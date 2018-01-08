"use strict";
exports.__esModule = true;
var fs = require("fs");
var _ = require("lodash");
function main() {
    var data = readData();
    var cleanedData = cleanData(data);
    var groupedData = _.groupBy(cleanedData, function (word) { return _.size(word) + 1; });
    var sized = _.mapValues(groupedData, function (value) { return value.length; });
    console.log(sized);
}
function readData() {
    return fs.readFileSync("./alastalon_salissa.txt", "utf8");
}
function cleanData(data) {
    return data.match(/\S+/g) || [];
}
main();
