//const TinyMT = require('./tinymtjs');
//const Con = require('./convert');

const LINESIZE = 6;
const PUZZLE = {};
PUZZLE.etitle = "numpl6";
PUZZLE.jtitle = "ミニナンプレ6";
PUZZLE.seed = "";
var APP = {};
var NP6 = new NumberPlace6();
var PRARRAY = ["123","456"];
//var PRSTR ="2   3  3   5 2        4  6   33  62 ";

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
    constructor(date, info, strhash) {
        this.type = info.type;
        this.uniq = this.type + info.uniq;
        switch (this.type) {
        case "hour" :
            this.subtitle = "random";
            this.seed = [strhash, info.uniq, (date.getTime() & 0xffffffff)];
            break;
        case "min":
            this.subtitle = "random";
            this.seed = [strhash, info.uniq, (date.getTime() & 0xffffffff)];
            break;
        default:
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const d = date.getDate();
            this.subtitle = formatDate(date);
            this.seed = [strhash, info.uniq, y, m, d];
            break;
        }
        var noko = nokori(date,this.type);
        this.nokori = noko.text;
        this.seconds = noko.seconds;
        this.time = date.getTime();
    }
    finish() {
        var date = new Date();
        var diff = Math.ceil((date.getTime() - this.time) / 1000);
        var timeout = diff >= this.seconds;
        if (!timeout) {
            this.seconds = this.seconds - diff;
        } else {
            this.seconds = 0;
        }
    }
}

function addClass(element, str) {
    element.classList.add(str);
}

function deleteClass(element, str) {
    element.classList.remove(str);
}

function clearClass(str) {
    const board = document.getElementById('board');
    const sp = board.getElementsByTagName("span");
    for (var i = 0; i < sp.length; i++) {
        deleteClass(sp[i], str);
    }
}

function empString(str) {
    const board = document.getElementById('board');
    const sp = board.getElementsByTagName("span");
    for (var i = 0; i < sp.length; i++) {
        if (sp[i].textContent.includes(str)) {
            addClass(sp[i], "e");
        }
    }
}

function setStringAtSelectedEl(str) {
    const board = document.getElementById('board');
    const sp = board.getElementsByTagName("span");
    for (var i = 0; i < sp.length; i++) {
        if (sp[i].classList.contains("s")) {
            sp[i].textContent = str;
            sp[i].classList.remove('w');
            break;
        }
    }
}

function keypush(element) {
    clearClass("e");
    if (APP.owari) {
        return;
    }
    const str = element.textContent;
    setStringAtSelectedEl(str);
    empString(str);
    clearClass("s");
}

function select(element) {
    if (APP.owari) {
        return;
    }
    clearClass("s");
    addClass(element, "s");
}

function makeBoard(prstr, len, width, height, fn) {
    var result = "";
    var c = 0;
    for (var i = 0; i < len; i++) {
        var ba = [];
        var rl = "";
        if (i % 2 == 1 && i != len - 1) {
            ba.push("b");
        }
        for (var j = 0; j < len; j++) {
            var ra = ba.concat([]);
            var click = "";
            var str = prstr[c++];
            if (j % 3 == 2 && j != len - 1) {
                ra.push("r");
            }
            if (str != " ") {
                ra.push("fx");
            } else {
                click = "onclick='" + fn + "(this)'";
            }
            //
            var cl = ra.join(" ");
            if (cl != "") {
                cl = "class='" + cl + "'";
            }
            result += "<span " + cl + " " + click + ">" + str + "</span>";
        }
    }
    return result;
}

function makeKey(str, fn) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
        result += "<span onclick='" + fn + "(this)'>" + str[i] + "</span>";
    }
    return result;
}

function getLocationInfo() {
    var info = {};
    const searchParams = new URLSearchParams(window.location.search);
    //console.log("search:"+searchParams);
    info.type = searchParams.get('t');
    //console.log("type:"+info.type);
    if (info.type != 'hour' && info.type != 'min') {
        info.type = 'day';
    }
    if (searchParams.has('str')) {
        info.str = searchParams.get('str');
        info.str = (info.str + "123456789").substring(0, LINESIZE);
    } else {
        info.str = "123456789".substring(0, LINESIZE);
    }
    if (searchParams.has('uniq')) {
        info.uniq = searchParams.get('uniq');
    } else {
        info.uniq = 1;
    }
    //console.log("info:"+info);
    return info;
}

function makeClipStr(title, problem, tourl) {
    var result = title + "\n";
    for (var i = 0; i < problem.length; i++) {
        if (problem[i] == ' ') {
            result += '□';
        } else {
            result += problem[i];
        }
        if (i % LINESIZE == LINESIZE -1) {
            result += "\n";
        }
    }
    result += "clear!\n";
    //result += decodeURIComponent(tourl) + "\n";
    result += decodeURI(tourl) + "\n";
    return result
}

function copyButton() {
    var str = makeClipStr(PUZZLE.title, APP.problem, location.href);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(str);
    }
}

function success_end() {
    // var resultArea = document.getElementById('resultarea');
    // resultArea.hidden = false;
    var kekka = document.getElementById('result');
    var button = document.getElementById('copy');
    var next = document.getElementById('nextgame');
    APP.owari = true;
    kekka.hidden = false;
    button.hidden = false;
    next.hidden = false;
    button.disabled = false;
    var kaisu = "";
    if (APP.checkCnt == 1) {
        kaisu = "一発クリア、"
    } else {
        kaisu += APP.checkCnt + "回試行でのクリア、"
    }
    kekka.textContent = kaisu + 'おめでとうございます'
    PUZZLE.seed.finish();
    setCookie(PUZZLE.etitle+PUZZLE.seed.uniq, APP, PUZZLE.seed.seconds);
}

