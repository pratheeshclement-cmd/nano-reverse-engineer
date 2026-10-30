/** Merge explicit layers by platform identity while retaining the winning spelling/value. */
export const mergeEnvironmentOverrides = <T>(
  existing: Readonly<Record<string, T>>,
  overrides: Readonly<Record<string, T>>,
  platform: NodeJS.Platform = process.platform,
): Readonly<Record<string, T>> => {
  const selected = new Map<string, readonly [string, T]>();
  for (const layer of [existing, overrides])
    for (const [key, value] of Object.entries(layer))
      selected.set(platform === "win32" ? key.toUpperCase() : key, [
        key,
        value,
      ]);
  return Object.freeze(Object.fromEntries(selected.values()));
};

/**
 * Project NRE_* and REA_* aliases with deterministic precedence:
 * NRE_* takes precedence over legacy REA_* when both are provided.
 */
export const resolveNreEnvironmentAliases = <T extends string | undefined>(
  environment: Readonly<Record<string, T>>,
): Record<string, T> => {
  const result: Record<string, T> = { ...environment };
  for (const [key, value] of Object.entries(environment)) {
    if (key.startsWith("NRE_")) {
      const reaKey = `REA_${key.slice(4)}`;
      result[reaKey] = value;
    } else if (key.startsWith("nre_")) {
      const reaKey = `rea_${key.slice(4)}`;
      result[reaKey] = value;
    }
  }
  return result;
};

/** Snapshot selected variables while preserving platform and caller precedence. */
export const snapshotEnvironment = <T extends string | undefined>(
  environment: Readonly<Record<string, T>>,
  platform: NodeJS.Platform = process.platform,
): Readonly<Record<string, T>> => {
  const aliased = resolveNreEnvironmentAliases(environment);
  const selected = mergeEnvironmentOverrides({}, aliased, platform);
  if (platform !== "win32") return selected;
  // Fold aliases in caller order so an explicit later override wins before
  // this canonical environment crosses a Windows process boundary.
  return Object.freeze(
    Object.fromEntries(
      Object.entries(selected)
        .map(([key, value]) => [key.toUpperCase(), value] as const)
        .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0)),
    ),
  );
};
