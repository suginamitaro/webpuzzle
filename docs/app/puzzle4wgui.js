
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
    if (!SEED.isTimeOut()) {
        setCookie(ETITLE, app, SEED.seconds);
    }
}
function owari() {
    var kekka = document.getElementById('result');
    kekka.textContent = 'おしかったですね'
    var button = document.getElementById('copy');
    button.disabled = false;
    button.hidden = false;
    app.line++;
    app.owari = true;
    if (!SEED.isTimeOut()) {
        setCookie(ETITLE, app, SEED.seconds);
    }
}
function backspace(item) {
    if (app.pos == 0) {
        return;
    }
    app.pos--
    var pos = app.line * app.line_size + app.pos;
    histarray[pos].textContent = "　";
}

function restoreHistory(app) {
    const chgmap = {"m":"maru", "o":"sankaku", "x":"shikaku"}
    for (var line = 0; line < app.line; line++) {
        for (var p = 0; p < app.line_size; p++) {
            var pos = line * app.line_size + p;
            histarray[pos].textContent = app.histstr[line][p];
            histarray[pos].className = chgmap[app.histtry[line][p]];
        }
    }
}

function enter(item) {
    var instr = "";
    for (i = 0; i < app.pos; i++) {
        var p = app.line * app.line_size;
        instr = instr + histarray[p + i].textContent;
    }
    if (instr.length != answer.length) {
        return;
    }
    var result = check_answer(instr, answer);
    app.histstr.push(instr);
    app.histtry.push(result.resstr);
    const chgmap = {"m":"maru", "o":"sankaku", "x":"shikaku"}
    for (i = 0; i < app.pos; i++) {
        var p = app.line * app.line_size;
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
    if (allsame(result.resstr, 'm')) {
        success_end();
        return;
    } else if (app.line >= hist_size -1) {
        owari();
        return;
    }
    app.line++;
    app.pos=0
    if (!SEED.isTimeOut()) {
        setCookie(ETITLE, app, SEED.seconds);
    }
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
    console.log('max-age:'+seconds)
    document.cookie = title + "=" + data +';max-age=' + seconds;
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

function init() {
    var kekka = document.getElementById('result');
    kekka.textContent = ''
    app.histtry = [];
    app.line = 0;
    app.pos = 0;
    var button = document.getElementById('copy');
    button.disabled = true;
    button.hidden = true;
    var cookie = getCookie(ETITLE, app);
    if (cookie) {
        //console.log(cookie);
        app = JSON.parse(cookie);
        restoreHistory(app);
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
