function ones32(x) {
    /* 32-bit recursive reduction using SWAR...
       but first step is mapping 2-bit values
       into sum of 2 1-bit values in sneaky way
    */
    /*
     * なお、javascript では31ビットまでしか扱えない
     */
    x &= 0x7fffffff;
    x -= ((x >> 1) & 0x55555555);
    x = (((x >> 2) & 0x33333333) + (x & 0x33333333));
    x = (((x >> 4) + x) & 0x0f0f0f0f);
    x += (x >> 8);
    x += (x >> 16);
    return(x & 0x0000003f);
}

/*
 * array 要素からちょうど num 個選んで返す
 * 多項式の次数が増えても、個数優先でよい（はず）
 */
function* combgenerator(ar, num) {
    const array = ar.concat();
    if (num == 1) {
        for (var i = 0; i < array.length; i++) {
            yield array[i];
        }
        return;
    }
    var idx = 1;
    const maxidx = 2**array.length;
    while (idx < maxidx) {
        if (ones32(idx) == num) {
            const result = [];
            var tmp = idx;
            var p = 0;
            while (tmp > 0) {
                if (tmp & 1) {
                    result.push(array[p]);
                }
                tmp = tmp >> 1;
                p++;
            }
            yield result;
        }
        idx++
    }
}

function* createCombinationGenerator(xs, r) {
  if (xs.length < r) {
    return;
  }
  if (r == 1) {
    for (let x of xs) {
      yield [x];
    }
    return;
  }
  const x = xs[0];
  const xs_ = xs.slice(1);
  for (let comb of createCombinationGenerator(xs_, r - 1)) {
    yield [x, ...comb];
  }
  for (let comb of createCombinationGenerator(xs_, r)) {
    yield comb;
  }
}

function* createCombinationGeneratorAll(array) {
    const xs = array.concat();
    for (var r = 1; r <= xs.length; r++) {
        for (let comb of createCombinationGenerator(xs, r)) {
            yield comb;
        }
    }
}

exports.ones32 = ones32;
exports.combgenerator = combgenerator;
exports.createCombinationGenerator = createCombinationGenerator;
exports.createCombinationGeneratorAll = createCombinationGeneratorAll;
