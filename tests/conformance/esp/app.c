#include <stdint.h>

/* esp_app_desc_t layout from ESP-IDF v6.1 esp_app_desc.h. */
typedef struct {
  uint32_t magic_word;
  uint32_t secure_version;
  uint32_t reserv1[2];
  char version[32];
  char project_name[32];
  char time[16];
  char date[16];
  char idf_ver[32];
  uint8_t app_elf_sha256[32];
  uint16_t min_efuse_blk_rev_full;
  uint16_t max_efuse_blk_rev_full;
  uint8_t mmu_page_size;
  uint8_t spi_flash_mode;
  uint8_t reserv3[2];
  uint32_t reserv2[18];
} nre_app_desc_t;

_Static_assert(sizeof(nre_app_desc_t) == 256, "esp_app_desc_t is 256 bytes");

__attribute__((section(".flash.appdesc"), used))
const nre_app_desc_t nre_app_desc = {
    .magic_word = 0xABCD5432,
    .secure_version = 3,
    .version = "nre-verify-1",
    .project_name = "nre_esp_image",
    .time = "00:00:00",
    .date = "Jan  1 2026",
    .idf_ver = "v6.1-nre",
    .max_efuse_blk_rev_full = 199,
    .mmu_page_size = 16,
};

__attribute__((section(".flash.rodata"), used))
const char nre_message[] = "NRE ESP image verification";

__attribute__((section(".flash.text"), used, noinline)) int
nre_flash_function(int value) {
  return value * 3 + nre_message[value & 7];
}

__attribute__((section(".dram0.data"), used)) volatile int nre_counter = 7;

__attribute__((section(".iram0.text"), used, noreturn)) void nre_entry(void) {
  for (;;)
    nre_counter = nre_flash_function(nre_counter);
}
