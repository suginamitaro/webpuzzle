/*
* パズル用関数
*/
/*
class PMLCG {
    constructor(seed) {
        this.me = seed & 0x7fffffff;
        for (var i = 0; i < 10; i++) {
            this.next();
        }
    }
    next() {
        this.me = (this.me * 48271) % 0x7fffffff;
        return this.me;
    }
    getInt(max) {
        var f = this.next() / 0x7fffffff;
        return Math.floor(f * max);
    }
}
*/

function getsample(array, n, rand) {
    var result = Array().concat(array);
    for (var i = 0; i < result.length; i++) {
        var j = rand.getInt(result.length);
        var tmp = result[i];
        result[i] = result[j];
        result[j] = tmp;
    }
    return result.slice(0, n);
}

function uniqPush(array, element) {
    if (!array.includes(element)) {
        array.push(element);
    }
}

function uniqAppend(array1, array2) {
    var result = Array();
    var tmp = Array().concat(array1).concat(array2);
    for (var i = 0; i < tmp.length; i++) {
        if (!result.includes(tmp[i])) {
            result.push(tmp[i]);
        }
    }
    return result;
}

function getRandomNArray(str1, str2, n, rand) {
    var ar1 = Array.from(str1);
    var ar2 = Array.from(str2);
    var result = [];
    ar2 = getsample(ar2, ar2.length, rand);
    var result = uniqAppend(ar1, ar2.slice(0, n));
    result = result.slice(0, n);
    result = getsample(result, n, rand);
    result.sort;
    return result;
}

function getHintArray(answer, ans_array, hints, word_count, size, rand) {
    var str = "" + answer;
    for (var i = 0; i < word_count; i++) {
        str = str + ans_array[rand.getInt(ans_array.length)];
    }
    var cnt = 0;
    var length = str.length;
    var sp = rand.getInt(ans_array.length);
    for (var i = 0; i < length; i++) {
        for (var j = sp; j < ans_array.length; j++) {
            var p = (j+sp) % ans_array.length;
            var s = ans_array[p];
            if (s.includes(str[i])) {
                str = str + ans_array[p];
                cnt++;
            }
            if (cnt >= word_count) {
                break;
            }
        }
        if (cnt >= word_count) {
            break;
        }
    }
    if (str.length > size) {
        str = str.substr(0, str.length);
    }
    return getRandomNArray(str, hints, size, rand);
}

function makeAiueo(aiueo) {
    var result = "";
    for (var i = 0; i < aiueo.length; i++) {
        result = result + "<span class='waku'>" + aiueo[i] + "</span>"
    }
    return result;
}

function setAiueo(element, aiueo) {
    element.style="display:grid;grid-template-columns: repeat("
        + aiueo.length + ", 1fr);";
    var result = "";
    for (var i = 0; i < aiueo.length; i++) {
        result = result + "<span class='waku'>" + aiueo[i] + "</span>"
    }
    element.innerHTML = result;
}


function setHistoryGrid(element, cols, rows) {
    element.style="display:grid;grid-template-columns: repeat("
        + cols + ", 1fr);";
    var result = "";
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            result = result + "<span class='waku'>　</span>"
        }
    }
    element.innerHTML = result;
}

function setHintGrid(element, hint_ar, cols, callbackstr, vline) {
    //element.style="display:grid;grid-template-columns: repeat("
    //    + cols + ", 1fr);column-gap:.5em";
    var divsty = "<div style='display:grid;grid-template-columns: repeat("
        + cols + ", 1fr);column-gap:.5em;margin-bottom:.5em'>";
    var result = "";
    var line = 0;
    if (vline) {
        result = divsty;
    } else {
        element.style="display:grid;grid-template-columns: repeat("
            + cols + ", 1fr);column-gap:.5em";
    }
    for (var i = 0; i < hint_ar.length; i++) {
        if (i != 0 && i % cols == 0) {
            line++;
            if (line == vline) {
                result = result + "</div>\n" + divsty;
            }
        }
        if (hint_ar[i] == "　") {
            result = result + "<span class='wakunashi'>" +
                hint_ar[i] + "</span>";
        } else {
            result = result + "<span class='waku' onclick='"
                + callbackstr + "(this)'>" + hint_ar[i] + "</span>";
        }
    }
    if (vline) {
        result = result + "</div>\n";
    }
    element.innerHTML = result;
}

function makeHistorySpan(length, line) {
    var result = "";
    for (var i = 0; i < line; i++) {
        for (var j = 0; j < length; j++) {
            result = result + "<span class='waku'>　</span>"
        }
        result = result + "<br/>\n";
    }
    return result;
}

