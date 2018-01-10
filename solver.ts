import * as fs from "fs";
import * as _ from "lodash";

// We preprocess all the words to have length of word_length + 1 to
// accommodate for spaces - this mkes each line (called bin because of the
// bin packing problem) 81 characters long (last character can be thought
// of as newline)
const BIN_SIZE = 81;

function main() {
  const args = process.argv;
  if (args.length < 4) {
    console.log("Usage: npm run solve [source data file path] [result file path] [optional: show_progress]");
    return 1;
  }
  const sourcePath = args[2];
  const resultPath = args[3];
  const showProgress = args[4] && args[4] === "show_progress";
  const data = readData(sourcePath);
  const cleanedData = cleanData(data);
  const packed = bestFitDecreasing(cleanedData, BIN_SIZE, showProgress);
  writeFile(packed, resultPath);
  return 0;
}

interface SpaceIndex {
  index: number;
  spaceLeft: number;
}

function bestFitDecreasing(items: string[], binSize: number, showProgress: boolean): string[][] {
  const spacesAddedItems = _.map(items, item => item += " ");
  const sortedDescending = _.sortBy(spacesAddedItems, word => -1 * word.length);
  let bins: string[][] = [];
  _.forEach(sortedDescending, (item, itemIndex) => {
    let spaceIndex: SpaceIndex = { index: -1, spaceLeft: binSize };
    _.forEach(bins, (bin, binIndex) => {
      const remainingSpace = binSize - getBinSize(bin);
      if (remainingSpace >= item.length && remainingSpace - item.length <= spaceIndex.spaceLeft) {
        spaceIndex = { index: binIndex, spaceLeft: remainingSpace - item.length};
      }
      if (spaceIndex.spaceLeft === 0) {
        return false;
      }
    });
    if (spaceIndex.index > -1) {
      bins[spaceIndex.index] = _.concat(bins[spaceIndex.index], item);
    } else {
      bins.push([item]);
    }
    if (!(itemIndex % 5000) && showProgress) console.log(itemIndex + 1 + " words processed");
  });
  return bins;
}

function calculateWastedSpace(items: string[], binSize: number, showProgress: boolean) {

}

function getBinSize(bin: string[]): number {
  return _.sum(_.map(bin, word => word.length));
}

function readData(path: string): string {
  return fs.readFileSync(path, "utf8");
}

function writeFile(bins: string[][], path: string) {
  const binsCombined = _.map(bins, bin => _.join(bin, "").slice(0, -1));
  fs.writeFile(path, _.join(binsCombined, "\n"), (err) => console.log(err));
}

function cleanData(data: string): string[] {
  return data.match(/\S+/g) || [];
}

main();