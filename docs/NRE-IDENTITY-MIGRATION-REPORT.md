# NRE — Complete Identity Transformation Audit Report

**Date:** 2026-10-30  
**Project:** Nano Reverse Engineer (NRE)  
**Target Identity:** NRE / Nano Reverse Engineer  
**Scope:** Repository-wide audit across all source files, documentation, configuration, scripts, tests, and metadata.

## 1. Executive Summary & Occurrence Counts

| Category                                                         | Description                          | Distinct Tokens | Total Occurrences | Files Affected |
| :--------------------------------------------------------------- | :----------------------------------- | :-------------- | :---------------- | :------------- |
| **Environment Variables (REA\_\*)**                              | Legacy references in envVars         | 457             | 4925              | 1031           |
| **Package & Repository Identifiers**                             | Legacy references in pkgMeta         | 2               | 6639              | 257            |
| **Full Product Name (Reverse Engineer Anything)**                | Legacy references in fullName        | 1               | 1                 | 1              |
| **Configuration Files (rea.json)**                               | Legacy references in configName      | 1               | 6                 | 4              |
| **Internal Identifiers & Temporary Prefixes (rea-\*, rea[A-Z])** | Legacy references in prefixedIds     | 5438            | 8593              | 2027           |
| **Uppercase Product Name (REA)**                                 | Legacy references in standaloneUpper | 1               | 6858              | 874            |
| **Agent Skill Manifests & Paths**                                | Legacy references in skillDir        | 1               | 222               | 90             |

---

## 2. Category Details & Proposed Replacements

### Environment Variables (REA_*)

| Legacy Identifier                      | Occurrences | Affected Files Count | Proposed NRE Replacement               |
| :------------------------------------- | :---------- | :------------------- | :------------------------------------- |
| `REA_LOG_LEVEL`                        | 402         | 212                  | `NRE_LOG_LEVEL`                        |
| `REA_PROCESS_RUN_ID`                   | 255         | 94                   | `NRE_PROCESS_RUN_ID`                   |
| `REA_ANALYSIS_PROVIDER`                | 171         | 92                   | `NRE_ANALYSIS_PROVIDER`                |
| `REA_MCP_INPUT_SCHEMA_PROFILE`         | 135         | 87                   | `NRE_MCP_INPUT_SCHEMA_PROFILE`         |
| `REA_JADX_MCP_JAR`                     | 118         | 32                   | `NRE_JADX_MCP_JAR`                     |
| `REA_KUNA_COMMAND`                     | 110         | 39                   | `NRE_KUNA_COMMAND`                     |
| `REA_IDA_MCP_CONFIG`                   | 95          | 29                   | `NRE_IDA_MCP_CONFIG`                   |
| `REA_GHIDRA_STARTUP_TIMEOUT_MS`        | 91          | 50                   | `NRE_GHIDRA_STARTUP_TIMEOUT_MS`        |
| `REA_GHIDRA_LANGUAGE_ID`               | 84          | 32                   | `NRE_GHIDRA_LANGUAGE_ID`               |
| `REA_KUNA_CACHE_DIR`                   | 82          | 33                   | `NRE_KUNA_CACHE_DIR`                   |
| `REA_TSHARK_COMMAND`                   | 81          | 35                   | `NRE_TSHARK_COMMAND`                   |
| `REA_JEB_MCP_URL`                      | 81          | 44                   | `NRE_JEB_MCP_URL`                      |
| `REA_ADB_PATH`                         | 78          | 30                   | `NRE_ADB_PATH`                         |
| `REA_PWNTOOLS_PYTHON`                  | 74          | 26                   | `NRE_PWNTOOLS_PYTHON`                  |
| `REA_CUTTER_BRIDGE_DIR`                | 74          | 18                   | `NRE_CUTTER_BRIDGE_DIR`                |
| `REA_BRIDGE_MAX_REQUEST_BYTES`         | 69          | 28                   | `NRE_BRIDGE_MAX_REQUEST_BYTES`         |
| `REA_HOPPER_STARTUP_TIMEOUT_MS`        | 64          | 41                   | `NRE_HOPPER_STARTUP_TIMEOUT_MS`        |
| `REA_BROWSER_EXECUTABLE`               | 62          | 33                   | `NRE_BROWSER_EXECUTABLE`               |
| `REA_MCP_TOOL_FAMILIES`                | 61          | 38                   | `NRE_MCP_TOOL_FAMILIES`                |
| `REA_RIZIN_COMMAND`                    | 61          | 20                   | `NRE_RIZIN_COMMAND`                    |
| `REA_MCP_OUTPUT_SCHEMA_PROFILE`        | 60          | 37                   | `NRE_MCP_OUTPUT_SCHEMA_PROFILE`        |
| `REA_GHIDRA_COMPILER_SPEC_ID`          | 57          | 20                   | `NRE_GHIDRA_COMPILER_SPEC_ID`          |
| `REA_MCP_MAX_RESPONSE_BYTES`           | 53          | 25                   | `NRE_MCP_MAX_RESPONSE_BYTES`           |
| `REA_WABT_BIN_DIRECTORY`               | 49          | 24                   | `NRE_WABT_BIN_DIRECTORY`               |
| `REA_GHIDRA_DISABLED_ANALYZERS`        | 46          | 15                   | `NRE_GHIDRA_DISABLED_ANALYZERS`        |
| `REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS` | 44          | 26                   | `NRE_GHIDRA_DECOMPILE_TIMEOUT_SECONDS` |
| `REA_GDB_COMMAND`                      | 44          | 11                   | `NRE_GDB_COMMAND`                      |
| `REA_JADX_OPERATION_TIMEOUT_MS`        | 42          | 21                   | `NRE_JADX_OPERATION_TIMEOUT_MS`        |
| `REA_CROSS_SWITCH_CASE`                | 42          | 1                    | `NRE_CROSS_SWITCH_CASE`                |
| `REA_REGEX_MATCHING_DEADLINE_MS`       | 41          | 19                   | `NRE_REGEX_MATCHING_DEADLINE_MS`       |
| _...and 427 more distinct tokens_      |             |                      |                                        |

