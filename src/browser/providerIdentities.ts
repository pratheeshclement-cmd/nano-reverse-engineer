import type { ProviderIdentity } from "../application/AnalysisProvider.js";

/** Identity available without loading the CdpBrowserProvider implementation. */
export const CDP_BROWSER_PROVIDER_IDENTITY: ProviderIdentity = Object.freeze({
  id: "nre-cdp-browser",
  name: "NRE Chrome DevTools Protocol observation provider",
  version: "2",
});

/** Identity available without loading the PlaywrightBrowserScenarioProvider implementation. */
export const PLAYWRIGHT_BROWSER_SCENARIO_PROVIDER_IDENTITY: ProviderIdentity =
  Object.freeze({
    id: "nre-playwright-browser-scenario",
    name: "NRE Playwright browser scenario capture provider",
    version: "1",
  });

/** Identity available without loading the CdpElectronProvider implementation. */
export const CDP_ELECTRON_PROVIDER_IDENTITY: ProviderIdentity = Object.freeze({
  id: "nre-cdp-electron",
  name: "NRE Electron file-page CDP observation provider",
  version: "1",
});

/** Identity available without loading the PlaywrightElectronActiveProvider implementation. */
export const PLAYWRIGHT_ELECTRON_ACTIVE_PROVIDER_IDENTITY: ProviderIdentity =
  Object.freeze({
    id: "nre-playwright-electron-active",
    name: "NRE Playwright active Electron observation provider",
    version: "1",
  });
