__attribute__((noinline)) int nre_pie_add(int value) {
    return value + 7;
}

int nre_pie_entry(void) {
    return nre_pie_add(35);
}