### Package & Repository Identifiers

| Legacy Identifier | Occurrences | Affected Files Count | Proposed NRE Replacement                     |
| :---------------- | :---------- | :------------------- | :------------------------------------------- |
| `morluto/rea`     | 5842        | 157                  | `pratheeshclement-cmd/nano-reverse-engineer` |
| `rea-agents`      | 797         | 151                  | `nano-reverse-engineer`                      |

### Full Product Name (Reverse Engineer Anything)

| Legacy Identifier           | Occurrences | Affected Files Count | Proposed NRE Replacement |
| :-------------------------- | :---------- | :------------------- | :----------------------- |
| `Reverse Engineer Anything` | 1           | 1                    | `Nano Reverse Engineer`  |

### Configuration Files (rea.json)

| Legacy Identifier | Occurrences | Affected Files Count | Proposed NRE Replacement |
| :---------------- | :---------- | :------------------- | :----------------------- |
| `rea.json`        | 6           | 4                    | `nre.json`               |

### Internal Identifiers & Temporary Prefixes (rea-*, rea[A-Z])

| Legacy Identifier                  | Occurrences | Affected Files Count | Proposed NRE Replacement         |
| :--------------------------------- | :---------- | :------------------- | :------------------------------- |
| `rea-agents`                       | 697         | 145                  | `nano-reverse-engineer`          |
| `rea-investigation-flow`           | 178         | 27                   | `nre-investigation-flow`         |
| `rea-mcp`                          | 111         | 9                    | `nre-mcp`                        |
| `rea-5345-lab`                     | 52          | 1                    | `nre-5345-lab`                   |
| `rea-workflow`                     | 44          | 8                    | `nre-workflow`                   |
| `rea-unconfigured-deep-provider`   | 41          | 18                   | `nre-unconfigured-deep-provider` |
| `rea-4388-profiles-20261016`       | 39          | 1                    | `nre-4388-profiles-20261016`     |
| `rea-agents-6`                     | 33          | 8                    | `nre-agents-6`                   |
| `rea-4537-lab`                     | 32          | 1                    | `nre-4537-lab`                   |
| `rea-4388-runtime-20261016`        | 31          | 3                    | `nre-4388-runtime-20261016`      |
| `rea-4390-realapps-20261016`       | 30          | 3                    | `nre-4390-realapps-20261016`     |
| `rea-docs-audit-20261012`          | 26          | 2                    | `nre-docs-audit-20261012`        |
| `rea-hopper-analysis`              | 25          | 25                   | `nre-hopper-analysis`            |
| `rea-native-handoff-20261015`      | 25          | 3                    | `nre-native-handoff-20261015`    |
| `rea-fixture`                      | 25          | 11                   | `nre-fixture`                    |
| `rea-client-fixture`               | 24          | 10                   | `nre-client-fixture`             |
| `rea-showcases-dark`               | 23          | 23                   | `nre-showcases-dark`             |
| `rea-showcases`                    | 23          | 23                   | `nre-showcases`                  |
| `rea-evidence`                     | 23          | 2                    | `nre-evidence`                   |
| `rea-target`                       | 23          | 2                    | `nre-target`                     |
| `rea-windows-x64`                  | 21          | 15                   | `nre-windows-x64`                |
| `rea-state`                        | 21          | 11                   | `nre-state`                      |
| `reaCalls`                         | 21          | 4                    | `nreCalls`                       |
| `rea-artifact-graph`               | 20          | 17                   | `nre-artifact-graph`             |
| `rea-project`                      | 20          | 3                    | `nre-project`                    |
| `rea-agents-1`                     | 19          | 3                    | `nre-agents-1`                   |
| `rea-agents-2`                     | 18          | 1                    | `nre-agents-2`                   |
| `rea-build-cache`                  | 17          | 3                    | `nre-build-cache`                |
| `rea-cdp-browser`                  | 17          | 12                   | `nre-cdp-browser`                |
| `rea-write`                        | 17          | 9                    | `nre-write`                      |
| _...and 5408 more distinct tokens_ |             |                      |                                  |

