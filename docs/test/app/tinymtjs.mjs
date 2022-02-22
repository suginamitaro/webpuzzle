/**
 * @file tinymtjs.mjs
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
 * original program is tinymt32.c and tinymt32.h
 * http://www.math.sci.hiroshima-u.ac.jp/m-mat/MT/TINYMT/index.html
 *
 * parameters, (mat1, mat2, tmat) are taken from
 * http://www.math.sci.hiroshima-u.ac.jp/m-mat/MT/TINYMT/DATA/index.html
 * tinymt32dc.0-4.65536.tar.gz
 * tinymt32dc.0.65536.txt
 * last line
 * ab5a14fcfae73ebad2addf92bef887b1,32,0,e99e1d33,42f090bd,ac3ff3ff,77,0
 *
 * Intitialization functions are modified to fit Javascript numbers.
 * Modified by Taro Suginami.
 * Copyright (C) 2021 Taro Suginami.
 * All rights reserved.
 *
 * The 3-clause BSD License is applied to this software, see
 * LICENSE.txt
 */

const MMMM    = 0xffffffff;
const UNSMASK = 0x7fffffff;
const MIN_LOOP = 8;
const MASK = 0x7fffffff;
const MAT1 = 0xe99e1d33;
const MAT2 = 0x42f090bd;
const TMAT = 0xac3ff3ff;
const SH0 = 1;
const SH1 = 10;
const SH8 = 8;

function ini_func1JS(x) {
    x = (x ^ (x >>> 27)) & UNSMASK;
    return (x * 26125) & MMMM;
}
function ini_func2JS(x) {
    x = (x ^ (x >>> 27)) & UNSMASK;
    return (x * 559973) & MMMM;
}

class TinyMTJS {
    constructor(seed) {
        this.st0 = 0;
        this.st1 = 0;
        this.st2 = 0;
        this.st3 = 0;
        if (typeof seed === 'string' || seed instanceof String) {
            this.setSeedArray(seed);
        } else if (Array.isArray(seed)) {
            this.setSeedArray(seed);
        } else {
            this.setSeed(seed);
        }
    }
    // Seeding for Java Script, modified by Taro Suginami
    setSeed(seed) {
        var status = Array(4);
        status[0] = seed & MMMM;
        status[1] = MAT1;
        status[2] = MAT2;
        status[3] = TMAT;
        for (var i = 1; i < MIN_LOOP; i++) {
            var x = (status[(i - 1) & 3] ^ (status[(i - 1) & 3] >>> 30));
            status[i & 3] ^= i + 30157 * (x & UNSMASK);
        }
        this.st0 = status[0];
        this.st1 = status[1];
        this.st2 = status[2];
        this.st3 = status[3];
        if (((this.st0 & MASK) == 0) &&
            (this.st1 == 0) &&
            (this.st2 == 0) &&
            (this.st3 == 0)) {
            this.st0 = 'T'.charCodeAt(0);
            this.st1 = 'I'.charCodeAt(0);
            this.st2 = 'N'.charCodeAt(0);
            this.st3 = 'Y'.charCodeAt(0);
        }
        for (var i = 0; i < MIN_LOOP; i++) {
            this.next();
        }
    }
    // Seeding for Java Script, modified by Taro Suginami
    setSeedArray(init_key) {
        const lag = 1;
        const mid = 1;
        const size = 4;
        var i;
        var j;
        var count;
        var r;
        var status = Array(4);
        var key_length;

        if (typeof init_key === 'string' || init_key instanceof String) {
            init_key = init_key.split('').map((v) => v.charCodeAt());
        } else if (!Array.isArray(init_key)) {
            throw new Error('TinyMTJS.setSeedArray: Seed type mismatch.');
        }
        key_length = init_key.length;
        status[0] = 0;
        status[1] = MAT1;
        status[2] = MAT2;
        status[3] = TMAT;
        if (key_length + 1 > MIN_LOOP) {
            count = key_length + 1;
        } else {
            count = MIN_LOOP;
        }
        r = ini_func1JS(status[0] ^ status[mid % size]
                        ^ status[(size - 1) % size]);
        status[mid % size] = (status[mid % size] + r) & MMMM;
        r = (r + key_length);// & UNSMASK;
        status[(mid + lag) % size] = (status[(mid + lag) % size] + r) & MMMM;
        status[0] = r;
        count--;
        for (i = 1, j = 0; (j < count) && (key_length > 0); j++) {
            r = ini_func1JS(status[i % size]
                            ^ status[(i + mid) % size]
                            ^ status[(i + size - 1) % size]);
            status[(i + mid) % size] = (status[(i + mid) % size] + r) & MMMM;
            r = (r + init_key[j % key_length] + i) & MMMM;
            status[(i + mid + lag) % size] =
                (status[(i + mid + lag) % size] + r) & MMMM;
            status[i % size] = r;
            i = (i + 1) % size;
        }
        for (j = 0; j < size; j++) {
            r = ini_func2JS(status[i % size]
                            + status[(i + mid) % size]
                            + status[(i + size - 1) % size]);
            status[(i + mid) % size] ^= r;
            r -= i;
            status[(i + mid + lag) % size] ^= r;
            status[i % size] = r;
            i = (i + 1) % size;
        }
        this.st0 = status[0];
        this.st1 = status[1];
        this.st2 = status[2];
        this.st3 = status[3];
        if (((this.st0 & MASK) == 0) &&
            (this.st1 == 0) &&
            (this.st2 == 0) &&
            (this.st3 == 0)) {
            this.st0 = 'T'.charCodeAt(0);
            this.st1 = 'I'.charCodeAt(0);
            this.st2 = 'N'.charCodeAt(0);
            this.st3 = 'Y'.charCodeAt(0);
        }
        for (var i = 0; i < MIN_LOOP; i++) {
            this.next();
        }
    }

    getInt31() {
        var v = this.next();
        return v >>> 1;
    }
    getDouble31() {
        return (this.getInt31() * 1.0) / 0x80000000;// 31bit int to double
    }
    getInt(max) {
        return Math.floor(this.getDouble31() * max);
    }
    next() {
        var y = this.st3;
        var x = (this.st0 & MASK) ^ this.st1 ^ this.st2;
        x ^= (x << SH0) & MMMM;
        y ^= (y >>> SH0) ^ x;
        this.st0 = this.st1;
        this.st1 = this.st2;
        this.st2 = x ^ ((y << SH1) & MMMM);
        this.st3 = y;
        if ((y & 1) == 1) {
            this.st1 ^= MAT1;
            this.st2 ^= MAT2;
        }
        var t0 = this.st3;
        var t1 = (this.st0 + (this.st2 >>> SH8)) & MMMM;
        t0 ^= t1;
        if ((t1 & 1) == 1) {
            t0 ^= TMAT;
        }
        return t0;
    }
}

export TinyMTJS;
