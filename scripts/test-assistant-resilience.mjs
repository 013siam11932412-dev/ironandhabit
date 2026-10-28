#!/usr/bin/env node
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const healerScript = path.join(__dirname, "heal-assistant.mjs");

const child = spawn(process.execPath, [healerScript, "--test-chat"], {
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code || 0);
});
