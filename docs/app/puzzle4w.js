/*
* パズル用関数
*/
class PMLCG {
    constructor(seed) {
        this.me = seed;
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

function makeHistorySpan(length, line) {
    var result = "";
    for (var i = 0; i < line; i++) {
        for (var j = 0; j < length; j++) {
            result = result + "<span class='waku'>　</span>\n"
        }
        result = result + "<br/>\n";
    }
    return result;
}

function makeHintSpan(hint_ar, br_pos, callbackstr) {
    var result = "";
    for (var i = 0; i < hint_ar.length; i++) {
        if (i != 0 && i % br_pos == 0) {
            result = result + "<br/>\n";
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

function makeClipStr(title, histtry) {
    const dict = {m:"\u{1f7e9}", o:"\u{1f7e8}", x:"\u{2b1c}", b:"\u{1f7e6}"};
    //const dict = {m:"○", o:"△", x:"□", b:"▽"};
    //const maru = "\u{1f7e9}";
    //const sankaku = "\u{1f7e8}";
    //const shikaku = "\u{2b1c}";
    //const bushu = "\u{1f7e6}";
    var result = title + "\n";
    for (var i = 0; i < histtry.length; i++) {
        var el = histtry[i];
        for (var j = 0; j < el.length; j++) {
            result = result + dict[el[j]];
        }
        result = result + "\n";
    }
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
        result.seconds = Math.floor((dd.getTime() - date.getTime()) / 1000);
        break;
    case "hour":
        dd.setMinutes(59);
        dd.setSeconds(59);
        result.seconds = Math.floor((dd.getTime() - date.getTime()) / 1000);
        break;
    default:
        dd.setSeconds(59);
        result.seconds = Math.floor((dd.getTime() - date.getTime()) / 1000);
    }
    result.text = formatTime(result.seconds);
    return result;
}

function makeSeed(date, option) {
    var result = {};
    result.type = option;
    switch (option) {
    case "day" :
        result.subtitle = formatDate(date);
        result.seed = tusan(date);
        break;
    case "hour" :
        result.subtitle = "random";
        result.seed = tusan(date) * 24 + date.getHours();
        break;
    default:
        result.subtitle = "random";
        result.seed = tusan(date) * 1440 +
            date.getHours() * 60 + date.getMinutes();
        break;
    }
    var noko = nokori(date,option);
    result.nokori = noko.text;
    result.seconds = noko.seconds;
    return result;
}

/*
function julian() {
    var date = new Date();
    var time = date.getTime();
    return Math.floor((time / 86400000) - (date.getTimezoneOffset()/1440) + 2440587.5);
}
*/

/*
console.log(julian());
*/
/*
var a = [1,2,3, 1];
var c = [3,4,5];
console.log(uniqAppend(a,c));
var rand = new PMLCG(9934);
var b = getsample(a, 2, rand);
console.log(b);
console.log(getRandomNArray("st","stxyz", 3, rand));
*/
/*
var ar = ["怪","人","戦","機","賞"];
var str = makeHintSpan(ar, 3, "str");
console.log(str);
*/
/*
console.log("ちぎりきな".length);
var str = makeHistorySpan(4, 3);
console.log(str);
*/
/*
var hitstr = "特突言戦";
var ansstr = "無限戦記";
var res = check_answer(hitstr, ansstr)
console.log(res[0]);
console.log(res);
*/
/*
console.log(allsame("abc","a"));
console.log(allsame("aaa","a"));
*/
/*
var title = 'TITLE';
var arr = ["mmm","mbx","mox"];
var res = makeClipStr(title, arr);
console.log(res);
*/