### Uppercase Product Name (REA)

| Legacy Identifier | Occurrences | Affected Files Count | Proposed NRE Replacement |
| :---------------- | :---------- | :------------------- | :----------------------- |
| `REA`             | 6858        | 874                  | `NRE`                    |

### Agent Skill Manifests & Paths

| Legacy Identifier           | Occurrences | Affected Files Count | Proposed NRE Replacement |
| :-------------------------- | :---------- | :------------------- | :----------------------- |
| `reverse-engineer-anything` | 222         | 90                   | `nano-reverse-engineer`  |

## 3. Files and Directories Slated for Renaming

| Type                | Current Path                                               | Proposed New Path                                          |
| :------------------ | :--------------------------------------------------------- | :--------------------------------------------------------- |
| Directory           | `.agents/skills/reverse-engineer-anything/`                | `.agents/skills/nano-reverse-engineer/`                    |
| Directory           | `.agents/skills/rea-analysis-optimization/`                | `.agents/skills/nre-analysis-optimization/`                |
| Directory           | `.agents/skills/rea-changelog-update/`                     | `.agents/skills/nre-changelog-update/`                     |
| Directory           | `.agents/skills/rea-ci-tests-audit/`                       | `.agents/skills/nre-ci-tests-audit/`                       |
| Directory           | `.agents/skills/rea-tool-design/`                          | `.agents/skills/nre-tool-design/`                          |
| Script              | `scripts/rea.mjs`                                          | `scripts/nre.mjs` (retained/unified)                       |
| Script              | `scripts/rea-android-workspace-guardian.mjs`               | `scripts/nre-android-workspace-guardian.mjs`               |
| Bridge              | `bridge/cutter/rea_bridge.py`                              | `bridge/cutter/nre_bridge.py`                              |
| Bridge              | `bridge/native/rea_lldb_tracer.py`                         | `bridge/native/nre_lldb_tracer.py`                         |
| Asset               | `assets/rea-plugin.png`                                    | `assets/nre-plugin.png`                                    |
| Documentation Asset | `docs/assets/rea-hopper-analysis.png`                      | `docs/assets/nre-hopper-analysis.png`                      |
| Documentation Asset | `docs/assets/rea-showcases-dark.svg`                       | `docs/assets/nre-showcases-dark.svg`                       |
| Documentation Asset | `docs/assets/rea-showcases.svg`                            | `docs/assets/nre-showcases.svg`                            |
| Workflow Example    | `examples/github-actions/rea-analysis.yml`                 | `examples/github-actions/nre-analysis.yml`                 |
| Website Asset       | `website/public/assets/figures/rea-investigation-flow.svg` | `website/public/assets/figures/nre-investigation-flow.svg` |
