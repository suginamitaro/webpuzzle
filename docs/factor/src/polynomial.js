//require('./euclid');
const euclid = require('./euclid');
const gcdInt = euclid.gcdInt;
const lcmInt = euclid.lcmInt;
const exgcd = euclid.exgcd;
const inverse = euclid.inverse;

function arDeg(ar) {
    for (var i = ar.length -1; i >= 0; i--) {
        if (ar[i] != 0) {
            return i;
        }
    }
    return -1;
}

function arEqual(ar1, ar2) {
    const deg1 = arDeg(ar1);
    const deg2 = arDeg(ar2);
    if (deg1 != deg2) {
        return false;
    }
    if (deg1 == -1) {
        return true;
    }
    for (var i = 0; i <= deg1; i++) {
        if (ar1[i] != ar2[i]) {
            return false;
        }
    }
    return true;
}

function arToString(indet, ar) {
    const deg = arDeg(ar);
    if (deg == -1) {
        return '0';
    }
    var s = '';
    var sep = '';
    for (var i = 0; i <= deg; i++) {
        if (ar[i] != 0) {
            if (i != 0 && ar[i] == 1) {
                s = s + sep;
            } else if (i != 0 && ar[i] == -1) {
                s = s + '-';
            } else if (ar[i] < 0) {
                s = s + ar[i];
            } else {
                s = s + sep + ar[i];
            }
            sep = '+';
            if (i == 0) {
                continue;
            }
            s = s + indet;
            if (i == 1) {
                continue;
            }
            s = s + '^' + i.toString();
        }
    }
    return s;
}

function arToDescString(indet, ar) {
    const deg = arDeg(ar);
    if (deg == -1) {
        return '0';
    }
    var s = '';
    var sep = '';
    for (var i = deg; i >= 0; i--) {
        if (ar[i] != 0) {
            if (i != 0 && ar[i] == 1) {
                s = s + sep;
            } else if (i != 0 && ar[i] == -1) {
                s = s + '-';
            } else if (ar[i] < 0) {
                s = s + ar[i];
            } else {
                s = s + sep + ar[i];
            }
            sep = '+';
            if (i == 0) {
                continue;
            }
            s = s + indet;
            if (i == 1) {
                continue;
            }
            s = s + '^' + i.toString();
        }
    }
    return s;
}

function arStandard(ar, mod) {
    for (var i = 0; i < ar.length; i++) {
        ar[i] = ((ar[i] % mod) + mod) % mod;
    }
}

function arLeadingK(ar) {
    for (var i = ar.length -1; i >= 0; i--) {
        if (ar[i] != 0) {
            return ar[i];
        }
    }
    return -1;
}

function arXn(ar) {
    for (var i = 0; i < ar.length; i++) {
        if (ar[i] != 0) {
            return i;
        }
    }
    return -1;
}

function arMaxK(ar) {
    var max = Math.abs(ar[0]);
    for (var i = 1; i < ar.length; i++) {
        if (Math.abs(ar[i]) > max) {
            max = Math.abs(ar[i]);
        }
    }
    return max;
}

function arAdd(ar1, ar2) {
    const deg1 = arDeg(ar1);
    const deg2 = arDeg(ar2);
    var res;
    var b;
    var d;
    if (deg1 >= deg2) {
        d = deg2;
        res = ar1.concat();
        b = ar2;
    } else {
        d = deg1;
        res = ar2.concat();
        b = ar1;
    }
    for (var i = 0; i <= d; i++) {
        res[i] = res[i] + b[i];
    }
    return res;
}

function arGt(ar1, ar2) {
    var deg1 = arDeg(ar1);
    var deg2 = arDeg(ar2);
    if (deg1 > deg2) {
        return 1;
    } else if (deg1 < deg2) {
        return -1;
    }
    for (var i = deg1; i >= 0; i--) {
        if (ar1[i] == ar2[i]) {
            continue;
        }
        if (ar1[i] == 0 && ar2[i] != 0) {
            return -1;
        }
        if (ar2[i] == 0 && ar1[i] != 0) {
            return 1;
        }
        if (ar1[i] < 0 && ar2[i] > 0) {
            return -1;
        }
        if (ar2[i] < 0 && ar1[i] > 0) {
            return 1;
        }
        return Math.abs(ar1[i]) - Math.abs(ar2[i]);
    }
    return 0;
}

