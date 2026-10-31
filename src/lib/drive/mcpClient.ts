import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

export interface DriveItem {
  id: string;
  name: string;
  type: "file" | "folder";
}

export interface AuthStatus {
  configured: boolean;
  hasTokens: boolean;
  email?: string;
  displayName?: string;
  expiresInSec?: number;
  needsAuth: boolean;
  message?: string;
}

export interface DriveStatusResponse {
  connected: boolean;
  status: "connected" | "connecting" | "reconnecting" | "disconnected" | "error";
  pid: number | null;
  uptimeSeconds: number | null;
  auth: AuthStatus;
  lastError: string | null;
}

/**
 * Curated safe starter vault templates used during offline or standby mode.
 */
export const DEFAULT_FALLBACK_VAULT_ITEMS: Record<string, DriveItem[]> = {
  root: [
    {
      id: "vault-workout-splits",
      name: "Iron & Habit - Workout Splits & Routines.pdf",
      type: "file",
    },
    {
      id: "vault-macro-nutrition",
      name: "Nutrition & Macro Meal Plans (Bangla & English).docx",
      type: "file",
    },
    {
      id: "vault-progress-photos",
      name: "Physique Progress & Transformations",
      type: "folder",
    },
    {
      id: "vault-coaching-notes",
      name: "Coach Notes & Biometrics Vault",
      type: "folder",
    },
  ],
  "vault-progress-photos": [
    {
      id: "photo-baseline-w01",
      name: "Week 01 - Baseline Assessment.jpg",
      type: "file",
    },
    {
      id: "photo-hypertrophy-w04",
      name: "Week 04 - Hypertrophy Checkpoint.jpg",
      type: "file",
    },
    {
      id: "photo-peak-w08",
      name: "Week 08 - Peak Definition.jpg",
      type: "file",
    },
  ],
  "vault-coaching-notes": [
    {
      id: "note-rpe-guide",
      name: "RPE & Progressive Overload Standards.pdf",
      type: "file",
    },
    {
      id: "note-sleep-biometrics",
      name: "Sleep Optimization & Heart Rate Metrics.docx",
      type: "file",
    },
    {
      id: "note-supplementation",
      name: "Evidence-Based Micronutrient Protocol.pdf",
      type: "file",
    },
  ],
};

export function getFallbackVaultItems(folderId: string = "root"): DriveItem[] {
  if (DEFAULT_FALLBACK_VAULT_ITEMS[folderId]) {
    return DEFAULT_FALLBACK_VAULT_ITEMS[folderId];
  }
  return [
    {
      id: `${folderId}-item-1`,
      name: "Offline Vault Item (Synced).pdf",
      type: "file",
    },
    {
      id: `${folderId}-item-2`,
      name: "Training Biometrics & Records.xlsx",
      type: "file",
    },
  ];
}

/**
 * Check Google Drive OAuth credentials and tokens on disk gracefully.
 */
