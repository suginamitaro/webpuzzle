class TinyMTJS {
    ini_func1JS(x) {
        const MMMM    = 0xffffffff;
        const UNSMASK = 0x7fffffff;
        x = (x ^ (x >>> 27)) & UNSMASK;
        return (x * 26125) & MMMM;
    }
    ini_func2JS(x) {
        const MMMM    = 0xffffffff;
        const UNSMASK = 0x7fffffff;
        x = (x ^ (x >>> 27)) & UNSMASK;
        return (x * 559973) & MMMM;
    }

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
    // Seeding for Java Script
    setSeed(seed) {
        const MMMM    = 0xffffffff;
        const UNSMASK = 0x7fffffff;
        const MIN_LOOP = 8;
        const MASK = 0x7fffffff;
        const MAT1 = 0x8f7011ee;
        const MAT2 = 0xfc78ff1f;
        const TMAT = 0x3793fdff;
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
    setSeedArray(init_key) {
        const MMMM    = 0xffffffff;
        const UNSMASK = 0x7fffffff;
        const MIN_LOOP = 8;
        const MASK = 0x7fffffff;
        const MAT1 = 0x8f7011ee;
        const MAT2 = 0xfc78ff1f;
        const TMAT = 0x3793fdff;
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
            throw new Error('TinyMTJS.setSeedArray Seed type mismatch.');
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
        r = this.ini_func1JS(status[0] ^ status[mid % size]
                             ^ status[(size - 1) % size]);
        status[mid % size] = (status[mid % size] + r) & MMMM;
        r = (r + key_length);// & UNSMASK;
        status[(mid + lag) % size] = (status[(mid + lag) % size] + r) & MMMM;
        status[0] = r;
        count--;
        for (i = 1, j = 0; (j < count) && (j < key_length); j++) {
            r = this.ini_func1JS(status[i % size]
                                 ^ status[(i + mid) % size]
                                 ^ status[(i + size - 1) % size]);
            status[(i + mid) % size] = (status[(i + mid) % size] + r) & MMMM;
            r = (r + init_key[j] + i) & MMMM;
            status[(i + mid + lag) % size] =
                (status[(i + mid + lag) % size] + r) & MMMM;
            status[i % size] = r;
            i = (i + 1) % size;
        }
        for (j = 0; j < size; j++) {
            r = this.ini_func2JS(status[i % size]
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
        const MMMM    = 0xffffffff;
        const UNSMASK = 0x7fffffff;
        const MIN_LOOP = 8;
        const MASK = 0x7fffffff;
        const MAT1 = 0x8f7011ee;
        const MAT2 = 0xfc78ff1f;
        const TMAT = 0x3793fdff;
        const SH0 = 1;
        const SH1 = 10;
        const SH8 = 8;

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

module.exports = TinyMTJS;
