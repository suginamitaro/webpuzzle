const polymodule = require('./polynomial');
const kzmodule = require('./kz');
const sosumd = require('./sosu');
const Polynomial = polymodule.Polynomial;
const PolynomialMP = polymodule.PolynomialMP;
const KZ = kzmodule.KZ;
const Sosu = sosumd.Sosu;

const MAX_K = 1000;
var app = {};
app.poly = '';

function dispButton() {
    const primeStr = document.getElementById('prime').value.trim();
    const indet = document.getElementById('indet').value.trim();
    const keisu = document.getElementById('keisu').value.trim();
    const sp = document.getElementById('disppoly');
    const prime = parseInt(primeStr, 10);
    if (prime == 2 || prime > 100) {
        sp.textContent = '3以上100以下の素数にしてください';
        return;
    }
    if (!Sosu.getPrimes().includes(prime)) {
        sp.textContent = '3以上100以下の素数にしてください';
        return;
    }
    if (keisu.match(/[0-9]*[a-zA-Z]/)) {
        app.poly = PolynomialMP.fromString2(keisu, prime);
    } else {
        const array = keisu.split(/ +/).map(x => parseInt(x,10));
        if (array.length > 0) {
            app.poly = new PolynomialMP(indet[0], array.reverse(), prime);
        }
    }
    var str = app.poly.toString(true, false);
    str = str.replaceAll(/\^([0-9]+)/g, "<sup>$1</sup>");
    sp.innerHTML = str;
}

function fzButton() {
    if (app.poly instanceof PolynomialMP) {
        // const kz = new KZ(app.poly);
        var fac = KZ.factorizeModP(app.poly);
        var str = KZ.factorToString(fac, true);
        str = str.replaceAll(/\^([0-9]+)/g, "<sup>$1</sup>");
        const sp = document.getElementById('result');
        sp.innerHTML = str;
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
    const disp = document.getElementById('disp');
    const factorize = document.getElementById('factorize');
    disp.onclick = dispButton;
    factorize.onclick = fzButton;
}

function init(prarray, prtype) {
    processDark();
    setOnClick();
}

window.onload = init;
