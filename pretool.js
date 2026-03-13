#!/usr/bin/env node

// PreToolUse hook - runs before any tool is executed
// Input is passed via stdin as JSON with: tool_name, tool_input
// Exit 0 = allow, exit 2 = block

const fs = require("fs");
const path = require("path");
const os = require("os");

const LOG_DIR = path.join(os.homedir(), ".tool-use", "logs");

function log(message) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  fs.appendFileSync(
    path.join(LOG_DIR, "hooks.log"),
    `[${timestamp}] ${message}\n`
  );
}

function isEnvFileAccess(toolInput) {
  const fields = [
    toolInput.file_path,
    toolInput.path,
    toolInput.command,
    toolInput.pattern,
  ].filter(Boolean);

  return fields.some((val) => {
    if (typeof val !== "string") return false;
    // match .env, .env.local, .env.production, etc. but not .environment or .envrc
    return /\.env($|\.[\w]+$|\s)/.test(val);
  });
}

// Read stdin synchronously
const data = fs.readFileSync("/dev/stdin", "utf8");
const input = JSON.parse(data);
const toolName = input.tool_name || "unknown";
const toolInput = input.tool_input || {};

log(`PRE-TOOL: ${toolName}`);

// Block any attempt to access .env files
if (isEnvFileAccess(toolInput)) {
  log(`BLOCKED: ${toolName} tried to access .env file`);
  process.stdout.write(
    JSON.stringify({
      reason: "Access to .env files is blocked by pre-tool hook",
    })
  );
  process.exitCode = 2;
} else {
  process.exitCode = 0;
}
