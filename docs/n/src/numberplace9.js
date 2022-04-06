const lineSize = 9;
const blockRows = 3;
const blockCols = 3;
const allSymbols = ["1","2","3","4","5","6","7","8","9"];

const rows = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44],
    [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77, 78, 79, 80]
];

const cols = [
    [0, 9, 18, 27, 36, 45, 54, 63, 72],
    [1, 10, 19, 28, 37, 46, 55, 64, 73],
    [2, 11, 20, 29, 38, 47, 56, 65, 74],
    [3, 12, 21, 30, 39, 48, 57, 66, 75],
    [4, 13, 22, 31, 40, 49, 58, 67, 76],
    [5, 14, 23, 32, 41, 50, 59, 68, 77],
    [6, 15, 24, 33, 42, 51, 60, 69, 78],
    [7, 16, 25, 34, 43, 52, 61, 70, 79],
    [8, 17, 26, 35, 44, 53, 62, 71, 80]
];

const blocks = [
    [0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80]
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

function getCounterPosEven(pos, mode) {
    console.log("pos,mode = " + pos + "," + mode);
    var x = tocol(pos);
    var y = torow(pos);
    console.log("x,y = " + x + "," + y);
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

function getCounterPosOdd(pos, mode)
{
    //console.log("pos,mode = " + pos + "," + mode);
    var x = tocol(pos);
    var y = torow(pos);
    //console.log("x,y = " + x + "," + y);
    var half = Math.floor(lineSize / 2);
    //console.log("half = " + half);
    x = x - half;
    y = y - half;
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
    x = x + half;
    y = y + half;
    //console.log("x,y = " + x + "," + y);
    return rows[y][x];
}

function getCounterPos(pos, mode)
{
    if (lineSize % 2 == 0) {
        return getCounterPosEven(pos, mode);
    } else {
        return getCounterPosOdd(pos, mode);
    }
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

class NumberPlace9 {
    convert(array, tiny) {
        var result = this.randomizeElement(array, tiny);
        //console.log("array:");
        //console.log(result);
        var mode = tiny.getInt(4);
        //console.log("mode:"+mode);
        if (mode != 3) {
            result = this.reverseChange(result, mode);
        }
        //console.log("1result:");
        //console.log(result);
        mode = tiny.getInt(3);
        if (mode != 2) {
            result = this.blockReverse(result, mode);
        }
        //console.log("2result:");
        //console.log(result);
        mode = tiny.getInt(3);
        if (mode != 2) {
            result = this.lineChange(result, mode);
        }
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

    blockReverse(ar, mode) {
        var array = ar.slice();
        const blo = [[0, 2, 3, 5, 6, 8], [0, 1, 2, 6, 7, 8]];
        const blo2 = [[2, 0, 5, 3, 8, 6], [6, 7, 8, 0, 1, 2]];
        const oth = [[1, 4, 7], [3, 4, 5]];
        for (var i = 0; i < 6; i++) {
            const b = blo[mode][i];
            const b2 = blo2[mode][i];
            for (var j = 0; j < lineSize; j++) {
                const idx1 = blocks[b][j];
                const idx2 = blocks[b2][j];
                array[idx1] = ar[idx2];
            }
        }
        for (var i = 0; i < 3; i++) {
            const b = oth[mode][i];
            for (var j = 0; j < lineSize; j++) {
                const idx1 = blocks[b][j];
                array[idx1] = ar[idx1];
            }
        }
        return array;
    }

    lineChange(ar, mode) {
        var array = ar.slice();
        var vl1;
        var vl2;
        const lin1 = [0, 2, 6, 8];
        const lin2 = [2, 0, 8, 6];
        const oth = [1, 3, 4, 5, 7];
        for (var i = 0; i < 4; i++) {
            if (mode == 0) {
                vl1 = cols[lin1[i]];
                vl2 = cols[lin2[i]];
            } else {
                vl1 = rows[lin1[i]];
                vl2 = rows[lin2[i]];
            }
            for (var j = 0; j < lineSize; j++) {
                const idx1 = vl1[j];
                const idx2 = vl2[j];
                array[idx1] = ar[idx2];
            }
        }
        for (var i = 0; i < 5; i++) {
            if (mode == 0) {
                vl1 = cols[oth[i]];
            } else {
                vl1 = rows[oth[i]];
            }
            for (var j = 0; j < lineSize; j++) {
                const idx1 = vl1[j];
                array[idx1] = ar[idx1];
            }
        }
        return array;
    }
    setWarn(element) {
        if (!element.classList.contains('fx')) {
            element.classList.add('w');
        }
    }
    setPencil(element) {
        if (!element.classList.contains('fx')) {
            element.classList.add('p');
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
            }
            if (elements[i].textContent.length > 1) {
                error = true;
                this.setWarn(elements[i]);
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

    vl_delete(elements, vl, pos, str) {
        result = str;
        for (var i = 0; i < lineSize; i++) {
            if (vl[i] == pos) {
                continue;
            }
            //console.log("vl[i]="+vl[i]);
            //console.log(elements[vl[i]]);
            const con = elements[vl[i]].textContent;
            //console.log(con);
            if (con != ' ' && con.length == 1) {
                result = result.replace(con, '');
            }
        }
        return result;
    }

    delSymbol(elements, pos, keystr) {
        var result  = keystr;
        result = this.vl_delete(elements, rows[torow(pos)], pos, result);
        result = this.vl_delete(elements, cols[tocol(pos)], pos, result);
        result = this.vl_delete(elements, blocks[toblk(pos)], pos, result);
        if (result.match(/[1-9]+/)) {
            result = result.split('').join(' ');
        }
        return result;
    }
    pencilMarkPos(elements, pos, keystr) {
        this.setPencil(elements[pos]);
        elements[pos].textContent = this.delSymbol(elements, pos, keystr);
    }
    pencilMark(elements, keystr) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].textContent == ' ') {
                this.setPencil(elements[i]);
                elements[i].textContent = this.delSymbol(elements, i, keystr);
            }
        }
    }
}

module.exports = NumberPlace9;
