/* Freestanding, source-owned static-analysis fixture. Never executed by NRE. */
volatile unsigned int nre_mips_global = 7;
const char nre_mips_marker[] = "nre-mips-source-owned-fixture";

__attribute__((noinline)) unsigned int nre_mips_leaf(unsigned int value)
{
    return value * 3u + nre_mips_global;
}

__attribute__((noinline)) unsigned int nre_mips_entry(unsigned int selector)
{
    unsigned int adjusted = selector > 10u ? selector : selector + 1u;
    return nre_mips_leaf(adjusted) + (unsigned char)nre_mips_marker[0];
}
