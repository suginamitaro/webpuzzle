const polymodule = require('./polynomial');
const eucmodule = require('./euclid');
const sosumd = require('./sosu');
const tinymd = require('./tinymtjs');
const Polynomial = polymodule.Polynomial;
const PolynomialMP = polymodule.PolynomialMP;
const inverse = eucmodule.inverse;
const Sosu = sosumd.Sosu;
const MulCMB = sosumd.MulCMB;
const TinyMTJS = tinymd.TinyMTJS;

// const PRIMES = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,
//                 53,59,61,67,71,73,79,83,89,97];


/*
 * ないときだけpush
 * arは破壊される
 */
function uniqPush(ar, el) {
    for (var i = 0; i < ar.length; i++) {
        if (ar[i].equal(el)) {
            return ar;
        }
    }
    ar.push(el);
    return ar;
}

/*
 * el をmonic に変換
 * ないときだけpush
 * arは破壊される
 */
function uniqPushMonic(ar, el) {
    if (el.canBeMonic()) {
        el = el.toMonic();
    }
    return uniqPush(ar, el);
}

function uniqJoinMonic(ar1, ar2) {
    var result = ar1.concat();
    for (var i = 0; i < ar2.length; i++) {
        result = uniqPushMonic(result, ar2[i]);
    }
    return result;
}

function uniqJoin(ar1, ar2) {
    var result = ar1.concat();
    for (var i = 0; i < ar2.length; i++) {
        result = uniqPush(result, ar2[i]);
    }
    return result;
}

function randomPMP(indet, deg, mod, tiny) {
    var ar = new Array(deg + 1);
    for (var i = 0; i <= deg; i++) {
//        var r = Math.trunc(Math.random() * mod);
        var r = tiny.getInt(mod);
        ar[i] = r;
    }
    while(ar[deg] == 0) {
//        ar[deg] = Math.trunc(Math.random() * mod);
        ar[deg] = tiny.getInt(mod-1)+1;
    }
    return new PolynomialMP(indet, ar, mod);
}

function randomPM(num, tiny) {
//    var r = Math.random() * (num * 2 + 1);
    var r = tiny.getInt(num * 2 + 1);
    return Math.trunc(r - num / 2);
}

function arModToInt(array, mod, mul) {
    var ar = array.concat();
    var half = mod / 2;
    for (var i = 0; i < ar.length; i++) {
        ar[i] = (ar[i] * mul) % mod;
        if (ar[i] > half) {
            ar[i] = ar[i] - mod;
        }
    }
    return ar;
}

// function sumDeg(ar) {
//     var sum = 0;
//     for (var i = 0; i < ar.length; i++) {
//         const el = ar[i];
//         sum = sum + el.deg();
//     }
//     return sum * ar.length;
// }

function isFactorsMatch(fcs) {
    const len = fcs.length;
    for (var i = 1; i < len; i++) {
        if (fcs[0].length != fcs[i].length) {
            return false;
        }
        for (var k = 0; k < fcs[i].length; k++) {
            var el0 = fcs[0][k];
            var el = fcs[i][k];
            if (el0[0].equal(el[0]) && el0[1] == el[1]) {
                continue;
            } else {
                return false;
            }
        }
    }
    return true;
}

function matchedFactors(fcs) {
    // console.log('in matchedFactors');
    var result = [];
    const len = fcs.length;
    // 1次式を全部push
    for (var i = 0; i < fcs.length; i++) {
        for (var j = 0; j < fcs[i].length; j++) {
            if (fcs[i][j][0].deg() <= 1) {
                result = uniqPush(result, fcs[i][j][0]);
            }
        }
    }
    // console.log('deg 1 all:');
    // for (var i = 0; i < result.length; i++) {
    //     console.log(result[i].toString());
    // }
    // 全部にある因子をpush
    for (var i = 0; i < fcs[0].length; i++) {
        var el = fcs[0][i][0];
        if (el.deg() <= 1) {
            continue;
        }
        var found = true;
        for (var j = 1; j < fcs.length; j++) {
            var fel = fcs[j].find(x => el.equal(x[0]));
            if (!fel) {
                found = false;
                break;
            }
        }
        if (found) {
            result = uniqPush(result, el);
        }
    }
    return result;
}

