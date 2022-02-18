#pragma once
#ifndef TINYMT32_HPP
#define TINYMT32_HPP
/**
 * @file tinymt32.hpp
 *
 * @brief Tiny Mersenne Twister only 127 bit internal state
 *
 * @author Mutsuo Saito (Hiroshima University)
 * @author Makoto Matsumoto (The University of Tokyo)
 *
 * Copyright (C) 2011 Mutsuo Saito, Makoto Matsumoto,
 * Hiroshima University and The University of Tokyo.
 * All rights reserved.
 *
 * The 3-clause BSD License is applied to this software, see
 * LICENSE.txt
 */

#include <stdint.h>
#include <inttypes.h>
#include <cmath>

class TinyMT32 {
private:
    uint32_t status[4];
    uint32_t mat1;
    uint32_t mat2;
    uint32_t tmat;
    static constexpr uint32_t TINYMT32_MASK = UINT32_C(0x7fffffff);
    static constexpr double TINYMT32_MUL = 1.0f / 16777216.0f;
    static constexpr int MIN_LOOP = 8;
    enum {mexp = 127, sh0 = 1, sh1 = 10, sh8 = 8};

    /**
     * This function changes internal state of tinymt32.
     * Users should not call this function directly.
     */
    void next_state() {
        uint32_t x;
        uint32_t y;

        y = status[3];
        x = (status[0] & TINYMT32_MASK)
            ^ status[1]
            ^ status[2];
        x ^= (x << sh0);
        y ^= (y >> sh0) ^ x;
       status[0] = status[1];
       status[1] = status[2];
       status[2] = x ^ (y << sh1);
       status[3] = y;
       if ((y & 1) != 0) {
           status[1] ^= mat1;
           status[2] ^= mat2;
       }
    }

    /**
     * This function outputs 32-bit unsigned integer from internal state.
     * Users should not call this function directly.
     * @return 32-bit unsigned pseudorandom number
     */
     uint32_t temper() {
         uint32_t t0, t1;
         t0 = status[3];
         t1 = status[0]
             + (status[2] >> sh8);
         t0 ^= t1;
         if ((t1 & 1) != 0) {
             t0 ^= tmat;
         }
         return t0;
    }

    /**
     * This function outputs floating point number from internal state.
     * Users should not call this function directly.
     * @return floating point number r (1.0 <= r < 2.0)
     */
    float temper_conv() {
        uint32_t t0, t1;
        union {
            uint32_t u;
            float f;
        } conv;

        t0 = status[3];
        t1 = status[0] + (status[2] >> sh8);
        t0 ^= t1;
        if ((t1 & 1) != 0) {
            conv.u  = ((t0 ^ tmat) >> 9) | UINT32_C(0x3f800000);
        } else {
            conv.u  = (t0 >> 9) | UINT32_C(0x3f800000);
        }
        return conv.f;
    }

    /**
     * This function outputs floating point number from internal state.
     * Users should not call this function directly.
     * @return floating point number r (1.0 < r < 2.0)
     */
    float temper_conv_open() {
        uint32_t t0, t1;
        union {
            uint32_t u;
            float f;
        } conv;

        t0 = status[3];
        t1 = status[0]
            + (status[2] >> sh8);
        t0 ^= t1;
        if ((t1 & 1) != 0) {
            conv.u  = ((t0 ^ tmat) >> 9) | UINT32_C(0x3f800001);
        } else {
            conv.u  = (t0 >> 9) | UINT32_C(0x3f800001);
        }
        return conv.f;
    }

    /**
     * This function certificate the period of 2^127-1.
     * @param random tinymt state vector.
     */
    void period_certification() {
        if ((status[0] & TINYMT32_MASK) == 0 &&
            status[1] == 0 &&
            status[2] == 0 &&
            status[3] == 0) {
            status[0] = 'T';
            status[1] = 'I';
            status[2] = 'N';
            status[3] = 'Y';
        }
    }
    uint32_t ini_func1(uint32_t x) {
        return (x ^ (x >> 27)) * UINT32_C(1664525);
    }
    uint32_t ini_func2(uint32_t x) {
        return (x ^ (x >> 27)) * UINT32_C(1566083941);
    }
public:
    TinyMT32(uint32_t pmat1, uint32_t pmat2, uint32_t ptmat, uint32_t pseed) {
        mat1 = pmat1;
        mat2 = pmat2;
        tmat = ptmat;
        seed(pseed);
    }
    TinyMT32(uint32_t pseed) {
        mat1 = UINT32_C(0x8f7011ee);
        mat2 = UINT32_C(0xfc78ff1f);
        tmat = UINT32_C(0x3793fdff);
        seed(pseed);
    }
    int get_mexp() const {
        return mexp;
    }

    uint32_t generate() {
        return generate_uint32();
    }
    /**
     * This function outputs 32-bit unsigned integer from internal state.
     * @return 32-bit unsigned integer r (0 <= r < 2^32)
     */
    uint32_t generate_uint32() {
        next_state();
        return temper();
    }

