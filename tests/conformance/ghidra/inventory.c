#include <stdio.h>
#include <stdlib.h>

volatile int nre_ghidra_inventory_global = 7;

#if defined(__x86_64__) && defined(__ELF__)
// Static decoder controls: these functions are retained but never executed.
__attribute__((naked, noinline, used)) void nre_ghidra_flow_return(void) {
  __asm__("ret");
}
__attribute__((naked, noinline, used)) void nre_ghidra_flow_cleanup_return(void) {
  __asm__("ret $16");
}
__attribute__((naked, noinline, used)) void nre_ghidra_flow_shared_tail(void) {
  __asm__("jmp nre_ghidra_flow_return");
}
__attribute__((naked, noinline, used)) void nre_ghidra_flow_trap(void) {
  __asm__("ud2");
}
#endif

// This literal reproduces stack exhaustion in Java's recursive regex matcher.
#define NRE_REPEAT_4(value) value value value value
#define NRE_REPEAT_16(value) NRE_REPEAT_4(NRE_REPEAT_4(value))
#define NRE_REGEX_RUN NRE_REPEAT_16(NRE_REPEAT_16(NRE_REPEAT_16("a")))
__attribute__((used)) const char *volatile nre_ghidra_regex_subject =
    NRE_REGEX_RUN NRE_REGEX_RUN NRE_REGEX_RUN "!";
#undef NRE_REGEX_RUN
#undef NRE_REPEAT_16
#undef NRE_REPEAT_4

enum ReaFixtureState { NRE_FIXTURE_IDLE = 0, NRE_FIXTURE_READY = 3 };
union ReaFixturePayload { unsigned int word; unsigned char bytes[4]; };
struct ReaFixtureLayout {
  enum ReaFixtureState state;
  union ReaFixturePayload payload;
  struct ReaFixtureLayout *next;
};
volatile struct ReaFixtureLayout nre_ghidra_inventory_layout = {
    NRE_FIXTURE_READY, {.word = 5}, 0};

__attribute__((noinline, used)) int nre_ghidra_inventory_leaf(int value) {
  puts("NRE_GHIDRA_LEAF_VALUE");
  return value + nre_ghidra_inventory_global;
}

// Ghidra's no-return analysis recognizes abort; this function provides a real
// terminal-call boundary while retaining a returning path.
__attribute__((noinline, used)) int nre_ghidra_inventory_terminal_call(
    int should_abort) {
  if (should_abort) abort();
  puts("NRE_GHIDRA_TERMINAL_CALL_RETURNED");
  return should_abort;
}

// A reference into the function body can land inside an instruction.
__attribute__((used)) const unsigned char *volatile nre_ghidra_interior_pointer =
    (const unsigned char *)(void *)nre_ghidra_inventory_leaf + 1;

__attribute__((noinline, used)) int nre_ghidra_inventory_branch(int value) {
  if (value > 10) {
    return nre_ghidra_inventory_leaf(value);
  }
  return nre_ghidra_inventory_leaf(-value);
}

__attribute__((noinline, used)) int nre_ghidra_inventory_indirect(
    int (*callback)(int), int value) {
  return callback(value);
}

__attribute__((noinline, used)) int nre_ghidra_inventory_switch(
    unsigned int selector, int value) {
  switch (selector) {
    case 0:
      return nre_ghidra_inventory_leaf(value);
    case 1:
      return nre_ghidra_inventory_leaf(value + 3);
    case 2:
      return nre_ghidra_inventory_leaf(value - 5);
    case 3:
      return nre_ghidra_inventory_leaf(value * 2);
    case 4:
      return nre_ghidra_inventory_leaf(value ^ 0x55);
    case 5:
      return nre_ghidra_inventory_leaf(value | 0x20);
    case 6:
      return nre_ghidra_inventory_leaf(value & 0x3f);
    case 7:
      return nre_ghidra_inventory_leaf(value + nre_ghidra_inventory_global);
    default:
      return -1;
  }
}

__attribute__((noinline, used)) int nre_ghidra_inventory_dense_switch(
    unsigned int selector, int value) {
  switch (selector) {
    case 0: return nre_ghidra_inventory_leaf(value + 0);
    case 1: return nre_ghidra_inventory_leaf(value + 1);
    case 2: return nre_ghidra_inventory_leaf(value + 2);
    case 3: return nre_ghidra_inventory_leaf(value + 3);
    case 4: return nre_ghidra_inventory_leaf(value + 4);
    case 5: return nre_ghidra_inventory_leaf(value + 5);
    case 6: return nre_ghidra_inventory_leaf(value + 6);
    case 7: return nre_ghidra_inventory_leaf(value + 7);
    case 8: return nre_ghidra_inventory_leaf(value + 8);
    case 9: return nre_ghidra_inventory_leaf(value + 9);
    case 10: return nre_ghidra_inventory_leaf(value + 10);
    case 11: return nre_ghidra_inventory_leaf(value + 11);
    case 12: return nre_ghidra_inventory_leaf(value + 12);
    case 13: return nre_ghidra_inventory_leaf(value + 13);
    case 14: return nre_ghidra_inventory_leaf(value + 14);
    case 15: return nre_ghidra_inventory_leaf(value + 15);
    case 16: return nre_ghidra_inventory_leaf(value + 16);
    case 17: return nre_ghidra_inventory_leaf(value + 17);
    case 18: return nre_ghidra_inventory_leaf(value + 18);
    case 19: return nre_ghidra_inventory_leaf(value + 19);
    case 20: return nre_ghidra_inventory_leaf(value + 20);
    case 21: return nre_ghidra_inventory_leaf(value + 21);
    case 22: return nre_ghidra_inventory_leaf(value + 22);
    case 23: return nre_ghidra_inventory_leaf(value + 23);
    case 24: return nre_ghidra_inventory_leaf(value + 24);
    case 25: return nre_ghidra_inventory_leaf(value + 25);
    case 26: return nre_ghidra_inventory_leaf(value + 26);
    case 27: return nre_ghidra_inventory_leaf(value + 27);
    case 28: return nre_ghidra_inventory_leaf(value + 28);
    case 29: return nre_ghidra_inventory_leaf(value + 29);
    case 30: return nre_ghidra_inventory_leaf(value + 30);
    case 31: return nre_ghidra_inventory_leaf(value + 31);
    case 32: return nre_ghidra_inventory_leaf(value + 32);
    case 33: return nre_ghidra_inventory_leaf(value + 33);
    case 34: return nre_ghidra_inventory_leaf(value + 34);
    case 35: return nre_ghidra_inventory_leaf(value + 35);
    case 36: return nre_ghidra_inventory_leaf(value + 36);
    case 37: return nre_ghidra_inventory_leaf(value + 37);
    case 38: return nre_ghidra_inventory_leaf(value + 38);
    case 39: return nre_ghidra_inventory_leaf(value + 39);
    default: return -1;
  }
}

__attribute__((noinline, used)) int nre_ghidra_inventory_entry(void) {
  puts("NRE_GHIDRA_INVENTORY_ENTRY");
  return nre_ghidra_inventory_branch(35) +
         nre_ghidra_inventory_indirect(nre_ghidra_inventory_leaf, 0) +
         nre_ghidra_inventory_dense_switch(100, 0) + 1;
}

int main(void) { return nre_ghidra_inventory_entry() == 49 ? 0 : 1; }
