#include <stdio.h>
__attribute__((noinline, used)) int nre_version_leaf(void) {
  puts("NRE_VERSION_ONE");
  return 1;
}
__attribute__((noinline, used)) int nre_version_entry(void) {
  return nre_version_leaf();
}
int main(void) { return nre_version_entry() == 1 ? 0 : 1; }
