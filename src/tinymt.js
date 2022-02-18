//debug

class TinyMT {
    constructor(seed) {
        this.st0 = 0;
        this.st1 = 0;
        this.st2 = 0;
        this.st3 = 0;
        this.setSeed(seed);
    }
    // Seeding for Java Script
    setSeed(seed) {
        const MIN_LOOP = 8;
        const MASK = 0x7fffffff;
        const MAT1 = 0x8f7011ee;
        const MAT2 = 0xfc78ff1f;
        const TMAT = 0x3793fdff;
        const MMMM = 0xffffffff;
        var status = Array(4);
        status[0] = seed & MMMM;
        status[1] = MAT1;
        status[2] = MAT2;
        status[3] = TMAT;
        for (var i = 1; i < MIN_LOOP; i++) {
            var x = (status[(i - 1) & 3] ^ (status[(i - 1) & 3] >>> 30));
            status[i & 3] ^= i + 30157 * (x & 0x7fffffff);
        }
//#if defined(DEBUG)
        // console.log("seed = " + seed);
        // console.log("mat1 = " + MAT1.toString(16));
        // console.log("mat2 = " + MAT2.toString(16));
        // console.log("tmat = " + TMAT.toString(16));
        // console.log("st[0] = " + status[0].toString(16));
        // console.log("st[1] = " + status[1].toString(16));
        // console.log("st[2] = " + status[2].toString(16));
        // console.log("st[3] = " + status[3].toString(16));
//endif
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
        //return v & 0x7fffffff;
        return v >>> 1;
    }
    getDouble31() {
        return (this.getInt31() * 1.0) / 0x80000000;// 31bit int to double
    }
    getInt(max) {
        return Math.floor(this.getDouble31() * max);
    }
    next() {
        const MASK = 0x7fffffff;
        const MMMM = 0xffffffff;
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

module.exports = TinyMT;