/* istanbul ignore next */
function longestFactors(fcs) {
    // console.log('in longestFactors');
    var max = fcs[0].length;
    var longest = fcs[0];
    const len = fcs.length;
    // 1次式を全部push
    for (var i = 1; i < len; i++) {
        if (fcs[i].length > max) {
            max = fcs[i].length;
            longest = fcs[i];
        }
    }
    return longest;
}

// function getLeastDeg(fcs) {
//     var mindeg = 100000;
//     var minel = 1;
//     for (var i = 0; i < fcs.length; i++) {
//         for (var j = 0; j < fcs[i].length; j++) {
//             var el = fcs[i][j][0];
//             if (el.deg() < mindeg) {
//                 mindeg = el.deg();
//                 minel = el;
//             }
//         }
//     }
//     return [minel];
// }

function check2(el, poly) {
    var n = 0;
    var res = poly.divrem(el);
    while (res[1].isZero()) {
        poly = res[0];
        n++;
        res = poly.divrem(el);
    }
    return [[el, n], poly];
}

function checkList2(factors, poly) {
    var result = [];
    for (var i = 0; i < factors.length; i++) {
        var r = check2(factors[i], poly);
        result.push(r[0]);
        poly = r[1];
    }
    return [result, poly];
}

function get1degs(poly) {
    poly = poly.gcdKPX()[1];
    // console.log('poly = ' + poly);
    const lkFactors = Sosu.integerFactorize(Math.abs(poly.leadingK()));
    const tkFactors = Sosu.integerFactorize(Math.abs(poly.tailingK()));
    // console.log(lkFactors);
    // console.log(tkFactors);
    const leadmcmb = new MulCMB(lkFactors);
    const tailmcmb = new MulCMB(tkFactors);
    const indet = poly.indet;
    var result = [];
    while (!leadmcmb.done()) {
        const lk = leadmcmb.next();
        tailmcmb.reset();
        while (!tailmcmb.done()) {
            var tk = tailmcmb.next()
            var el = new Polynomial(indet, [tk, lk]);
            // console.log('el = ' + el);
            var r = poly.divrem(el);
            if (r[1].isZero()) {
                result = uniqPush(result, el);
            }
            el = new Polynomial(indet, [-tk, lk]);
            // console.log('el = ' + el);
            r = poly.divrem(el);
            if (r[1].isZero()) {
                result = uniqPush(result, el);
            }
        }
    }
    return result;
}

function get1degsmul(poly) {
    const lst = get1degs(poly);
//    console.log('get1degsmul lst = ' + lst);
    return checkList2(lst, poly);
}

// function isIn(array, poly) {
//     var fnd = array.find(x => x.equal(poly));
//     if (fnd) {
//         return true;
//     } else {
//         return false;
//     }
// }

