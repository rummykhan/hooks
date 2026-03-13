# Claude Code Hooks - Tool Usage Logger

An experiment with [Claude Code hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) that logs every tool invocation (before and after execution) to a local log file, with `.env` file access protection.

## How It Works

Claude Code hooks allow you to run custom shell commands in response to tool use events. This project registers two hooks:

- **PreToolUse** - Fires before any tool is executed. Logs the tool name with a timestamp. Blocks access to `.env` files.
- **PostToolUse** - Fires after any tool is executed. Logs the tool name with a timestamp.

Both hooks match all tools (`.*` matcher) and append entries to `~/.tool-use/logs/hooks.log`.

## .env Protection

The PreToolUse hook detects attempts to access `.env` files and blocks them with exit code 2. It checks:

- `file_path` (Read tool)
- `path` (Glob/Grep tools)
- `command` (Bash tool, e.g. `cat .env`)
- `pattern` (Grep tool)

Matches `.env`, `.env.local`, `.env.production`, etc. but not `.environment` or `.envrc`.

```
[2026-03-13 21:13:02] PRE-TOOL: Read
[2026-03-13 21:13:02] BLOCKED: Read tried to access .env file
```

## Files

| File | Description |
|------|-------------|
| `pretool.js` | Pre-tool hook (Node.js) - logs + blocks .env access |
| `posttool.js` | Post-tool hook (Node.js) - logs after tool execution |
| `pretool.sh` | Pre-tool hook (Bash) - original logging-only version |
| `posttool.sh` | Post-tool hook (Bash) - original logging-only version |
| `hooks.json` | Hook configuration (standalone format) |
| `.claude/settings.json` | Project-level Claude Code settings with hooks |
| `.claude/settings.local.json` | Local permissions for the hook scripts |
| `logs/hooks.log` | Sample log output from a real session |

## Log Format

```
[2026-03-13 14:10:41] PRE-TOOL: Bash
[2026-03-13 14:10:41] POST-TOOL: Bash
[2026-03-13 16:52:48] PRE-TOOL: Glob
[2026-03-13 16:52:49] POST-TOOL: Glob
[2026-03-13 21:13:02] BLOCKED: Read tried to access .env file
```

Each entry includes:
- Timestamp (`YYYY-MM-DD HH:MM:SS`)
- Hook phase (`PRE-TOOL`, `POST-TOOL`, or `BLOCKED`)
- Tool name (e.g., `Bash`, `Read`, `Glob`, `mcp__github__search_repositories`)

## Setup

1. Clone this repo
2. Update the paths in `hooks.json` and `.claude/settings.json` to point to your local copies of `pretool.js` and `posttool.js`
3. Either:
   - Copy `hooks.json` to your Claude Code hooks configuration, or
   - Use the `.claude/settings.json` as your project settings

## Hook Behavior

- **Exit code 0** from a PreToolUse hook allows the tool to run
- **Exit code 2** from a PreToolUse hook blocks the tool execution
- PostToolUse hooks receive the tool result in addition to the tool input

The JS hooks log all tool usage and block `.env` file access. The original `.sh` hooks are kept for reference (logging only, no blocking).
