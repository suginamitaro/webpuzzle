#include <iostream>
#include <inttypes.h>
#include <cstdio>
#include "tinymt32.hpp"

int main(int argc, char * argv[]) {
    uint32_t seed = 1;
    //uint32_t seed_array[5];
    if (argc >= 2) {
        seed = (uint32_t)strtoul(argv[1], NULL, 0);
    }
    //printf(" seed = %d\n", seed);
    TinyMT32 tinymt(seed);
    //printf(" seedJS seed = %d\n", seed);
    tinymt.seedJS(seed);
    printf("31-bit unsigned integers r, where 0 <= r < 2^31\n");
    for (int i = 0; i < 20; i++) {
        printf("%" PRIu32 "\n", tinymt.generate_uint31());
    }
    printf("31-bit double r, where 0 <= r < 1.0\n");
    for (int i = 0; i < 20; i++) {
        printf("%.10f\n", tinymt.generate_double31());
    }
    printf("int r, where 0 <= r < 100\n");
    for (int i = 0; i < 20; i++) {
        printf("%" PRIu32 "\n", tinymt.getInt(100));
    }
    return 0;
}