/*
 * Cantor–Zassenhaus algorithm
 * のつもりだが、ちゃんと実装できているか不明。そもそもKZじゃなくてCZではないか。
*/
class KZ {
    constructor(pol) {
        this.original = pol;
        // this.lscount = 0;
        // this.pccount = 0;
        var w = pol.gcdKPX();
        //this.gcdK = new Polynomial(pol.indet, [w[0]]);
        this.gcdK = w[0];
        this.gcdP = w[1];
        this.free = this.gcdP.squareFree();
        this.resultFactors = [];
        this.tinymt = new TinyMTJS(pol.ar);
        // this.liftFail = false;
        // this.primeChange = true;
        // console.log('this.gcdK = ' + this.gcdK);
        // console.log('this.gcdP = ' + this.gcdP.toString());
        // console.log('this.free = ' + this.free.toString());
    }
    selectPrime(lk, least = 3, max = 1000) {
        const primes = Sosu.getPrimes();
        var result = 1;
        for (var i = 1; i < primes.length; i++) {
            if (primes[i] >= max) {
                break;
            }
            if (lk % primes[i] != 0 && primes[i] >= least) {
                result = primes[i];
                break;
            }
        }
        return result; // error
    }
    selectPrimeN(lk, n, least = 3, max = 1000) {
        // console.log('in selePrimeN lk = ' + lk + ' n = ' + n);
        const primes = Sosu.getPrimes();
        const pmax = 100;
        var result = [];
        var count = 0;
        var m = n * 2;
        while (count < n) {
            const n = this.tinymt.getInt(m) % Math.min(primes.length, pmax);
            const p = primes[n];
            // console.log('p = ' + p);
            if ((lk % p) != 0 && p >= least) {
                if (!result.includes(p)) {
                    result.push(p);
                    count++;
                } else {
                    m = m + 1;
                }
            }
        }
        // console.log('result = ' + result);
        return result;
    }
    kz(freeMP, prime) {
        const one = new PolynomialMP(freeMP.indet, [1], prime);
        // console.log('one = ' + one.toString());
        var result = [freeMP];
        result = uniqJoinMonic(result, this.kz1(freeMP, prime, one));
        result = result.sort((a, b) => a.gt(b));
        return result;
    }
    // kz1(work, prime, one) {
    //     // console.log('in kz1 prime = ' + prime + ' work = ' + work.toString());
    //     const deg = work.deg();
    //     if (deg <= 1) {
    //         return [work];
    //     }
    //     var factors = [];
    //     var m = Math.trunc((prime ** deg - 1) / 2);
    //     var maxm = 2*m;
    //     var zero = true;
    //     var count = 0;
    //     const maxloop = 200;
    //     for (var i = 0; i < maxloop || zero; i++) {
    //         // console.log('count = ' + count + ' zero = ' + zero);
    //         if (count >= 2) {
    //             break;
    //         }
    //         var bx = randomPMP(work.indet, deg-1, prime, this.tinymt);
    //         // console.log('bx = ' + bx.toString());
    //         var a = work.gcd(bx);
    //         a = a.toMonic();
    //         var unq = !factors.find(x => x.equal(a));
    //         if (a.deg() > 0) {
    //             count++;
    //         }
    //         if (a.deg() > 0 && unq) {
    //             // console.log('push 1 '+ a.toString());
    //             // factors = uniqPushMonic(factors, a);
    //             factors = uniqPush(factors, a);
    //             if (a.deg() > 1 && a.deg() < deg) {
    //                 factors = uniqJoinMonic(factors, this.kz1(a, prime, one));
    //             }
    //             var qu = work.divRem(a)[0];
    //             qu = qu.toMonic();
    //             // console.log('push 2 ' + qu.toString());
    //             // factors = uniqPushMonic(factors, qu);
    //             factors = uniqPush(factors, qu);
    //             if (qu.deg() > 1 && qu.deg() < deg) {
    //                 factors = uniqJoinMonic(factors, this.kz1(qu, prime, one));
    //             }
    //         }
    //         const m2 = m + randomPM(3, this.tinymt);
    //         // console.log('m2 = ' + m2);
    //         // var bxm = bx.powerMod(m, work);
    //         var bxm = bx.powerMod(m2, work);
    //         // console.log('bxm = ' + bxm.toString());
    //         if (bxm.deg() < 1) {
    //             // m = m + 1;
    //             // if (m > maxm) {
    //             //     m = 2;
    //             // }
    //             continue;
    //         }
    //         zero = false;
    //         var a = work.gcd(bxm);
    //         a = a.toMonic();
    //         unq = !factors.find(x => x.equal(a));
    //         if (a.deg() > 0) {
    //             count++;
    //         }
    //         if (a.deg() > 0 && unq) {
    //             // console.log('push 3 ' + a.toString());
    //             // factors = uniqPushMonic(factors, a);
    //             factors = uniqPush(factors, a);
    //             if (a.deg() > 1 && a.deg() < deg) {
    //                 factors = uniqJoinMonic(factors, this.kz1(a, prime, one));
    //             }
    //             var qu = work.divRem(a)[0];
    //             qu = qu.toMonic();
    //             // console.log('push 4 ' + qu.toString());
    //             // factors = uniqPushMonic(factors, qu);
    //             factors = uniqPush(factors, qu);
    //             if (qu.deg() > 1 && qu.deg() < deg) {
    //                 factors = uniqJoinMonic(factors, this.kz1(qu, prime, one));
    //             }
    //         }
    //         var bxm1 = bxm.add(one);
    //         // console.log('bxm1 = ' + bxm1.toString());
    //         a = work.gcd(bxm1);
    //         a = a.toMonic();
    //         unq = !factors.find(x => x.equal(a));
    //         if (a.deg() > 0) {
    //             count++;
    //         }
    //         if (a.deg() > 0 && unq) {
    //             // console.log('push 5 ' + a.toString());
    //             // factors = uniqPushMonic(factors, a);
    //             factors = uniqPush(factors, a);
    //             if (a.deg() > 1 && a.deg() < deg) {
    //                 factors = uniqJoinMonic(factors, this.kz1(a, prime, one));
    //             }
    //             var qu = work.divRem(a)[0];
    //             qu = qu.toMonic();
    //             // console.log('push 6 ' + qu.toString());
    //             // factors = uniqPushMonic(factors, qu);
    //             factors = uniqPush(factors, qu);
    //             if (qu.deg() > 1 && qu.deg() < deg) {
    //                 factors = uniqJoinMonic(factors, this.kz1(qu, prime, one));
    //             }
    //         }
    //         bxm1 = bxm.sub(one);
    //         // console.log('bxm1 = ' + bxm1.toString());
    //         a = work.gcd(bxm1);
    //         a = a.toMonic();
    //         unq = !factors.find(x => x.equal(a));
    //         if (a.deg() > 0) {
    //             count++;
    //         }
    //         if (a.deg() > 0 && unq) {
    //             // console.log('push 7 ' + a.toString());
    //             // console.log('bx ' + bx.toString());
    //             // console.log('bxm1 ' + bxm1.toString());
    //             // factors = uniqPushMonic(factors, a);
    //             factors = uniqPush(factors, a);
    //             if (a.deg() > 1 && a.deg() < deg) {
    //                 factors = uniqJoinMonic(factors, this.kz1(a, prime, one));
    //             }
    //             var qu = work.divRem(a)[0];
    //             qu = qu.toMonic();
    //             // console.log('push 8 ' + qu.toString());
    //             // factors = uniqPushMonic(factors, qu);
    //             factors = uniqPush(factors, qu);
    //             if (qu.deg() > 1 && qu.deg() < deg) {
    //                 factors = uniqJoinMonic(factors, this.kz1(qu, prime, one));
    //             }
    //         }
    //     }
    //     return factors;
    // }