/*
 * deg(ar1) >= deg(ar2) + shift と仮定する
 * ar2 の 要素に k を掛けて index の大きい方に shift して ar1 に加える
 * ar1 は破壊的に変化する。
 */
function arAddMulShift(ar1, ar2, k, shift) {
    const deg1 = arDeg(ar1);
    const deg2 = arDeg(ar2);
    if (ar1.length < deg2 + shift + 1) {
        throw new Error('invalid degree');
    }
    for (var i = 0; i <= deg2; i++) {
        ar1[i+shift] = ar1[i+shift] + k * ar2[i];
    }
}

function arSub(ar1, ar2) {
    const deg1 = arDeg(ar1);
    const deg2 = arDeg(ar2);
    var res;
    var b;
    var d;
    var s;
    if (deg1 >= deg2) {
        d = deg2;
        res = ar1.concat();
        s = -1;
        b = ar2;
    } else {
        d = deg1;
        res = ar2.concat();
        s = 1;
        b = ar1;
        for (var i = 0; i < res.length; i++) {
            res[i] = -res[i];
        }
    }
    for (var i = 0; i <= d; i++) {
        res[i] = res[i] + s * b[i];
    }
    return res;
}

function arMulK(ar, k) {
    var res = ar.concat();
    for (var i = 0; i < res.length; i++) {
        res[i] = res[i] * k;
    }
    return res;
}

function arDivK(ar, k) {
    var res = ar.concat();
    for (var i = 0; i < res.length; i++) {
        res[i] = res[i] / k;
    }
    return res;
}

function arGcdK(ar) {
    var d = arDeg(ar);
    if (d == -1) {
        return 0;
    }
    var a = ar[d];
    if (Math.abs(a) == 1) {
        return a;
    }
    for (var i = 0; i < d; i++) {
        if (ar[i] == 0) {
            continue;
        }
        if (Math.abs(ar[i]) == 1) {
            return Math.sign(ar[d]);
        }
        a = gcdInt(a, ar[i]);
    }
    return Math.sign(ar[d]) * Math.abs(a);
}

function arRandom(deg, max) {
    var ar = new Array(deg + 1);
    for (var i = 0; i <= deg; i++) {
        var r = Math.trunc(Math.random() * max);
        var sign = 1 - Math.trunc(Math.random() * 2) * 2;
        ar[i] = sign * r;
    }
    while(ar[deg] == 0) {
        ar[deg] = Math.trunc(Math.random() * max);
    }
    return ar;
}

function arIsTanko(ar) {
    var deg = arDeg(ar);
    for (var i = deg -1; i >= 0; i--) {
        if (ar[i] != 0) {
            return false;
        }
    }
    return true;
}

/*
 * 多項式のクラス
 */
