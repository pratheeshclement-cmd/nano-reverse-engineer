import { describe, expect, it } from "vitest";
import {
  isDisallowedGdbCommand,
  isDisallowedRizinCommand,
  isUnsafeDebuggingPermitted,
} from "./debuggerSecurityPolicy.js";

describe("debuggerSecurityPolicy", () => {
  it("permits standard GDB inspection and control commands", () => {
    const safeCommands = [
      "info registers",
      "break main",
      "continue",
      "stepi",
      "next",
      "x/10gx 0x401000",
      "print $rax",
      "disassemble main",
      "backtrace",
      "frame 0",
      "thread 1",
    ];
    for (const cmd of safeCommands) {
      expect(isDisallowedGdbCommand(cmd, {})).toBeUndefined();
    }
  });

  it("disallows GDB shell escapes by default", () => {
    const dangerous = [
      "shell whoami",
      "shell rm -rf /",
      "!id",
      "! cat /etc/passwd",
      "shell",
      "!",
      "python import os; os.system('whoami')",
      "py import subprocess; subprocess.Popen(['ls'])",
    ];
    for (const cmd of dangerous) {
      expect(isDisallowedGdbCommand(cmd, {})).toBeDefined();
    }
  });

  it("permits GDB shell escapes when NRE_ALLOW_UNSAFE_DEBUGGING is true", () => {
    expect(
      isDisallowedGdbCommand("shell whoami", {
        NRE_ALLOW_UNSAFE_DEBUGGING: "true",
      }),
    ).toBeUndefined();
    expect(
      isDisallowedGdbCommand("shell whoami", {
        REA_ALLOW_UNSAFE_DEBUGGING: "true",
      }),
    ).toBeUndefined();
  });

  it("permits standard Rizin analysis commands", () => {
    const safeCommands = [
      "iI",
      "pdf",
      "pxw 64 @ rsp",
      "af",
      "s 0x1000",
      "pd 20",
      "dr",
      "dm",
    ];
    for (const cmd of safeCommands) {
      expect(isDisallowedRizinCommand(cmd, {})).toBeUndefined();
    }
  });

  it("disallows Rizin shell execution commands by default", () => {
    const dangerous = ["!whoami", "!id", "!=sh", "=!cat /etc/shadow"];
    for (const cmd of dangerous) {
      expect(isDisallowedRizinCommand(cmd, {})).toBeDefined();
    }
  });

  it("permits Rizin shell execution when NRE_ALLOW_UNSAFE_DEBUGGING is true", () => {
    expect(
      isDisallowedRizinCommand("!whoami", {
        NRE_ALLOW_UNSAFE_DEBUGGING: "true",
      }),
    ).toBeUndefined();
  });
});

