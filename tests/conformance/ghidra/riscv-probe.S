/* Fixed instruction oracle, independent of the compiler's C code generation. */
.section .text
.option norvc
.global nre_riscv_probe
.type nre_riscv_probe, @function
nre_riscv_probe:
    addi a0, a0, 17
    ret
.size nre_riscv_probe, .-nre_riscv_probe
