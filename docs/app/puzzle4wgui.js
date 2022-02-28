

function isSmartPhone() {
  // UserAgentからのスマホ判定
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    return true;
  } else {
    return false;
  }
}

function copyButton() {
    var str = makeClipStr(PUZZLE.title, app.histtry, location.href);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(str);
    }
}
function success_end() {
    var kekka = document.getElementById('result');
    kekka.textContent = 'おめでとうございます'
    var button = document.getElementById('copy');
    button.disabled = false;
    button.hidden = false;
    app.line++;
    app.owari = true;
    PUZZLE.seed.finish();
    setCookie(PUZZLE.etitle+PUZZLE.seed.type, app, PUZZLE.seed.seconds);
}

function google(str) {
    const start = '<a href="https://www.google.com/search?q=';
    const mid = '">';
    const end = '</a>';
    return start + str + mid + str + end;
}

function owari() {
    var kekka = document.getElementById('result');
    //kekka.textContent = 'おしかったですね。正解は「' +
    //    google(PUZZLE.answer) + '」です。';
    kekka.innerHTML = 'おしかったですね。正解は「' + google(PUZZLE.answer) + '」です。';
    var button = document.getElementById('copy');
    button.disabled = false;
    button.hidden = false;
    app.line++;
    app.owari = true;
    PUZZLE.seed.finish();
    setCookie(PUZZLE.etitle+PUZZLE.seed.type, app, PUZZLE.seed.seconds);
}

function backspace(item) {
    var p = app.line * app.line_size;
    clear(PUZZLE.histarray, p, app.line_size);
    if (app.pos == 0) {
        return;
    }
    app.pos--
    var pos = app.line * app.line_size + app.pos;
    PUZZLE.histarray[pos].textContent = "　";
}

function restoreHistory(app) {
    const histdiv = document.getElementById('hist');
    setHistoryGrid(histdiv, app.line_size, PUZZLE.hist_size);
    var histarray = histdiv.getElementsByTagName('span');
    const chgmap = {"m":"maru", "o":"sankaku", "x":"shikaku"}
    for (var line = 0; line < app.line; line++) {
        for (var p = 0; p < app.line_size; p++) {
            var pos = line * app.line_size + p;
            histarray[pos].textContent = app.histstr[line][p];
            histarray[pos].className = chgmap[app.histtry[line][p]];
        }
    }
}

function getdan(str, aiueoar) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
        var s = str[i];
        for (var j = 0; j < aiueoar.length; j++) {
            if (aiueoar[j].includes(s)) {
                result = result + aiueoar[j][0];
            }
        }
    }
    return result;
}

function check_aiueo(instr, answer, aiueoar) {
    var result = {};
    result.match = [];
    result.unmatch = [];
    var inaiu = getdan(instr, aiueoar);
    var ansaiu = getdan(answer, aiueoar);
    for (var i = 0; i < inaiu.length; i++) {
        var s = inaiu[i];
        if (ansaiu.includes(s)) {
            uniqPush(result.match, s);
        } else {
            uniqPush(result.unmatch, s);
        }
    }
    return result;
}

function warning(elements, p, len) {
    for (var i = 0; i < len; i++) {
        elements[p + i].className = 'warning';
    }
}

function clear(elements, p, len) {
    for (var i = 0; i < len; i++) {
        elements[p + i].className = 'waku';
    }
}

function aiuenter(item) {
    var instr = "";
    var p = app.line * app.line_size;
    for (i = 0; i < app.pos; i++) {
        instr = instr + PUZZLE.histarray[p + i].textContent;
    }
    if (instr.length != PUZZLE.answer.length) {
        warning(PUZZLE.histarray, p, app.line_size);
        return;
    }
    if (!ANSWER_ARRAY.includes(instr)) {
        warning(PUZZLE.histarray, p, app.line_size);
        return;
    }
    var result = check_answer(instr, PUZZLE.answer);
    app.histstr.push(instr);
    app.histtry.push(result.resstr);
    const chgmap = {"m":"maru", "o":"sankaku", "x":"shikaku"}
    for (i = 0; i < app.pos; i++) {
        PUZZLE.histarray[p + i].className = chgmap[result.resstr[i]];
    }
    var candidates = document.getElementById('candidate').
        getElementsByTagName('span');
    for (var i = 0; i < candidates.length; i++) {
        var e = candidates[i];
        if (result.match.includes(e.textContent)) {
            e.className = 'maru';
        } else if (result.hit.includes(e.textContent)) {
            if (e.className != 'maru') {
                e.className = 'sankaku';
            }
        } else if (result.nomatch.includes(e.textContent)) {
            e.className = 'shikaku';
        }
    }
    var hinAiu = check_aiueo(instr, PUZZLE.answer, AIUEO);
    //console.log(hinAiu);
    var aiueo = document.getElementById('aiueo').
        getElementsByTagName('span');
    for (var i = 0; i < aiueo.length; i++) {
        var e = aiueo[i];
        //console.log(e.textContent);
        if (hinAiu.match.includes(e.textContent)) {
            e.className = 'sankaku';
        } else if (hinAiu.unmatch.includes(e.textContent)) {
            e.className = 'shikaku';
        }
    }
    if (allsame(result.resstr, 'm')) {
        success_end();
        return;
    } else if (app.line >= PUZZLE.hist_size -1) {
        owari();
        return;
    }
    app.line++;
    app.pos=0
    setCookie(PUZZLE.etitle+PUZZLE.seed.type, app, PUZZLE.seed.seconds);
}

