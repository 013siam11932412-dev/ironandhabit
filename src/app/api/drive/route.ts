// Self-healing Google Drive MCP API Route with Cloud Vault Standby Fallback
import { NextRequest, NextResponse } from "next/server";
import {
  getDriveMcpManager,
  checkLocalAuthStatus,
  getFallbackVaultItems,
  type DriveItem,
} from "@/lib/drive/mcpClient";

export type { DriveItem };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const folderId = searchParams.get("folderId") || "root";
  const pageSizeParam = searchParams.get("pageSize");
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : undefined;

  const manager = getDriveMcpManager();

  // Action: status check
  if (action === "status") {
    try {
      const status = manager.getStatus();
      let accountInfo: Record<string, unknown> | null = null;
      if (status.connected) {
        accountInfo = await manager.getActiveAccountInfo();
      }

      return NextResponse.json({
        success: true,
        status,
        accountInfo,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch status";
      return NextResponse.json({
        success: false,
        error: message,
        status: manager.getStatus(),
      });
    }
  }

  // Action: manual force-restart
  if (action === "restart") {
    try {
      const newStatus = await manager.restart();
      return NextResponse.json({
        success: true,
        restarted: true,
        status: newStatus,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to restart MCP server";
      return NextResponse.json({
        success: false,
        error: message,
        status: manager.getStatus(),
      });
    }
  }

  // Safe Fallback Query Handler for Cloud Vault Standby
  try {
    const authStatus = checkLocalAuthStatus();

    // If local OAuth tokens are missing, enter Cloud Vault Standby with safe starter items
    if (authStatus.needsAuth) {
      console.warn("[DriveRoute] Local auth missing, serving Cloud Vault Standby template items.");
      const fallbackItems =
        typeof manager?.getSafeFallbackItems === "function"
          ? manager.getSafeFallbackItems(folderId)
          : getFallbackVaultItems(folderId);
      return NextResponse.json(
        {
          success: true,
          standby: true,
          isFallback: true,
          folderId,
          items: fallbackItems,
          errorCode: "AUTH_REQUIRED",
          message: authStatus.message || "Cloud Vault Standby active (Authentication pending).",
          setupHint: "Run `npx -y @piotr-agier/google-drive-mcp auth` to connect live Google Drive.",
          authStatus,
        },
        { status: 200 }
      );
    }

    // Attempt live MCP tool query
    const result = await manager.listFolder(folderId, pageSize);

    if (result.isError) {
      console.warn("[DriveRoute] Live MCP query returned error, engaging Cloud Vault Standby:", result.errorMessage);
      const fallbackItems =
        typeof manager?.getSafeFallbackItems === "function"
          ? manager.getSafeFallbackItems(folderId)
          : getFallbackVaultItems(folderId);

      return NextResponse.json(
        {
          success: true,
          standby: true,
          isFallback: true,
          folderId,
          items: fallbackItems,
          errorCode: "STANDBY",
          message: result.errorMessage || "Cloud Vault Standby: Serving safe cached offline vault.",
          raw: result.raw,
          authStatus,
        },
        { status: 200 }
      );
    }

    // Live query succeeded
    return NextResponse.json({
      success: true,
      standby: false,
      isFallback: false,
      folderId,
      items: result.items,
      raw: result.raw,
      authStatus,
    });
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    const rawMessage = err?.message || "Unknown error occurred while querying Google Drive MCP";

    console.warn("[DriveRoute] MCP query error caught, engaging Cloud Vault Standby:", rawMessage);

    const authStatus = checkLocalAuthStatus();
    const fallbackItems =
      typeof manager?.getSafeFallbackItems === "function"
        ? manager.getSafeFallbackItems(folderId)
        : getFallbackVaultItems(folderId);

    // Always respond with success: true and standby: true so UI navigates seamlessly without red errors
    return NextResponse.json(
      {
        success: true,
        standby: true,
        isFallback: true,
        folderId,
        items: fallbackItems,
        errorCode: "STANDBY",
        error: rawMessage,
        message: "Cloud Vault Standby: Serving safe cached offline vault.",
        authStatus,
        diagnostics: manager.getStderrDiagnostics().slice(-5),
      },
      { status: 200 }
    );
  }
}