class Polynomial {
    constructor(str, ar) {
        this.indet = str;
        this.ar = ar.concat();
    }
    static fromString(str) {
        var sar = str.split(/[:,]/);
        const indet = sar[0];
        const ar = new Array(sar.length -1);
        for (var i = 1; i < sar.length; i++) {
            ar[i - 1] = parseInt(sar[i]);
        }
        return new Polynomial(indet, ar);
    }
    deg() {
        return arDeg(this.ar);
    }
    isTanko() {
        return arIsTanko(this.ar);
    }
    equal(pol) {
        if (this.indet != pol.indet) {
            return false;
        }
        return arEqual(this.ar, pol.ar);
    }
    isZero() {
        return this.deg() == -1;
    }
    leadingK() {
        return arLeadingK(this.ar);
    }
    tailingK() {
        return this.ar[0];
    }
    toString() {
        return arToString(this.indet, this.ar, this.deg());
    }
    toDescString() {
        return arToDescString(this.indet, this.ar, this.deg());
    }
    /*
     * return this * kx^n
     */
    kmulxn(k, n) {
        const ar = new Array(this.deg()+n+1);
        for (var i = 0; i <= this.deg(); i++) {
            ar[i + n] = this.ar[i] * k;
        }
        for (var i = 0; i < n; i++) {
            ar[i] = 0;
        }
        return new Polynomial(this.indet, ar);
    }
    add(pol) {
        if (this.indet != pol.indet) {
            throw new Error('indetermint mismatch');
        }
        const res = arAdd(this.ar, pol.ar);
        return new Polynomial(this.indet, res);
    }
    sub(pol) {
        if (this.indet != pol.indet) {
            throw new Error('indetermint mismatch');
        }
        const res = arSub(this.ar, pol.ar);
        return new Polynomial(this.indet, res);
    }
    gt(pol) {
        if (this.indet != pol.indet) {
            throw new Error('indetermint mismatch');
        }
        return arGt(this.ar, pol.ar);
    }
    mul(pol) {
        if (this.indet != pol.indet) {
            throw new Error('indetermint mismatch');
        }
        if (this.isZero() || pol.isZero()) {
            return new Polynomial(this.indet, [0]);
        }
        var pdeg = pol.deg();
        var ar = new Array(this.deg() + pdeg + 1).fill(0);
        for (var i = 0; i <= pdeg; i++) {
            var k = pol.ar[i];
            if (k != 0) {
                arAddMulShift(ar, this.ar, k, i);
            }
        }
        return new Polynomial(this.indet, ar);
    }
    maxK() {
        return arMaxK(this.ar);
    }
    /*
     * gcd of coefficients
     */
    gcdK() {
        // var d = this.deg();
        // if (d == -1) {
        //     return 0;
        // }
        return arGcdK(this.ar);
        // var a = this.ar[d];
        // if (Math.abs(a) == 1) {
        //     return a;
        // }
        // for (var i = 0; i < d; i++) {
        //     if (this.ar[i] == 0) {
        //         continue;
        //     }
        //     if (Math.abs(this.ar[i]) == 1) {
        //         return Math.sign(this.ar[d]);
        //     }
        //     a = gcdInt(a, this.ar[i]);
        // }
        // return Math.sign(this.ar[d]) * Math.abs(a);
    }
    /*
     * 係数の gcd をくくり出し、それで割った多項式と共に返す
     */
    gcdKP() {
        const a = this.gcdK();
        const ar = this.ar.concat();
        for (var i = 0; i <= this.deg(); i++) {
            ar[i] = ar[i] / a;
        }
        return [a, new Polynomial(this.indet, ar)];
    }
    gcdKPX() {
        const a = this.gcdK();
        var n = 0;
        for (var i = 0; i <= this.deg(); i++) {
            if (this.ar[i] != 0) {
                n = i;
                break;
            }
        }
        var xar = new Array(n + 1).fill(0);
        // console.log('n = ' + n);
        xar[n] = a;
        // console.log(xar);
        var r1 = new Polynomial(this.indet, xar);
        var r2 = this.divrem(r1)[0];
        return [r1, r2];
    }
    /*
     * differential 多項式の微分
     */
    d() {
        var d = this.deg();
        if (d <= 0) {
            return new Polynomial(this.indet, [0]);
        }
        var ar = new Array(d);
        for (var i = 1; i <= d; i++) {
            ar[i - 1] = this.ar[i] * i;
        }
        return new Polynomial(this.indet, ar);
    }
    modK(mod) {
        if (mod <= 1) {
            throw new Error('zero divide');
        }
        var ar = this.ar.concat();
        arStandard(ar, mod);
        return new Polynomial(this.indet, ar);
    }
    /*
     * 余り付き割り算
     * return [p, r], where p*pol + r = this
     */
    divrem(pol) {
        if (this.indet != pol.indet) {
            console.log('this.indet = ' + this.indet);
            console.log('pol.indet = ' + pol.indet);
            throw new Error('indetermint mismatch');
        }
        if (pol.isZero()) {
            throw new Error('zero divide');
        }
        if (this.deg() < pol.deg()) {
            return [new Polynomial(this.indet, [0]),
                    new Polynomial(this.indet, this.ar)];
        }
        var tl = arLeadingK(this.ar);
        var pl = arLeadingK(pol.ar);
        if (tl % pl != 0) {
            return [new Polynomial(this.indet, [0]),
                    new Polynomial(this.indet, this.ar)];
        }
        var diff = this.deg() - pol.deg();
        const ar = new Array(diff+1).fill(0);
        ar[diff] = tl / pl;
        // for (var i = 0; i < diff; i++) {
        //     ar[i] = 0;
        // }
        var tmp = this.sub(pol.kmulxn(tl/pl, diff));
        while (diff > 0) {
            diff = tmp.deg() - pol.deg();
            tl = tmp.leadingK();
            if (tl % pl != 0 || diff < 0) {
                return [new Polynomial(this.indet, ar), tmp];
            }
            ar[diff] = tl / pl;
            tmp = tmp.sub(pol.kmulxn(tl/pl, diff));
        }
        return [new Polynomial(this.indet, ar), tmp];
    }
    /*
     * 余り付き割り算（インチキ）
     * return [p, r], where p*pol + r = this
     */
    remX(pol) {
        if (this.indet != pol.indet) {
            throw new Error('indetermint mismatch');
        }
        if (pol.isZero()) {
            throw new Error('zero divide');
        }
        if (this.deg() < pol.deg()) {
            return new Polynomial(this.indet, this.ar);
        }
        var tl = this.leadingK();
        var pl = pol.leadingK();
        // if (tl % pl != 0) {
        //     return [new Polynomial(this.indet, [0]),
        //             new Polynomial(this.indet, this.ar)];
        // }
        var diff = this.deg() - pol.deg();
        const ar = new Array(diff+1).fill(0);
        var tmp = new Polynomial(this.indet, this.ar);
        if (tl % pl != 0) {
            const m = lcmInt(tl, pl) / tl;
            tl = tl * m;
            tmp = tmp.kmulxn(m, 0);
        }
        ar[diff] = tl / pl;
        tmp = tmp.sub(pol.kmulxn(tl/pl, diff));
        while (diff > 0 && !tmp.isZero()) {
            diff = tmp.deg() - pol.deg();
            if (diff < 0) {
                break;
            }
            tl = tmp.leadingK();
            if (tl % pl != 0) {
//                return [new Polynomial(this.indet, ar), tmp];
                const m = lcmInt(tl, pl) / tl;
                tl = tl * m;
                tmp = tmp.kmulxn(m, 0);
            }
            ar[diff] = tl / pl;
            tmp = tmp.sub(pol.kmulxn(tl/pl, diff));
        }
        const kp = tmp.gcdKP();
        return kp[1];
    }
    gcd(pol) {
        if (this.indet != pol.indet) {
            throw new Error('indetermint mismatch');
        }
        var a = this;
        var b = pol;
        var t = this.gcdKP();
        var ak = t[0];
        a = t[1];
        t = pol.gcdKP();
        var bk = t[0]
        b = t[1];
        var gcdK = gcdInt(ak, bk);
        if (b.deg() > a.deg()) {
            return b.gcd(a);
        }
        if (b.deg() == a.deg() && b.leadingK() > a.leadingK()) {
            return b.gcd(a);
        }
        while (!b.isZero()) {
            var t = b;
            var tmp = a.divrem(b);
            b = tmp[1];
            if (b.deg() >= a.deg()) {
                return new Polynomial(this.indet, [gcdK]);
            }
            a = t;
        }
        if (a.deg() == 0 && a.leadingK() == -1) {
            return new Polynomial(this.indet, [1]);
        } else {
            return a.kmulxn(gcdK, 0);
        }
    }
    gcdX(pol) {
        if (this.indet != pol.indet) {
            throw new Error('indetermint mismatch');
        }
        var a = this;
        var b = pol;
        // console.log('a = ' + a.toString());
        // console.log('b = ' + b.toString());
        var t = this.gcdKP();
        var ak = t[0];
        a = t[1];
        t = pol.gcdKP();
        var bk = t[0]
        b = t[1];
        var gcdK = gcdInt(ak, bk);
        if (b.deg() > a.deg()) {
            return b.gcd(a);
        }
        if (b.deg() == a.deg() && b.leadingK() > a.leadingK()) {
            return b.gcdX(a);
        }
        while (!b.isZero()) {
            // console.log('a = ' + a.toString());
            // console.log('b = ' + b.toString());
            var t = b;
            //var tmp = a.divrem(b);
            b = a.remX(b);
            // if (b.deg() >= a.deg()) {
            //     return new Polynomial(this.indet, [gcdK]);
            // }
            a = t;
            // console.log('gcdx a = ' + a.toString());
            // console.log('gcdx b = ' + b.toString());
        }
        // console.log('a = ' + a.toString());
        // console.log('b = ' + b.toString());
        // console.log('gcdK = ' + gcdK);
        // remXではgcdを括り出しているので-1にならない
//        if (a.deg() == 0 && a.leadingK() == -1) {
        if (a.deg() == 0) {
            return new Polynomial(this.indet, [1]);
        } else {
            return a.kmulxn(gcdK, 0);
        }
    }
    squareFree() {
        var d = this.d().gcdKP()[1];
//        var g = this.gcd(d);
        var g = this.gcdX(d);
        if (g.deg() > 0) {
            var t = this.divrem(g);
            if (!t[0].isZero()) {
                return t[0];
            } else {
                var t = this.gcdKP()[1];
                return new Polynomial(t.indet, t.ar);
            }
        } else {
            var t = this.gcdKP()[1];
            return new Polynomial(t.indet, t.ar);
        }
    }
    static getRandom(indet, deg, max) {
        deg = Math.trunc(deg);
        max = Math.trunc(max);
        if (deg < 1) {
            throw new Error('deg too small');
        }
        if (max < 2) {
            throw new Error('max too small');
        }
        var array = arRandom(deg, max);
        return new Polynomial(indet, array);
    }
}