function enter(item) {
    var instr = "";
    for (i = 0; i < app.pos; i++) {
        var p = app.line * app.line_size;
        instr = instr + PUZZLE.histarray[p + i].textContent;
    }
    if (instr.length != PUZZLE.answer.length) {
        return;
    }
    var result = check_answer(instr, PUZZLE.answer);
    app.histstr.push(instr);
    app.histtry.push(result.resstr);
    const chgmap = {"m":"maru", "o":"sankaku", "x":"shikaku"}
    for (i = 0; i < app.pos; i++) {
        var p = app.line * app.line_size;
        PUZZLE.histarray[p + i].className = chgmap[result.resstr[i]];
    }
    var candidates = document.getElementById('candidate').
        getElementsByTagName('span');
    for (var i = 0; i < candidates.length; i++) {
        var e = candidates[i];
        if (result.match.includes(e.textContent)) {
            e.className = 'maru';
        } else if (result.hit.includes(e.textContent)) {
            if (e.className != 'maru') {
                e.className = 'sankaku';
            }
        } else if (result.nomatch.includes(e.textContent)) {
            e.className = 'shikaku';
        }
    }
    if (allsame(result.resstr, 'm')) {
        success_end();
        return;
    } else if (app.line >= PUZZLE.hist_size -1) {
        owari();
        return;
    }
    app.line++;
    app.pos=0
    setCookie(PUZZLE.etitle+PUZZLE.seed.type, app, PUZZLE.seed.seconds);
}

function hintClick(item) {
    var inChar = item.textContent;
    if (app.pos >= app.line_size) {
        return;
    }
    var pos = app.line * app.line_size + app.pos;
    PUZZLE.histarray[pos].textContent = inChar;
    app.pos++;
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

function getType() {
    var type = location.search.split('=')[1];
    console.log('in getType type:'+type);
    if (type != 'hour' && type != 'min') {
        type = 'day';
    }
    return type;
}

function processCookie(cookie) {
    //console.log(cookie);
    app = JSON.parse(cookie);
    restoreHistory(app);
    if (app.owari) {
        app.line = PUZZLE.hist_size;
        app.pos = app.line_size;
        var button = document.getElementById('copy');
        button.disabled = false;
        button.hidden = false;
        var kekka = document.getElementById('result');
        kekka.textContent = "次のゲームまであと " + PUZZLE.seed.nokori;
        var nextgame = document.getElementById('nextgame');
        nextgame.hidden = false;
        var candidate = document.getElementById('candidate');
        candidate.hidden = true;
    }
}

function init() {
    var type = getType();
    console.log('type:'+type);
    var date = new Date();
    const change = {robot4w:1, hyaku5c:2, hyaku5cAA:3, jukugo4c:4};
    const kind = change[PUZZLE.etitle];
    //PUZZLE.seed = new Seed(date, type, PUZZLE.etitle);
    PUZZLE.seed = new Seed(date, type, kind);
    PUZZLE.title = PUZZLE.jtitle + " " + PUZZLE.seed.subtitle;
    var aiueo = document.getElementById('aiueo');
    console.log('aiueo:'+aiueo);
    if (aiueo) {
        //var ah = makeAiueo("あいうえお");
        //console.log(ah);
        //aiueo.innerHTML = ah;
        setAiueo(aiueo, "あいうえお");
    }
    var cookie = getCookie(PUZZLE.etitle+type);
    if (cookie) {
        processCookie(cookie);
        if (app.owari) {
            return;
        }
    }
    var kekka = document.getElementById('result');
    kekka.textContent = ''
    var button = document.getElementById('copy');
    button.disabled = true;
    button.hidden = true;
    var nextgame = document.getElementById('nextgame');
    nextgame.hidden = true;

    var rand = new TinyMTJS(PUZZLE.seed.seed);
    var histdiv = document.getElementById('hist');
    PUZZLE.histarray = histdiv.getElementsByTagName('span');
    app.histtry = [];
    app.histstr = [];
    app.line = 0;
    app.pos = 0;
    app.owari = false;
    PUZZLE.answer = ANSWER_ARRAY[rand.getInt(ANSWER_ARRAY.length)];
    app.line_size = PUZZLE.answer.length
    //var hs = makeHistorySpan(app.line_size, PUZZLE.hist_size);
    //histdiv.innerHTML = hs;
    setHistoryGrid(histdiv, app.line_size, PUZZLE.hist_size);
    var candidate = document.getElementById('candidate');
    //var sps = "";
    if (PUZZLE.fixedHint) {
        var hint_arr = ANSWER_ALL_KANJI.split("");
        //sps = makeHintSpan(hint_arr, PUZZLE.hint_width,
        //                   'hintClick', PUZZLE.vline);
        //candidate.innerHTML= sps;
        setHintGrid(candidate, hint_arr, PUZZLE.hint_width, 'hintClick',
                   PUZZLE.vline);
    } else {
        var hint_arr = getHintArray(PUZZLE.answer,
                                ANSWER_ARRAY,
                                ANSWER_ALL_KANJI,
                                PUZZLE.dificulity,
                                PUZZLE.hint_size,
                                rand);
        //sps = makeHintSpan(hint_arr, PUZZLE.hint_width, 'hintClick');
        //candidate.innerHTML= sps;
        setHintGrid(candidate, hint_arr, PUZZLE.hint_width, 'hintClick');
    }

}