    /*
     * もはや、Cantor–Zassenhaus algorithm ではない。
     * 勘で取ってサーセンざんす（済みません）アルゴリズム　Kandetotte Sa-senn-zansu
     */
    kz1(work, prime, one) {
        //console.log('in kz1 prime = ' + prime + ' work = ' + work.toString());
        const deg = work.deg();
        if (deg <= 1) {
            return [work];
        }
        var factors = [];
        var count = 0;
        var fncnt = 0;
        const maxcount = 200;
        const maxfncnt = 10 * deg;

        const checkPush = function (poly) {
            const a = work.gcd(poly).toMonic();
            if (a.deg() < 1) {
                count++;
                return;
            }
            const fnd = factors.find(x => x.equal(a));
            if (fnd) {
                count++;
                return;
            }
            count = 0;
            fncnt++;
            // console.log('push 1 '+ a.toString());
            factors = uniqPush(factors, a);
            const qu = work.divRem(a)[0].toMonic();
            // console.log('push 2 ' + qu.toString());
            factors = uniqPush(factors, qu);
        }

        while (count < maxcount && fncnt < maxfncnt) {
            var bx = randomPMP(work.indet, deg-1, prime, this.tinymt);
            // console.log('bx = ' + bx.toString());
            checkPush(bx);
            var bx1 = bx.add(one);
            // console.log('bx1 = ' + bx1.toString());
            checkPush(bx1);
            bx1 = bx.sub(one);
            // console.log('bx1 = ' + bx1.toString());
            checkPush(bx1);
        }
        factors = factors.sort((a, b) => a.gt(b));
        var subfactors = [];
        for (var i = 0; i < factors.length; i++) {
            subfactors = uniqJoin(subfactors, this.kz1(factors[i], prime, one));
        }
        return uniqJoin(factors, subfactors);
    }