class PolynomialMP {
    constructor(indet, ar, mod, base = mod) {
        this.indet = indet;
        this.ar = ar.concat();
        this.mod = mod;
        this.base = base;
        this.standard();
    }
    static fromPolynomial(pol, mod, base = mod) {
        return new PolynomialMP(pol.indet, pol.ar, mod, base);
    }
    toPolynomial() {
        return new Polynomial(this.indet, this.ar);
    }
    equal(pol) {
        if (this.indet != pol.indet) {
            return false;
        }
        if (this.mod != pol.mod) {
            return false;
        }
        return arEqual(this.ar, pol.ar);
    }
    toNewMod(mod) {
        if (mod % this.base != 0) {
            throw new Error('invalid mod');
        }
        return new PolynomialMP(this.indet, this.ar, mod, this.base);
    }
    getMod() {
        return this.mod;
    }
    standard() {
        arStandard(this.ar, this.mod);
    }
    toString() {
        return arToString(this.indet, this.ar, this.deg())+
            '(' + this.mod + ')';
    }
    deg() {
        return arDeg(this.ar);
    }
    isZero() {
        return this.deg() == -1;
    }
    leadingK() {
        return arLeadingK(this.ar);
    }
    add(pol) {
        if (this.indet != pol.indet || this.mod != pol.mod) {
            throw new Error('indetermint mismatch');
        }
        const res = arAdd(this.ar, pol.ar);
        return new PolynomialMP(this.indet, res, this.mod, this.base);
    }
    sub(pol) {
        if (this.indet != pol.indet || this.mod != pol.mod) {
            throw new Error('indetermint mismatch');
        }
        const res = arSub(this.ar, pol.ar);
        return new PolynomialMP(this.indet, res, this.mod, this.base);
    }
    mulK(k) {
        const res = arMulK(this.ar, k);
        return new PolynomialMP(this.indet, res, this.mod, this.base);
    }
    divK(k) {
        const res = arDivK(this.ar, k);
        return new PolynomialMP(this.indet, res, this.mod, this.base);
    }
    /*
     * differential 多項式の微分
     */
    d() {
        var d = this.deg();
        if (d <= 0) {
            return new PolynomialMP(this.indet, [0], this.mod, this.base);
        }
        var ar = new Array(d).fill(0);
        for (var i = 1; i <= d; i++) {
            ar[i - 1] = this.ar[i] * i;
        }
        return new PolynomialMP(this.indet, ar, this.mod, this.base);
    }
    hasSquare() {
        var d = this.d();
        var g = this.gcd(d);
        if (g.deg() > 0) {
            return true;
        } else {
            return false;
        }
    }
    squareFree() {
        var d = this.d();
        var g = this.gcd(d);
        if (g.deg() > 0) {
            var t = this.divRem(g);
            return t[0].toMonic();
        } else {
            return this.toMonic();
        }
    }

