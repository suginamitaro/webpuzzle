const polymodule = require('./polynomial');
const eucmodule = require('./euclid');
const sosumd = require('./sosu');
const tinymd = require('./tinymtjs');
const utlmd = require('./util');
const Polynomial = polymodule.Polynomial;
const PolynomialMP = polymodule.PolynomialMP;
const inverse = eucmodule.inverse;
const Sosu = sosumd.Sosu;
const MulCMB = sosumd.MulCMB;
const TinyMTJS = tinymd.TinyMTJS;
//const combgenerator = utlmd.combgenerator;
const createCombinationGeneratorAll = utlmd.createCombinationGeneratorAll;

const log4js = require('./log4js')
const logger = log4js.getLogger();
// fatal
// error
// warn
// info
// debug
// trace
//logger.level = 'debug';
logger.level = 'fatal';

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

function randomPMP(indet, deg, mod, tiny) {
    var ar = new Array(deg + 1);
    for (var i = 0; i <= deg; i++) {
        var r = tiny.getInt(mod);
        ar[i] = r;
    }
    while(ar[deg] == 0) {
        ar[deg] = tiny.getInt(mod-1)+1;
    }
    return new PolynomialMP(indet, ar, mod);
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

function czpower(poly, p, d, modp) {
    const m = (p - 1) / 2;
    var fp = poly;
    var f = new PolynomialMP(poly.indet, [1], poly.base);
    for (let n = 1; n < d; n++) {
        f = fp.power(m).mul(f).divRem(modp)[1];
        fp = fp.powerP().divRem(modp)[1];
    }
    return f;
}

function powerOfMP(poly) {
    const prime = poly.base;
    var ar1 = poly.ar.concat();
    var ar2 = [];
    var finish = false;
    var cnt = 0;
    while (!finish) {
        for (let i = 0; i < ar1.length; i++) {
            if (i % prime == 0) {
                ar2.push(ar1[i]);
            } else if (ar1[i] != 0) {
                finish = true;
                break;
            }
        }
        if (finish) {
            break;
        }
        ar1 = ar2;
        ar2 = [];
        cnt += prime;
    }
    return [new PolynomialMP(poly.indet, ar1, poly.mod, poly.base),
            cnt];
}

function squareFreeMP(poly) {
    logger.debug('in squareFreeMP poly = ' + poly);
    const diffP = poly.d();
    logger.debug('diffP = ' + diffP);
    // ちょうどP乗だった
    if (diffP.isZero()) {
        let tmp = powerOfMP(poly);
        logger.debug('just power of P');
        return [tmp[0], tmp[1], null];
    }
    const gcd = poly.gcd(diffP).toMonic();
    logger.debug('gcd = ' + gcd);
    // gcd が 1
    if (gcd.deg() <= 0) {
        logger.debug('only rest');
        return [gcd, 1, poly];
    }
    var n = 0;
    var work = poly;
    var res = work.divRem(gcd);
    logger.debug('res[0] = ' + res[0]);
    logger.debug('res[1] = ' + res[1]);
    return [gcd, 1, res[0]];
}

function reduceFactor(factor) {
    logger.debug('in reduceFactor');
    var result = [];
    factor.forEach(el => {
        const e = result.find(ar => ar[0].equal(el[0]));
        if (!e) {
            logger.debug('push ' + el[0] + el[1]);
            result.push(el);
        } else {
            logger.debug('inc ' + e[1] + ',' + el[1]);
            e[1] += el[1];
        }
    });
    return result;
}

/*
 * Distinct Degree Factorization on GF(p)
 * freeMP, prime -> array of polynomialMP
 * https://en.wikipedia.org/wiki/Factorization_of_polynomials_over_finite_fields  (2022-11-20)
 */
function ddf(free, prime, tee, tp) {
    free = free.toMonic();
    if (logger.isDebugEnabled()) {
        logger.debug('in ddf prime = ' + prime
                     + ' free = ' + free.toString());
    }
    // const deg = free.deg();
    if (free.deg() <= 1) {
        logger.debug('out ddf ddfactors:' + free.toString() +
                     ',' + free.deg());
        return [[free, free.deg()]];
    }
    var ddfactors = [];
    var cnt = 1;
    while (free.deg() >= 2 * cnt) {
        var tmp = tp.sub(tee);
        const g = free.gcd(tmp).toMonic();
        // const g = free.gcd(tmp);
        if (logger.isDebugEnabled()) {
            logger.debug('cnt = ' + cnt);
            logger.debug('free = ' + free);
            logger.debug('tp = ' + tp);
            logger.debug('tmp = ' + tmp);
            logger.debug('g = ' + g);
        }
        if (g.deg() > 0) {
            logger.debug('g = ' + g + ' cnt = ' + cnt);
            ddfactors.push([g, cnt]);
            free = free.divRem(g)[0].toMonic();
        }
        cnt++;
        // このあと足し算するのにtomonic しちゃいかんでしょ
        // tp = tp.powerPMod(free).toMonic();
        tp = tp.powerPMod(free);
    }
    if (free.deg() > 0) {
        // logger.info('doubtful?');
        logger.debug('free.deg() > 0 ' + free);
        ddfactors.push([free, free.deg()]);
    }
    if (ddfactors.length == 0) {
        // return [[free, 1]];
        logger.debug('length == 0 ' + free);
        ddfactors.push([free, free.deg()]);
    }
    if (logger.isDebugEnabled()) {
        logger.debug('out ddf ddfactors:');
        ddfactors.forEach(pr => {
            logger.debug(pr[0].toString() + ',' + pr[1]);
        });
    }
    return ddfactors;
}

/*
 * Equal Degree Factorization on GF(p) by Cantor–Zassenhaus
 * freeMP, deg, prime -> array of polynomialMP
 * https://en.wikipedia.org/wiki/Factorization_of_polynomials_over_finite_fields
 *  (2022-11-20 ver.)
 */
function edfcz(free, deg, prime, one, tinymt) {
    if (prime == 2) {
        logger.fatal('not supported prime:' + prime);
        throw new Error('not supported prime');
    }
    if (logger.isDebugEnabled()) {
        logger.debug('in edfcz free = ' + free + ' deg = ' + deg +
                     ' prime = ' + prime + ' one = ' + one);
    }
    const r = free.deg() / deg;
    var inlist = [free];
    var outlist = [];
    var inlist2 = [];
    while (outlist.length < r) {
        if (inlist.length == 0) {
            logger.fatal('empty');
            break;
        }
        // var rndp = randomPMP(free.indet, free.deg()-1, prime, this.tinymt);
        var rndp = randomPMP(free.indet, free.deg()-1, prime, tinymt);
        logger.debug('rndp1 = ' + rndp);
        rndp = czpower(rndp, prime, free.deg(), free).sub(one);
        logger.debug('rndp2 = ' + rndp);
        if (rndp.deg() < 1) {
            continue;
        }
        inlist.forEach(f => {
            const gcdp = f.gcd(rndp).toMonic();
            logger.debug('gcdp = ' + gcdp);
            if (gcdp.deg() < 1 || gcdp.equal(f)) {
                inlist2.push(f);
                return;
            }
            const tmp = f.divRem(gcdp)[0].toMonic();
            logger.debug('tmp = ' + tmp);
            if (gcdp.deg() == deg) {
                outlist.push(gcdp);
            } else {
                inlist2.push(gcdp);
            }
            if (tmp.deg() == deg) {
                outlist.push(tmp);
            } else {
                inlist2.push(tmp);
            }
        });
        inlist = inlist2;
        inlist2 = [];
    }
    if (logger.isDebugEnabled()) {
        logger.debug('out edfcz outlist:');
        outlist.forEach(f => logger.debug(f.toString()));
    }
    return outlist;
}

/*
 * Factorization on GF(p)
 * freeMP, prime -> array of polynomialMP
 */
function fzfp(freeMP, prime, tinymt) {
    if (logger.isDebugEnabled()) {
        logger.debug('in fzfp freeMP = ' + freeMP + ' prime = ' + prime);
    }
    if (freeMP.deg() == 1) {
        if (logger.isDebugEnabled()) {
            logger.debug('out fzfp irrplist:');
            logger.debug(freeMP.toString());
        }
        return [freeMP];
    }
    freeMP = freeMP.toMonic();
    const one = new PolynomialMP(freeMP.indet, [1], prime);
    const tee = new PolynomialMP(freeMP.indet, [0, 1], prime);
    const tp = tee.powerPMod(freeMP);
    const result = ddf(freeMP, prime, tee, tp);
    var irrplist = result.map(pair => {
        if (pair[0].deg() <= pair[1]) {
            return pair[0];
        }else {
            return edfcz(pair[0], pair[1], prime, one, tinymt);
        }
    });
    irrplist = irrplist.flat().sort((a, b) => a.gt(b));
    if (logger.isDebugEnabled()) {
        logger.debug('out fzfp irrplist:');
        irrplist.forEach(el => logger.debug(el.toString()));
    }
    return irrplist;
}

// (a^2 b)^3 c とかだったら?
function fczMP1(poly, prime, tinymt) {
    const sqf = squareFreeMP(poly);
    if (logger.isDebugEnabled()) {
        logger.debug('in fczMP1');
        logger.debug('prime = ' + prime);
        logger.debug('poly = ' + poly);
        logger.debug('sqf[0] = ' + sqf[0]);
        logger.debug('sqf[1] = ' + sqf[1]);
        logger.debug('sqf[2] = ' + sqf[2]);
    }
    var factors = [];
    if (sqf[0].deg() > 0) {
        factors = fczMP1(sqf[0], prime);
        factors = factors.map(el => [el[0], el[1] * sqf[1]]);
    }
    if (logger.isDebugEnabled()) {
        logger.debug('factors:');
        factors.forEach(el => {
            logger.debug(el[0].toString() + ',' + el[1]);
        });
    }
    if (!sqf[2]) {
        return factors;
    }
    var workPol = sqf[2];
    var tmp = fzfp(workPol, prime, tinymt);
    tmp = tmp.map(pol => [pol, 1]);
    factors = factors.concat(tmp);
    factors = factors.sort((a, b) => a[0].gt(b[0]));
    if (logger.isDebugEnabled()) {
        logger.debug('factors:');
        factors.forEach(el => {
            logger.debug(el[0].toString() + ',' + el[1]);
        });
    }
    return factors;
}

function selectPrime(lk, least = 2, max = 1000) {
    const primes = Sosu.getPrimes();
    var result = 1;
    for (var i = 0; i < primes.length; i++) {
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

/*
 * 書き直し版 lift
 * 参考：https://mathlog.info/articles/3326
 */
function lift(gb, hb, fb, f, prime, max) {
    if (logger.isDebugEnabled()) {
        logger.debug('in lift');
        logger.debug('gb = ' + gb.toString());
        logger.debug('hb = ' + hb.toString());
    }
    if (gb.isZero() || hb.isZero()) {
        logger.fatal('gb or hb is zero');
        //return false;
    }
    var p = prime;
    var n = 1;
    var tmp = gb.mul(hb);
    if (!tmp.equal(fb)) {
        throw new Error('gb * hb != fb');
    }
    tmp = gb.exGcd(hb);
    var a = tmp[0];
    var b = tmp[1];
    if (logger.isDebugEnabled()) {
        logger.debug('a = ' + a.toString());
        logger.debug('b = ' + b.toString());
        logger.debug('r = ' + tmp[2].toString());
    }
    if (tmp[2].deg() != 0) {
        // ゆるい条件を満たさない
        return false;
    }
    var gn = gb;
    var hn = hb;
    var g0 = gn;
    var h0 = hn;
    while (p**n < max) {
        if (logger.isDebugEnabled()) {
            logger.debug('n = ' + n);
            logger.debug('p ** n = ' + (p ** n));
            logger.debug('max = ' + max);
        }
        var nextMod = p**(n+1);
        var fn = PolynomialMP.fromPolynomial(f, nextMod, p);
        gn = gn.toNewMod(nextMod);
        hn = hn.toNewMod(nextMod);
        fn = fn.toNewMod(nextMod);
        fn = fn.sub(gn.mul(hn));
        a = a.toNewMod(nextMod);
        b = b.toNewMod(nextMod);
        g0 = g0.toNewMod(nextMod);
        tmp = fn.mul(b).divRem(g0);
        var q = tmp[0];
        var pn = tmp[1];
        h0 = h0.toNewMod(nextMod);
        tmp = h0.mul(q);
        var qn = fn.mul(a).add(h0.mul(q)); // qn.deg <= d - m
        gn = gn.add(pn);
        hn = hn.add(qn);
        n = n + 1;
    }
    return gn;
}

function liftFactors(factors, freeMP, free, prime, max) {
    logger.debug('in lift factors');
    var result = [];
    for (var i = 0; i < factors.length; i++) {
        var fn = factors[i];
        var gn = freeMP.divRem(fn)[0];
        if (logger.isDebugEnabled()) {
            logger.debug('fn = ' + fn);
            logger.debug('gn = ' + gn);
        }
        if (fn.deg() == 0) {
            // ありえない？ 既約の場合？
            continue;
        }
        var res = lift(fn, gn, freeMP, free, prime, max);
        logger.debug('lift res = ' + res);
        if (!res) {
            continue;
        }
        result = uniqPushMonic(result, res);
    }
    if (logger.isDebugEnabled()) {
        logger.debug('out lift factors result:[');
        result.forEach(x => logger.debug(x.toString()));
        logger.debug(']');
    }
    return result;
}

/*
 * check and get multiplicity
 */
function checkAndm(pol, orig) {
    var prime = pol.mod;
    var lkFactors = Sosu.integerFactorize(orig.leadingK());
    if (logger.isDebugEnabled()) {
        logger.debug('in checkAndm');
        logger.debug('pol = ' + pol.toString());
        logger.debug('orig = ' + orig.toString());
        logger.debug('prime = ' + prime);
        logger.debug('lk = ' + orig.leadingK());
        logger.debug('lkFactors = [' +
                     lkFactors.reduce((p, c) => p + c + ',',
                                      '') + ']');
    }
    if (pol.deg() > orig.deg()) {
        logger.info('pol.deg > orig.deg');
        return false;
    }
    var poly = false;
    var half = pol.mod / 2;
    var n = 1;
    var p2 = false;
    var mcmb = new MulCMB(lkFactors);
    var mcmlist = mcmb.getList();
    for (var i = 0; i < mcmlist.length; i++) {
        var array = arModToInt(pol.ar, pol.mod, mcmlist[i]);
        p2 = new Polynomial(pol.indet, array);
        logger.debug('p2 = ' + p2.toString());
        var r = orig.divrem(p2);
        if (r[1].isZero()) {
            poly = r[0];
            break;
        }
    }
    if (!poly) {
        logger.debug('out checkAndm false');
        return false;
    }
    for(;;) {
        var r = poly.divrem(p2);
        if (r[1].isZero()) {
            if (logger.isDebugEnabled()) {
                Logger.debug('mul poly = ' + poly);
                logger.debug('p2 = ' + p2);
                logger.debug('r[0] = ' + r[0])
                logger.debug('r[1] = ' + r[1])
            }
            poly = r[0];
            n++;
        } else {
            break;
        }
    }
    if (logger.isDebugEnabled()) {
        logger.debug('out checkAndm');
        logger.debug('p2 = ' + p2.toString() + ' n = ' + n);
        logger.debug('poly = ' + poly.toString());
    }
    return [p2, n, poly];
}

/*
 * check and get multiplicity for lifted factors.
 * (mod p^n) -> Z
 * 組み合わせを生成する必要がある
 */
function checkFactors(origlifted, origtarget, incomp) {
    if (origlifted.length == 0) {
        logger.info('origlifted is empty');
        return [[],[]];
    }
    var targetpol = origtarget;
    var lifted = origlifted.concat();
    if (logger.isDebugEnabled()) {
        logger.debug('in checkFactors lifted:');
        for (var i = 0; i < lifted.length; i++) {
            logger.debug(lifted[i].toString());
        }
        logger.debug('incomp:');
        for (var i = 0; i < incomp.length; i++) {
            logger.debug(incomp[i].toString());
        }
    }
    const one = new PolynomialMP(lifted[0].indet, [1], lifted[0].mod,
                                 lifted[0].base);
    var result = [];
    var doubtfuls = [];
    while (lifted.length > 0) {
        if (logger.isDebugEnabled()) {
            logger.debug('lifted:' +
                         lifted.reduce((p, c) => p + c + ';', ''));
        }
        var liftedcomb = createCombinationGeneratorAll(lifted);
        var found = false;
        for (const plar of liftedcomb) {
            const pol = plar.reduce((p,c) => p.mul(c), one);
            var r = checkAndm(pol, targetpol);
            if (logger.isDebugEnabled()) {
                logger.debug('targetpol = ' + targetpol.toString());
                logger.debug('pol = ' + pol);
                if (r) {
                    logger.debug('r[0] = ' + r[0].toString());
                    logger.debug('r[1] = ' + r[1]);
                }
            }
            if (!r) {
                continue;
            }
            found = true;
            targetpol = r[2];
            if (incomp.some(el => plar.includes(el))) {
                doubtfuls.push([r[0], r[1]]);
                logger.debug('doubtfuls push [' + r[0] + ',' + r[1] + ']');
            } else {
                result.push([r[0], r[1]]);
                logger.debug('result push [' + r[0] + ',' + r[1] + ']');
            }
            break;
        }
        if (targetpol.deg() <= 0) {
            break;
        }
        if (!found) {
            break;
        }
    }
    if (targetpol.deg() > 0) {
        doubtfuls.push([targetpol, 1]);
    }
    if (logger.isDebugEnabled()) {
        logger.debug('check Factors result:[');
        result.forEach(el => logger.debug(el[0].toString() + ',' + el[1]));
        logger.debug('] doubtfuls:');
        doubtfuls.forEach(el =>
                          logger.debug(el[0].toString() + ',' + el[1]));
        logger.debug(']');
    }
    return [result, doubtfuls];
}

/*
 * Cantor–Zassenhaus algorithm
 * のつもりだが、ちゃんと実装できているか不明。そもそもKZじゃなくてCZではないか。
*/
class KZ {
    constructor(pol) {
        this.original = pol;
        var w = pol.gcdKPX();
        //this.gcdK = new Polynomial(pol.indet, [w[0]]);
        this.gcdK = w[0];
        this.gcdP = w[1];
        // this.free = this.gcdP.squareFree();
        this.resultFactors = [];
        this.tinymt = new TinyMTJS(pol.ar);
    }

    /*
     * 因数分解
     * 分割統治を重視する
     */
    factorize() {
        // 整数の共通因子とx^nをくくり出す
        var w = this.original.gcdKPX();
        this.gcdK = w[0];
        this.gcdP = w[1];
        const firstFactor = [[this.gcdK, 1]];
        logger.debug('firstFactor = ' + firstFactor);
        // var prelist = [];

        const gcdPol = this.gcdP;
        // this.free = this.gcdP.squareFree();
        // logger.debug('gcdPol = ' + gcdPol);

        // 括り出しで残りがない場合
        if (gcdPol.deg() == 0) {
            // this.resultFactors = firstFactor.concat(prelist);
            this.resultFactors = firstFactor;
            this.success = true;
            return true;
        }
        const leastPrime = 3;
        //var leastPrime = 5;
        var factors = this.fz0(gcdPol, leastPrime);
        // factors = factors.concat(prelist);
        factors = factors.sort((a, b) => a[0].gt(b[0]));
        factors = reduceFactor(factors);
        this.resultFactors = firstFactor.concat(factors);
        this.success = true;
        return true;
    }

    /*
     * square free からやりなおせるように
     */
    fz0(pol, leastPrime) {
        // ここで2乗以上は取り出してしまう
        const sqfct = pol.squareFactor();
        if (logger.isDebugEnabled()) {
            logger.debug('fz0 sqfct:' + sqfct[0] + ',' + sqfct[1]);
            logger.debug(sqfct[2].toString());
        }
        if (pol.leadingK() % sqfct[0].leadingK() != 0) {
            sqfct[1] = 0;
            sqfct[2] = pol;
        }
        var factors = [];
        if (sqfct[1] != 0) {
            factors = this.fz1(sqfct[0]);
            factors = factors.map(x => [x[0], x[1] * sqfct[1]]);
        }
        const free = sqfct[2];
        factors = factors.concat(this.fz1(free, leastPrime));
        factors = factors.filter(el => el[0].deg() >= 1);
        if (logger.isDebugEnabled()) {
            logger.debug('out fz0 factors:');
            for (var i = 0; i < factors.length; i++) {
                logger.debug(factors[i].toString());
            }
        }
        return factors;
    }

    // gcd いらない free と同じ
    fz1(free, leastPrime) {
        // logger.debug('in fz1 free = ' + free);
        // logger.debug('gcd = ' + gcd);
        // if (gcd.deg() <= 1) {
        //     return [[gcd, 1]];
        // }
        if (free.deg() <= 1) {
            // const r = checkList2([free], gcd);
            // return r[0];
            return [[free, 1]];
        }
        const lk = free.leadingK();
        var prime = selectPrime(lk, leastPrime);
        if (prime > 100) {
            throw new Error('select prime fail');
        }
        var factors = this.fz2(free, prime);
        return factors;
    }

    /*
      free, prime -> factors
     */
    fz2(free, prime) {
        if (logger.isDebugEnabled()) {
            logger.debug('in fz2 free = ' + free);
            logger.debug('prime = ' + prime);
        }
        // var freedeg = free.deg();
        const max = free.maxK() * 2;
        // const lk = free.leadingK();
        var freeMP = PolynomialMP.fromPolynomial(free, prime);

        // ここでMPのsquareFactorを使う
        logger.debug('freeMP = ' + freeMP);
        const sqf = freeMP.squareFactor();
        var sq = sqf[0];
        var mul = sqf[1];
        const rem = sqf[2];
        // if (logger.isDebugEnabled()) {
        //     logger.debug('sq = ' + sq);
        //     logger.debug('mul = ' + mul);
        //     logger.debug('rem = ' + rem);
        // }
        if (mul == 1) {
            const sqf2 = freeMP.squareFactor();
            var sq = sqf2[0];
            var mul = sqf2[1];
        }
        if (logger.isDebugEnabled()) {
            logger.debug('sq = ' + sq);
            logger.debug('mul = ' + mul);
            logger.debug('rem = ' + rem);
        }
        var sqfactors = [sq.power(mul)];
        //var factors = this.kz(rem, prime).sort((a, b) => a.gt(b))
        var factors = fzfp(rem, prime, this.tinymt).sort((a, b) => a.gt(b))
        if (logger.isDebugEnabled()) {
            logger.debug('fz2 sqfactors:');
            for (var i = 0; i < sqfactors.length; i++) {
                logger.debug(sqfactors[i].toString());
            }
            logger.debug('fz2 factors:');
            for (var i = 0; i < factors.length; i++) {
                logger.debug(factors[i].toString());
            }
        }
        var sqlifted = liftFactors(sqfactors, freeMP, free, prime, max);
        var lifted = liftFactors(factors, freeMP, free, prime, max);
        if (logger.isDebugEnabled()) {
            logger.debug('fz2 sqlifted:');
            for (var i = 0; i < sqlifted.length; i++) {
                logger.debug(sqlifted[i].toString());
            }
            logger.debug('fz2 lifted:');
            for (var i = 0; i < lifted.length; i++) {
                logger.debug(lifted[i].toString());
            }
        }
        if (sqlifted.length == 0 && lifted.length == 0) {
            prime = selectPrime(free.leadingK(), prime + 1);
            return this.fz2(free, prime);
        }
        lifted = lifted.concat(sqlifted).sort((a, b) => a.gt(b));
        const res = checkFactors(lifted, free, sqlifted)
        var intfactors = res[0];
        const doubtfuls = res[1];
        if (logger.isDebugEnabled()) {
            logger.debug('intfactors2:');
            intfactors.forEach(el =>
                            logger.debug(el[0].toString() + "," + el[1] + ';'));
            logger.debug('doubtfuls:');
            doubtfuls.forEach (el =>
                               logger.debug(el[0].toString() + "," + el[1] + ';'));
        }
        if (doubtfuls.length == 0) {
            // console.log('intfactors3:' + JSON.stringify(intfactors));
            return intfactors;
        }
        var leastPrime = 3;
        if (intfactors.length == 0) {
            leastPrime = prime + 1;
        }
        // console.log('doubtfuls:' + JSON.stringify(doubtfuls));
        doubtfuls.forEach(db => {
            // console.log('db:' + JSON.stringify(db));
            prime = selectPrime(db[0].leadingK(), leastPrime);
            /* istanbul ignore if */
            if (prime > 100) {
                logger.fatal('prime > 100, prime = ' + prime);
                intfactors.push(db);
            } else {
                // const fc = this.fz2(db[0], prime);
                const fc = this.fz0(db[0], prime);
                // console.log('fc:' + JSON.stringify(fc));
                intfactors = intfactors.concat(fc.map(x => [x[0], x[1] * db[1]]));
            }
        });
        // console.log('intfactors4:' + JSON.stringify(intfactors));
        return intfactors.filter(x => x[0].deg() > 0);
    }

    getFactors() {
        return this.resultFactors;
    }

    getStringFactors(desc = true) {
        var s = '';
        var kxn = this.resultFactors[0][0];
        var k = kxn.leadingK();
        var deg = kxn.deg();
        if (k != 1 || deg > 0) {
            s = s + kxn.toString();
        } else if (this.resultFactors.length == 2 &&
                   this.resultFactors[1][1] == 1) {
            return this.resultFactors[1][0].toString(desc);
        }
        for (var i = 1; i < this.resultFactors.length; i++) {
            var el = this.resultFactors[i];
            s = s + '(' + el[0].toString(desc) + ')';
            if (el[1] != 1) {
                s = s + '^' + el[1];
            }
        }
        return s;
    }

    // (a^2 b)^3 c とかだったら?
    static factorizeModP(poly) {
        if (!(poly instanceof PolynomialMP)) {
            throw new Error('poly is not PolynomialMP');
        }
        const prime = poly.base;
        const seed = poly.ar.concat();
        seed.push(prime);
        const tinymt = new TinyMTJS(seed);

        // const orig = PolynomialMP.fromPolynomial(this.original, prime);
        const orig = poly;

        const lk = orig.leadingK();
        var workPol = orig.toMonic();
        var xn = workPol.getXn();
        var preList = [[xn[0].mulK(lk), 1]];
        workPol = xn[1];
        logger.debug('preList = ' + preList);
        if (workPol.deg() <= 0) {
            return preList;
        }
        var factor = fczMP1(workPol, prime, tinymt);
        factor = reduceFactor(factor);
        return preList.concat(factor);
    }

    static factorToString(factors, desc=true) {
        logger.debug('in factorToString desc = ' + desc);
        var s = '';
        var kxn = factors[0][0];
        var k = kxn.leadingK();
        var deg = kxn.deg();
        if (k != 1 || deg > 0) {
            s = s + kxn.toString(desc, false);
        } else if (factors.length == 2 &&
                   factors[1][1] == 1) {
            return factors[1][0].toString(desc, false);
        }
        for (var i = 1; i < factors.length; i++) {
            var el = factors[i];
            s = s + '(' + el[0].toString(desc, false) + ')';
            if (el[1] != 1) {
                s = s + '^' + el[1];
            }
        }
        return s;
    }

}

exports.KZ = KZ;