function checkButton() {
    if (APP.owari) {
        return;
    }
    console.log('checkButton clicked');
    const board = document.getElementById('board');
    const sp = board.getElementsByTagName("span");
    //const str = sp.map(x => x.textContent).join('');

    var str = "";
    for (var i = 0; i < sp.length; i++) {
        str += sp[i].textContent;
    }
    console.log("str:"+str);
    APP.checkCnt++;
    if (NP6.check(sp)) { // check and warninig set
        console.log('check ok');
        APP.answer = str;
        success_end();
    } else {
        console.log('check NG');
    }
}

function makeDict(str) {
    var result = str.split('');
    var res = [];
    for (var i = 0; i < result.length; i++) {
        res[(i+1).toString()] = result[i];
    }
    res['0'] = '0';
    res[' '] = ' ';
    return res;
}

function replace(org, str) {
    var dict = makeDict(str);
    var result = org.split('').map(x => dict[x]).join('');
    console.log("result:"+result);
    return result;
}

function setCookie(title, app, seconds) {
    //const fixstr = "; SameSite=Lax; Content-Type: text/plain; charset=UTF-8;";
    const fixstr = "; SameSite=Lax;";
    var data = encodeURIComponent(JSON.stringify(app));
    //var data = JSON.stringify(app);
    console.log(data);
    console.log('max-age:'+seconds)
    document.cookie = title + "=" + data + fixstr + " max-age=" + seconds;
}

function getCookie(title) {
    const cookieArray = new Array();
    if(document.cookie){
        const tmp = document.cookie.split('; ');
        for(let i=0;i<tmp.length;i++){
            const data = tmp[i].split('=');
            cookieArray[data[0]] = decodeURIComponent(data[1]);
            //cookieArray[data[0]] = data[1];
        }
    }
    const cookie = cookieArray[title];
    console.log(cookie);
    if (!cookie) {
        return "";
    } else {
        return cookie;
    }
}

function nofunc() {
}

function setBoard(board, answer) {
    const sp = board.getElementsByTagName("span");
    for (var i = 0; i < sp.length; i++) {
        if (sp[i].textContent == ' ') {
            sp[i].textContent = answer[i];
        }
    }
}

function restoreBoard(app) {
    const bd = makeBoard(app.problem, 6, 3, 2, 'nofunc');
    const board = document.getElementById('board');
    board.innerHTML = bd;
    setBoard(board, app.answer);
    var keystr = APP.keystr + " ";
    const ky = makeKey(keystr, 'nofunc');
    const key = document.getElementById('key');
    //console.log(ky);
    key.innerHTML = ky;
}

function processCookie(cookie) {
    //console.log(cookie);
    APP = JSON.parse(cookie);
    restoreBoard(APP);
    if (APP.owari) {
        //app.line = PUZZLE.hist_size;
        //app.pos = app.line_size;
        var check = document.getElementById('check');
        check.disabled=true;
        check.hidden=true;
        var button = document.getElementById('copy');
        button.disabled = false;
        button.hidden = false;
        var kekka = document.getElementById('result');
        kekka.textContent = "次のゲームまであと " + PUZZLE.seed.nokori;
        var nextgame = document.getElementById('nextgame');
        nextgame.hidden = false;
        //var candidate = document.getElementById('candidate');
        //candidate.hidden = true;
    }
}

function init() {
    var info = getLocationInfo();
    var date = new Date();
    //const change = {robot4w:1, hyaku5c:2, hyaku5cAA:3, jukugo4c:4};
    //const kind = change[PUZZLE.etitle];
    var rand = new TinyMTJS(info.str);
    PUZZLE.seed = new Seed(date, info, rand.getInt31());
    rand.setSeed(PUZZLE.seed.seed);
    const jtitle = PUZZLE.jtitle + "(" + info.str + ")";
    const pagetitle = document.getElementById('title');
    pagetitle.textContent = jtitle;
    PUZZLE.title = jtitle + PUZZLE.seed.subtitle;
    var cookie = getCookie(PUZZLE.etitle+PUZZLE.seed.uniq);
    if (cookie) {
        processCookie(cookie);
        if (APP.owari) {
            return;
        }
    }
    var kekka = document.getElementById('result');
    var check = document.getElementById('check');
    var button = document.getElementById('copy');
    var next = document.getElementById('nextgame');
    check.onclick = checkButton;
    button.onclick = copyButton;
    kekka.hidden = true;
    button.hidden = true;
    next.hidden = true;
    kekka.textContent = '';

    //var prstr ="2   3  3   5 2        4  6   33  62 ";
    var prstr = PRARRAY[rand.getInt(PRARRAY.length)];
    prstr = NP6.convert(prstr.split(''), rand).join('');
    prstr = replace(prstr, info.str);
    APP.problem = prstr;
    APP.keystr = info.str;
    APP.checkCnt = 0;
    //console.log(prstr);
    //var keystr = "123456 ";
    var keystr = info.str + " ";
    const bd = makeBoard(prstr, 6, 3, 2, 'select');
    const board = document.getElementById('board');
    board.innerHTML = bd;
    const ky = makeKey(keystr, 'keypush');
    const key = document.getElementById('key');
    //console.log(ky);
    key.innerHTML = ky;
}

window.onload = init;