    // preLift(factors, freeMP) {
    //     var result = [];
    //     for (var i = 0; i < factors.length; i++) {
    //         var el = factors[i];
    //         var q = freeMP.divRem(el)[0];
    //         var g = q.gcd(el);
    //         if (g.deg() < 1) {
    //             result = uniqPushMonic(result, el);
    //         } else if (el.deg() > g.deg()) {
    //             el = el.divRem(g)[0];
    //             result = uniqPushMonic(result, el);
    //         }
    //     }
    //     return result;
    // }
    /*
     * 書き直し版 lift
     * 参考：https://mathlog.info/articles/3326
     */
    lift(gb, hb, fb, f, prime, max) {
        // console.log('in lift');
        // console.log('gb = ' + gb.toString());
        // console.log('hb = ' + hb.toString());
        var p = prime;
        var n = 1;
        var tmp = gb.mul(hb);
        if (!tmp.equal(fb)) {
            throw new Error('gb * hb != fb');
        }
        tmp = gb.exGcd(hb);
        var a = tmp[0];
        var b = tmp[1];
        // console.log('a = ' + a.toString());
        // console.log('b = ' + b.toString());
        // console.log('r = ' + tmp[2].toString());
        if (tmp[2].deg() != 0) {
            // ゆるい条件を満たさない
            // p を変えてやりなおしだ
            // console.log('gcd(gb, hb) = ' + tmp[2].toString());
            return false;
        }
        var gn = gb;
        var hn = hb;
        var g0 = gn;
        var h0 = hn;
        while (p**n < max) {
            var nextMod = p**(n+1);
            var fn = PolynomialMP.fromPolynomial(f, nextMod, p);
            gn = gn.toNewMod(nextMod);
            hn = hn.toNewMod(nextMod);
            fn = fn.toNewMod(nextMod);
            // console.log('fn = ' + fn.toString());
            fn = fn.sub(gn.mul(hn));
            // console.log('nextMod = ' + nextMod);
            // console.log('f = ' + f.toString());
            // console.log('gn = ' + gn.toString());
            // console.log('hn = ' + hn.toString());
            // console.log('fn = ' + fn.toString());
            a = a.toNewMod(nextMod);
            b = b.toNewMod(nextMod);
            g0 = g0.toNewMod(nextMod);
            // console.log('bfn = ' + fn.mul(b).toString());
            // console.log('g0 = ' + g0.toString());
            tmp = fn.mul(b).divRem(g0);
            var q = tmp[0];
            var pn = tmp[1];
            // console.log('q = ' + q.toString());
            // console.log('pn = ' + pn.toString());
            h0 = h0.toNewMod(nextMod);
            tmp = h0.mul(q);
            // console.log('tmp = ' + tmp.toString());
            // console.log('h0 = ' + h0.toString());
            var qn = fn.mul(a).add(h0.mul(q)); // qn.deg <= d - m
            // console.log('qn = ' + qn.toString());
            // console.log('hn = ' + hn.toString());
            gn = gn.add(pn);
            hn = hn.add(qn);
            n = n + 1;
            //hn1 = hn2;
            // console.log('gn = ' + gn.toString());
            // console.log('hn = ' + hn.toString());
            // console.log('p**n = ' + (p**n));
            // console.log('n = ' + n);
        }
        //return [gn, hn];
        // console.log('return :' + gn.toString());
        return gn;
    }

