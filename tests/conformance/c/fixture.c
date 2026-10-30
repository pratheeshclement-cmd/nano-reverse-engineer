#include <stdio.h>

volatile int nre_c_global = 7;

#define NRE_LONG_CHUNK "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
#define NRE_LONG_256 NRE_LONG_CHUNK NRE_LONG_CHUNK NRE_LONG_CHUNK NRE_LONG_CHUNK
#define NRE_LONG_1024 NRE_LONG_256 NRE_LONG_256 NRE_LONG_256 NRE_LONG_256
/* Keep the full-size literal even when a loader does not type it as a string. */
__attribute__((used)) const char nre_long_literal[] =
    "NRE_LONG_LITERAL_" NRE_LONG_1024 NRE_LONG_1024 NRE_LONG_1024 NRE_LONG_1024 "needle";
/* Verified Hopper loaders recognize this extent and split it into native objects. */
__attribute__((used)) const char nre_fragmented_literal[] =
    "NRE_FRAGMENTED_LITERAL_" NRE_LONG_256 NRE_LONG_256 "fragment_tail";
__attribute__((used)) const char nre_utf8_literal[] = "NRE_UTF8_é_😀";
__attribute__((used)) const char nre_ellipsis_literal[] = "NRE_LITERAL_…";
__attribute__((used)) const char nre_latin1_literal[] = "NRE_LATIN1_\xff";

__attribute__((noinline, used)) void nre_long_literal_procedure(void) {
  puts(nre_long_literal);
  puts(nre_fragmented_literal);
  puts(nre_utf8_literal);
  puts("NRE_ESCAPED_\"\\line\nend\t\r");
  puts("NRE_LITERAL_BACKSLASH_\\n");
  puts(nre_ellipsis_literal);
  puts(nre_latin1_literal);
}

__attribute__((noinline, used)) int nre_leaf(int value) {
  puts("NRE_C_LEAF");
  return value + nre_c_global;
}

__attribute__((noinline, used)) int nre_branch(int value) {
  return value > 3 ? nre_leaf(value) : nre_leaf(-value);
}

__attribute__((noinline, used)) int nre_entry(void) {
  puts("NRE_C_ENTRY");
  /* Give the native locals oracle explicit stack storage. */
  volatile int input = 5;
  return nre_branch(input);
}

int main(void) { return nre_entry() == 12 ? 0 : 1; }

__attribute__((noinline, used)) int nre_cycle_b(int value);

__attribute__((noinline, used)) int nre_cycle_a(int value) {
  return value > 0 ? nre_cycle_b(value - 1) : value;
}

__attribute__((noinline, used)) int nre_cycle_b(int value) {
  return value > 0 ? nre_cycle_a(value - 1) : value;
}