export function checkLocalAuthStatus(): AuthStatus {
  try {
    const configDir = path.join(os.homedir(), ".config", "google-drive-mcp");
    const keysPath = path.join(configDir, "gcp-oauth.keys.json");
    const tokensPath = path.join(configDir, "tokens.json");

    const hasKeys = fs.existsSync(keysPath);
    const hasTokens = fs.existsSync(tokensPath);

    if (!hasKeys && !hasTokens) {
      return {
        configured: false,
        hasTokens: false,
        needsAuth: true,
        message: "Google OAuth credentials and tokens not found in ~/.config/google-drive-mcp.",
      };
    }

    if (hasTokens) {
      try {
        const raw = fs.readFileSync(tokensPath, "utf8");
        const parsed = JSON.parse(raw);
        const defaultAccount = parsed.defaultAccount || Object.keys(parsed.accounts || {})[0];
        const account = parsed.accounts?.[defaultAccount];

        if (account) {
          const email = account.email || defaultAccount;
          const expiryDate = account.expiryDate;
          const expiresInSec = expiryDate ? Math.max(0, Math.round((expiryDate - Date.now()) / 1000)) : undefined;

          return {
            configured: true,
            hasTokens: true,
            email,
            expiresInSec,
            needsAuth: false,
            message: `Authenticated as ${email}`,
          };
        }
      } catch (parseErr) {
        return {
          configured: true,
          hasTokens: false,
          needsAuth: true,
          message: "Failed to parse tokens.json. Re-authentication required.",
        };
      }
    }

    return {
      configured: hasKeys,
      hasTokens: false,
      needsAuth: true,
      message: "OAuth keys found, but token authorization is required.",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error checking local credentials";
    return {
      configured: false,
      hasTokens: false,
      needsAuth: true,
      message: msg,
    };
  }
}

/**
 * Robustly resolve the google-drive-mcp executable path.
 * Prefers direct Node execution of the installed package entry point
 * to bypass Windows npx/cmd.exe stdio pipe breakage.
 */
export function resolveMcpServerTarget(): { command: string; args: string[] } {
  const possiblePaths = [
    path.join(process.cwd(), "node_modules", "@piotr-agier", "google-drive-mcp", "dist", "index.js"),
    path.join(process.cwd(), "..", "node_modules", "@piotr-agier", "google-drive-mcp", "dist", "index.js"),
    path.join(os.homedir(), "AppData", "Local", "npm-cache", "_npx"),
  ];

  for (const cand of possiblePaths) {
    if (fs.existsSync(/*turbopackIgnore: true*/ cand) && cand.endsWith("index.js")) {
      return {
        command: process.execPath,
        args: [cand],
      };
    }
  }

  // Fallback to npx if direct node_modules resolution fails
  return {
    command: process.platform === "win32" ? "npx.cmd" : "npx",
    args: ["-y", "@piotr-agier/google-drive-mcp"],
  };
}

/**
 * Builds clean, comprehensive environment variables ensuring all Windows system
 * directories and home paths are present for child process execution.
 */
function buildChildEnvironment(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      env[key] = value;
    }
  }

  // Guarantee required Windows variables
  if (process.platform === "win32") {
    if (!env.USERPROFILE && process.env.USERPROFILE) env.USERPROFILE = process.env.USERPROFILE;
    if (!env.HOMEPATH && process.env.HOMEPATH) env.HOMEPATH = process.env.HOMEPATH;
    if (!env.HOMEDRIVE && process.env.HOMEDRIVE) env.HOMEDRIVE = process.env.HOMEDRIVE;
    if (!env.APPDATA && process.env.APPDATA) env.APPDATA = process.env.APPDATA;
    if (!env.LOCALAPPDATA && process.env.LOCALAPPDATA) env.LOCALAPPDATA = process.env.LOCALAPPDATA;
    if (!env.SYSTEMROOT && process.env.SYSTEMROOT) env.SYSTEMROOT = process.env.SYSTEMROOT;
  }

  return env;
}

/**
 * Parses raw text from listFolder tool output.
 */
export function parseDriveListing(rawText: string): DriveItem[] {
  const items: DriveItem[] = [];
  const lines = rawText.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("Contents of folder:") ||
      trimmed.startsWith("More items available") ||
      trimmed.startsWith("(Folder is empty)") ||
      trimmed.startsWith("No files")
    ) {
      continue;
    }

    // Strip leading list bullet if present (e.g., "- 📄 ...", "* 📁 ...")
    const cleanLine = trimmed.replace(/^[-*•]\s+/, "");

    // Matches e.g. "📄 Day_1_v3 (ID: 1kiy_...)" or "📁 Sagordi (ID: ...)" with unicode support
    const match = cleanLine.match(/^([\u{1F4C1}\u{1F4C2}\u{1F4C4}📁📄]?)\s*(.+?)\s*\(ID:\s*([^)]+)\)$/u);
    if (match) {
      const icon = match[1];
      const name = match[2].trim();
      const id = match[3].trim();
      const isFolder = icon === "📁" || icon === "\u{1F4C1}" || icon === "\u{1F4C2}";
      items.push({
        id,
        name,
        type: isFolder ? "folder" : "file",
      });
    }
  }

  return items;
}

/**
 * Resilient, self-healing Google Drive MCP Connection Manager.
 * Features:
 * - Singleton lifecycle across Next.js invocations (persisted on globalThis).
 * - Automatic process restart on unexpected closure or MCP error -32000.
 * - Concurrency mutex to prevent connection race conditions.
 * - Diagnostics ring buffer for child process stderr.
 * - Graceful authentication and token pre-flight validation.
 */
export class DriveMcpManager {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private status: "connected" | "connecting" | "reconnecting" | "disconnected" | "error" = "disconnected";
  private connectingPromise: Promise<Client> | null = null;
  private opLock: Promise<unknown> = Promise.resolve();
  private startedAt: number | null = null;
  private lastError: string | null = null;
  private stderrBuffer: string[] = [];
  private maxStderrLines = 40;
  private folderCache: Map<string, { items: DriveItem[]; raw: string; timestamp: number }> = new Map();

  constructor() {
    // Initial state
  }