    liftFactors(factors, freeMP, free, prime, max) {
        // console.log('in lift factors');
        var result = [];
        for (var i = 0; i < factors.length; i++) {
            var fn = factors[i];
            var gn = freeMP.divRem(fn)[0];
            // console.log('fn = ' + fn);
            // console.log('gn = ' + gn);
            if (fn.deg() == 0 || gn.deg() == 0) {
                continue;
            }
            var res = this.lift(fn, gn, freeMP, free, prime, max);
            /* istanbul ignore next */
            if (!res) {
                // this.liftFail = true;
                continue;
            }
            // uniqPushGcd(result, res[0]);
            // uniqPushGcd(result, res[1]);
            // this.lscount++;
            uniqPushMonic(result, res);
            // 逆にする (liftで片方しか上げていないため)
            gn = gn.toMonic();
            fn = freeMP.divRem(gn)[0];
            var res = this.lift(gn, fn, freeMP, free, prime, max);
            /* istanbul ignore next */
            // if (!res) {
            //     // this.liftFail = true;
            //     continue;
            // }
            uniqPushMonic(result, res);
            //uniqPushMonic(result, res[1]);
        }
        return result;
    }
    /*
     * check and get multiplicity
     */
    checkAndm(pol, orig, lkFactors) {
        // console.log('in checkAndm');
        // console.log('pol = ' + pol.toString());
        // console.log('orig = ' + orig.toString());
        if (pol.deg() > orig.deg()) {
            return false;
        }
        var prime = pol.mod;
        // console.log('in checkAndm');
        // console.log('pol = ' + pol.toString());
        // console.log('orig = ' + orig.toString());
        // console.log('prime = ' + prime);
        // console.log('lk = ' + orig.leadingK());
        // mod を捨てる
        // console.log('in checkAndm pol = ' + pol.toString());
        var poly = false;
        var half = pol.mod / 2;
        var n = 1;
        var p2 = false;
        // orig.leadingK を素因数分解する
        //var leadingIntFactors = integerFactorize(orig.leadingK);
        //console.log(lkFactors);
        var mcmb = new MulCMB(lkFactors);
        var mcmlist = mcmb.getList();
        for (var i = 0; i < mcmlist.length; i++) {
            var array = arModToInt(pol.ar, pol.mod, mcmlist[i]);
            p2 = new Polynomial(pol.indet, array);
            // console.log('p2 = ' + p2.toString());
            var r = orig.divrem(p2);
            if (r[1].isZero()) {
                poly = r[0];
                break;
            }
        }
        if (!poly) {
            // console.log('out checkAndm false');
            return false;
        }
        for(;;) {
            var r = poly.divrem(p2);
            if (r[1].isZero()) {
                // console.log('mul poly = ' + poly);
                // console.log('p2 = ' + p2);
                // console.log('r[0] = ' + r[0])
                // console.log('r[1] = ' + r[1])
                poly = r[0];
                n++;
            } else {
                break;
            }
        }
        // console.log('out checkAndm');
        // console.log('p2 = ' + p2.toString() + ' n = ' + n);
        // console.log('poly = ' + poly.toString());
        return [p2, n, poly];
    }
    /*
     * check and get multiplicity for lifted factors.
     */
    checkFactors(lifted, orig) {
        // console.log('in checkFactors');
        // for (var i = 0; i < lifted.length; i++) {
        //     console.log(lifted[i].toString());
        // }
        var result = [];
        var lkFactors = Sosu.integerFactorize(orig.leadingK());
        for (var i = 0; i < lifted.length; i++) {
            var r = this.checkAndm(lifted[i], orig, lkFactors);
            // console.log('orig = ' + orig.toString());
            // console.log('lifted[i] = ' + lifted[i]);
            if (r) {
                // console.log('r[0] = ' + r[0].toString());
                // console.log('r[1] = ' + r[1]);
                result.push(r);
                //orig = orig.divrem(r[0])[0];
                orig = r[2];
            }
            if (orig.deg() == 0) {
                break;
            }
        }
        if (orig.deg() > 0) {
            result.push([orig, 1]);
        }
        //console.log('check Factors result = ' + result);
        return result;
    }
    factorize() {
        var w = this.original.gcdKPX();
        this.gcdK = w[0];
        this.gcdP = w[1];
        const firstFactor = [[this.gcdK, 1]];
        // console.log('firstFactor = ' + firstFactor);
        const res = get1degsmul(this.gcdP);
        var prelist = res[0];
        prelist = prelist.sort((a, b) => a[0].gt(b[0]));
        // console.log('prelist = ' + prelist);
        // console.log('res[0] = ' + res[0]);
        const gcdPol = res[1];
        // this.free = this.gcdP.squareFree();
        // console.log('gcdPol = ' + gcdPol);
        this.free = gcdPol.squareFree();
        // console.log('squareFree = ' + this.free);

        if (this.free.deg() == 0) {
            this.resultFactors = firstFactor.concat(prelist);
            this.success = true;
            return true;
        }
        // if (this.gcdP.deg() == 1) {
        //     this.resultFactors = prelist.concat([this.gcdP, 1]];
        //     this.success = true;
        //     return true;
        // }
        var factors = this.fz1(this.free, gcdPol);
        // var intGcd = [[this.gcdK, 1]];
        // console.log('in factorize');
        // console.log('prelist = ' + prelist);
        // console.log('factors = ' + factors);
        factors = factors.concat(prelist);
        factors = factors.sort((a, b) => a[0].gt(b[0]));
        this.resultFactors = firstFactor.concat(factors);
        this.success = true;
        return true;
    }

