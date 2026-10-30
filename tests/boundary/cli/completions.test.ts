import { resolve } from "node:path";
import { Cli, z } from "incur";
import { expect, it } from "vitest";

import { createCliCompletions } from "../../../src/cli/completions.js";
import { workspaceCliTest } from "../../support/cli/workspaceCliFixture.js";

const registry = () =>
  Cli.create("nre", { sync: false }).command("instructions", {
    options: z.object({
      procedure: z.string().optional(),
      targetFormat: z.enum(["dos-com", "raw-binary"]).optional(),
    }),
    run: () => {
      throw new Error("Completion must not execute a command");
    },
  });
const complete = (words: string[], index = words.length - 1) => {
  let text = "";
  const callback = createCliCompletions(registry(), {
    COMPLETE: "bash",
    _COMPLETE_INDEX: String(index),
  });
  expect(
    callback(["--", ...words], {
      stdout: (value) => {
        text += value;
      },
    }),
  ).toBe(true);
  return text === ""
    ? []
    : text
        .split("\v")
        .map((value) => (value.endsWith("\x01") ? value.slice(0, -1) : value));
};

it("resolves enabled builtin scopes in the same tree as registered commands", () => {
  expect(complete(["nre", "mcp", ""])).toEqual(["add", "doctor"]);
  expect(complete(["nre", "mcp", "d"])).toEqual(["doctor"]);
  expect(complete(["nre", "mcp", "ad"])).toEqual(["add"]);
  expect(complete(["nre", "mcp"], 2)).toEqual(["add", "doctor"]);
  expect(complete(["nre", ""])).toEqual(["instructions", "mcp", "completions"]);
  expect(complete(["nre", "completions", "b"])).toEqual(["bash"]);
  expect(complete(["nre", "mcp", "add", "--c"])).toEqual([
    "--command",
    "--columns",
  ]);
});

it("uses canonical global flag metadata and retains command options and enum hints", () => {
  expect(complete(["nre", "instructions", "--he"])).toEqual(["--help"]);
  expect(complete(["nre", "instructions", "--for"])).toEqual(["--format"]);
  expect(complete(["nre", "instructions", "--tok"])).toEqual(
    expect.arrayContaining([
      "--token-count",
      "--token-limit",
      "--token-offset",
    ]),
  );
  expect(complete(["nre", "instructions", "--proc"])).toEqual(["--procedure"]);
  expect(complete(["nre", "instructions", "--target-format", ""])).toEqual([
    "dos-com",
    "raw-binary",
  ]);
  expect(complete(["nre", "instructions", "--format", ""])).toEqual([
    "toon",
    "json",
    "yaml",
    "md",
    "jsonl",
    "csv",
    "tsv",
  ]);
  expect(complete(["nre", "mcp", "doctor", "--format", ""])).toEqual([
    "toon",
    "json",
    "yaml",
    "md",
    "jsonl",
  ]);
  expect(complete(["nre", "mcp", "doctor", "--"])).toEqual([
    "--format",
    "--json",
    "--full-output",
    "--help",
    "--timings",
  ]);
  expect(complete(["nre", "mcp", "doctor", "--t"])).toEqual(["--timings"]);
  expect(complete(["nre", "mcp", "doctor", "-h"])).toEqual(["-h"]);
  expect(complete(["nre", "--filter-output", "mcp", ""])).toEqual([
    "instructions",
    "mcp",
    "completions",
  ]);
  expect(complete(["nre", "instructions", "--"])).not.toContain(
    "--incur-update-check",
  );
  expect(complete(["nre", "instructions", "--"])).not.toContain("--mcp");
});

