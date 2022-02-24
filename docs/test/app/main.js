/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./web/app/puzzle4w.js":
/*!*****************************!*\
  !*** ./web/app/puzzle4w.js ***!
  \*****************************/
/***/ (() => {

eval("/*\n* パズル用関数\n*/\n/*\nclass PMLCG {\n    constructor(seed) {\n        this.me = seed & 0x7fffffff;\n        for (var i = 0; i < 10; i++) {\n            this.next();\n        }\n    }\n    next() {\n        this.me = (this.me * 48271) % 0x7fffffff;\n        return this.me;\n    }\n    getInt(max) {\n        var f = this.next() / 0x7fffffff;\n        return Math.floor(f * max);\n    }\n}\n*/\n\nfunction getsample(array, n, rand) {\n    var result = Array().concat(array);\n    for (var i = 0; i < result.length; i++) {\n        var j = rand.getInt(result.length);\n        var tmp = result[i];\n        result[i] = result[j];\n        result[j] = tmp;\n    }\n    return result.slice(0, n);\n}\n\nfunction uniqPush(array, element) {\n    if (!array.includes(element)) {\n        array.push(element);\n    }\n}\n\nfunction uniqAppend(array1, array2) {\n    var result = Array();\n    var tmp = Array().concat(array1).concat(array2);\n    for (var i = 0; i < tmp.length; i++) {\n        if (!result.includes(tmp[i])) {\n            result.push(tmp[i]);\n        }\n    }\n    return result;\n}\n\nfunction getRandomNArray(str1, str2, n, rand) {\n    var ar1 = Array.from(str1);\n    var ar2 = Array.from(str2);\n    var result = [];\n    ar2 = getsample(ar2, ar2.length, rand);\n    var result = uniqAppend(ar1, ar2.slice(0, n));\n    result = result.slice(0, n);\n    result = getsample(result, n, rand);\n    result.sort;\n    return result;\n}\n\nfunction getHintArray(answer, ans_array, hints, word_count, size, rand) {\n    var str = \"\" + answer;\n    for (var i = 0; i < word_count; i++) {\n        str = str + ans_array[rand.getInt(ans_array.length)];\n    }\n    var cnt = 0;\n    var length = str.length;\n    var sp = rand.getInt(ans_array.length);\n    for (var i = 0; i < length; i++) {\n        for (var j = sp; j < ans_array.length; j++) {\n            var p = (j+sp) % ans_array.length;\n            var s = ans_array[p];\n            if (s.includes(str[i])) {\n                str = str + ans_array[p];\n                cnt++;\n            }\n            if (cnt >= word_count) {\n                break;\n            }\n        }\n        if (cnt >= word_count) {\n            break;\n        }\n    }\n    if (str.length > size) {\n        str = str.substr(0, str.length);\n    }\n    return getRandomNArray(str, hints, size, rand);\n}\n\nfunction makeAiueo(aiueo) {\n    var result = \"\";\n    for (var i = 0; i < aiueo.length; i++) {\n        result = result + \"<span class='waku'>\" + aiueo[i] + \"</span>\"\n    }\n    return result;\n}\n\nfunction setAiueo(element, aiueo) {\n    element.style=\"display:grid;grid-template-columns: repeat(\"\n        + aiueo.length + \", 1fr);\";\n    var result = \"\";\n    for (var i = 0; i < aiueo.length; i++) {\n        result = result + \"<span class='waku'>\" + aiueo[i] + \"</span>\"\n    }\n    element.innerHTML = result;\n}\n\n\nfunction setHistoryGrid(element, cols, rows) {\n    element.style=\"display:grid;grid-template-columns: repeat(\"\n        + cols + \", 1fr);\";\n    var result = \"\";\n    for (var i = 0; i < rows; i++) {\n        for (var j = 0; j < cols; j++) {\n            result = result + \"<span class='waku'>　</span>\"\n        }\n    }\n    element.innerHTML = result;\n}\n\nfunction setHintGrid(element, hint_ar, cols, callbackstr, vline) {\n    //element.style=\"display:grid;grid-template-columns: repeat(\"\n    //    + cols + \", 1fr);column-gap:.5em\";\n    var divsty = \"<div style='display:grid;grid-template-columns: repeat(\"\n        + cols + \", 1fr);column-gap:.5em;margin-bottom:.5em'>\";\n    var result = \"\";\n    var line = 0;\n    if (vline) {\n        result = divsty;\n    } else {\n        element.style=\"display:grid;grid-template-columns: repeat(\"\n            + cols + \", 1fr);column-gap:.5em\";\n    }\n    for (var i = 0; i < hint_ar.length; i++) {\n        if (i != 0 && i % cols == 0) {\n            line++;\n            if (line == vline) {\n                result = result + \"</div>\\n\" + divsty;\n            }\n        }\n        if (hint_ar[i] == \"　\") {\n            result = result + \"<span class='wakunashi'>\" +\n                hint_ar[i] + \"</span>\";\n        } else {\n            result = result + \"<span class='waku' onclick='\"\n                + callbackstr + \"(this)'>\" + hint_ar[i] + \"</span>\";\n        }\n    }\n    if (vline) {\n        result = result + \"</div>\\n\";\n    }\n    element.innerHTML = result;\n}\n\nfunction makeHistorySpan(length, line) {\n    var result = \"\";\n    for (var i = 0; i < line; i++) {\n        for (var j = 0; j < length; j++) {\n            result = result + \"<span class='waku'>　</span>\"\n        }\n        result = result + \"<br/>\\n\";\n    }\n    return result;\n}\n\nfunction makeHintSpan(hint_ar, br_pos, callbackstr, vline) {\n    var result = \"\";\n    var line = 0;\n    for (var i = 0; i < hint_ar.length; i++) {\n        if (i != 0 && i % br_pos == 0) {\n            line++;\n            if (line == vline) {\n                result = result + \"<br/><p>\\n\";\n            } else {\n                result = result + \"<br/>\\n\";\n            }\n        }\n        if (hint_ar[i] == \"　\") {\n            result = result + \"<span class='wakunashi'>\" +\n                hint_ar[i] + \"</span> \";\n        } else {\n            result = result + \"<span class='waku' onclick='\"\n                + callbackstr + \"(this)'>\" + hint_ar[i] + \"</span> \";\n        }\n    }\n    // for safari\n    result = result + \"<br/>\";\n    return result;\n}\n\nfunction check_answer(instr, answer) {\n    var result = {};\n    result.resstr = \"\";\n    result.match = [];\n    result.hit = [];\n    result.nomatch = [];\n    for (var i = 0; i < instr.length; i++) {\n        var el = instr[i];\n        if (el == answer[i]) {\n            result.resstr = result.resstr + \"m\";\n            result.match.push(el);\n            continue;\n        }\n        if (answer.includes(el)) {\n            result.resstr = result.resstr + \"o\";\n            result.hit.push(el);\n        } else {\n            result.resstr = result.resstr + \"x\";\n            result.nomatch.push(el);\n        }\n    }\n    return result;\n}\n\nfunction allsame(str,cha) {\n    for (var i = 0; i < str.length; i++) {\n        if (str[i] != cha) {\n            return false;\n        }\n    }\n    return true;\n}\n\nfunction makeClipStr(title, histtry, tourl) {\n    const dict = {m:\"\\u{1f7e9}\", o:\"\\u{1f7e8}\", x:\"\\u{2b1c}\", b:\"\\u{1f7e6}\"};\n    var result = title + \"\\n\";\n    for (var i = 0; i < histtry.length; i++) {\n        var el = histtry[i];\n        for (var j = 0; j < el.length; j++) {\n            result = result + dict[el[j]];\n        }\n        result = result + \"\\n\";\n    }\n    result = result + tourl\n    return result\n}\n\nfunction tusan(date) {\n    const mday = [[0,31,59,90,120,151,181,212,243,273,304,334],\n                  [0,31,60,91,121,152,182,213,244,274,305,335]];\n    const y = (date.getFullYear() % 100) * 100;\n    const m = date.getMonth();\n    const d = date.getDate();\n    if (y % 4 == 0) {\n        return y + d + mday[1][m];\n    } else {\n        return y + d + mday[0][m];\n    }\n}\n\nfunction formatDate(date) {\n    const y = date.getFullYear();\n    const m = date.getMonth() + 1;\n    const d = date.getDate();\n    const ms = (\"0\" + m).substr(-2);\n    const ds = (\"0\" + d).substr(-2);\n    return y + \"-\" + ms + \"-\" + ds;\n}\n\nfunction formatTime(basesec) {\n    const sec = basesec % 60;\n    const min = (Math.floor(basesec / 60)) % 60;\n    const hour = Math.floor(basesec / 3600);\n    const hs = (\"0\" + hour).substr(-2);\n    const mins = (\"0\" + min).substr(-2);\n    const secs = (\"0\" + sec).substr(-2);\n    return hs + \":\" + mins + \":\" + secs;\n}\n\nfunction nokori(date, option) {\n    var result = {};\n    var dd = new Date(date);\n    var secs = 0;\n    switch (option) {\n    case \"day\":\n        dd.setHours(23);\n        dd.setMinutes(59);\n        dd.setSeconds(59);\n        result.seconds = Math.ceil((dd.getTime() - date.getTime()) / 1000);\n        break;\n    case \"hour\":\n        dd.setMinutes(59);\n        dd.setSeconds(59);\n        result.seconds = Math.ceil((dd.getTime() - date.getTime()) / 1000);\n        break;\n    default:\n        dd.setSeconds(59);\n        result.seconds = Math.ceil((dd.getTime() - date.getTime()) / 1000);\n        result.seconds = 9 * 60 + result.seconds; // 10 minutes\n    }\n    result.text = formatTime(result.seconds);\n    return result;\n}\n\nclass Seed {\n    constructor(date, option, etitle) {\n        this.type = option;\n        switch (option) {\n        case \"hour\" :\n            this.subtitle = \"random\";\n            this.seed = etitle + (date.getTime() & 0xffffffff);\n            break;\n        case \"min\":\n            this.subtitle = \"random\";\n            this.seed = etitle + (date.getTime() & 0xffffffff);\n            break;\n        default:\n            const y = date.getFullYear();\n            const m = date.getMonth() + 1;\n            const d = date.getDate();\n            this.subtitle = formatDate(date);\n            this.seed = etitle + y + m + d;\n            break;\n        }\n        var noko = nokori(date,option);\n        this.nokori = noko.text;\n        this.seconds = noko.seconds;\n        this.time = date.getTime();\n    }\n    finish() {\n        var date = new Date();\n        var diff = Math.ceil((date.getTime() - this.time) / 1000);\n        var timeout = diff >= this.seconds;\n        //console.log(\"seed:\"+this);\n        //console.log(\"diff:\"+diff);\n        //console.log(\"result:\"+result);\n        if (!timeout) {\n            this.seconds = this.seconds - diff;\n        } else {\n            this.seconds = 0;\n        }\n    }\n}\n\n\n//# sourceURL=webpack://wordle/./web/app/puzzle4w.js?");

/***/ }),

