const lineSize = 6;
const blockRows = 2;
const blockCols = 3;
const allSymbols = ["1","2","3","4","5","6"];
const rows = [
    [0, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29],
    [30, 31, 32, 33, 34, 35]
];

const cols = [
    [0, 6, 12, 18, 24, 30],
    [1, 7, 13, 19, 25, 31],
    [2, 8, 14, 20, 26, 32],
    [3, 9, 15, 21, 27, 33],
    [4, 10, 16, 22, 28, 34],
    [5, 11, 17, 23, 29, 35]
];

const blocks = [
    [0, 1, 2, 6, 7, 8],
    [3, 4, 5, 9, 10, 11],
    [12, 13, 14, 18, 19, 20],
    [15, 16, 17, 21, 22, 23],
    [24, 25, 26, 30, 31, 32],
    [27, 28, 29, 33, 34, 35]
];

function tocol(pos) {
    return pos % lineSize;
}
function torow(pos) {
    return Math.floor(pos / lineSize);
}
function toblk(index) {
    return Math.floor(torow(index) / blockRows) * blockRows +
        Math.floor(tocol(index) / blockCols);
}

function getCounterPos(pos, mode) {
    var x = tocol(pos);
    var y = torow(pos);
    const half = Math.floor(lineSize / 2);
    if (x >= half) {
        x = x - half + 1;
    } else {
        x = x - half;
    }
    if (y >= half) {
        y = y - half + 1;
    } else {
        y = y - half;
    }
    switch (mode) {
    case 0:
        x = -x;
        break;
    case 1:
        y = -y;
        break;
    case 2:
        x = -x;
        y = -y;
    }
    if (x >= 0) {
        x = x + half - 1;
    } else {
        x = x + half;
    }
    if (y >= 0) {
        y = y + half - 1;
    } else {
        y = y + half;
    }
    return rows[y][x];
}

function vl_change(array, vl1, vl2) {
    for (var i = 0; i < lineSize; i++) {
        const idx1 = vl1[i];
        const idx2 = vl2[i];
        const tmp = array[idx1];
        array[idx1] = array[idx2];
        array[idx2] = tmp;
    }
}

class NumberPlace6 {
    convert(array, tiny) {
        var result = this.randomizeElement(array, tiny);
        //console.log("array:")
        //console.log(result);
        var mode = tiny.getInt(4);
        //console.log("mode:"+mode);
        if (mode != 3) {
            result = this.reverseChange(result, mode);
        }
        //console.log("1result:");
        //console.log(result);
        mode = tiny.getInt(2);
        if (mode != 1) {
            result = this.blockReverse(result);
        }
        //console.log("2result:");
        //console.log(result);
        var marr = [];
        for (var i = 0; i < 3; i++) {
            marr.push(tiny.getInt(7));
        }
        result = this.lineChange(result, marr);
        //console.log("3result:");
        //console.log(result);
        return result;
    }

    getRandomSymbolArray(tiny) {
        var result = allSymbols.slice();
        //console.log("result:"+result);
        for (var i = 0; i < result.length; i++) {
            const tmp = result[i];
            const pos = tiny.getInt(result.length);
            result[i] = result[pos];
            result[pos] = tmp;
        }
        var res = [];
        for (var i = 0; i < result.length; i++) {
            res[(i+1).toString()] = result[i];
        }
        res['0'] = '0';
        res[' '] = ' ';
        return res;
    }

    randomizeElement(array, tiny) {
        const rsa = this.getRandomSymbolArray(tiny);
        return array.map(el => rsa[el]);
    }

    reverseChange(array, mode) {
        //console.log("mode:"+mode);
        var work = [];
        for (var i = 0; i < array.length; i++) {
            work[i] = array[getCounterPos(i, mode)];
        }
        return work;
    }

    blockReverse(ar) {
        var array = ar.slice();
        var blo = [[0, 4], [1, 5]];
        for (var i = 0; i < 2; i++) {
            vl_change(array, blocks[blo[i][0]], blocks[blo[i][1]]);
        }
        return array;
    }

    lineChange(ar, marr) {
        var array = ar.slice();
        const change_line = [[cols[0], cols[1]],
                             [cols[1], cols[2]], [cols[3], cols[4]],
                             [cols[4], cols[5]], [rows[0], rows[1]],
                             [rows[2], rows[3]], [rows[4], rows[5]]];
        for (var i = 0; i < marr.length; i++) {
            var x = marr[i];
            vl_change(array, change_line[i][0], change_line[i][1]);
        }
        return array;
    }
    setWarn(element) {
        if (!element.classList.contains('fx')) {
            element.classList.add('w');
        }
    }
    vlCheck(elements, vline) {
        var error = false;
        for (var i = 0; i < vline.length; i++) {
            const p = vline[i];
            for (var j = 0; j < vline.length; j++) {
                const q = vline[j];
                if (i == j) {
                    continue;
                }
                if (elements[p].textContent == elements[q].textContent) {
                    error = true;
                    //console.log('check ng 2 p='+p+' q='+q);
                    this.setWarn(elements[p]);
                    this.setWarn(elements[q]);
                }
            }
        }
        return !error;
    }
    check(elements) {
        var error = false;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].textContent == ' ') {
                error = true;
                this.setWarn(elements[i]);
                //console.log('check ng 1 i='+i);
            }
        }
        if (error) {
            return false;
        }
        const vls = [rows, cols, blocks];
        for (var k = 0; k < vls.length; k++) {
            var vl = vls[k];
            for (var i = 0; i < vl.length; i++) {
                const line = vl[i];
                var ok = this.vlCheck(elements, line);
                //console.log('ok='+ok);
                if (!ok) {
                    error = true;
                }
            }
        }
        //console.log('error='+error+' !error='+!error);
        return !error;
    }
}

//module.exports = NumberPlace6;
