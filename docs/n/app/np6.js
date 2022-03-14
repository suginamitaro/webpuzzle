//const TinyMTJS = require('./tinymtjs');
//const NumberPlace6 = require('./numberplace');

const LINESIZE = 6;
const PUZZLE = {};
PUZZLE.etitle = "numpl6";
PUZZLE.jtitle = "ミニナンプレ6";
PUZZLE.seed = "";
var APP = {};
const NP6 = new NumberPlace6();
const FNAME = {'H' : "pz.hidden.txt",
               'L' : "pz.locked.txt",
               'T' : "pz.tuple.txt",
               'X' : "pz.xwing.txt",
               'Y' : "pz.xywing.txt",
               'Z' : "pz.xyzwing.txt"};
const RAND = new TinyMTJS(0);
//var PRARRAY = ["123","456"];

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
    const result = {};
    const dd = new Date(date);
    //const secs = 0;
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
        dd.setMinutes(Math.ceil(date.getMinutes() / 10) * 10);
        dd.setSeconds(59);
        result.seconds = Math.ceil((dd.getTime() - date.getTime())/ 1000);
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
        const noko = nokori(date,this.type);
        this.nokori = noko.text;
        this.seconds = noko.seconds;
        this.time = date.getTime();
    }
    finish() {
        const date = new Date();
        const diff = Math.ceil((date.getTime() - this.time) / 1000);
        const timeout = diff >= this.seconds;
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
            sp[i].classList.remove('p');
            break;
        }
    }
}

function getSelectedPos(sp) {
    for (var i = 0; i < sp.length; i++) {
        if (sp[i].classList.contains("s")) {
            return i;
        }
    }
    return -1;
}

function delStringAtSelectedEl(str) {
    const board = document.getElementById('board');
    const sp = board.getElementsByTagName("span");
    for (var i = 0; i < sp.length; i++) {
        if (sp[i].classList.contains("s")){
            if (sp[i].classList.contains("p")) {
                sp[i].textContent = sp[i].textContent.replace(str, "");
            }
            break;
        }
    }
}

function keypush() {
    clearClass("e");
    if (APP.owari) {
        return;
    }
    const str = this.textContent;
    setStringAtSelectedEl(str);
    empString(str);
    clearClass("s");
}

function delkey() {
    clearClass("e");
    if (APP.owari) {
        return;
    }
    const str = this.textContent;
    delStringAtSelectedEl(str);
    clearClass("s");
}

function select() {
    if (APP.owari) {
        return;
    }
    clearClass("s");
    addClass(this, "s");
}

function makeBoard(element, prstr, len, width, height, func) {
    //console.log("prstr:"+prstr);
    var c = 0;
    for (var i = 0; i < len; i++) {
        //const ba = [];
        var ba = false;
        //if ((i % height == height -1) && (i != len - 1)) {
        if ((i % 2 == 1) && (i != len - 1)) {
            ba = true;
        }
        for (var j = 0; j < len; j++) {
            var sp = document.createElement('span');
            if (ba) {
                sp.classList.add('b');
            }
            //const ra = ba.concat([]);
            //if ((j % width == width - 1) && j != len - 1) {
            if ((j % 3 == 2) && j != len - 1) {
                sp.classList.add('r');
            }
            const str = prstr[c++];
            if (str != " ") {
                sp.classList.add('fx');
            } else if (func != null) {
                sp.onclick = func;
            }
            sp.textContent = str;
            element.appendChild(sp);
        }
    }
    //console.log(element);
}

function makeKey(element, str, func) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
        const sp = document.createElement('span');
        sp.textContent = str[i];
        if (func != null) {
            sp.onclick = func;
        }
        element.appendChild(sp);
    }
}

