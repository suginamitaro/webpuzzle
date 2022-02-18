const TinyMT = require('./tinymt');

var tiny = new TinyMT(1234);
var ok = true;
for (var i = 0; i < 0x70000000; i++) {
    var x = tiny.getDouble31();
    if (x >= 1.0) {
        console.log("NG");
        ok = false;
        break;
    }
}
if (ok) {
    console.log("OK");
}
