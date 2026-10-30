#include <stdio.h>
__attribute__((noinline, used)) int nre_version_leaf(void) {
  puts("NRE_VERSION_TWO");
  return 2;
}
__attribute__((noinline, used)) int nre_added(void) { return 40; }
__attribute__((noinline, used)) int nre_version_entry(void) {
  return nre_version_leaf() + nre_added();
}
int main(void) { return nre_version_entry() == 42 ? 0 : 1; }
