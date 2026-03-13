# Claude Code Hooks - Tool Usage Logger

An experiment with [Claude Code hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) that logs every tool invocation (before and after execution) to a local log file.

## How It Works

Claude Code hooks allow you to run custom shell commands in response to tool use events. This project registers two hooks:

- **PreToolUse** - Fires before any tool is executed. Logs the tool name with a timestamp.
- **PostToolUse** - Fires after any tool is executed. Logs the tool name with a timestamp.

Both hooks match all tools (`.*` matcher) and append entries to `~/.tool-use/logs/hooks.log`.

## Files

| File | Description |
|------|-------------|
| `hooks.json` | Hook configuration (standalone format) |
| `.claude/settings.json` | Project-level Claude Code settings with hooks registered |
| `.claude/settings.local.json` | Local permissions for the hook scripts |
| `pretool.sh` | Pre-tool hook script - logs before tool execution |
| `posttool.sh` | Post-tool hook script - logs after tool execution |
| `logs/hooks.log` | Sample log output from a real session |

## Log Format

```
[2026-03-13 14:10:41] PRE-TOOL: Bash
[2026-03-13 14:10:41] POST-TOOL: Bash
[2026-03-13 16:52:48] PRE-TOOL: Glob
[2026-03-13 16:52:49] POST-TOOL: Glob
```

Each entry includes:
- Timestamp (`YYYY-MM-DD HH:MM:SS`)
- Hook phase (`PRE-TOOL` or `POST-TOOL`)
- Tool name (e.g., `Bash`, `Read`, `Glob`, `mcp__github__search_repositories`)

## Setup

1. Clone this repo
2. Update the paths in `hooks.json` and `.claude/settings.json` to point to your local copies of `pretool.sh` and `posttool.sh`
3. Either:
   - Copy `hooks.json` to your Claude Code hooks configuration, or
   - Use the `.claude/settings.json` as your project settings

## Hook Behavior

- **Exit code 0** from a PreToolUse hook allows the tool to run
- **Exit code 2** from a PreToolUse hook blocks the tool execution
- PostToolUse hooks receive the tool result in addition to the tool input

Both scripts currently exit `0` (allow all tools) and only perform logging.
