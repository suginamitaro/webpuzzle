function copyButton() {
    var str = makeClipStr(title, histtry);
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
}
function owari() {
    //alert('owari');
    var kekka = document.getElementById('result');
    kekka.textContent = 'おしかったですね'
    var button = document.getElementById('copy');
    button.disabled = false;
    button.hidden = false;
}
function backspace(item) {
    if (currentCharPos == 0) {
        return;
    }
    currentCharPos--
    var pos = currentHist * line_size + currentCharPos;
    histarray[pos].textContent = "　";
}
function enter(item) {
    var instr = "";
    for (i = 0; i < currentCharPos; i++) {
        var p = currentHist * line_size;
        instr = instr + histarray[p + i].textContent;
    }
    if (instr.length != answer.length) {
        return;
    }
    var result = check_answer(instr, answer);
    var resstr = result[0];
    histtry.push(resstr);
    for (i = 0; i < currentCharPos; i++) {
        var p = currentHist * line_size;
        if (resstr[i] == 'm') {
            histarray[p + i].className = 'maru';
        } else if (resstr[i] == 'o') {
            histarray[p + i].className = 'sankaku';
        } else {
            histarray[p + i].className = 'shikaku';
        }
    }
    var maar = result[1];
    var hitar = result[2];
    var nomat = result[3];
    var candidates = document.getElementById('candidate').
        getElementsByTagName('span');
    for (var i = 0; i < candidates.length; i++) {
        var e = candidates[i];
        if (maar.includes(e.textContent)) {
            e.className = 'maru';
        } else if (hitar.includes(e.textContent)) {
            e.className = 'sankaku';
        } else if (nomat.includes(e.textContent)) {
            e.className = 'shikaku';
        }
    }
    if (allsame(resstr, 'm')) {
        success_end();
        return;
    } else if (currentHist >= hist_size -1) {
        owari();
        return;
    }
    currentHist++;
    currentCharPos=0
}
function hintClick(item) {
    var inChar = item.textContent;
    if (currentCharPos >= line_size) {
        return;
    }
    var pos = currentHist * line_size + currentCharPos;
    histarray[pos].textContent = inChar;
    currentCharPos++;
}
function isFirstOfDay(title, short_time) {
    const cookieArray = new Array();
    if(document.cookie != ''){
        const tmp = document.cookie.split('; ');
        for(let i=0;i<tmp.length;i++){
            const data = tmp[i].split('=');
            cookieArray[data[0]] = decodeURIComponent(data[1]);
        }
    }
    const today = cookieArray.includes(title);
    if (!today) {
        const date = new Date();
        const todayEnd = new Date(date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate(),
                                  23, 59, 59);
        const dateTime = date.getTime();
        const todayEndTime = todayEnd.getTime();
        const remainingTime = Math.ceil((todayEndTime - dateTime) / 1000);
        if (short_time) {
            document.cookie = title + '=1;max-age=' + 600;
        } else {
            document.cookie = title + '=1;max-age=' + remainingTime;
        }
        return true;
    } else {
        return false;
    }
}

function init() {
    var firstday = isFirstOfDay(etitle, true);
    var br = document.createElement('br');
    var kekka = document.getElementById('result');
    kekka.textContent = ''
    histtry = [];
    currentHist = 0;
    currentCharPos = 0;
    var button = document.getElementById('copy');
    button.disabled = true;
    button.hidden = true;
    if (!firstday) {
        currentHist = hist_size;
        currentCharPos=line_size;
        return;
    }
}
