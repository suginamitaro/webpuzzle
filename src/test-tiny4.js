const TinyMT = require('./tinymt');

var tiny = new TinyMT([1234]);
console.log('new TinyMT([1234])');
for (var i = 0; i < 10; i++) {
    console.log(tiny.getDouble31());
}
tiny.setSeed(9);
console.log('tiny.setSeed(9)');
for (var i = 0; i < 10; i++) {
    console.log(tiny.getDouble31());
}
tiny.setSeedArray('seed');
console.log("tiny.setSeedArray('seed')");
for (var i = 0; i < 10; i++) {
    console.log(tiny.getDouble31());
}
tiny.setSeedArray([]);
console.log('tiny.setSeedArray([])');
for (var i = 0; i < 10; i++) {
    console.log(tiny.getDouble31());
}
tiny.setSeedArray(['abc']);// not NG
console.log("tiny.setSeedArray(['abc'])");
for (var i = 0; i < 10; i++) {
    console.log(tiny.getDouble31());
}