    fz1(free, gcd) {
        // console.log('in fz1 free = ' + free);
        // console.log('gcd = ' + gcd);
        if (gcd.deg() <= 1) {
            return [[gcd, 1]];
        }
        if (free.deg() <= 1) {
            const r = checkList2([free], gcd);
            return r[0];
        }
        const trycount = 3;
        // const trycount = 2;
        var tryfactors = new Array(trycount);
        const lk = this.free.leadingK();
        // var maxprime = Math.max(this.free.maxK() * 2, 100);
        // var leastPrime = 3;
        //var leastPrime = 5;
        const primes = this.selectPrimeN(lk, trycount);
        // console.log('primes = ' + primes);
        for (var i = 0; i < trycount; i++) {
            // leastPrime = this.selectPrime(lk, leastPrime, maxprime);
            //leastPrime = this.selectPrime(lk, leastPrime);
            //tryfactors[i] = this.fz2(free, gcd, leastPrime);
            tryfactors[i] = this.fz2(free, gcd, primes[i]);
            //leastPrime++;
        }
        // for (var i = 0; i < tryfactors.length; i++) {
        //     console.log('tryfactors i = ' + i);
        //     for (var j = 0; j < tryfactors[i].length; j++) {
        //         console.log(tryfactors[i][j][0].toString() + ',' +
        //                     tryfactors[i][j][1]);
        //     }
        // }
        if (isFactorsMatch(tryfactors)) {
            // console.log('Factors Match');
            return tryfactors[0];
        }
        // console.log('not matched');
        var matchedF = matchedFactors(tryfactors);
        // if (matchedF.length == 0) {
        //     matchedF = getLeastDeg(tryfactors);
        // }
        // console.log('matchedF:')
        // for (var i = 0; i < matchedF.length; i++) {
        //     console.log(matchedF[i].toString());
        // }
        if (matchedF.length > 0) {
            // console.log('Factors Partial Match');
            var checked = checkList2(matchedF, gcd);
            var prelist = checked[0];
            gcd = checked[1];
            // console.log('gcd = ' + gcd);
            if (gcd.deg() == 0) {
                return prelist;
            }
            // console.log('gcd = ' + gcd.toString());
            free = gcd.squareFree(); // 無駄
            return prelist.concat(this.fz1(free, gcd));
        }
        var longestF = longestFactors(tryfactors);
        // console.log('longestFactors:');
        // for (var i = 0; i < longestF.length; i++) {
        //     console.log(longestF[i][0].toString());
        // }
        var result = [];
        for (var i = 0; i < longestF.length; i++) {
            var gcdi = longestF[i][0];
            var freei = gcdi.squareFree();
            // var r = this.fz1(gcdi, freei)
            result = result.concat(this.fz1(gcdi, freei));
        }
        return result;
    }