function getLocationInfo() {
    const info = {};
    const searchParams = new URLSearchParams(window.location.search);
    info.type = searchParams.get('t');
    if (info.type != 'hour' && info.type != 'min') {
        info.type = 'day';
    }
    if (searchParams.has('st')) {
        info.str = searchParams.get('st');
        info.str = (info.str + "123456789").substring(0, LINESIZE);
    } else {
        info.str = "123456789".substring(0, LINESIZE);
    }
    if (searchParams.has('uq')) {
        info.uniq = searchParams.get('uq');
    } else {
        info.uniq = 1;
    }
    if (searchParams.has('l')) {
        info.level = searchParams.get('l');
    } else {
        info.level = H;
    }
    if (window.location.href.substring(0,4) == "http") {
        info.file = false;
    } else {
        info.file = true;
    }
    return info;
}

function makeClipStr(title, problem, tourl) {
    const space = "\u{2b1c}";
    var sp = space;
    for (var i = 0; i < problem.length; i++) {
        if (problem[i].match(/[A-Za-z0-9]/)) {
            sp = '_';
            break;
        }
    }
    var result = title + "\n";
    var c = 0;
    for (var i = 0; i < problem.length; i++) {
        if (problem[i] == ' ') {
            result += sp;
        } else {
            result += problem[i];
        }
        if ((i % 3 == 2) && (i % LINESIZE != LINESIZE -1)) {
            result += " ";
        }
        if (i % LINESIZE == LINESIZE -1) {
            result += "\n";
            c++;
        }
        if (c == 2 && i < LINESIZE * LINESIZE -2) {
            result += "\n";
            c = 0;
        }
    }
    result += "clear!\n";
    result += tourl + "\n";
    return result;
}

function copyButton() {
    var str = makeClipStr(PUZZLE.title, APP.problem, location.href);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(str);
    }
}

function success_end() {
    clearClass("s");
    clearClass("e");
    clearClass("w");
    const check = document.getElementById('check');
    check.disabled=true;
    check.hidden=true;
    const penb = document.getElementById('pen');
    penb.hidden=true;
    const reset = document.getElementById('reset');
    reset.hidden=true;
    const key2 = document.getElementById('key2');
    key2.hidden=true;
    const kekka = document.getElementById('result');
    const button = document.getElementById('copy');
    const next = document.getElementById('nextgame');
    APP.owari = true;
    kekka.hidden = false;
    button.hidden = false;
    next.hidden = false;
    button.disabled = false;
    var kaisu = "";
    if (APP.checkCnt == 1) {
        kaisu = "一発クリア、";
    } else {
        kaisu += APP.checkCnt + "回試行でのクリア、";
    }
    kekka.textContent = kaisu + 'おめでとうございます';
    PUZZLE.seed.finish();
    setCookie(PUZZLE.etitle+PUZZLE.seed.uniq, APP, PUZZLE.seed.seconds);
}

function checkButton() {
    if (APP.owari) {
        return;
    }
    const board = document.getElementById('board');
    const sp = board.getElementsByTagName("span");

    var str = "";
    for (var i = 0; i < sp.length; i++) {
        str += sp[i].textContent;
    }
    APP.checkCnt++;
    if (NP6.check(sp)) { // check and warninig set
        APP.answer = str;
        success_end();
    } else {
        console.log('check NG');
    }
}

function makeDict(str) {
    var result = str.split('');
    const res = [];
    for (var i = 0; i < result.length; i++) {
        res[(i+1).toString()] = result[i];
    }
    res['0'] = '0';
    res[' '] = ' ';
    return res;
}

function replace(org, str) {
    const dict = makeDict(str);
    const result = org.split('').map(x => dict[x]).join('');
    return result;
}

function setCookie(title, app, seconds) {
    const fixstr = "; SameSite=Lax;";
    var data = encodeURIComponent(JSON.stringify(app));
    document.cookie = title + "=" + data + fixstr + " max-age=" + seconds;
}

function getCookie(title) {
    const cookieArray = new Array();
    if(document.cookie){
        const tmp = document.cookie.split('; ');
        for(let i=0;i<tmp.length;i++){
            const data = tmp[i].split('=');
            cookieArray[data[0]] = decodeURIComponent(data[1]);
        }
    }
    const cookie = cookieArray[title];
    if (!cookie) {
        return "";
    } else {
        return cookie;
    }
}
function pen() {
    const key2 = document.getElementById('key2');
    key2.hidden=false;
    const penb = document.getElementById('pen');
    penb.disabled=true;
}

