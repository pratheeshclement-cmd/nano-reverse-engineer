// A real initialized data range, with independently recognizable endpoints.
volatile unsigned char nre_large_payload[NRE_PAYLOAD_BYTES] = {
    [0] = 0x5a, [NRE_PAYLOAD_BYTES - 1] = 0xa5};

__attribute__((noinline, used)) int nre_large_entry(void) {
  return nre_large_payload[0] + nre_large_payload[NRE_PAYLOAD_BYTES - 1];
}

int main(void) { return nre_large_entry(); }
