# NRE v7.0 Security Hardening & Threat Model Report

## Threat Model Overview

Nano Reverse Engineer (NRE) operates as a universal software intelligence and reverse-engineering platform. Its operating context presents unique security considerations:
1. **Host-Target Boundary:** NRE analyzes untrusted binary executables (PE, ELF, Mach-O, firmware, bytecode, web applications). Untrusted code must never achieve code execution on the analyst's host.
2. **Network MCP Interface:** When exposed via streamable HTTP (`/mcp`), NRE provides LLM agents and IDEs access to powerful disassembly, decompilation, and debugging tools.
3. **External Provider Processes:** NRE coordinates external tools (Ghidra, GDB, Rizin, JADX, Apktool, WABT, Python decompilers). Communication with these processes must remain secure and isolated.

---

## Security Vulnerabilities & Mitigations (v7.0)

### 1. SEC-01: Network MCP Authentication & Host Verification
- **Vulnerability:** Prior to v7.0, binding to `0.0.0.0` or non-loopback addresses relied solely on Host header checking. Host validation protects against DNS rebinding in browser environments but provides zero authentication against unauthorized network callers.
- **Remediation in v7.0:**
  - Non-loopback network bindings fail closed at server startup unless an explicit `authToken` is supplied or `--allow-unauthenticated` is set.
  - Authentication tokens can be supplied via:
    - CLI argument: `--token <secret>` or `--auth-token <secret>`
    - Environment variable: `NRE_HTTP_AUTH_TOKEN`, `REA_HTTP_AUTH_TOKEN`, or `MCP_AUTH_TOKEN`
  - Inbound HTTP requests must supply the secret via standard `Authorization: Bearer <secret>` or header `x-nre-auth-token: <secret>`.
  - Secret verification uses timing-safe buffer comparison via `crypto.timingSafeEqual` over SHA-256 digests to prevent timing side-channel attacks.
  - Failures immediately return HTTP 401 with `WWW-Authenticate: Bearer realm="NRE"` and a standard JSON-RPC unauthorized payload. Tokens are never echoed in logs or error messages.

### 2. SEC-02: Interactive Debugger Command Injection Defenses
- **Vulnerability:** Reverse engineering debuggers (GDB and Rizin) offer interactive command execution tools (`gdb_command`, `rizin_command`). LLM agents generating commands could issue shell escapes (`!`, `shell`, `python import os; os.system(...)`), compromising the host machine.
- **Remediation in v7.0:**
  - Implemented `src/server/debuggerSecurityPolicy.ts`.
  - Enforces mandatory inspection before passing command strings to underlying debugger processes:
    - **GDB Policy:** Blocks `shell`, `!`, `python`, `py`, `source`, `system`, and multi-line command chaining that attempts shell breakouts.
    - **Rizin Policy:** Blocks `!`, `#!`, `pipe`, `system`, and OS shell execution directives.
  - Attempts to invoke disallowed commands return a clear, structured JSON error indicating the security restriction.
  - For trusted, sandboxed lab environments, operators may enable unsafe commands by explicitly setting `NRE_ALLOW_UNSAFE_DEBUGGING="true"` or `REA_ALLOW_UNSAFE_DEBUGGING="true"`.

### 3. SEC-03: Subprocess Secret Sanitization
- **Vulnerability:** External analysis tools executed via `ProviderProcess.ts` inherited ambient host process environment variables by default. If the operator's shell had API keys (e.g. OpenAI, Anthropic, Google, AWS, GitHub, NPM), untrusted analysis targets or third-party decompilers could access those secrets.
- **Remediation in v7.0:**
  - Integrated `sanitizeChildEnvironment()` in `src/process/ProviderProcess.ts`.
  - Automatically scrubs sensitive environment variables matching sensitive patterns:
    - Token patterns: `*AUTH_TOKEN*`, `*API_KEY*`, `*SECRET*`, `*PRIVATE_KEY*`
    - Cloud & CI tokens: `AWS_*`, `GITHUB_*`, `GH_TOKEN`, `NPM_TOKEN`, `SSH_AUTH_SOCK`
  - Child processes only receive the strictly necessary paths (`PATH`, `TEMP`, `SYSTEMROOT`, `JAVA_HOME`, `GHIDRA_INSTALL_DIR`) and explicit provider configuration parameters.

### 4. SEC-04: Path Traversal & Target Confinement
- **Guards in Place:**
  - All target ingestion paths are strictly checked for directory traversal (`..`) escapes and NUL byte injection (`\0`).
  - Analysis workspaces and temporary extracted artifacts are contained within managed session directories with deterministic cleanup lifecycles.
  - Target paths outside allowed project boundaries require explicit analyst confirmation.

---

## Security Verification Checklist

- [x] Unauthenticated non-loopback HTTP bindings are rejected with a fail-closed startup error.
- [x] Valid bearer token passes authentication and opens session.
- [x] Invalid bearer token receives HTTP 401 with `WWW-Authenticate`.
- [x] Timing-safe string comparison protects against secret extraction.
- [x] Shell escapes in GDB commands (`shell whoami`, `!id`, python subprocesses) are blocked.
- [x] Shell escapes in Rizin commands (`!cat /etc/passwd`) are blocked.
- [x] Child processes spawned by `ProviderProcess` have sensitive credentials scrubbed from their environment.
- [x] Path normalization rejects NUL bytes and illicit directory traversal.
- [x] Zero sensitive tokens or credentials leaked in error payloads, logs, or JSON schemas.

