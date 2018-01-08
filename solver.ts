import * as fs from "fs";
import * as _ from "lodash";

// We preprocess all the words to have length of word_length + 1 to
// accommodate for spaces - this mkes each line (called bin because of the
// bin packing problem) 81 characters long (last character can be thought
// of as newline)
const BIN_SIZE = 81;

function main() {
  const data = readData();
  const cleanedData = cleanData(data);
  const packed = bestFitDecreasing(cleanedData, BIN_SIZE);
  writeFile(packed);
}

interface SpaceIndex {
  index: number;
  spaceLeft: number;
}

function bestFitDecreasing(items: string[], binSize: number): string[][] {
  const spacesAddedItems = _.map(items, item => item += " ");
  const sortedDescending = _.sortBy(spacesAddedItems, word => -1 * word.length);
  let bins: string[][] = [];
  _.forEach(sortedDescending, item => {
    let spaceIndex: SpaceIndex = { index: -1, spaceLeft: binSize };
    _.forEach(bins, (bin, binIndex) => {
      const remainingSpace = binSize - getBinSize(bin);
      if (remainingSpace > item.length && remainingSpace - item.length < spaceIndex.spaceLeft) {
        spaceIndex = { index: binIndex, spaceLeft: remainingSpace - item.length};
      }
    });
    if (spaceIndex.index > -1) {
      bins[spaceIndex.index] = _.concat(bins[spaceIndex.index], item);
    } else {
      bins.push([item]);
    }
  });
  return bins;
}

function getBinSize(bin: string[]): number {
  return _.sum(_.map(bin, word => word.length));
}

function readData(): string {
  // return fs.readFileSync("./test_file.txt", "utf8");
  return fs.readFileSync("./alastalon_salissa.txt", "utf8");
}

function writeFile(bins: string[][]) {
  const binsCombined = _.map(bins, bin => _.join(bin, "").slice(0, -1));
  fs.writeFile("./result.txt", _.join(binsCombined, "\n"), (err) => console.log(err));
}

function cleanData(data: string): string[] {
  return data.match(/\S+/g) || [];
}

main();