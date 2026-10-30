/* Relocatable (ET_REL) static-analysis fixture, built with -c -G0 and never
 * executed or linked by NRE. It exercises the relocations Linux MIPS kernel
 * modules use: R_MIPS_26 calls, HI16/LO16 address pairs (one HI16 shared by
 * several LO16s, two HI16s resolved by one LO16, and a LO16 >= 0x8000 that
 * forces a HI16 carry), R_MIPS_32
 * data words, and undefined external code and data symbols. powf is an
 * external whose float prototype Ghidra's C library archive supplies by name,
 * so soft-float builds must give it the soft-float prototype too.
 */
extern int nre_mips_rel_external(int value);
extern int nre_mips_rel_external_data;
extern float powf(float base, float exponent);

struct nre_mips_rel_pair {
    int first;
    int second;
};

struct nre_mips_rel_pair nre_mips_rel_pair = { 0x1111, 0x2222 };
/* Places nre_mips_rel_carry past a signed 16-bit low-half boundary. */
char nre_mips_rel_padding[0x8000] = { 1 };
int nre_mips_rel_carry = 0x3333;
/* Referenced only by nre_mips_rel_highs, so its single LO16 stays unique. */
int nre_mips_rel_highs_target = 0x4444;
static const char nre_mips_rel_marker[] = "nre-mips-relocatable-fixture";

__attribute__((noinline)) int nre_mips_rel_leaf(int value)
{
    return value * 3 + nre_mips_rel_pair.first + nre_mips_rel_pair.second;
}

__attribute__((noinline, long_call)) int nre_mips_rel_far(int value);

int nre_mips_rel_far(int value)
{
    return value + nre_mips_rel_marker[value & 7] + nre_mips_rel_carry;
}

int (*const nre_mips_rel_table[])(int) = {
    nre_mips_rel_leaf,
    nre_mips_rel_far,
    nre_mips_rel_external,
};

__attribute__((noinline)) int nre_mips_rel_scaled(int value)
{
    float scaled = powf(1.5f, 2.5f);
    return value ^ *(int *)&scaled;
}

/* Most GCC-built kernel modules checked contain LO16s that resolve several
 * pending HI16s; Clang does not produce that from C. Two %hi and exactly one
 * %lo of a symbol nothing else references: any assembler that orders each
 * HI16 before a matching LO16 (GNU as, every LLVM version) must emit both
 * HI16s ahead of that single LO16, which therefore resolves both.
 */
__asm__(".text\n"
        ".globl nre_mips_rel_highs\n"
        ".type nre_mips_rel_highs, @function\n"
        ".set push\n"
        ".set noreorder\n"
        "nre_mips_rel_highs:\n"
        "    lui $2, %hi(nre_mips_rel_highs_target)\n"
        "    lui $3, %hi(nre_mips_rel_highs_target)\n"
        "    addiu $2, $2, %lo(nre_mips_rel_highs_target)\n"
        "    jr $31\n"
        "    move $3, $2\n"
        ".set pop\n"
        ".size nre_mips_rel_highs, .-nre_mips_rel_highs\n");

int nre_mips_rel_entry(int value)
{
    return nre_mips_rel_leaf(value) + nre_mips_rel_far(value) +
        nre_mips_rel_external(value) + nre_mips_rel_external_data +
        nre_mips_rel_table[value & 1](value) + nre_mips_rel_scaled(value);
}