function makeHintSpan(hint_ar, br_pos, callbackstr, vline) {
    var result = "";
    var line = 0;
    for (var i = 0; i < hint_ar.length; i++) {
        if (i != 0 && i % br_pos == 0) {
            line++;
            if (line == vline) {
                result = result + "<br/><p>\n";
            } else {
                result = result + "<br/>\n";
            }
        }
        if (hint_ar[i] == "　") {
            result = result + "<span class='wakunashi'>" +
                hint_ar[i] + "</span> ";
        } else {
            result = result + "<span class='waku' onclick='"
                + callbackstr + "(this)'>" + hint_ar[i] + "</span> ";
        }
    }
    // for safari
    result = result + "<br/>";
    return result;
}

function check_answer(instr, answer) {
    var result = {};
    result.resstr = "";
    result.match = [];
    result.hit = [];
    result.nomatch = [];
    for (var i = 0; i < instr.length; i++) {
        var el = instr[i];
        if (el == answer[i]) {
            result.resstr = result.resstr + "m";
            result.match.push(el);
            continue;
        }
        if (answer.includes(el)) {
            result.resstr = result.resstr + "o";
            result.hit.push(el);
        } else {
            result.resstr = result.resstr + "x";
            result.nomatch.push(el);
        }
    }
    return result;
}

function allsame(str,cha) {
    for (var i = 0; i < str.length; i++) {
        if (str[i] != cha) {
            return false;
        }
    }
    return true;
}

function makeClipStr(title, histtry, tourl) {
    const dict = {m:"\u{1f7e9}", o:"\u{1f7e8}", x:"\u{2b1c}", b:"\u{1f7e6}"};
    var result = title + "\n";
    for (var i = 0; i < histtry.length; i++) {
        var el = histtry[i];
        for (var j = 0; j < el.length; j++) {
            result = result + dict[el[j]];
        }
        result = result + "\n";
    }
    result = result + tourl
    return result
}

function tusan(date) {
    const mday = [[0,31,59,90,120,151,181,212,243,273,304,334],
                  [0,31,60,91,121,152,182,213,244,274,305,335]];
    const y = (date.getFullYear() % 100) * 100;
    const m = date.getMonth();
    const d = date.getDate();
    if (y % 4 == 0) {
        return y + d + mday[1][m];
    } else {
        return y + d + mday[0][m];
    }
}

function formatDate(date) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const ms = ("0" + m).substr(-2);
    const ds = ("0" + d).substr(-2);
    return y + "-" + ms + "-" + ds;
}

function formatTime(basesec) {
    const sec = basesec % 60;
    const min = (Math.floor(basesec / 60)) % 60;
    const hour = Math.floor(basesec / 3600);
    const hs = ("0" + hour).substr(-2);
    const mins = ("0" + min).substr(-2);
    const secs = ("0" + sec).substr(-2);
    return hs + ":" + mins + ":" + secs;
}

function nokori(date, option) {
    var result = {};
    var dd = new Date(date);
    var secs = 0;
    switch (option) {
    case "day":
        dd.setHours(23);
        dd.setMinutes(59);
        dd.setSeconds(59);
        result.seconds = Math.ceil((dd.getTime() - date.getTime()) / 1000);
        break;
    case "hour":
        dd.setMinutes(59);
        dd.setSeconds(59);
        result.seconds = Math.ceil((dd.getTime() - date.getTime()) / 1000);
        break;
    default:
        dd.setSeconds(59);
        result.seconds = Math.ceil((dd.getTime() - date.getTime()) / 1000);
        result.seconds = 9 * 60 + result.seconds; // 10 minutes
    }
    result.text = formatTime(result.seconds);
    return result;
}

class Seed {
    constructor(date, option, etitle) {
        this.type = option;
        switch (option) {
        case "hour" :
            this.subtitle = "random";
            this.seed = etitle + (date.getTime() & 0xffffffff);
            break;
        case "min":
            this.subtitle = "random";
            this.seed = etitle + (date.getTime() & 0xffffffff);
            break;
        default:
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const d = date.getDate();
            this.subtitle = formatDate(date);
            this.seed = etitle + y + m + d;
            break;
        }
        var noko = nokori(date,option);
        this.nokori = noko.text;
        this.seconds = noko.seconds;
        this.time = date.getTime();
    }
    finish() {
        var date = new Date();
        var diff = Math.ceil((date.getTime() - this.time) / 1000);
        var timeout = diff >= this.seconds;
        //console.log("seed:"+this);
        //console.log("diff:"+diff);
        //console.log("result:"+result);
        if (!timeout) {
            this.seconds = this.seconds - diff;
        } else {
            this.seconds = 0;
        }
    }
}