function pencilMark() {
    const board = document.getElementById('board');
    const sp = board.getElementsByTagName('span');
    NP6.pencilMark(sp, APP.keystr);

    //const p = getSelectedPos(sp);
    clearClass("s");
    clearClass("e");
    // if (p >= 0) {
    //     NP6.pencilMarkPos(sp, p, APP.keystr);
    // }
}

function reset() {
    if (APP.owari) {
        return;
    }
    const board = document.getElementById('board');
    const sp = board.getElementsByTagName('span');
    for (var i = 0; i < sp.length; i++) {
        if (!sp[i].classList.contains('fx')) {
            sp[i].classList.remove('w');
            sp[i].classList.remove('p');
            sp[i].classList.remove('s');
            sp[i].textContent = ' ';
        }
    }
    APP.checkCnt++;
}

/*
function nofunc() {
}
*/
function setBoard(board, answer) {
    const sp = board.getElementsByTagName("span");
    for (var i = 0; i < sp.length; i++) {
        if (sp[i].textContent == ' ') {
            sp[i].textContent = answer[i];
        }
    }
}

function restoreBoard(app) {
    const board = document.getElementById('board');
    makeBoard(board, app.problem, 6, 3, 2, null);
    setBoard(board, app.answer);
    const keystr = APP.keystr + " ";
    const key = document.getElementById('key');
    makeKey(key, keystr, null);
}

function processCookie(cookie) {
    APP = JSON.parse(cookie);
    restoreBoard(APP);
    if (APP.owari) {
        const loading = document.getElementById('loading');
        loading.hidden = true;
        const check = document.getElementById('check');
        check.disabled=true;
        check.hidden=true;
        const penb = document.getElementById('pen');
        penb.hidden=true;
        const reset = document.getElementById('reset');
        reset.hidden=true;
        const key2 = document.getElementById('key2');
        key2.hidden=true;
        const button = document.getElementById('copy');
        button.disabled = false;
        button.hidden = false;
        const kekka = document.getElementById('result');
        kekka.textContent = "次のゲームまであと " + PUZZLE.seed.nokori;
        const nextgame = document.getElementById('nextgame');
        nextgame.hidden = false;
    }
}

function processDark() {
    const userMod = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const sMode = window.sessionStorage.getItem('user');
    const el = document.documentElement;

    if(sMode) {
        el.setAttribute('theme', sMode);
    } else {
        if(userMod == true) {
            el.setAttribute('theme', 'dark');
        } else {
            el.setAttribute('theme', 'light');
        }
    }

    document.getElementById("changeMode").onclick = function() {
        const nowMode = el.getAttribute('theme');
        if(nowMode == 'dark') {
            el.setAttribute('theme', 'light');
            window.sessionStorage.setItem('user', 'light');
        } else {
            el.setAttribute('theme', 'dark');
            window.sessionStorage.setItem('user', 'dark');
        }
    };
}

function setOnClick() {
    const check = document.getElementById('check');
    const button = document.getElementById('copy');
    const penb = document.getElementById('pen');
    const resetb = document.getElementById('reset');
    check.onclick = checkButton;
    button.onclick = copyButton;
    penb.onclick = pen;
    resetb.onclick = reset;
}

