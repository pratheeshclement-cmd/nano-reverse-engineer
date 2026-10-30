/* Source-owned mixed-instruction shared-image control. */
.abicalls
.module fp=xx
.module nooddspreg
.text
.set noreorder
.set nomicromips
.set mips16
.globl nre_mips16_probe
.type nre_mips16_probe, @function
.ent nre_mips16_probe
nre_mips16_probe:
    li $2, 90
    xor $2, $4
    addiu $2, 7
    jrc $31
.end nre_mips16_probe
.size nre_mips16_probe, . - nre_mips16_probe
.ifndef NRE_MIPS_SYMBOL_RELATIVE
.hidden nre_mips16_probe
.endif

.set nomips16
.globl nre_mips32_probe
.type nre_mips32_probe, @function
.ent nre_mips32_probe
nre_mips32_probe:
    addiu $2, $4, 3
    jr $31
    nop
.end nre_mips32_probe
.size nre_mips32_probe, . - nre_mips32_probe

.data
.balign 4
.globl nre_mips16_pointer
.type nre_mips16_pointer, @object
.size nre_mips16_pointer, 4
nre_mips16_pointer:
    .word nre_mips16_probe
.section .note.GNU-stack, "", @progbits
