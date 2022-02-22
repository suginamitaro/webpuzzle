
function copyButton() {
    var str = makeClipStr(TITLE, app.histtry, MYURL);
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
    SEED.finish();
    setCookie(ETITLE, app, SEED.seconds);
}
function owari() {
    var kekka = document.getElementById('result');
    kekka.textContent = 'おしかったですね'
    var button = document.getElementById('copy');
    button.disabled = false;
    button.hidden = false;
    app.line++;
    app.owari = true;
    SEED.finish();
    setCookie(ETITLE, app, SEED.seconds);
}
function backspace(item) {
    var p = app.line * app.line_size;
    clear(histarray, p, app.line_size);
    if (app.pos == 0) {
        return;
    }
    app.pos--
    var pos = app.line * app.line_size + app.pos;
    histarray[pos].textContent = "　";
}

function restoreHistory(app) {
    const histdiv = document.getElementById('hist');
    var hs = makeHistorySpan(app.line_size, hist_size);
    histdiv.innerHTML = hs;
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

function enter(item) {
    var instr = "";
    var p = app.line * app.line_size;
    for (i = 0; i < app.pos; i++) {
        instr = instr + histarray[p + i].textContent;
    }
    if (instr.length != answer.length) {
        warning(histarray, p, app.line_size);
        return;
    }
    if (!ANSWER_ARRAY.includes(instr)) {
        warning(histarray, p, app.line_size);
        return;
    }
    var result = check_answer(instr, answer);
    app.histstr.push(instr);
    app.histtry.push(result.resstr);
    const chgmap = {"m":"maru", "o":"sankaku", "x":"shikaku"}
    for (i = 0; i < app.pos; i++) {
        histarray[p + i].className = chgmap[result.resstr[i]];
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
    var hinAiu = check_aiueo(instr, answer, AIUEO);
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
    } else if (app.line >= hist_size -1) {
        owari();
        return;
    }
    app.line++;
    app.pos=0
    setCookie(ETITLE, app, SEED.seconds);
}
function hintClick(item) {
    var inChar = item.textContent;
    if (app.pos >= app.line_size) {
        return;
    }
    var pos = app.line * app.line_size + app.pos;
    histarray[pos].textContent = inChar;
    app.pos++;
}

function setCookie(title, app, seconds) {
    var data = JSON.stringify(app);
    //console.log(data);
    console.log('max-age:'+seconds);
    document.cookie = title + "=" + data +'; SameSite=Lax; max-age=' + seconds;
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
    //console.log(cookie);
    if (!cookie) {
        return "";
    } else {
        return cookie;
    }
}

function makeAiueo(aiueo) {
    var result = "";
    for (var i = 0; i < aiueo.length; i++) {
        result = result + "<span class='waku'>" + aiueo[i] + "</span>"
    }
    return result;
}

function init() {
    var kekka = document.getElementById('result');
    kekka.textContent = ''
    app.histtry = [];
    app.line = 0;
    app.pos = 0;
    var button = document.getElementById('copy');
    button.disabled = true;
    button.hidden = true;
    var nextgame = document.getElementById('nextgame');
    nextgame.hidden = true;
    var aiueo = document.getElementById('aiueo');
    var ah = makeAiueo("あいうえお");
    //console.log(ah);
    aiueo.innerHTML = ah;
    var cookie = getCookie(ETITLE, app);
    if (cookie) {
        //console.log(cookie);
        app = JSON.parse(cookie);
        restoreHistory(app);
        console.log('owari:'+app.owari);
        if (app.owari) {
            app.line = hist_size;
            app.pos = app.line_size;
            button.disabled = false;
            button.hidden = false;
            kekka.textContent = "次のゲームまであと " + SEED.nokori;
            var nextgame = document.getElementById('nextgame');
            nextgame.hidden = false;
            var candidate = document.getElementById('candidate');
            candidate.hidden = true;
        }
    }
}