    uint32_t generate_uint31() {
        next_state();
        //return temper() & 0x7fffffff;
        return temper() >> 1;
    }
    double generate_double31() {
        return static_cast<double>(generate_uint31()) / 0x80000000;
    }
    uint32_t getInt(uint32_t max) {
        return static_cast<uint32_t>(std::floor(generate_double31() * max));
    }
    /**
     * This function outputs floating point number from internal state.
     * This function is implemented using multiplying by (1 / 2^53).
     * @param random tinymt internal status
     * @return floating point number r (0.0 <= r < 1.0)
     */
    float generate_float() {
        next_state();
        return (float)(temper() >> 8) * TINYMT32_MUL;
    }

    /**
     * This function outputs floating point number from internal state.
     * This function is implemented using union trick.
     * @return floating point number r (0.0 <= r < 1.0)
     */
    float generate_float01() {
        next_state();
        return temper_conv() - 1.0f;
    }

    /**
     * This function outputs floating point number from internal state.
     * This function is implemented using union trick.
     * @return floating point number r (0.0 < r <= 1.0)
     */
    float generate_floatOC() {
        next_state();
        return 1.0f - generate_float();
    }

    /**
     * This function outputs floating point number from internal state.
     * This function is implemented using union trick.
     * @return floating point number r (0.0 < r < 1.0)
     */
    float generate_floatOO() {
        next_state();
        return temper_conv_open() - 1.0f;
    }

    /**
     * This function initializes the internal state array with a 32-bit
     * unsigned integer seed.
     * @param seed a 32-bit unsigned integer used as a seed.
     */
    void seed(uint32_t value) {
        status[0] = value;
        status[1] = mat1;
        status[2] = mat2;
        status[3] = tmat;
        for (unsigned int i = 1; i < MIN_LOOP; i++) {
            status[i & 3] ^= i + UINT32_C(1812433253)
                * (status[(i - 1) & 3]
                   ^ (status[(i - 1) & 3] >> 30));
        }
        period_certification();
        for (unsigned int i = 0; i < MIN_LOOP; i++) {
            next_state();
        }
    }

    // seeding for Java Script
    void seedJS(uint32_t value) {
        status[0] = value;
        status[1] = mat1;
        status[2] = mat2;
        status[3] = tmat;
        for (unsigned int i = 1; i < MIN_LOOP; i++) {
            uint64_t x = status[(i - 1) & 3] ^ (status[(i - 1) & 3] >> 30);
            x = i + 30157 * (x & UINT64_C(0x7fffffff));
            status[i & 3] ^= static_cast<uint32_t>(x);
        }
#if defined(DEBUG)
    printf("seed = %u\n", value);
    printf("mat1 = %08x\n", mat1);
    printf("mat2 = %08x\n", mat2);
    printf("tmat = %08x\n", tmat);
    printf("st:%08x %08x %08x %08x\n",
           status[0],
           status[1],
           status[2],
           status[3]);
#endif
        period_certification();
        for (unsigned int i = 0; i < MIN_LOOP; i++) {
            next_state();
        }
#if defined(DEBUG)
    printf("st:%08x %08x %08x %08x\n",
           status[0],
           status[1],
           status[2],
           status[3]);
#endif
    }
    /**
     * This function initializes the internal state array,
     * with an array of 32-bit unsigned integers used as seeds
     * @param init_key the array of 32-bit integers, used as a seed.
     * @param key_length the length of init_key.
     */
    void seed(const uint32_t init_key[], int key_length) {
        const unsigned int lag = 1;
        const unsigned int mid = 1;
        const unsigned int size = 4;
        unsigned int i, j;
        unsigned int count;
        uint32_t r;

        status[0] = 0;
        status[1] = mat1;
        status[2] = mat2;
        status[3] = tmat;
        if (key_length + 1 > MIN_LOOP) {
            count = (unsigned int)key_length + 1;
        } else {
            count = MIN_LOOP;
        }
        r = ini_func1(status[0] ^ status[mid % size]
                      ^ status[(size - 1) % size]);
        status[mid % size] += r;
        r += (unsigned int)key_length;
        status[(mid + lag) % size] += r;
        status[0] = r;
        count--;
        for (i = 1, j = 0; (j < count) && (j < (unsigned int)key_length); j++) {
            r = ini_func1(status[i % size]
                          ^ status[(i + mid) % size]
                          ^ status[(i + size - 1) % size]);
            status[(i + mid) % size] += r;
            r += init_key[j] + i;
            status[(i + mid + lag) % size] += r;
            status[i % size] = r;
            i = (i + 1) % size;
        }
        for (j = 0; j < size; j++) {
            r = ini_func2(status[i % size]
                          + status[(i + mid) % size]
                          + status[(i + size - 1) % size]);
            status[(i + mid) % size] ^= r;
            r -= i;
            status[(i + mid + lag) % size] ^= r;
            status[i % size] = r;
            i = (i + 1) % size;
        }
        period_certification();
        for (i = 0; i < MIN_LOOP; i++) {
            next_state();
        }
    }

};

#endif