    fz2(free, gcdPol, prime) {
        // console.log('in fz2 free = ' + free);
        // console.log('gcdPol = ' + gcdPol);
        // console.log('prime = ' + prime);
        var freedeg = free.deg();
        const max = free.maxK() * 2;
        const lk = free.leadingK();
        // this.lscount = 0;
        var freeMP = PolynomialMP.fromPolynomial(free, prime);
        var factors = this.kz(freeMP, prime);
        // factors = this.preLift(factors, freeMP);
        factors = factors.sort((a, b) => a.gt(b));
        // console.log('fz2 factors:');
        // for (var i = 0; i < factors.length; i++) {
        //     console.log(factors[i].toString());
        // }
        var lifted = this.liftFactors(factors, freeMP, free, prime, max);
        // console.log('fz2 lifted:');
        // for (var i = 0; i < lifted.length; i++) {
        //     console.log(lifted[i].toString());
        // }
        // if (this.lscount > 0) {
        if (lifted && lifted.length > 0) {
            lifted = lifted.sort((a, b) => a.gt(b));
            var intFactors = this.checkFactors(lifted, gcdPol);
            intFactors = intFactors.sort((a, b) => a[0].gt(b[0]));
            // console.log('return fz2 intFactors:');
            // for (var i = 0; i < intFactors.length; i++) {
            //     console.log(intFactors[i][0].toString() +
            //                 ':' + intFactors[i][1]);
            // }
            return intFactors;
        } else {
            // console.log('return fz2 irreducible? ' + gcdPol.toString());
            return [[gcdPol, 1]]
        }
    }
    getFactors() {
        // /* istanbul ignore next */
        // if (!this.success) {
        //     return [];
        // }
        return this.resultFactors;
    }
    getStringFactors(desc = true) {
        // /* istanbul ignore next */
        // if (!this.success) {
        //     return '';
        // }
        // console.log('in getStringFactors');
        // console.log(this.resultFactors);
        var s = '';
        var kxn = this.resultFactors[0][0];
        // var k = this.resultFactors[0][0].leadingK();
        // var deg = this.resultFactors[0][0].deg();
        var k = kxn.leadingK();
        var deg = kxn.deg();
        if (k != 1 || deg > 0) {
            s = s + kxn.toString();
        } else if (this.resultFactors.length == 2 &&
                   this.resultFactors[1][1] == 1) {
            if (desc) {
                return this.resultFactors[1][0].toDescString();
            } else {
                return this.resultFactors[1][0].toString();
            }
        }
        for (var i = 1; i < this.resultFactors.length; i++) {
            var el = this.resultFactors[i];
            // if (el[0].toString().length == 1) {
            //     s = s + el[0].toString();
            // } else
            if (desc) {
                s = s + '(' + el[0].toDescString() + ')';
            } else {
                s = s + '(' + el[0].toString() + ')';
            }
            if (el[1] != 1) {
                s = s + '^' + el[1];
            }
        }
        return s;
    }
}

exports.KZ = KZ;
