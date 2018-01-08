"use strict";
exports.__esModule = true;
var fs = require("fs");
var _ = require("lodash");
// We preprocess all the words to have length of word_length + 1 to
// accommodate for spaces - this mkes each line (called bin because of the
// bin packing problem) 81 characters long (last character can be thought
// of as newline)
var BIN_SIZE = 81;
function main() {
    var data = readData();
    var cleanedData = cleanData(data);
    var packed = bestFitDecreasing(cleanedData, BIN_SIZE);
    writeFile(packed);
}
function bestFitDecreasing(items, binSize) {
    var spacesAddedItems = _.map(items, function (item) { return item += " "; });
    var sortedDescending = _.sortBy(spacesAddedItems, function (word) { return -1 * word.length; });
    var bins = [];
    _.forEach(sortedDescending, function (item) {
        var spaceIndex = { index: -1, spaceLeft: binSize };
        _.forEach(bins, function (bin, binIndex) {
            var remainingSpace = binSize - getBinSize(bin);
            if (remainingSpace > item.length && remainingSpace - item.length < spaceIndex.spaceLeft) {
                spaceIndex = { index: binIndex, spaceLeft: remainingSpace - item.length };
            }
        });
        if (spaceIndex.index > -1) {
            bins[spaceIndex.index] = _.concat(bins[spaceIndex.index], item);
        }
        else {
            bins.push([item]);
        }
    });
    return bins;
}
function getBinSize(bin) {
    return _.sum(_.map(bin, function (word) { return word.length; }));
}
function readData() {
    return fs.readFileSync("./test_file.txt", "utf8");
    // return fs.readFileSync("./alastalon_salissa.txt", "utf8");
}
function writeFile(bins) {
    var binsCombined = _.map(bins, function (bin) { return _.join(bin, "").slice(0, -1); });
    fs.writeFile("./result.txt", _.join(binsCombined, "\n"), function (err) { return console.log(err); });
}
function cleanData(data) {
    return data.match(/\S+/g) || [];
}
main();
