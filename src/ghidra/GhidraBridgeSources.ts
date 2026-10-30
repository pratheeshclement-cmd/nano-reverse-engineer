/** Required packaged sources, selected by their runtime role rather than order. */
export const GHIDRA_BRIDGE_SOURCES = Object.freeze({
  bridge: "NreGhidraBridge.java",
  bundleActivator: "NreGhidraBundleActivator.java",
  extensions: "NreGhidraExtensions.java",
  prepareCom: "NreGhidraPrepareCom.java",
  prepareRaw: "NreGhidraPrepareRaw.java",
  prepareDol: "NreGhidraPrepareDol.java",
  applySeeds: "NreGhidraApplySeeds.java",
  analysisOptions: "NreGhidraAnalysisOptions.java",
  noReturnFix: "NreGhidraNoReturnFix.java",
  mipsSoftFloat: "NreGhidraMipsSoftFloat.java",
} as const);
