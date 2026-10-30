/* Source-owned Allegrex decoding probe. This fixture is never executed. */
.set noreorder
.text
.align 2
.globl nre_psp_probe
.type nre_psp_probe, @function
.ent nre_psp_probe
nre_psp_probe:
  addiu $v0, $zero, 0x1234
  bitrev $v0, $v0
  jr $ra
  nop
.end nre_psp_probe
.size nre_psp_probe, .-nre_psp_probe
