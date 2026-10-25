import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  console.log("Initializing MCP StdioClientTransport...");
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@piotr-agier/google-drive-mcp"],
    env: {
      ...process.env,
    },
  });

  const client = new Client(
    {
      name: "google-drive-test-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    console.log("Connecting to Google Drive MCP server via stdio...");
    await client.connect(transport);
    console.log("Connected successfully!\n");

    console.log("Calling tool: listFolder...");
    const result = await client.callTool({
      name: "listFolder",
      arguments: {},
    });

    console.log("\n--- Google Drive Files & Folders ---");
    if (result.content && Array.isArray(result.content)) {
      for (const item of result.content) {
        if (item.type === "text") {
          console.log(item.text);
        } else {
          console.log(JSON.stringify(item, null, 2));
        }
      }
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
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
