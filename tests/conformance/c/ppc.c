/* Freestanding, source-owned static-analysis fixture. Never executed by NRE. */
volatile unsigned int nre_ppc_global = 7;
const char nre_ppc_marker[] = "nre-ppc-source-owned-fixture";

__attribute__((noinline)) unsigned int nre_ppc_leaf(unsigned int value)
{
    return value * 3u + nre_ppc_global;
}

__attribute__((noinline)) unsigned int nre_ppc_entry(unsigned int selector)
{
    unsigned int adjusted = selector > 10u ? selector : selector + 1u;
    return nre_ppc_leaf(adjusted) + (unsigned char)nre_ppc_marker[0];
}