it("shares Bash registration across ordinary and protocol routes while retaining builtin precedence", () => {
  const cli = registry();
  let direct = "";
  const ordinary = createCliCompletions(cli, {});
  expect(
    ordinary(["--format", "json", "completions", "bash"], {
      stdout: (text) => {
        direct += text;
      },
    }),
  ).toBe(true);
  let protocol = "";
  expect(
    createCliCompletions(cli, { COMPLETE: "bash" })([], {
      stdout: (text) => {
        protocol += text;
      },
    }),
  ).toBe(true);
  expect(direct.trim()).toBe(protocol.trim());
  expect(direct).toContain("type compopt");
  expect(direct).toContain("||\n    complete -o default -o bashdefault");
  expect(ordinary(["completions", "bash", "--help"], {})).toBe(false);
  expect(ordinary(["completions", "bash", "--schema"], {})).toBe(false);
});

workspaceCliTest(
  "explains zsh completion initialization in public help",
  async ({ processes, workspace }) => {
    const environment = {
      ...process.env,
      ...workspace.environment,
      NRE_LOG_LEVEL: "silent",
      NRE_TEST_NODE: process.execPath,
      NRE_TEST_DISPATCHER: resolve("scripts/nre.mjs"),
    };
    for (const arguments_ of [
      ["completions", "--help"],
      ["--json", "completions", "--help"],
      ["completions"],
    ]) {
      const help = await processes.run(
        process.execPath,
        [resolve("scripts/nre.mjs"), ...arguments_],
        { env: environment },
      );
      expect(help.exitCode, help.stderr).toBe(0);
      expect(help.stdout).toContain(
        "initialize completion with `autoload -Uz compinit; compinit` before evaluating the zsh hook",
      );
    }
  },
);

workspaceCliTest.skipIf(process.platform !== "darwin")(
  "registers zsh completion after compinit",
  async ({ processes, workspace }) => {
    const environment = {
      ...process.env,
      ...workspace.environment,
      NRE_LOG_LEVEL: "silent",
      NRE_TEST_NODE: process.execPath,
      NRE_TEST_DISPATCHER: resolve("scripts/nre.mjs"),
    };
    const result = await processes.run(
      "zsh",
      [
        "-f",
        "-c",
        `
nre() { "$NRE_TEST_NODE" "$NRE_TEST_DISPATCHER" "$@"; }
autoload -Uz compinit
compinit -i -D
eval "$(nre completions zsh)" || exit
print -r -- "association=\${+_comps[nre]}"
`,
      ],
      { env: environment },
    );
    expect(result.exitCode, result.stderr).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("association=1\n");
  },
);

workspaceCliTest.skipIf(process.platform === "win32")(
  "runs generated Bash completion with valid MCP scope and incomplete global values through the public launcher",
  async ({ processes, workspace }) => {
    const result = await processes.run(
      "bash",
      [
        "--noprofile",
        "--norc",
        "-c",
        `
nre() { "$NRE_TEST_NODE" "$NRE_TEST_DISPATCHER" "$@"; }
eval "$(nre completions bash)" || exit
COMP_WORDS=(nre mcp "")
COMP_CWORD=2
_incur_complete_rea || exit
printf 'mcp=%s\\n' "\${COMPREPLY[*]}"
COMP_WORDS=(nre instructions --format "")
COMP_CWORD=3
_incur_complete_rea || exit
printf 'format=%s\\n' "\${COMPREPLY[*]}"
COMP_WORDS=(nre mcp doctor --)
COMP_CWORD=3
_incur_complete_rea || exit
printf 'doctor=%s\\n' "\${COMPREPLY[*]}"
`,
      ],
      {
        env: {
          ...process.env,
          ...workspace.environment,
          NRE_LOG_LEVEL: "silent",
          NRE_TEST_NODE: process.execPath,
          NRE_TEST_DISPATCHER: resolve("scripts/nre.mjs"),
        },
      },
    );
    expect(result.exitCode, result.stderr).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("mcp=add doctor\n");
    expect(result.stdout).toContain("format=toon json yaml md jsonl csv tsv\n");
    expect(result.stdout).toContain(
      "doctor=--format --json --full-output --help --timings\n",
    );
  },
);
