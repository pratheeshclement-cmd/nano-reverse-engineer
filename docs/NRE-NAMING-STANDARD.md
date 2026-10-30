# NRE Official Naming & Identity Standard

## 1. Official Project Identity

The official identity of this project across all documentation, interfaces, tools, and platforms is:

| Property                        | Official Canonical Value                                               | Notes                                             |
| :------------------------------ | :--------------------------------------------------------------------- | :------------------------------------------------ |
| **Product Full Name**           | **Nano Reverse Engineer**                                              | Primary formal product name                       |
| **Product Short Name**          | **NRE**                                                                | Formal acronym and display name                   |
| **CLI Command**                 | `nre`                                                                  | Executable exposed in `package.json#bin`          |
| **NPM Package Name**            | `nano-reverse-engineer`                                                | NPM distribution package                          |
| **MCP Server ID**               | `io.github.pratheeshclement-cmd/nano-reverse-engineer`                 | Formal MCP catalog identifier                     |
| **MCP Server Key**              | `nre`                                                                  | MCP configuration key in client configs           |
| **Agent Skill Name**            | `nano-reverse-engineer`                                                | Directory: `.agents/skills/nano-reverse-engineer` |
| **Configuration File**          | `nre.json`                                                             | Operator configuration file                       |
| **Environment Variable Prefix** | `NRE_*`                                                                | Primary configuration namespace                   |
| **GitHub Repository**           | `pratheeshclement-cmd/nano-reverse-engineer`                           | Official source repository                        |
| **GitHub Issues / PRs**         | `https://github.com/pratheeshclement-cmd/nano-reverse-engineer/issues` | Bug reporting & tracking                          |

---

## 2. Environment Variable Naming Rules

All environment variables follow the strict `NRE_<SUBSYSTEM>_<SETTING>` convention:

- **Core / Logging:**
  - `NRE_LOG_LEVEL` (debug, info, warn, error)
  - `NRE_PROCESS_RUN_ID`
  - `NRE_ANALYSIS_PROVIDER` (auto, ghidra, ida, hopper)
- **MCP Server & Networking:**
  - `NRE_MCP_TOOL_FAMILIES`
  - `NRE_MCP_MAX_RESPONSE_BYTES`
  - `NRE_MCP_MAX_INPUT_ELEMENTS`
  - `NRE_MCP_INPUT_SCHEMA_PROFILE`
  - `NRE_MCP_OUTPUT_SCHEMA_PROFILE`
  - `NRE_HTTP_AUTH_TOKEN`
  - `NRE_ALLOW_UNAUTHENTICATED`
  - `NRE_MCP_MAX_SESSIONS`
- **Reverse Engineering Providers:**
  - `NRE_GHIDRA_INSTALL_DIR` / `NRE_GHIDRA_PROJECT_PATH` / `NRE_GHIDRA_STARTUP_TIMEOUT_MS`
  - `NRE_IDA_MCP_CONFIG`
  - `NRE_HOPPER_STARTUP_TIMEOUT_MS`
  - `NRE_JEB_MCP_URL` / `NRE_JEB_MCP_TIMEOUT_MS`
  - `NRE_JADX_MCP_JAR` / `NRE_JADX_OPERATION_TIMEOUT_MS`
  - `NRE_ADB_PATH`
  - `NRE_RIZIN_COMMAND` / `NRE_GDB_COMMAND`
  - `NRE_WABT_BIN_DIRECTORY`
  - `NRE_TSHARK_COMMAND`
  - `NRE_KUNA_COMMAND` / `NRE_KUNA_CACHE_DIR`

---

## 3. Temporary Files, Prefixes, and IPC Sockets

All runtime temporary files, sockets, and isolation prefixes must strictly use `nre-`:

- Workspace prefixes: `nre-android-`, `nre-jadx-`, `nre-screen-`, `nre-bugreport-`
- IPC / Bridges: `nre-jadx-bridge`, `nre-cutter-bridge`, `nre-lldb-tracer`
- Sockets and named pipes: `\\.\pipe\nre-...` or `/tmp/nre-...`