//function init(prarray, prtype) {
//function init(prstr, prtype) {
function init() {
    //dirty();
    //prepare(prtype);
    //const info = getLocationInfo();
    //const date = new Date();
    //const rand = new TinyMTJS(info.str);
    //RAND.setSeed(info.str);
    //PUZZLE.seed = new Seed(date, info, RAND.getInt31());
    //RAND.setSeed(PUZZLE.seed.seed);
    const jtitle = PUZZLE.jtitle + APP.level + "(" + APP.keystr + ")";
    const pagetitle = document.getElementById('title');
    pagetitle.textContent = jtitle;
    PUZZLE.title = jtitle + PUZZLE.seed.subtitle;
    // var cookie = getCookie(PUZZLE.etitle+PUZZLE.seed.uniq);
    // if (cookie) {
    //     processCookie(cookie);
    //     if (APP.owari) {
    //         return;
    //     }
    // }
    const kekka = document.getElementById('result');
    const button = document.getElementById('copy');
    const next = document.getElementById('nextgame');
    const loading = document.getElementById('loading');
    loading.hidden = true;
    kekka.hidden = true;
    button.hidden = true;
    next.hidden = true;
    kekka.textContent = '';

    //var prstr = prarray[RAND.getInt(prarray.length)];
    //prstr = NP6.convert(prstr.split(''), RAND).join('');
    //prstr = replace(prstr, info.str);
    //APP.problem = prstr;
    //APP.keystr = info.str;
    APP.checkCnt = 0;
    const keystr = APP.keystr + " ";
    const board = document.getElementById('board');
    makeBoard(board, APP.problem, 6, 3, 2, select);
    const key = document.getElementById('key');
    makeKey(key, keystr, keypush);
    const key2 = document.getElementById('key2');
    //if (key2) {
    const sp = document.createElement('span');
    sp.textContent = "\u{1f4dd}";
    sp.onclick = pencilMark;
    key2.appendChild(sp);
    makeKey(key2, APP.keystr, delkey);
    //}
}

function prepare() {
    processDark();
    setOnClick();
    const info = getLocationInfo();
    APP.level = info.level;
    APP.keystr = info.str;
    const date = new Date();
    RAND.setSeed(APP.keystr);
    PUZZLE.seed = new Seed(date, info, RAND.getInt31());
    RAND.setSeed(PUZZLE.seed.seed);
    var cookie = getCookie(PUZZLE.etitle+PUZZLE.seed.uniq);
    if (cookie) {
        processCookie(cookie);
        // owari でないことがあるのか
        if (APP.owari) {
            return;
        }
    }
    // strage にあるか
    const key = 'problemArray-' + APP.level;
    const storage = window.sessionStorage.getItem(key);
    if(storage) {
        problemArray = storage.split('\n');
        //console.log("in sessionStorage");
        //console.log(problemArray);
        //var prstr = problemArray[RAND.getInt(problemArray.length)];
        randomProblem(problemArray);
        //init(APP.level);
        init();
        return;
    }
    if (info.file) {
        // file から読み込む これは自分だけ 出鱈目でいい
        const infile = document.getElementById('file');
        infile.hidden = false;
        infile.addEventListener('change', filechange);
    } else {
        const xhr = XMLHttpRequest();
        const path = './data/' + FNAME[APP.level];
        xhr.open('get', path, true);
        xhr.onload = function () {
            const problemArray = this.responseText.split('\n');
            const key = 'problemArray-' + APP.level;
            window.sessionStorage.setItem(key, problemArray);
            randomProblem(problemArray);
            init(APP.level);
        };
        xhr.send(null);
    }

}

function randomProblem(problemArray) {
    //console.log("in randomProblem");
    //console.log("length:" + problemArray.length);
    var prstr = problemArray[RAND.getInt(problemArray.length)];
    //console.log("prstr:" + prstr);
    if (prstr.length == LINESIZE * LINESIZE + 2) {
        prstr = prstr.substring(1, LINESIZE * LINESIZE + 1);
    }
    prstr = NP6.convert(prstr.split(''), RAND).join('');
    prstr = replace(prstr, APP.keystr);
    APP.problem = prstr;
}

function filechange(e) {
    const infile = document.getElementById('file');
    infile.hidden = true;
    const result = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(result);
    reader.addEventListener('load', function() {
        const problemArray = this.result.split(/\n/);
        const key = 'problemArray-' + APP.level;
        window.sessionStorage.setItem(key, this.result);
        randomProblem(problemArray);
        init(APP.level);
    });
}

window.onload = prepare;
//module.exports = init;
