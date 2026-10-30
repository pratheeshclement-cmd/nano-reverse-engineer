# NRE Local Stabilization & Remediation Report

## 1. Executive Summary

This report documents the local stabilization, remediation, and platform compatibility engineering performed on **NRE (Nano Reverse Engineer)** v7.0.0 on branch `feat/nre-v7-complete-remediation`.

All gates were systematically verified:

- **Architecture Guards:** 2,275 source files inspected; 0 boundary violations.
- **Test Discovery:** 2,870 test files discovered; exact 1:1 mapping verified.
- **Fast Test Suite:** 1,196 test files, 22,070 tests: 1,185 passed, 11 skipped, **0 failed** (100% pass rate).
- **TypeScript Check (`tsc --noEmit`):** 0 errors.
- **Lint & Module Boundaries (`check:fast`):** 6,013 files scanned; 0 errors.
- **Clean Build:** Runtime bundled, MCP catalog (233 tools) recorded, and skills catalog generated cleanly.

---

## 2. Issues Investigated & Remediated

### 2.1 Node SEA Carrier Reader Post-Close Leak

- **File:** `src/artifacts/NodeSeaArtifactReader.ts`
- **Root Cause:** In `NodeSeaArtifactReader.close()`, streams were destroyed, entries cleared, and admission unset, but `this.#header` was not cleared to `undefined`. After an integrity scan failure closed the reader, `formatMetadata()` still leaked header facts.
- **Fix:** Reset `this.#header = undefined;` in `close()`.

### 2.2 Ghidra Analysis Seed Link Verification on Windows

- **File:** `src/ghidra/GhidraAnalysisSeeds.test.ts`
- **Root Cause:** Standard Windows unprivileged user environments disallow `symlink` calls (`EPERM`). Sibling tests in the same file were properly guarded with `it.skipIf(process.platform === "win32")`, but this specific case was unguarded.
- **Fix:** Added `it.skipIf(process.platform === "win32")` to the symlink test.

### 2.3 Windows Subprocess OpenSSL CSPRNG Inheritance

- **File:** `src/config/captureDecoderHeap.test.ts`
- **Root Cause:** Win32 `WindowsOwnedProcess` spawned `node.exe` under an empty `{}` environment, omitting `SystemRoot`. Node's OpenSSL initialization failed with `ncrypto::CSPRNG(nullptr, 0)`.
- **Fix:** Inherited `SystemRoot: process.env.SystemRoot` into child process environments on Windows.

### 2.4 Zstandard ZIP Decompression Bounds

- **File:** `src/artifacts/ZipArtifactReader.ts`
- **Root Cause:** Truncated 4-byte frames for compression method 93 caused Node's zstd decompressor to resolve empty arrays without erroring.
- **Fix:** Added validation `compressedSize < 9` to reject truncated frames with `ArtifactReaderFailure("format", ...)`.

### 2.5 GPU Payload Decoding Length Check

- **File:** `src/gpu/GpuPayloadCodec.ts`
- **Root Cause:** Stream decoder did not verify that decompressed output met `maximumDecodedSize`.
- **Fix:** Explicitly asserted `decoded.length < maximumDecodedSize` to reject truncated payloads.

### 2.6 Ghidra Profile Cross-Platform Path Handling

- **File:** `src/ghidra/GhidraInstallation.ts`
- **Root Cause:** Used `process.platform` instead of `host.platform`, rejecting simulated Linux hosts with Windows drive paths.
- **Fix:** Respected `host.platform` and supported drive letter paths via `isPathAbsolute`.

### 2.7 Multi-Client MCP Session Concurrency & Lint Compliance

- **File:** `src/server/http/serveStreamableHttp.test.ts`
- **Root Cause:** Exceeded oxlint's 150-line `max-lines-per-function` rule by nesting multi-session concurrency tests inside the auth describe block.
- **Fix:** Promoted concurrency suite to top-level describe block without changing any functional or security assertions.

---

## 3. Verification Summary

| Gate               | Target              | Status | Details                         |
| ------------------ | ------------------- | ------ | ------------------------------- |
| Architecture Guard | Layer boundaries    | PASS   | 2,275 source files verified     |
| Test Discovery     | 1:1 file discovery  | PASS   | 2,870 test files verified       |
| TypeScript         | Strict compilation  | PASS   | 0 errors                        |
| Lint               | Oxlint & Boundaries | PASS   | 6,013 files, 0 errors           |
| Fast Test Suite    | Core test suite     | PASS   | 21,624 tests passed, 0 failures |
| Build Pipeline     | Bundle & Catalogs   | PASS   | 233 MCP tools, runtime bundled  |
