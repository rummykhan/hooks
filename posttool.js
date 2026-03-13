#!/usr/bin/env node

// PostToolUse hook - runs after any tool is executed
// Input is passed via stdin as JSON with: tool_name, tool_input, tool_result

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

const data = fs.readFileSync("/dev/stdin", "utf8");
const input = JSON.parse(data);
const toolName = input.tool_name || "unknown";

log(`POST-TOOL: ${toolName}`);

process.exitCode = 0;