    /*
     * gcd of coefficients
     */
    gcdK() {
        // var d = this.deg();
        // if (d == -1) {
        //     return 0;
        // }
        return arGcdK(this.ar);
    }
    gcdDiv() {
        var d = this.deg();
        if (d == -1) {
            return this;
        }
        var g = arGcdK(this.ar);
        var ar = arDivK(this.ar, g);
        return new PolynomialMP(this.indet, ar, this.mod, this.base);
    }
    mul(pol) {
        if (this.indet != pol.indet || this.mod != pol.mod) {
            throw new Error('indetermint mismatch');
        }
        if (this.isZero() || pol.isZero()) {
            return new PolynomialMP(this.indet, [0], this.mod, this.base);
        }
        var pdeg = pol.deg();
        var ar = new Array(this.deg() + pdeg + 1).fill(0);
        for (var i = 0; i <= pdeg; i++) {
            var k = pol.ar[i];
            if (k != 0) {
                arAddMulShift(ar, this.ar, k, i);
            }
        }
        return new PolynomialMP(this.indet, ar, this.mod, this.base);
    }
    canBeMonic() {
        const lk = this.leadingK();
        if (lk == 1) {
            return true;
        }
        if (this.mod == this.base) {
            return true;
        } else if (lk % this.base != 0) {
            return true;
        } else {
            return false;
        }
    }
    toMonic() {
        const lk = this.leadingK();
        if (lk == 1) {
            return this;
        }
        var inv;
        if (this.mod == this.base) {
            inv = inverse(lk, this.mod);
        } else if (lk % this.base != 0) {
            inv = inverse(lk, this.mod);
        } else {
            console.log('cannot change to monic :' + this.toString());
            throw new Error('cannot change to monic');
        }
        var ar = this.ar.concat();
        for (var i = 0; i < ar.length; i++) {
            ar[i] = ar[i] * inv;
        }
        return new PolynomialMP(this.indet, ar, this.mod, this.base);
    }
    gt(pol) {
        if (this.indet != pol.indet || this.mod != pol.mod) {
            throw new Error('indetermint mismatch');
        }
        return arGt(this.ar, pol.ar);
    }
    /*
     * 余り付き割り算
     * return [p, r], where p*pol + r = this
     */
    divRem(pol) {
        if (this.indet != pol.indet || this.mod != pol.mod) {
            throw new Error('indetermint mismatch');
        }
        if (this.isZero()) {
            return [new PolynomialMP(this.indet, [0], this.mod, this.base),
                    new PolynomialMP(this.indet, [0], this.mod, this.base)];
        }
        if (pol.isZero()) {
            throw new Error('zero divide');
        }
        if (this.deg() < pol.deg()) {
            return [new PolynomialMP(this.indet, [0], this.mod, this.base),
                    new PolynomialMP(this.indet, this.ar, this.mod, this.base)];
        }
        if (this.base == this.mod) {
            return this.divRem1(pol);
        } else {
            return this.divRem2(pol);
        }
    }
    /*
     * mod p の場合
     */
    divRem1(pol) {
        // console.log('in divRem1');
        var tl = arLeadingK(this.ar);
        var pl = arLeadingK(pol.ar);
        const invpl = inverse(pl, this.mod);
        var diff = this.deg() - pol.deg();
        const ar = new Array(diff+1);
        for (var i = 0; i <= diff; i++) {
            ar[i] = 0;
        }
        var mul = (tl * invpl) % this.mod;
        // console.log('mul = ' + mul);
        ar[diff] = mul;
        var tmp = this.ar.concat();
        // console.log('tmp = ' + arToString('x', tmp));
        arAddMulShift(tmp, pol.ar, this.mod - mul, diff);
        // console.log('tmp = ' + arToString('x', tmp));
        arStandard(tmp, this.mod);
        // console.log('tmp = ' + arToString('x', tmp));
        // console.log('divrem ar = ' + arToString('x', ar));
        // console.log('divrem tmp = ' + arToString('x', tmp));
        // console.log('divrem pol = ' + arToString('x', pol));
        //var cnt = diff;
        diff = arDeg(tmp) - pol.deg();
        while (diff >= 0) {
            // if (cnt < 0) {
            //     throw new Error('count over');
            // }
            // cnt--;
            // console.log('divrem ar = ' + arToString('x', ar));
            // console.log('divrem tmp = ' + arToString('x', tmp));
            // console.log('divrem pol = ' + arToString('x', pol));
            tl = arLeadingK(tmp);
            mul = (tl * invpl) % this.mod;
            ar[diff] = mul;
            arAddMulShift(tmp, pol.ar, -mul, diff);
            arStandard(tmp, this.mod);
            diff = arDeg(tmp) - pol.deg();
        }
        return [new PolynomialMP(this.indet, ar, this.mod, this.base),
                new PolynomialMP(this.indet, tmp, this.mod, this.base)];
    }
    /*
     * mod p^n の場合
     */
    divRem2(pol) {
        var tl = arLeadingK(this.ar);
        var pl = arLeadingK(pol.ar);
        var inversible = false;
        var invpl;
        var mul;
        if (pl % pol.base != 0) {
            inversible = true;
            invpl = inverse(pl, this.mod);
            mul = (tl * invpl) % this.mod;
        } else if (tl % pl == 0) {
            mul = Math.trunc(tl / pl);
        } else {
            return [new PolynomialMP(this.indet, [0], this.mod, this.base),
                    new PolynomialMP(this.indet, this.ar, this.mod, this.base)];
        }
        var diff = this.deg() - pol.deg();
        const ar = new Array(diff+1);
        for (var i = 0; i <= diff; i++) {
            ar[i] = 0;
        }
        ar[diff] = mul;
        var tmp = this.ar.concat();
        arAddMulShift(tmp, pol.ar, -mul, diff);
        arStandard(tmp, this.mod);
        // console.log('divrem ar = ' + arToString('x', ar));
        // console.log('divrem tmp = ' + arToString('x', tmp));
        // console.log('divrem pol = ' + arToString('x', pol));
        //var cnt = diff;
        diff = arDeg(tmp) - pol.deg();
        while (diff >= 0) {
            // if (cnt < 0) {
            //     throw new Error('count over');
            // }
            // cnt--;
            // console.log('divrem ar = ' + arToString('x', ar));
            // console.log('divrem tmp = ' + arToString('x', tmp));
            // console.log('divrem pol = ' + arToString('x', pol));
            tl = arLeadingK(tmp);
            if (inversible) {
                mul = (tl * invpl) % this.mod;
            } else if (tl % pl == 0) {
                mul = Math.trunc(tl / pl);
            } else {
                return [new PolynomialMP(this.indet, ar, this.mod, this.base),
                        new PolynomialMP(this.indet, tmp, this.mod, this.base)];
            }
            ar[diff] = mul;
            arAddMulShift(tmp, pol.ar, -mul, diff);
            arStandard(tmp, this.mod);
            diff = arDeg(tmp) - pol.deg();
        }
        return [new PolynomialMP(this.indet, ar, this.mod, this.base),
                new PolynomialMP(this.indet, tmp, this.mod, this.base)];
    }
    gcd(pol) {
        if (this.indet != pol.indet || this.mod != pol.mod) {
            throw new Error('indetermint mismatch');
        }
        if (this.deg() < pol.deg()) {
            return pol.gcd(this);
        }
        var a = this;
        var b = pol;
        while (!b.isZero()) {
            var t = b;
            var c = a.divRem(b);
            b = c[1];
            a = t;
        }
        return a;
    }
    exGcd(pol) {
        if (this.indet != pol.indet || this.mod != pol.mod) {
            throw new Error('indetermint mismatch');
        }
        if (this.isZero() || pol.isZero()) {
            throw new Error('not supported');
        }
        if (this.deg() < pol.deg()) {
            var x = pol.exGcd(this);
            return [x[1], x[0], x[2]];
        }
        const zero = new PolynomialMP(this.indet, [0], this.mod, this.base);
        const one = new PolynomialMP(this.indet, [1], this.mod, this.base);
        var r0 = this;
        var r1 = pol;
        var a0 = one;
        var a1 = zero;
        var b0 = zero;
        var b1 = one;
        while (!r1.isZero()) {
            var tmp = r0.divRem(r1);
            var q1 = tmp[0];
            var r2 = tmp[1];
            var a2 = a0.sub(q1.mul(a1));
            var b2 = b0.sub(q1.mul(b1));
            r0 = r1;
            r1 = r2;
            a0 = a1;
            a1 = a2;
            b0 = b1;
            b1 = b2;
        }
        if (r0.deg() == 0 && r0.leadingK() != 1) {
            var inv = inverse(r0.leadingK(), this.mod);
            a0 = a0.mulK(inv);
            b0 = b0.mulK(inv);
            r0 = r0.mulK(inv);
        }
        return [a0, b0, r0];
    }
    power(n) {
        if (n < 0 || !Number.isInteger(n)) {
            throw new Error('not supported');
        }
        var x = this;
        var res = new PolynomialMP(this.indet, [1], this.mod, this.base);
        while (n != 0) {
            if ((n % 2) == 1) {
                res = res.mul(x);
            }
            x = x.mul(x);
            n = n >> 1;
        }
        return res;
    }
    powerMod(n, modp) {
        if (n < 0 || !Number.isInteger(n)) {
            throw new Error('not supported');
        }
        if (modp.isZero()) {
            throw new Error('zero divide');
        }
        var x = this;
        var res = new PolynomialMP(this.indet, [1], this.mod, this.base);
        while (n != 0) {
            if ((n % 2) == 1) {
                res = res.mul(x);
                res = res.divRem(modp)[1];
            }
            //console.log(x);
            x = x.mul(x);
            x = x.divRem(modp)[1];
            n = n >> 1;
        }
        return res;
    }
}

//module.exports = Polynomial;
exports.Polynomial = Polynomial;
exports.PolynomialMP = PolynomialMP;

exports.arToString = arToString;
exports.arStandard = arStandard;
exports.arEqual = arEqual;
exports.arDeg = arDeg;
exports.arLeadingK = arLeadingK;
exports.arMaxK = arMaxK;
exports.arAdd = arAdd;
exports.arAddMulShift = arAddMulShift;
exports.arSub = arSub;
exports.arGt = arGt;
exports.arXn = arXn;
exports.arRandom = arRandom;
