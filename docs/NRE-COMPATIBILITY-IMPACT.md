# NRE Compatibility Impact & Breaking Change Assessment

## 1. Migration Scope & Rationale

As part of the definitive transformation from **REA / Reverse Engineer Anything** to **NRE / Nano Reverse Engineer**, all legacy aliases, fallback variables, deprecated shims, and historical names are being completely migrated to the canonical NRE standard.

This document details the impact on existing workflows and guarantees zero capability regression.

---

## 2. Breaking Changes & Compatibility Impact

| Area                      | Former Legacy Value            | New Definitive Value                                   | Impact & Action Required                                                                             |
| :------------------------ | :----------------------------- | :----------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **CLI Binary**            | `rea`                          | `nre`                                                  | Terminal scripts and CI pipelines invoking `rea` must be updated to invoke `nre`.                    |
| **Config File**           | `rea.json`                     | `nre.json`                                             | Project configurations named `rea.json` must be renamed to `nre.json`.                               |
| **Environment Variables** | `REA_*` (e.g. `REA_LOG_LEVEL`) | `NRE_*` (e.g. `NRE_LOG_LEVEL`)                         | Environment configurations, `.env` files, and CI runner secrets must update their prefix to `NRE_*`. |
| **NPM Package**           | `rea-agents`                   | `nano-reverse-engineer`                                | `package.json` dependencies and `npx` invocations update to `nano-reverse-engineer`.                 |
| **MCP Server ID**         | `io.github.morluto/rea`        | `io.github.pratheeshclement-cmd/nano-reverse-engineer` | MCP client configurations update their server ID to the new catalog key.                             |
| **MCP Key**               | `"rea"`                        | `"nre"`                                                | Client config objects (Claude Desktop / Cursor) update `"rea"` to `"nre"`.                           |

---

## 3. Preserved Capabilities & Functional Invariants

The migration updates identity and namespaces while strictly preserving:

1. **All 233 MCP Reverse Engineering Tools:** Every tool name, schema contract, and execution handler remains 100% intact.
2. **Analysis Engines & Providers:** Support for Ghidra, IDA Pro, Hopper, Rizin, GDB, JADX, Apktool, WABT, EVMole, Kuna, and custom bridges is completely preserved.
3. **Data & Evidence Formats:** Workflow snapshots, binary diagnostics, evidence provenance, and coverage ledgers retain their exact data models.
4. **Platform Compatibility:** Full support on Windows, macOS, and Linux without platform divergence.
