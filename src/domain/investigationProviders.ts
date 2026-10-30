/** Provider identity for deterministic composed analysis workflows. */
export const NRE_WORKFLOW_PROVIDER = {
  id: "nre-workflow",
  name: "NRE composed investigation workflow",
  version: "1",
} as const;

/** Provider identity for deterministic artifact inventories. */
export const ARTIFACT_GRAPH_PROVIDER = Object.freeze({
  id: "nre-artifact-graph",
  name: "NRE safe artifact graph provider",
  version: "1",
} as const);

/** Provider identity for execution-free managed PE/CLI analysis. */
export const MANAGED_STATIC_PROVIDER = Object.freeze({
  id: "nre-dotnet-static",
  name: "NRE managed static analysis provider",
  version: "1",
} as const);

/** Provider identity for portable, execution-free PE resource decoding. */
export const PE_RESOURCES_PROVIDER = Object.freeze({
  id: "nre-pe-resources",
  name: "NRE PE resource parser",
  version: "1",
} as const);

/** Provider identity for portable, execution-free PE Authenticode table decoding. */
export const PE_CERTIFICATES_PROVIDER = Object.freeze({
  id: "nre-pe-certificates",
  name: "NRE PE certificate parser",
  version: "1",
} as const);

/** Provider identity for portable, execution-free PE import-table decoding. */
export const PE_IMPORTS_PROVIDER = Object.freeze({
  id: "nre-pe-imports",
  name: "NRE PE import parser",
  version: "1",
} as const);

/** Provider identity for portable, execution-free ELF note-table decoding. */
export const DEVICETREE_PROVIDER = Object.freeze({
  id: "nre-devicetree",
  name: "NRE flattened devicetree parser",
  version: "1",
} as const);

export const ELF_NOTES_PROVIDER = Object.freeze({
  id: "nre-elf-notes",
  name: "NRE ELF note parser",
  version: "1",
} as const);

/** Provider identity for portable, execution-free Apple .ips crash-report decoding. */
export const APPLE_IPS_PROVIDER = Object.freeze({
  id: "nre-apple-ips",
  name: "NRE Apple IPS parser",
  version: "1",
} as const);
/** Provider identity for portable, execution-free Linux kernel-module metadata. */
export const KERNEL_MODULE_PROVIDER = Object.freeze({
  id: "nre-kernel-module",
  name: "NRE kernel module parser",
  version: "1",
} as const);

/** Provider identity for execution-free Shannon byte-entropy profiling. */
export const BYTE_ENTROPY_PROVIDER = Object.freeze({
  id: "byte-entropy",
  name: "NRE byte entropy",
  version: "1",
} as const);

/** Provider identity for portable, execution-free PE and ELF export tables. */
export const NATIVE_EXPORTS_PROVIDER = Object.freeze({
  id: "nre-native-exports",
  name: "NRE PE/ELF export table reader",
  version: "1",
} as const);

/** Provider identity for deterministic managed-code comparison workflows. */
export const MANAGED_WORKFLOW_PROVIDER = {
  id: "nre-dotnet-workflows",
  name: "NRE managed-code workflows",
  version: "1",
} as const;

/** Provider identity for deterministic Apple application projections. */
export const APPLE_APPLICATION_PROVIDER = {
  id: "nre-apple-application",
  name: "NRE Apple application workflows",
  version: "1",
} as const;

/** Provider identity for deterministic Android application projections. */
export const ANDROID_APPLICATION_PROVIDER = {
  id: "nre-android-application",
  name: "NRE Android application workflows",
  version: "1",
} as const;

/** Provider identity for deterministic HarmonyOS application projections. */
export const HARMONY_APPLICATION_PROVIDER = {
  id: "nre-harmony-application",
  name: "NRE HarmonyOS application workflows",
  version: "1",
} as const;

/** Provider identity for verified publication of retained website scripts. */
export const WEB_SCRIPT_EXPORT_PROVIDER = {
  id: "nre-web-script-export",
  name: "NRE captured script export",
  version: "1",
} as const;

/** Provider identity for deterministic static JavaScript application analysis. */
export const JAVASCRIPT_APPLICATION_PROVIDER = {
  id: "nre-javascript-application",
  name: "NRE JavaScript application analyzer",
  version: "1",
} as const;

/** Provider identity for static/passive-runtime JavaScript reconciliation. */
export const JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER = {
  id: "nre-javascript-runtime-reconciliation",
  name: "NRE JavaScript runtime reconciliation",
  version: "1",
} as const;

/** Provider identity for selected views of retained analysis Evidence. */
export const ANALYSIS_VIEW_PROVIDER = {
  id: "nre-analysis-view",
  name: "NRE analysis view projection",
  version: "1",
} as const;

/** Provider identity for graph-native feature tracing and version comparison. */
export const JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER = {
  id: "nre-javascript-application-workflows",
  name: "NRE JavaScript application workflows",
  version: "1",
} as const;

/** Provider identity for deterministic Evidence bundle comparisons. */
export const BUNDLE_COMPARISON_PROVIDER = {
  id: "nre-bundle-comparison",
  name: "NRE Evidence bundle comparison",
  version: "1",
} as const;

/** Provider identity for comparison-Evidence behavior aggregation. */
export const CHANGED_BEHAVIOR_PROVIDER = {
  id: "nre-changed-behavior",
  name: "NRE changed behavior investigation",
  version: "1",
} as const;

/** Provider identity for Evidence-backed call-path reconstruction. */
export const CALL_PATH_PROVIDER = {
  id: "nre-call-path",
  name: "NRE call path reconstruction",
  version: "1",
} as const;

/** Provider identity for explicit static/runtime hypothesis correlation. */
export const STATIC_RUNTIME_PROVIDER = {
  id: "nre-static-runtime-correlation",
  name: "NRE static/runtime correlation",
  version: "1",
} as const;

/** Provider identity for finite reconstruction specification verification. */
export const RECONSTRUCTION_PROVIDER = {
  id: "nre-reconstruction-verifier",
  name: "NRE reconstruction verifier",
  version: "1",
} as const;

export const PE_LOAD_CONFIG_PROVIDER = Object.freeze({
  id: "nre-pe-load-config",
  name: "NRE PE TLS/load-config parser",
  version: "1",
} as const);
