/* Freestanding GameCube DOL fixture, source-owned static-analysis input. Never executed by NRE. */
volatile unsigned int nre_dol_global = 0x11223344u;
unsigned int nre_dol_zero[4];
__attribute__((section(".dol_tail"), used)) unsigned int nre_dol_tail[4] = {1u, 2u, 3u, 4u};
