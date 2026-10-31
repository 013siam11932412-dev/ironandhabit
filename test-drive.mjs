import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";

async function main() {
  console.log("Initializing Google Drive MCP diagnostic test...");

  const serverScript = path.join(
    process.cwd(),
    "node_modules",
    "@piotr-agier",
    "google-drive-mcp",
    "dist",
    "index.js"
  );

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverScript],
    env: {
      ...process.env,
    },
  });

  const client = new Client(
    {
      name: "google-drive-diagnostic-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    console.log("Connecting via stdio...");
    await client.connect(transport);
    console.log("Connected successfully!");

    console.log("Calling authGetStatus...");
    const authResult = await client.callTool({
      name: "authGetStatus",
      arguments: {},
    });
    console.log("Auth result received.");

    console.log("Calling listFolder...");
    const result = await client.callTool({
      name: "listFolder",
      arguments: {},
    });

    console.log("\n--- Google Drive Contents ---");
    if (result.content && Array.isArray(result.content)) {
      for (const item of result.content) {
        if (item.type === "text") {
          console.log(item.text);
        }
      }
    }
    console.log("\nDiagnostic test passed successfully.");
  } catch (error) {
    console.error("Error communicating with MCP server:", error);
    process.exitCode = 1;
  } finally {
    try {
      await client.close();
    } catch {
      // Ignore close errors
    }
  }
}

main();
