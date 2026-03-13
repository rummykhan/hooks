#!/bin/bash

# PreToolUse hook - runs before any tool is executed
# Input is passed via stdin as JSON with: tool_name, tool_input

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name','unknown'))" 2>/dev/null)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG_DIR="$HOME/.tool-use/logs"
mkdir -p "$LOG_DIR"

echo "[$TIMESTAMP] PRE-TOOL: $TOOL_NAME" >> "$LOG_DIR/hooks.log"

# Exit 0 = allow, exit 2 = block
exit 0
