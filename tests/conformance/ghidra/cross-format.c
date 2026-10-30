typedef int (*nre_cross_callback)(int);

volatile int nre_cross_global = 7;
const volatile char nre_cross_message[] = "NRE_GHIDRA_CROSS_FORMAT";

__attribute__((noinline, used)) int nre_cross_leaf(int value) {
  return value + nre_cross_global + nre_cross_message[0] - 'R';
}

__attribute__((noinline, used)) int nre_cross_branch(int value) {
  /* A volatile-dependent loop keeps this callee multi-block at every
     optimization level: newer clang folds a symmetric if/else of tail calls
     into a conditional negate, and cross-format verification requires a
     recovered multi-block callee. */
  int adjusted = value > 10 ? value + 1 : -value;
  while (adjusted > 100) {
    adjusted -= nre_cross_global;
  }
  return nre_cross_leaf(adjusted);
}

__attribute__((noinline, used)) int nre_cross_indirect(
    nre_cross_callback callback, int value) {
  return callback(value);
}

#define NRE_CROSS_SWITCH_CASE(case_value) \
  case case_value:                        \
    return nre_cross_leaf(payload + case_value)

__attribute__((noinline, used)) int nre_cross_dense_switch(unsigned int selector,
                                                           int payload) {
  switch (selector) {
    NRE_CROSS_SWITCH_CASE(0);
    NRE_CROSS_SWITCH_CASE(1);
    NRE_CROSS_SWITCH_CASE(2);
    NRE_CROSS_SWITCH_CASE(3);
    NRE_CROSS_SWITCH_CASE(4);
    NRE_CROSS_SWITCH_CASE(5);
    NRE_CROSS_SWITCH_CASE(6);
    NRE_CROSS_SWITCH_CASE(7);
    NRE_CROSS_SWITCH_CASE(8);
    NRE_CROSS_SWITCH_CASE(9);
    NRE_CROSS_SWITCH_CASE(10);
    NRE_CROSS_SWITCH_CASE(11);
    NRE_CROSS_SWITCH_CASE(12);
    NRE_CROSS_SWITCH_CASE(13);
    NRE_CROSS_SWITCH_CASE(14);
    NRE_CROSS_SWITCH_CASE(15);
    NRE_CROSS_SWITCH_CASE(16);
    NRE_CROSS_SWITCH_CASE(17);
    NRE_CROSS_SWITCH_CASE(18);
    NRE_CROSS_SWITCH_CASE(19);
    NRE_CROSS_SWITCH_CASE(20);
    NRE_CROSS_SWITCH_CASE(21);
    NRE_CROSS_SWITCH_CASE(22);
    NRE_CROSS_SWITCH_CASE(23);
    NRE_CROSS_SWITCH_CASE(24);
    NRE_CROSS_SWITCH_CASE(25);
    NRE_CROSS_SWITCH_CASE(26);
    NRE_CROSS_SWITCH_CASE(27);
    NRE_CROSS_SWITCH_CASE(28);
    NRE_CROSS_SWITCH_CASE(29);
    NRE_CROSS_SWITCH_CASE(30);
    NRE_CROSS_SWITCH_CASE(31);
    NRE_CROSS_SWITCH_CASE(32);
    NRE_CROSS_SWITCH_CASE(33);
    NRE_CROSS_SWITCH_CASE(34);
    NRE_CROSS_SWITCH_CASE(35);
    NRE_CROSS_SWITCH_CASE(36);
    NRE_CROSS_SWITCH_CASE(37);
    NRE_CROSS_SWITCH_CASE(38);
    NRE_CROSS_SWITCH_CASE(39);
    default:
      return -1;
  }
}

#undef NRE_CROSS_SWITCH_CASE

__attribute__((noinline, used, visibility("default"))) int nre_cross_entry(void) {
  return nre_cross_branch(35) + nre_cross_indirect(nre_cross_leaf, 0);
}

__attribute__((used, visibility("default"))) void nre_cross_start(void) {
  volatile int result = nre_cross_entry();
  (void)result;
  for (;;) {
  }
}
