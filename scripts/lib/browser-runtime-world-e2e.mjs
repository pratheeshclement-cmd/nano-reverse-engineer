import assert from "node:assert/strict";

export const isolatedFixtureUrl = "nre-isolated-fixture.js";

/** Create an explicitly owned native isolated-world fixture outside NRE's public operations. */
export async function createRuntimeIsolatedWorld(connection) {
  const tree = await connection.send("Page.getFrameTree");
  const world = await connection.send("Page.createIsolatedWorld", {
    frameId: tree.frameTree.frame.id,
    worldName: "nre-verifier-isolated",
  });
  const contextId = world.executionContextId;
  assert.ok(Number.isInteger(contextId));
  const initialized = await connection.send("Runtime.evaluate", {
    contextId,
    expression: `function nreIsolatedFixture() { return 'isolated-proof'; }
//# sourceURL=${isolatedFixtureUrl}`,
  });
  assert.equal(initialized.exceptionDetails, undefined);
  return contextId;
}

/** Invoke a known isolated callback and the selected site's callback after actual NRE arming. */
export async function triggerRuntimeFixtureAction(connection, contextId) {
  const proof = await connection.send("Runtime.evaluate", {
    contextId,
    expression: "nreIsolatedFixture()",
    returnByValue: true,
  });
  assert.equal(proof.result.value, "isolated-proof");
  return connection.send("Runtime.evaluate", {
    expression: "document.querySelector('#run').click()",
  });
}
