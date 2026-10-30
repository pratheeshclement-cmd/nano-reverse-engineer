#ifdef _WIN32
#define NRE_EXPORT __declspec(dllexport)
#define NRE_NOINLINE __declspec(noinline)
#else
#define NRE_EXPORT __attribute__((visibility("default")))
#define NRE_NOINLINE __attribute__((noinline))
#endif

NRE_EXPORT NRE_NOINLINE int nre_fixture_add(int left, int right) {
  return left + right + 7;
}

NRE_EXPORT NRE_NOINLINE int nre_fixture_subtract(int left, int right) {
  return left - right - 13;
}

int main(void) {
  return nre_fixture_add(11, 24) + nre_fixture_subtract(24, 11);
}
