/*
 * GCD 整数の最小公倍数
 */
function gcdInt(x, y) {
    if (x < 0 && y < 0) {
        return -gcdInt2(Math.abs(x), Math.abs(y));
    } else {
        return gcdInt2(Math.abs(x), Math.abs(y));
    }
}

function gcdInt2(x, y) {
    if (y > x) {
        return gcdInt(y, x);
    }
    var a = x;
    var b = y;
    while (b != 0) {
        var t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function lcmInt(x, y) {
    return x * y / gcdInt(x, y);
}

function exgcd(x, y) {
    if (x <= 0 || y <= 0) {
        throw new Error('out of range');
    }
    var r0 = x;
    var r1 = y;
    var a0 = 1;
    var a1 = 0;
    var b0 = 0;
    var b1 = 1;
    while (r1 > 0) {
        var q1 = Math.trunc(r0 / r1);
        var r2 = r0 % r1;
        var a2 = a0 - q1*a1
        var b2 = b0 - q1*b1
        r0 = r1;
        r1 = r2;
        a0 = a1;
        a1 = a2;
        b0 = b1;
        b1 = b2;
    }
    return [a0, b0, r0];
}

function inverse(x, mod) {
    x = (x % mod + mod) % mod;
    const r = exgcd(x, mod);
    if (r[2] == 1) {
        return (r[0] + mod) % mod;
    } else {
        // console.log('r[2] = ' + r[2]);
        // console.log('x = ' + x);
        // console.log('mod = ' + mod);
        throw new Error('gcd is not 1');
    }
}

exports.gcdInt = gcdInt;
exports.exgcd = exgcd;
exports.lcmInt = lcmInt;
exports.inverse = inverse;
