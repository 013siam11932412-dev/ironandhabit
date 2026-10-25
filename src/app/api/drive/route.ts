import { NextRequest, NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";



export interface DriveItem {
  id: string;
  name: string;
  type: "file" | "folder";
}

function parseDriveListing(rawText: string): DriveItem[] {
  const items: DriveItem[] = [];
  const lines = rawText.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("Contents of folder:") ||
      trimmed.startsWith("More items available")
    ) {
      continue;
    }

    // Matches e.g. "📄 Day_1_v3 (ID: 1kiy_...)" or "📁 Sagordi (ID: ...)"
    const match = trimmed.match(/^([📄📁]?)\s*(.+?)\s*\(ID:\s*([^)]+)\)$/);
    if (match) {
      const icon = match[1];
      const name = match[2];
      const id = match[3];
      items.push({
        id,
        name,
        type: icon === "📁" ? "folder" : "file",
      });
    }
  }

  return items;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get("folderId") || undefined;
  const pageSizeParam = searchParams.get("pageSize");
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : undefined;

  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      env[key] = value;
    }
  }

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@piotr-agier/google-drive-mcp"],
    env,
  });

  const client = new Client(
    {
      name: "ironandhabit-drive-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);

    const toolArgs: Record<string, unknown> = {};
    if (folderId) {
      toolArgs.folderId = folderId;
    }
    if (pageSize && !isNaN(pageSize)) {
      toolArgs.pageSize = pageSize;
    }

    const response = await client.callTool({
      name: "listFolder",
      arguments: toolArgs,
    });

    let rawText = "";
    if (response.content && Array.isArray(response.content)) {
      for (const item of response.content) {
        if (item.type === "text") {
          rawText += item.text + "\n";
        }
      }
    }

    const isError = response.isError || rawText.includes("Error:");
    if (isError) {
      return NextResponse.json(
        {
          success: false,
          error: rawText.trim() || "Failed to list Google Drive contents",
        },
        { status: 500 }
      );
    }

    const items = parseDriveListing(rawText);

    return NextResponse.json({
      success: true,
      folderId: folderId || "root",
      items,
      raw: rawText.trim(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  } finally {
    try {
      await client.close();
    } catch {
      // Ignore client closure errors
    }
  }
}
