/* Source-owned standard MIPS32 instructions with fixed, reviewable encodings.
 * No target execution. The branch at +4 targets +20; its delay slot is a NOP.
 */
.set push
.set noreorder
.text
.p2align 2
.globl nre_mips_probe
.type nre_mips_probe, @function
.ent nre_mips_probe
nre_mips_probe:
    addiu $2, $4, 0x1234
    beq $4, $0, .Lzero
    nop
    jr $31
    nop
.Lzero:
    addiu $2, $0, 7
    jr $31
    nop
.end nre_mips_probe
.size nre_mips_probe, .-nre_mips_probe
.set pop
.section .note.GNU-stack,"",@progbits
