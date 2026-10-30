import type { DoctorProviderInspection } from "./Doctor.js";
import { compareUnicodeCodePoints } from "../domain/unicodeCodePointOrder.js";

const SELECTED_REGISTRATION_SETTINGS = [
  "GHIDRA_INSTALL_DIR",
  "GHIDRA_HEADLESS_MAXMEM",
  "GHIDRA_MAXMEM",
  "JAVA_HOME",
  "HOPPER_LAUNCHER_PATH",
  "HOPPER_LOADER_ARGS_JSON",
  "NRE_ILSPY_CMD_PATH",
  "NRE_ADB_PATH",
  "NRE_APKTOOL_COMMAND",
  "NRE_TSHARK_COMMAND",
  "NRE_CAPINFOS_COMMAND",
  "NRE_TSHARK_PRLIMIT_COMMAND",
  "NRE_OBJDUMP_COMMAND",
  "NRE_GDB_COMMAND",
  "NRE_RIZIN_COMMAND",
  "NRE_CUTTER_BRIDGE_DIR",
  "NRE_WABT_BIN_DIRECTORY",
  "NRE_WAKARU_COMMAND",
  "NRE_JAVASCRIPT_PRLIMIT_COMMAND",
  "NRE_BINWALK_COMMAND",
  "NRE_UNBLOB_COMMAND",
  "NRE_FIRMWARE_PRLIMIT_COMMAND",
  "NRE_EVM_PRLIMIT_COMMAND",
  "NRE_SIGROK_COMMAND",
  "NRE_SIGROK_PRLIMIT_COMMAND",
  "NRE_MITMDUMP_COMMAND",
  "NRE_BROWSER_EXECUTABLE",
  "NRE_BROWSER_NO_SANDBOX",
  "NRE_PWNTOOLS_PYTHON",
  "NRE_PWNTOOLS_MAX_INPUT_BYTES",
  "NRE_PWNDBG_GDB",
  "NRE_PWNDBG_GDBINIT",
  "NRE_PWNDBG_VENV_PATH",
  "NRE_DARWIN_SWIFTC_PATH",
  "NRE_DARWIN_MODULE_CACHE_PATH",
  "SDKROOT",
  "NRE_SWIFTC_COMPILE_TIMEOUT_MS",
  "NRE_LOG_LEVEL",
  "NRE_REFERENCE_SECRET_PATTERNS_JSON",
  "NRE_IDA_MCP_CONFIG",
  "NRE_JADX_MCP_JAR",
  "NRE_JADX_HEAP_MIB",
  "NRE_JADX_ACTIVE_PROCESSOR_COUNT",
  "NRE_JADX_OPERATION_TIMEOUT_MS",
  "NRE_KUNA_COMMAND",
  "NRE_KUNA_CACHE_DIR",
  "NRE_KUNA_CACHE_MAX_BYTES",
  "NRE_KUNA_PROJECT_TIMEOUT_MS",
  "NRE_KUNA_TIMEOUT_MS",
  "NRE_KUNA_JOBS",
  "NRE_ANALYSIS_PROVIDER",
  "NRE_ASAR_MAX_HEADER_BYTES",
  "NRE_BRIDGE_MAX_REQUEST_BYTES",
  "NRE_CAPTURE_DECODER_OLD_GENERATION_MIB",
  "NRE_GHIDRA_DECOMPILE_TIMEOUT_SECONDS",
  "NRE_GHIDRA_STARTUP_TIMEOUT_MS",
  "NRE_GHIDRA_LANGUAGE_ID",
  "NRE_GHIDRA_COMPILER_SPEC_ID",
  "NRE_GHIDRA_DISABLED_ANALYZERS",
  "NRE_GHIDRA_SEED_FILE",
  "NRE_GHIDRA_PROJECT_PATH",
  "NRE_GHIDRA_PROGRAM_NAME",
  "NRE_GHIDRA_NATIVEAOT_JAR",
  "NRE_HOPPER_CALLER_SCAN_BUDGET_MS",
  "NRE_HOPPER_STARTUP_TIMEOUT_MS",
  "NRE_JEB_MCP_URL",
  "NRE_JEB_MCP_TIMEOUT_MS",
  "NRE_MCP_INPUT_SCHEMA_PROFILE",
  "NRE_MCP_TOOL_FAMILIES",
  "NRE_MCP_OUTPUT_SCHEMA_PROFILE",
  "NRE_MCP_MAX_RESPONSE_BYTES",
  "NRE_MCP_MAX_INPUT_ELEMENTS",
  "NRE_NATIVE_MATCHING_REPRESENTATION_BYTES",
  "NRE_REGEX_MATCHING_DEADLINE_MS",
  "NRE_REGEX_WORKER_HEAP_REQUEST_MIB",
  "NRE_MCP_INITIALIZE_BUDGET_MS",
  "NRE_MCP_TOOLS_LIST_BUDGET_MS",
  "NRE_MCP_FIRST_CATALOG_BUDGET_MS",
  "NRE_MCP_DOCTOR_DEADLINE_MS",
] as const;

/** Explicit selections override discovered defaults even when a provider is unavailable.
 * This is a registration policy, not a prefix match against the ambient environment.
 */
export const explicitSetupRegistrationEnvironment = (
  environment: Readonly<Record<string, string | undefined>>,
): Readonly<Record<string, string>> =>
  Object.fromEntries(
    SELECTED_REGISTRATION_SETTINGS.flatMap((key) => {
      const value = environment[key];
      return value === undefined ? [] : [[key, value]];
    }),
  );

/** Discovered provider defaults; explicit selections are applied separately. */
export const providerRegistrationEnvironment = (
  inspections: readonly DoctorProviderInspection[],
): Readonly<Record<string, string>> =>
  Object.fromEntries(
    inspections
      .flatMap(({ registrationEnvironment }) =>
        Object.entries(registrationEnvironment),
      )
      .sort(([left], [right]) => compareUnicodeCodePoints(left, right)),
  );