  public getCachedFolder(folderId: string = "root"): DriveItem[] | null {
    const cached = this.folderCache.get(folderId);
    return cached ? cached.items : null;
  }

  public getSafeFallbackItems(folderId: string = "root"): DriveItem[] {
    const cached = this.getCachedFolder(folderId);
    if (cached && cached.length > 0) {
      return cached;
    }
    return getFallbackVaultItems(folderId);
  }

  public getStatus(): DriveStatusResponse {
    const auth = checkLocalAuthStatus();
    const isAlive = this.isProcessAlive();

    return {
      connected: isAlive && this.status === "connected",
      status: isAlive ? this.status : "disconnected",
      pid: this.transport?.pid ?? null,
      uptimeSeconds: this.startedAt && isAlive ? Math.round((Date.now() - this.startedAt) / 1000) : null,
      auth,
      lastError: this.lastError,
    };
  }

  public isProcessAlive(): boolean {
    if (!this.transport || !this.client) return false;
    const pid = this.transport.pid;
    if (!pid) return false;

    try {
      // process.kill with 0 tests whether the process is alive without sending a signal
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  }

  private appendStderr(text: string) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      this.stderrBuffer.push(`[${new Date().toISOString()}] ${line}`);
      if (this.stderrBuffer.length > this.maxStderrLines) {
        this.stderrBuffer.shift();
      }
    }
  }

  public getStderrDiagnostics(): string[] {
    return [...this.stderrBuffer];
  }

  /**
   * Safely cleans up the active client, transport, and child process.
   */
  public async cleanup(): Promise<void> {
    const prevTransport = this.transport;
    const prevClient = this.client;

    this.client = null;
    this.transport = null;
    this.connectingPromise = null;
    this.status = "disconnected";

    if (prevClient) {
      try {
        await prevClient.close();
      } catch {
        // Ignore close errors
      }
    }

    if (prevTransport) {
      try {
        await prevTransport.close();
      } catch {
        // Ignore close errors
      }

      if (prevTransport.pid) {
        try {
          process.kill(prevTransport.pid, "SIGTERM");
        } catch {
          // Process already dead
        }
      }
    }
  }

  /**
   * Establishes connection to the Google Drive MCP server via stdio.
   * If already connecting, reuses the in-flight promise.
   */
  public async connect(): Promise<Client> {
    if (this.client && this.isProcessAlive() && this.status === "connected") {
      return this.client;
    }

    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    this.connectingPromise = (async () => {
      this.status = this.status === "error" || this.status === "disconnected" ? "connecting" : "reconnecting";
      this.lastError = null;

      // Clean any stale state before reconnecting
      await this.cleanup();

      const { command, args } = resolveMcpServerTarget();
      console.log(`[DriveMCP] Spawning MCP server: ${command} ${args.join(" ")}`);

      const transport = new StdioClientTransport({
        command,
        args,
        env: buildChildEnvironment(),
        stderr: "pipe",
      });

      // Capture stderr for diagnosing token or process crashes
      const stderrStream = transport.stderr;
      if (stderrStream) {
        stderrStream.on("data", (chunk: Buffer) => {
          const text = chunk.toString();
          this.appendStderr(text);
          // Log authentication or token refresh warnings to console
          if (text.includes("token") || text.includes("Error") || text.includes("retry")) {
            console.warn(`[DriveMCP:stderr] ${text.trim()}`);
          }
        });
      }

      const client = new Client(
        {
          name: "ironandhabit-drive-resilient-client",
          version: "2.0.0",
        },
        {
          capabilities: {},
        }
      );

      // Listen for unexpected process termination or transport closure
      transport.onclose = () => {
        console.warn("[DriveMCP] MCP server stdio process connection closed unexpectedly.");
        this.status = "disconnected";
        this.client = null;
        this.transport = null;
      };

      transport.onerror = (err: Error) => {
        console.error("[DriveMCP] StdioClientTransport error:", err);
        this.lastError = err.message;
      };

      try {
        await client.connect(transport);
        this.client = client;
        this.transport = transport;
        this.status = "connected";
        this.startedAt = Date.now();
        console.log(`[DriveMCP] Connected successfully (PID: ${transport.pid})`);
        return client;
      } catch (connectErr) {
        this.status = "error";
        const message = connectErr instanceof Error ? connectErr.message : "Failed to connect to MCP server";
        this.lastError = message;
        console.error("[DriveMCP] Connection failed:", message);
        await this.cleanup();
        throw connectErr;
      } finally {
        this.connectingPromise = null;
      }
    })();

    return this.connectingPromise;
  }

  /**
   * Executes a tool call with automatic reconnection and retry on MCP error -32000 (Connection closed).
   */
  public async callToolWithAutoRestart(
    name: string,
    toolArgs: Record<string, unknown> = {},
    maxRetries = 2
  ): Promise<{ content: Array<{ type: string; text?: string }>; isError?: boolean }> {
    // Queue calls to serialize stdio requests
    const runOperation = async (): Promise<{ content: Array<{ type: string; text?: string }>; isError?: boolean }> => {
      let client: Client;
      try {
        client = await this.connect();
      } catch (connErr) {
        const msg = connErr instanceof Error ? connErr.message : "Connection failed";
        throw new Error(`MCP Connect Error: ${msg}`);
      }

      try {
        const response = await client.callTool({
          name,
          arguments: toolArgs,
        });

        return response as { content: Array<{ type: string; text?: string }>; isError?: boolean };
      } catch (callErr: unknown) {
        const err = callErr as { code?: number; message?: string };
        const isConnectionClosed =
          err?.code === -32000 ||
          err?.message?.includes("Connection closed") ||
          err?.message?.includes("not connected") ||
          err?.message?.includes("closed") ||
          !this.isProcessAlive();

        if (isConnectionClosed) {
          console.warn(
            `[DriveMCP] Detected connection close (Code: ${err?.code}, Message: ${err?.message}). Retries remaining: ${maxRetries}`
          );

          // Teardown the dead process
          await this.cleanup();

          if (maxRetries > 0) {
            // Exponential backoff before auto-restarting
            const delayMs = (3 - maxRetries) * 400;
            console.log(`[DriveMCP] Waiting ${delayMs}ms before auto-restarting stdio process...`);
            await new Promise((res) => setTimeout(res, delayMs));

            // Recursively retry after auto-restart
            return this.callToolWithAutoRestart(name, toolArgs, maxRetries - 1);
          }
        }

        // If not a close error or out of retries, rethrow
        throw callErr;
      }
    };

    // Chain onto the operation lock
    const currentOp = this.opLock.then(runOperation, runOperation);
    this.opLock = currentOp.catch(() => {});
    return currentOp;
  }

  /**
   * Lists the contents of a Google Drive folder.
   */
  public async listFolder(
    folderId?: string,
    pageSize?: number
  ): Promise<{ items: DriveItem[]; raw: string; isError: boolean; errorMessage?: string }> {
    const toolArgs: Record<string, unknown> = {};
    if (folderId && folderId !== "root") {
      toolArgs.folderId = folderId;
    }
    if (pageSize && !isNaN(pageSize)) {
      toolArgs.pageSize = pageSize;
    }

    const response = await this.callToolWithAutoRestart("listFolder", toolArgs, 2);

    let rawText = "";
    if (response.content && Array.isArray(response.content)) {
      for (const item of response.content) {
        if (item.type === "text" && item.text) {
          rawText += item.text + "\n";
        }
      }
    }

    const hasError = response.isError || rawText.includes("Error:") || rawText.includes("invalid_grant");
    if (hasError) {
      return {
        items: [],
        raw: rawText.trim(),
        isError: true,
        errorMessage: rawText.trim() || "Google Drive returned an error",
      };
    }

    const items = parseDriveListing(rawText);
    const cacheKey = folderId && folderId !== "root" ? folderId : "root";
    if (items.length > 0) {
      this.folderCache.set(cacheKey, { items, raw: rawText.trim(), timestamp: Date.now() });
    }
    return {
      items,
      raw: rawText.trim(),
      isError: false,
    };
  }

  /**
   * Queries authGetStatus tool to check active account info.
   */
  public async getActiveAccountInfo(): Promise<Record<string, unknown> | null> {
    try {
      const response = await this.callToolWithAutoRestart("authGetStatus", {}, 1);
      if (response.content && Array.isArray(response.content)) {
        for (const item of response.content) {
          if (item.type === "text" && item.text) {
            try {
              // Try to find JSON within the output
              const jsonMatch = item.text.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
              }
            } catch {
              // Not pure JSON
            }
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Forces a complete restart of the MCP process.
   */
  public async restart(): Promise<DriveStatusResponse> {
    console.log("[DriveMCP] Force restart requested.");
    await this.cleanup();
    await this.connect();
    return this.getStatus();
  }
}

// Preserve manager singleton across Next.js dev server hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var __driveMcpManager: DriveMcpManager | undefined;
}

export function getDriveMcpManager(): DriveMcpManager {
  if (!globalThis.__driveMcpManager) {
    globalThis.__driveMcpManager = new DriveMcpManager();
  }
  return globalThis.__driveMcpManager;
}