/***/ "./web/app/puzzle4wgui.js":
/*!********************************!*\
  !*** ./web/app/puzzle4wgui.js ***!
  \********************************/
/***/ (() => {

eval("\n\nfunction isSmartPhone() {\n  // UserAgentからのスマホ判定\n  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {\n    return true;\n  } else {\n    return false;\n  }\n}\n\nfunction copyButton() {\n    var str = makeClipStr(PUZZLE.title, app.histtry, location.href);\n    if (navigator.clipboard) {\n        navigator.clipboard.writeText(str);\n    }\n}\nfunction success_end() {\n    var kekka = document.getElementById('result');\n    kekka.textContent = 'おめでとうございます'\n    var button = document.getElementById('copy');\n    button.disabled = false;\n    button.hidden = false;\n    app.line++;\n    app.owari = true;\n    PUZZLE.seed.finish();\n    setCookie(PUZZLE.etitle+PUZZLE.seed.type, app, PUZZLE.seed.seconds);\n}\n\nfunction owari() {\n    var kekka = document.getElementById('result');\n    kekka.textContent = 'おしかったですね'\n    var button = document.getElementById('copy');\n    button.disabled = false;\n    button.hidden = false;\n    app.line++;\n    app.owari = true;\n    PUZZLE.seed.finish();\n    setCookie(PUZZLE.etitle+PUZZLE.seed.type, app, PUZZLE.seed.seconds);\n}\n\nfunction backspace(item) {\n    var p = app.line * app.line_size;\n    clear(PUZZLE.histarray, p, app.line_size);\n    if (app.pos == 0) {\n        return;\n    }\n    app.pos--\n    var pos = app.line * app.line_size + app.pos;\n    PUZZLE.histarray[pos].textContent = \"　\";\n}\n\nfunction restoreHistory(app) {\n    const histdiv = document.getElementById('hist');\n    setHistoryGrid(histdiv, app.line_size, PUZZLE.hist_size);\n    var histarray = histdiv.getElementsByTagName('span');\n    const chgmap = {\"m\":\"maru\", \"o\":\"sankaku\", \"x\":\"shikaku\"}\n    for (var line = 0; line < app.line; line++) {\n        for (var p = 0; p < app.line_size; p++) {\n            var pos = line * app.line_size + p;\n            histarray[pos].textContent = app.histstr[line][p];\n            histarray[pos].className = chgmap[app.histtry[line][p]];\n        }\n    }\n}\n\nfunction getdan(str, aiueoar) {\n    var result = \"\";\n    for (var i = 0; i < str.length; i++) {\n        var s = str[i];\n        for (var j = 0; j < aiueoar.length; j++) {\n            if (aiueoar[j].includes(s)) {\n                result = result + aiueoar[j][0];\n            }\n        }\n    }\n    return result;\n}\n\nfunction check_aiueo(instr, answer, aiueoar) {\n    var result = {};\n    result.match = [];\n    result.unmatch = [];\n    var inaiu = getdan(instr, aiueoar);\n    var ansaiu = getdan(answer, aiueoar);\n    for (var i = 0; i < inaiu.length; i++) {\n        var s = inaiu[i];\n        if (ansaiu.includes(s)) {\n            uniqPush(result.match, s);\n        } else {\n            uniqPush(result.unmatch, s);\n        }\n    }\n    return result;\n}\n\nfunction warning(elements, p, len) {\n    for (var i = 0; i < len; i++) {\n        elements[p + i].className = 'warning';\n    }\n}\n\nfunction clear(elements, p, len) {\n    for (var i = 0; i < len; i++) {\n        elements[p + i].className = 'waku';\n    }\n}\n\nfunction aiuenter(item) {\n    var instr = \"\";\n    var p = app.line * app.line_size;\n    for (i = 0; i < app.pos; i++) {\n        instr = instr + PUZZLE.histarray[p + i].textContent;\n    }\n    if (instr.length != PUZZLE.answer.length) {\n        warning(PUZZLE.histarray, p, app.line_size);\n        return;\n    }\n    if (!ANSWER_ARRAY.includes(instr)) {\n        warning(PUZZLE.histarray, p, app.line_size);\n        return;\n    }\n    var result = check_answer(instr, PUZZLE.answer);\n    app.histstr.push(instr);\n    app.histtry.push(result.resstr);\n    const chgmap = {\"m\":\"maru\", \"o\":\"sankaku\", \"x\":\"shikaku\"}\n    for (i = 0; i < app.pos; i++) {\n        PUZZLE.histarray[p + i].className = chgmap[result.resstr[i]];\n    }\n    var candidates = document.getElementById('candidate').\n        getElementsByTagName('span');\n    for (var i = 0; i < candidates.length; i++) {\n        var e = candidates[i];\n        if (result.match.includes(e.textContent)) {\n            e.className = 'maru';\n        } else if (result.hit.includes(e.textContent)) {\n            if (e.className != 'maru') {\n                e.className = 'sankaku';\n            }\n        } else if (result.nomatch.includes(e.textContent)) {\n            e.className = 'shikaku';\n        }\n    }\n    var hinAiu = check_aiueo(instr, PUZZLE.answer, AIUEO);\n    //console.log(hinAiu);\n    var aiueo = document.getElementById('aiueo').\n        getElementsByTagName('span');\n    for (var i = 0; i < aiueo.length; i++) {\n        var e = aiueo[i];\n        //console.log(e.textContent);\n        if (hinAiu.match.includes(e.textContent)) {\n            e.className = 'sankaku';\n        } else if (hinAiu.unmatch.includes(e.textContent)) {\n            e.className = 'shikaku';\n        }\n    }\n    if (allsame(result.resstr, 'm')) {\n        success_end();\n        return;\n    } else if (app.line >= PUZZLE.hist_size -1) {\n        owari();\n        return;\n    }\n    app.line++;\n    app.pos=0\n    setCookie(PUZZLE.etitle+PUZZLE.seed.type, app, PUZZLE.seed.seconds);\n}\n\nfunction enter(item) {\n    var instr = \"\";\n    for (i = 0; i < app.pos; i++) {\n        var p = app.line * app.line_size;\n        instr = instr + PUZZLE.histarray[p + i].textContent;\n    }\n    if (instr.length != PUZZLE.answer.length) {\n        return;\n    }\n    var result = check_answer(instr, PUZZLE.answer);\n    app.histstr.push(instr);\n    app.histtry.push(result.resstr);\n    const chgmap = {\"m\":\"maru\", \"o\":\"sankaku\", \"x\":\"shikaku\"}\n    for (i = 0; i < app.pos; i++) {\n        var p = app.line * app.line_size;\n        PUZZLE.histarray[p + i].className = chgmap[result.resstr[i]];\n    }\n    var candidates = document.getElementById('candidate').\n        getElementsByTagName('span');\n    for (var i = 0; i < candidates.length; i++) {\n        var e = candidates[i];\n        if (result.match.includes(e.textContent)) {\n            e.className = 'maru';\n        } else if (result.hit.includes(e.textContent)) {\n            if (e.className != 'maru') {\n                e.className = 'sankaku';\n            }\n        } else if (result.nomatch.includes(e.textContent)) {\n            e.className = 'shikaku';\n        }\n    }\n    if (allsame(result.resstr, 'm')) {\n        success_end();\n        return;\n    } else if (app.line >= PUZZLE.hist_size -1) {\n        owari();\n        return;\n    }\n    app.line++;\n    app.pos=0\n    setCookie(PUZZLE.etitle+PUZZLE.seed.type, app, PUZZLE.seed.seconds);\n}\n\nfunction hintClick(item) {\n    var inChar = item.textContent;\n    if (app.pos >= app.line_size) {\n        return;\n    }\n    var pos = app.line * app.line_size + app.pos;\n    PUZZLE.histarray[pos].textContent = inChar;\n    app.pos++;\n}\n\nfunction setCookie(title, app, seconds) {\n    var data = JSON.stringify(app);\n    //console.log(data);\n    //console.log('max-age:'+seconds)\n    document.cookie = title + \"=\" + data +';SameSite=Lax;max-age=' + seconds;\n}\n\nfunction getCookie(title) {\n    const cookieArray = new Array();\n    if(document.cookie){\n        const tmp = document.cookie.split('; ');\n        for(let i=0;i<tmp.length;i++){\n            const data = tmp[i].split('=');\n            cookieArray[data[0]] = decodeURIComponent(data[1]);\n        }\n    }\n    const cookie = cookieArray[title];\n    //console.log(cookie);\n    if (!cookie) {\n        return \"\";\n    } else {\n        return cookie;\n    }\n}\n\nfunction getType() {\n    var type = location.search.split('=')[1];\n    console.log('in getType type:'+type);\n    if (type != 'hour' && type != 'min') {\n        type = 'day';\n    }\n    return type;\n}\n\nfunction processCookie(cookie) {\n    //console.log(cookie);\n    app = JSON.parse(cookie);\n    restoreHistory(app);\n    if (app.owari) {\n        app.line = PUZZLE.hist_size;\n        app.pos = app.line_size;\n        var button = document.getElementById('copy');\n        button.disabled = false;\n        button.hidden = false;\n        var kekka = document.getElementById('result');\n        kekka.textContent = \"次のゲームまであと \" + PUZZLE.seed.nokori;\n        var nextgame = document.getElementById('nextgame');\n        nextgame.hidden = false;\n        var candidate = document.getElementById('candidate');\n        candidate.hidden = true;\n    }\n}\n\nfunction init() {\n    var type = getType();\n    console.log('type:'+type);\n    var date = new Date();\n    PUZZLE.seed = new Seed(date, type, PUZZLE.etitle);\n    PUZZLE.title = PUZZLE.jtitle + \" \" + PUZZLE.seed.subtitle;\n    var aiueo = document.getElementById('aiueo');\n    console.log('aiueo:'+aiueo);\n    if (aiueo) {\n        //var ah = makeAiueo(\"あいうえお\");\n        //console.log(ah);\n        //aiueo.innerHTML = ah;\n        setAiueo(aiueo, \"あいうえお\");\n    }\n    var cookie = getCookie(PUZZLE.etitle+type);\n    if (cookie) {\n        processCookie(cookie);\n        if (app.owari) {\n            return;\n        }\n    }\n    var kekka = document.getElementById('result');\n    kekka.textContent = ''\n    var button = document.getElementById('copy');\n    button.disabled = true;\n    button.hidden = true;\n    var nextgame = document.getElementById('nextgame');\n    nextgame.hidden = true;\n\n    var rand = new TinyMTJS(PUZZLE.seed.seed);\n    var histdiv = document.getElementById('hist');\n    PUZZLE.histarray = histdiv.getElementsByTagName('span');\n    app.histtry = [];\n    app.histstr = [];\n    app.line = 0;\n    app.pos = 0;\n    app.owari = false;\n    PUZZLE.answer = ANSWER_ARRAY[rand.getInt(ANSWER_ARRAY.length)];\n    app.line_size = PUZZLE.answer.length\n    //var hs = makeHistorySpan(app.line_size, PUZZLE.hist_size);\n    //histdiv.innerHTML = hs;\n    setHistoryGrid(histdiv, app.line_size, PUZZLE.hist_size);\n    var candidate = document.getElementById('candidate');\n    //var sps = \"\";\n    if (PUZZLE.fixedHint) {\n        var hint_arr = ANSWER_ALL_KANJI.split(\"\");\n        //sps = makeHintSpan(hint_arr, PUZZLE.hint_width,\n        //                   'hintClick', PUZZLE.vline);\n        //candidate.innerHTML= sps;\n        setHintGrid(candidate, hint_arr, PUZZLE.hint_width, 'hintClick',\n                   PUZZLE.vline);\n    } else {\n        var hint_arr = getHintArray(PUZZLE.answer,\n                                ANSWER_ARRAY,\n                                ANSWER_ALL_KANJI,\n                                PUZZLE.dificulity,\n                                PUZZLE.hint_size,\n                                rand);\n        //sps = makeHintSpan(hint_arr, PUZZLE.hint_width, 'hintClick');\n        //candidate.innerHTML= sps;\n        setHintGrid(candidate, hint_arr, PUZZLE.hint_width, 'hintClick');\n    }\n\n}\n\n\n//# sourceURL=webpack://wordle/./web/app/puzzle4wgui.js?");

/***/ }),

