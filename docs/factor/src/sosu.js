class Sosu {
    static PRIMES = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
        67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137,
        139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199,
        211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277,
        281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359,
        367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439,
        443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521,
        523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607,
        613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683,
        691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773,
        787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863,
        877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967,
        971, 977, 983, 991, 997];
    static MaxPrime = 997;
    static getPrimes() {
        return Sosu.PRIMES.concat();
    }
    static getMaxPrime() {
        return Sosu.MaxPrime;
    }
    static getPrimesTo(n) {
        var p = new Array(n+1).fill(1);
        p[0] = 0;
        p[1] = 0;
        for (var i = 2; i <= n; i++) {
            if (p[i] != 1) {
                continue;
            }
            var q = i;
            for (var j = 2; q * j <= n; j++) {
                p[q*j] = 0;
            }
        }
        var res = [];
        for (var i = 0; i < p.length; i++) {
            if (p[i] == 1) {
                res.push(i);
            }
        }
        return res;
    }
    static integerFactorize(num) {
        num = Math.trunc(num);
        var res = [];
        if (num > Sosu.MaxPrime * Sosu.MaxPrime) {
            return res;
        }
        while (num > 1) {
            for (var i = 0; i < Sosu.PRIMES.length; i++) {
                var p = Sosu.PRIMES[i];
                if (num % p == 0) {
                    num = num / p;
                    res.push(p);
                    break;
                }
            }
        }
        return res;
    }
}

class MulCMB {
    // var idx;
    // var ar;
    constructor(array) {
        this.ar = array.concat();
        this.idx = 0;
    }
    done() {
        return this.idx >= 2**this.ar.length;
    }
    reset() {
        this.idx = 0;
    }
    next() {
        if (this.done()) {
            return false;
        }
        var res = 1;
        var x = this.idx;
        var y = 0;
        this.idx++;
        while (x > 0) {
            if (x % 2 == 1) {
                res = res * this.ar[y];
            }
            x = Math.trunc(x / 2);
            y++;
        }
        return res;
    }
    getList() {
        var result = [];
        while (!this.done()) {
            var el = this.next();
            if (!result.includes(el)) {
                result.push(el);
            }
        }
        return result;
    }
}

exports.Sosu = Sosu;
exports.MulCMB = MulCMB;
