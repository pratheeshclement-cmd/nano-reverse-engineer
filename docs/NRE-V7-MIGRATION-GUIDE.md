# NRE v7.0 Migration & Compatibility Guide

This guide assists developers, operators, and AI agent orchestrators in transitioning from **REA v6.8.0** to **NRE v7.0.0 (Nano Reverse Engineer)**.

---

## 1. Summary of Changes

| Feature / Area | REA v6.8.0 (Legacy) | NRE v7.0.0 (Current) | Compatibility Guarantee |
| :--- | :--- | :--- | :--- |
| **CLI Binary** | `rea` | `nre` (primary) & `rea` (alias) | **100% Dual Support** (both binaries work identically) |
| **Configuration File** | `rea.json` | `nre.json` & `rea.json` | **Dual Resolution** (`nre.json` takes precedence if present) |
| **Environment Variables** | `REA_*` | `NRE_*` & `REA_*` | **Dual Resolution** (`NRE_*` takes precedence over `REA_*`) |
| **MCP Identity** | `rea` | `nre` & `rea` | **Full backward compatibility** with existing MCP clients |
| **HTTP Authentication** | Host validation only | Token auth required for non-loopback | **Fail-closed** on external interfaces; loopback remains zero-config |
| **HTTP Concurrency** | Single-tenant (eviction) | Multi-tenant concurrent sessions | Supported via `--max-sessions` or `NRE_MCP_MAX_SESSIONS` |
| **Debugger Commands** | Unrestricted shell escapes | Restricted by security policy | Safe by default; opt-in with `NRE_ALLOW_UNSAFE_DEBUGGING` |

---

## 2. CLI Migration

### Invocation
Both command-line aliases are supported out of the box:
```bash
# New recommended invocation:
nre analyze ./target.exe --output report.json
nre mcp --http --port 8080 --token secret-token-here

# Legacy invocation continues to work without warnings:
rea analyze ./target.exe --output report.json
rea mcp --http --port 8080 --token secret-token-here
```

### New CLI Flags for `mcp --http`
- `--token <secret>` or `--auth-token <secret>`: Set HTTP authentication secret.
- `--allow-unauthenticated`: Permit binding to non-loopback network interfaces without an auth token (insecure).
- `--max-sessions <number>`: Configure maximum number of concurrent client sessions (default 1 in single-tenant mode; set > 1 for multi-tenant mode).

---

## 3. Environment Variable Mapping

NRE v7.0 introduces clean `NRE_*` names for all configuration variables. The runtime automatically maps them:

| NRE Setting (v7.0) | Legacy Setting (v6.8) | Description |
| :--- | :--- | :--- |
| `NRE_HTTP_AUTH_TOKEN` | `REA_HTTP_AUTH_TOKEN` | Secret token required for HTTP MCP connections |
| `NRE_ALLOW_UNAUTHENTICATED` | `REA_ALLOW_UNAUTHENTICATED` | Explicit opt-in for unauthenticated non-loopback binds |
| `NRE_MCP_MAX_SESSIONS` | `REA_MCP_MAX_SESSIONS` | Maximum concurrent HTTP MCP sessions |
| `NRE_ALLOW_UNSAFE_DEBUGGING` | `REA_ALLOW_UNSAFE_DEBUGGING` | Permit OS shell escapes in GDB and Rizin |
| `NRE_ANALYSIS_PROVIDER` | `REA_ANALYSIS_PROVIDER` | Default engine selector (`auto`, `ghidra`, `ida`, `hopper`) |
| `NRE_MCP_TOOL_FAMILIES` | `REA_MCP_TOOL_FAMILIES` | Filter active MCP tool families |
| `NRE_LOG_LEVEL` | `REA_LOG_LEVEL` | Logging verbosity (`debug`, `info`, `warn`, `error`) |

If both `NRE_*` and `REA_*` are set in the environment, the `NRE_*` value takes precedence.

---

## 4. MCP Server Client Configuration

### Claude Desktop / Cursor / Antigravity MCP Config

#### Option A: Native NRE (Recommended)
```json
{
  "mcpServers": {
    "nre": {
      "command": "npx",
      "args": ["-y", "nano-reverse-engineer@latest", "mcp"]
    }
  }
}
```

#### Option B: Legacy REA Compatibility (Unchanged)
```json
{
  "mcpServers": {
    "rea": {
      "command": "npx",
      "args": ["-y", "reverse-engineer-anything@latest", "mcp"]
    }
  }
}
```

#### Option C: HTTP MCP Remote Service with Authentication
```json
{
  "mcpServers": {
    "nre-remote": {
      "url": "http://10.0.0.10:8080/mcp",
      "headers": {
        "Authorization": "Bearer my-secure-token"
      }
    }
  }
}
```

---

## 5. Security Action Required for Remote Deployments

If you currently deploy NRE or REA over a network (e.g. Docker, Kubernetes, remote server):
1. Set an authentication token using `NRE_HTTP_AUTH_TOKEN="<random-secure-string>"`.
2. Update MCP clients to include the `Authorization: Bearer <token>` header.
3. If running in an isolated private test container where auth is not needed, pass `--allow-unauthenticated` or set `NRE_ALLOW_UNAUTHENTICATED=true`.

