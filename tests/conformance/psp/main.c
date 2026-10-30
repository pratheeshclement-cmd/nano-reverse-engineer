#include <pspkernel.h>

PSP_MODULE_INFO("nre_psp_fixture", 0, 1, 0);
#ifndef NRE_PSP_GLOBAL
#define NRE_PSP_GLOBAL 7
#endif
volatile unsigned int nre_psp_global = NRE_PSP_GLOBAL;
const char nre_psp_marker[] = "nre-psp-source-owned-fixture";
unsigned int nre_psp_probe(void);

__attribute__((noinline)) unsigned int nre_psp_leaf(unsigned int value) {
  return value * 3u + nre_psp_global;
}
__attribute__((noinline)) unsigned int nre_psp_entry(unsigned int selector) {
  unsigned int adjusted = selector > 10u ? selector : selector + 1u;
  return nre_psp_leaf(adjusted) + nre_psp_probe();
}
int main(void) {
  return (int)nre_psp_entry(11u);
}