/***/ "./web/app/tinymtjs.js":
/*!*****************************!*\
  !*** ./web/app/tinymtjs.js ***!
  \*****************************/
/***/ (() => {

eval("/**\n * @file tinymtjs.js\n *\n * @brief Tiny Mersenne Twister for Java Script.\n * Intitialization functions are modified to fit Javascript numbers.\n *\n * Originai authors:\n * @author Mutsuo Saito (Hiroshima University)\n * @author Makoto Matsumoto (The University of Tokyo)\n *\n * Copyright (C) 2011 Mutsuo Saito, Makoto Matsumoto,\n * Hiroshima University and The University of Tokyo.\n * All rights reserved.\n *\n * modified by\n * @author Taro Suginami\n * Copyright (C) 2022 Taro Suginami.\n * All rights reserved.\n *\n * original program is TinyMT32.java\n * http://www.math.sci.hiroshima-u.ac.jp/m-mat/MT/TINYMT/JAVA/index.html\n *\n * parameters, (mat1, mat2, tmat) are taken from\n * http://www.math.sci.hiroshima-u.ac.jp/m-mat/MT/TINYMT/DATA/index.html\n * tinymt32dc.0-4.65536.tar.gz\n * tinymt32dc.0.65536.txt\n * last line\n * ab5a14fcfae73ebad2addf92bef887b1,32,0,e99e1d33,42f090bd,ac3ff3ff,77,0\n *\n */\n/*\nCopyright (c) 2011, 2013 Mutsuo Saito, Makoto Matsumoto,\nHiroshima University and The University of Tokyo.\nAll rights reserved.\nCopyright (C) 2022 Taro Suginami.\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are\nmet:\n\n    * Redistributions of source code must retain the above copyright\n      notice, this list of conditions and the following disclaimer.\n    * Redistributions in binary form must reproduce the above\n      copyright notice, this list of conditions and the following\n      disclaimer in the documentation and/or other materials provided\n      with the distribution.\n    * Neither the name of the Hiroshima University nor the names of\n      its contributors may be used to endorse or promote products\n      derived from this software without specific prior written\n      permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n\"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\nLIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\nA PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\nOWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\nSPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\nLIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\nDATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\nTHEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\n\nconst MMMM    = 0xffffffff;\nconst UNSMASK = 0x7fffffff;\nconst MIN_LOOP = 8;\nconst MASK = 0x7fffffff;\nconst MAT1 = 0xe99e1d33;\nconst MAT2 = 0x42f090bd;\nconst TMAT = 0xac3ff3ff;\nconst SH0 = 1;\nconst SH1 = 10;\nconst SH8 = 8;\n\nfunction ini_func1JS(x) {\n    x = (x ^ (x >>> 27) ^ (x << 19)) & UNSMASK;\n    return (x * 26125) & MMMM;\n}\nfunction ini_func2JS(x) {\n    x = (x ^ (x >>> 27) ^ (x << 19)) & UNSMASK;\n    return (x * 559973) & MMMM;\n}\n\nclass TinyMTJS {\n    constructor(seed) {\n        this.st0 = 0;\n        this.st1 = 0;\n        this.st2 = 0;\n        this.st3 = 0;\n        this.setSeed(seed);\n    }\n    setSeed(seed) {\n        if (typeof seed === 'string' || seed instanceof String) {\n            var aseed = seed.split('').map((v) => v.charCodeAt());\n            this.setSeedArray(aseed);\n        } else if (Array.isArray(seed)) {\n            this.setSeedArray(seed);\n        } else {\n            this.setSeedNumber(seed);\n        }\n    }\n    // Seeding for Java Script, modified by Taro Suginami\n    // private\n    setSeedNumber(seed) {\n        var status = Array(4);\n        status[0] = seed & MMMM;\n        status[1] = MAT1;\n        status[2] = MAT2;\n        status[3] = TMAT;\n        for (var i = 1; i < MIN_LOOP; i++) {\n            var x = status[(i - 1) & 3];\n            x = x ^ (x >>> 30) ^ (x << 17);\n            status[i & 3] ^= i + 30157 * (x & UNSMASK);\n        }\n        this.st0 = status[0];\n        this.st1 = status[1];\n        this.st2 = status[2];\n        this.st3 = status[3];\n        if (((this.st0 & MASK) == 0) &&\n            (this.st1 == 0) &&\n            (this.st2 == 0) &&\n            (this.st3 == 0)) {\n            this.st0 = 'T'.charCodeAt(0);\n            this.st1 = 'I'.charCodeAt(0);\n            this.st2 = 'N'.charCodeAt(0);\n            this.st3 = 'Y'.charCodeAt(0);\n        }\n        for (var i = 0; i < MIN_LOOP; i++) {\n            this.next();\n        }\n    }\n    // Seeding for Java Script, modified by Taro Suginami\n    // private\n    setSeedArray(init_key) {\n        if (!Array.isArray(init_key)) {\n            throw new Error('TinyMTJS.setSeedArray: Seed type mismatch.');\n        }\n        const lag = 1;\n        const mid = 1;\n        const size = 4;\n        var i;\n        var j;\n        var count;\n        var r;\n        var status = Array(4);\n        var key_length;\n\n        key_length = init_key.length;\n        status[0] = 0;\n        status[1] = MAT1;\n        status[2] = MAT2;\n        status[3] = TMAT;\n        if (key_length + 1 > MIN_LOOP) {\n            count = key_length + 1;\n        } else {\n            count = MIN_LOOP;\n        }\n        r = ini_func1JS(status[0] ^ status[mid % size]\n                        ^ status[(size - 1) % size]);\n        status[mid % size] = (status[mid % size] + r) & MMMM;\n        r = (r + key_length);// & UNSMASK;\n        status[(mid + lag) % size] = (status[(mid + lag) % size] + r) & MMMM;\n        status[0] = r;\n        count--;\n        for (i = 1, j = 0; (j < count) && (key_length > 0); j++) {\n            r = ini_func1JS(status[i % size]\n                            ^ status[(i + mid) % size]\n                            ^ status[(i + size - 1) % size]);\n            status[(i + mid) % size] = (status[(i + mid) % size] + r) & MMMM;\n            r = (r + init_key[j % key_length] + i) & MMMM;\n            status[(i + mid + lag) % size] =\n                (status[(i + mid + lag) % size] + r) & MMMM;\n            status[i % size] = r;\n            i = (i + 1) % size;\n        }\n        for (j = 0; j < size; j++) {\n            r = ini_func2JS(status[i % size]\n                            + status[(i + mid) % size]\n                            + status[(i + size - 1) % size]);\n            status[(i + mid) % size] ^= r;\n            r -= i;\n            status[(i + mid + lag) % size] ^= r;\n            status[i % size] = r;\n            i = (i + 1) % size;\n        }\n        this.st0 = status[0];\n        this.st1 = status[1];\n        this.st2 = status[2];\n        this.st3 = status[3];\n        if (((this.st0 & MASK) == 0) &&\n            (this.st1 == 0) &&\n            (this.st2 == 0) &&\n            (this.st3 == 0)) {\n            this.st0 = 'T'.charCodeAt(0);\n            this.st1 = 'I'.charCodeAt(0);\n            this.st2 = 'N'.charCodeAt(0);\n            this.st3 = 'Y'.charCodeAt(0);\n        }\n        for (var i = 0; i < MIN_LOOP; i++) {\n            this.next();\n        }\n    }\n\n    getInt31() {\n        var v = this.next();\n        return v >>> 1;\n    }\n\n    getDouble31() {\n        return (this.getInt31() * 1.0) / 0x80000000;// 31bit int to double\n    }\n\n    getInt(max) {\n        return Math.floor(this.getDouble31() * max);\n    }\n\n    next() {\n        var y = this.st3;\n        var x = (this.st0 & MASK) ^ this.st1 ^ this.st2;\n        x ^= (x << SH0) & MMMM;\n        y ^= (y >>> SH0) ^ x;\n        this.st0 = this.st1;\n        this.st1 = this.st2;\n        this.st2 = x ^ ((y << SH1) & MMMM);\n        this.st3 = y;\n        if ((y & 1) == 1) {\n            this.st1 ^= MAT1;\n            this.st2 ^= MAT2;\n        }\n        var t0 = this.st3;\n        var t1 = (this.st0 + (this.st2 >>> SH8)) & MMMM;\n        t0 ^= t1;\n        if ((t1 & 1) == 1) {\n            t0 ^= TMAT;\n        }\n        return t0;\n    }\n}\n\n//module.exports = TinyMTJS;\n\n\n//# sourceURL=webpack://wordle/./web/app/tinymtjs.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_modules__["./web/app/tinymtjs.js"]();
/******/ 	__webpack_modules__["./web/app/puzzle4w.js"]();
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./web/app/puzzle4wgui.js"]();
/******/ 	
/******/ })()
;