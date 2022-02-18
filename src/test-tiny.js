const {format} = require('util')
const TinyMT = require('./tinymt');

var tiny = new TinyMT(1);
console.log("31-bit unsigned integers r, where 0 <= r < 2^31");
for (var i = 0; i < 20; i++) {
    console.log(format("%d", tiny.getInt31()));
}
console.log("31-bit double r, where 0 <= r < 1.0");
for (var i = 0; i < 20; i++) {
    console.log(format("%f", tiny.getDouble31().toPrecision(10)));
}
console.log("int r, where 0 <= r < 100");
for (var i = 0; i < 20; i++) {
    console.log(format("%d", tiny.getInt(100)));
}
