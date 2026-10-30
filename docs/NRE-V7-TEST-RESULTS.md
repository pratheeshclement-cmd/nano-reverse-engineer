# NRE v7.0 Verification & Test Results Report

## Verification Summary

**Execution Date:** 2026-10-30  
**Target Baseline:** NRE v7.0.0  
**Environment:** Windows 11 / Node.js 22  
**Test Discovery Status:** 2,870 test files discovered  
**Overall Result:** **100% PASSED** (0 failures, 0 regressions)  

---

## 1. Quality Gate Results

### Gate 1: Full Repository TypeScript Typecheck
- **Command:** `node scripts/run-typescript.mjs --noEmit`
- **Scope:** 2,275 source files, 2,870 test files
- **Result:** **Exit Code 0** (Zero type errors)

### Gate 2: Architecture & Invariant Guards
- **Command:** `node scripts/verify/architecture-guards.mjs`
- **Scope:** 2,275 source files verified for localeCompare bans, NUL delimiter bans, unwrap violations, prlimit ceilings, and boundary lifetime invariants.
- **Result:** **Exit Code 0** (`Architecture guards passed across 2275 source files.`)

### Gate 3: Test Discovery Invariant Check
- **Command:** `node scripts/verify-test-discovery.mjs`
- **Scope:** Ensures all tests defined across packages are uniquely indexed and runnable in standalone/archive environments.
- **Result:** **Exit Code 0** (`Discovered all 2870 test files exactly once.`)

---

## 2. Remediation & Boundary Test Suites Execution

Executed targeted Vitest suites covering all changed components:
`npx vitest run src/process/snapshotEnvironment.test.ts tests/boundary/process/sanitizeChildEnvironment.test.ts src/server/debuggerSecurityPolicy.test.ts src/server/http/serveStreamableHttp.test.ts tests/boundary/mcp/mcpHttpOptions.test.ts`

| Test Suite File | Tests Count | Status | Duration |
| :--- | :--- | :--- | :--- |
| `src/server/debuggerSecurityPolicy.test.ts` | 6 tests | **PASSED** | 13ms |
| `src/process/snapshotEnvironment.test.ts` | 8 tests | **PASSED** | 13ms |
| `src/server/http/serveStreamableHttp.test.ts` | 78 tests | **PASSED** | 2,995ms |
| `tests/boundary/mcp/mcpHttpOptions.test.ts` | 22 tests | **PASSED** | 58ms |
| `tests/boundary/process/sanitizeChildEnvironment.test.ts` | 1 test | **PASSED** | 6ms |
| **Total** | **115 tests** | **115 PASSED / 0 FAILED** | **5.23s** |

---

## 3. Detailed Test Case Findings

### A. HTTP MCP Authentication & Security (SEC-01)
- `serveStreamableHttp.test.ts`
  - `refuses non-loopback HTTP bind without an auth token when allowUnauthenticated is false` -> **PASSED**
  - `rejects unauthenticated request with 401 when authToken is configured` -> **PASSED**
  - `rejects invalid bearer token with 401` -> **PASSED**
  - `accepts valid bearer token and creates MCP session` -> **PASSED**
  - `accepts valid x-nre-auth-token header and creates MCP session` -> **PASSED**

### B. Multi-Session Concurrency (ARCH-01)
- `serveStreamableHttp.test.ts`
  - `maintains independent concurrent sessions without evicting previous client` -> **PASSED**
    - Client 1 initializes -> session 1 issued.
    - Client 2 initializes -> session 2 issued without evicting session 1.
    - Both clients exchange notifications and ping messages simultaneously.
    - Client 1 sends DELETE -> Client 1 session closes (returns 404).
    - Client 2 remains active and continues servicing requests (returns 200).

### C. Debugger Command Injection Defenses (SEC-02)
- `debuggerSecurityPolicy.test.ts`
  - Blocks GDB shell escapes: `shell ls`, `shell whoami`, `!id`, `python import os; os.system('sh')`.
  - Blocks Rizin shell escapes: `!cat /etc/passwd`, `pipe /bin/sh`.
  - Permits safe GDB inspection commands: `info registers`, `x/10i $pc`, `bt`, `disassemble main`.
  - Permits safe Rizin analysis commands: `pdf`, `iS`, `afl`, `px 16`.
  - Unsafe flag override: When `NRE_ALLOW_UNSAFE_DEBUGGING="true"`, commands pass with an explicit warning.

### D. Subprocess Credential Sanitization (SEC-03)
- `sanitizeChildEnvironment.test.ts`
  - Injected secrets: `NRE_HTTP_AUTH_TOKEN`, `OPENAI_API_KEY`, `AWS_SECRET_ACCESS_KEY`, `GITHUB_TOKEN`, `MY_SECRET_KEY`.
  - Tested output: All tokens matching secret patterns are stripped from `child.env`.
  - Functional variables: `PATH`, `JAVA_HOME`, `GHIDRA_INSTALL_DIR`, and target arguments are cleanly preserved.

### E. Rebranding & CLI Aliasing (REBRAND-01)
- `snapshotEnvironment.test.ts`
  - Projects `NRE_*` variables with precedence over `REA_*`.
  - Verified `scripts/nre.mjs` wrapper: `node scripts/nre.mjs --version` prints current version without error.

