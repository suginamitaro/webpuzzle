const AIUEO = ["あかさたなはまやらわがざだば",
               "いきしちにひみりぎじぢび",
               "うくすつぬふむゆるぐずづぶ",
               "えけせてねへめれげぜでべ",
               "おこそとのほもよろをごぞどぼ"];

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

console.log(getdan("ぎ", AIUEO));
console.log(check_aiueo("ぎあのふ", "ききおえ", AIUEO));
