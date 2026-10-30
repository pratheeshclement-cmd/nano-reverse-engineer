#include <stdlib.h>
#include <string.h>
#include <errno.h>

extern void *__tls_get_addr(void *);
extern int *__errno_location(void);
extern void nre_unknown_stop(void);
extern void _Unwind_Resume(void *) __attribute__((noreturn));
volatile unsigned long nre_after_call;

void *nre_malloc(size_t n) {
    void *p = malloc(n);
    nre_after_call++;
    return p;
}
void *nre_malloc_adjacent(size_t n) {
    void *p = malloc(n);
    nre_after_call++;
    return p;
}
__attribute__((visibility("hidden"))) void *nre_tls(void *p) {
    void *value = __tls_get_addr(p);
    nre_after_call++;
    return value;
}
__attribute__((visibility("hidden"))) void *nre_tls_chain(void *p) {
    void *value = nre_tls(p);
    nre_after_call++;
    return value;
}
void *nre_tls_outer(void *p) {
    void *value = nre_tls_chain(p);
    nre_after_call++;
    return value;
}
void *nre_memcpy(void *out, const void *in, size_t n) {
    void *value = memcpy(out, in, n);
    nre_after_call++;
    return value;
}
void *nre_memset(void *out, int c, size_t n) {
    void *value = memset(out, c, n);
    nre_after_call++;
    return value;
}
size_t nre_strlen(const char *p) {
    size_t value = strlen(p);
    nre_after_call++;
    return value;
}
int *nre_errno(void) {
    int *p = __errno_location();
    nre_after_call++;
    return p;
}
void nre_unknown(void) {
    nre_unknown_stop();
    nre_after_call++;
}
void nre_abort(void) { abort(); }
void nre_unwind(void *p) { _Unwind_Resume(p); }
void nre_local_stop(void) { __builtin_trap(); }
int nre_local_return(void) { return 1658; }
