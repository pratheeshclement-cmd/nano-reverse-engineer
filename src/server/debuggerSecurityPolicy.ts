/**
 * Security policy for debugger and command execution tools (gdb_console, rizin_debug_command, execute_rizin_command).
 * Prevents arbitrary OS shell escape and execution while fully preserving legitimate reverse-engineering commands.
 */

/** Check whether unrestricted/unsafe debugging is explicitly opted into via environment variable. */
export const isUnsafeDebuggingPermitted = (
  env: NodeJS.ProcessEnv = process.env,
): boolean =>
  env.NRE_ALLOW_UNSAFE_DEBUGGING === "true" ||
  env.NRE_ALLOW_UNSAFE_DEBUGGING === "true";

/**
 * Audit a GDB console command.
 * Disallows explicit operating system shell escapes (e.g. `shell`, `!`, subprocess python)
 * unless unsafe debugging is explicitly permitted.
 */
export const isDisallowedGdbCommand = (
  command: string,
  env: NodeJS.ProcessEnv = process.env,
): string | undefined => {
  if (isUnsafeDebuggingPermitted(env)) return undefined;
  const trimmed = command.trim();
  if (/^(?:shell\b|!)/iu.test(trimmed)) {
    return (
      "Executing operating system shell commands ('shell' / '!') through GDB is disallowed by default. " +
      "Legitimate debugging commands (break, continue, step, print, x, info, disassemble, backtrace) are permitted. " +
      "To allow unrestricted shell execution, set NRE_ALLOW_UNSAFE_DEBUGGING=true."
    );
  }
  if (
    /^(?:python|py)\s+.*(?:os\.system|subprocess\b|pty\.spawn|shutil\b)/isu.test(
      trimmed,
    )
  ) {
    return (
      "Executing operating system subprocesses via Python in GDB is disallowed by default. " +
      "To allow unrestricted execution, set NRE_ALLOW_UNSAFE_DEBUGGING=true."
    );
  }
  return undefined;
};

/**
 * Audit a Rizin debugger command.
 * Disallows explicit operating system shell execution (e.g. `!<cmd>` or `=!<cmd>`)
 * unless unsafe debugging is explicitly permitted.
 */
export const isDisallowedRizinCommand = (
  command: string,
  env: NodeJS.ProcessEnv = process.env,
): string | undefined => {
  if (isUnsafeDebuggingPermitted(env)) return undefined;
  const trimmed = command.trim();
  if (/^=?!/iu.test(trimmed)) {
    return (
      "Executing operating system shell commands ('!') through Rizin is disallowed by default. " +
      "Legitimate reverse-engineering and inspection commands are permitted. " +
      "To allow unrestricted shell execution, set NRE_ALLOW_UNSAFE_DEBUGGING=true."
    );
  }
  return undefined;
};
