"use strict";
exports.__esModule = true;
var fs = require("fs");
function main() {
    var data = readData();
    var cleanedData = cleanData(data);
    console.log(cleanedData.length);
}
function readData() {
    return fs.readFileSync("./alastalon_salissa.txt", "utf8");
}
function cleanData(data) {
    return data.match(/\S+/g) || [];
}
main();
