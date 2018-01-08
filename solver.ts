import * as fs from "fs";
import * as _ from "lodash";

function main() {
  const data = readData();
  const cleanedData = cleanData(data);
  const groupedData = _.groupBy(cleanedData, word => _.size(word) + 1);
  const sized = _.mapValues(groupedData, value => value.length);
  console.log(sized);
}

function readData(): string {
  return fs.readFileSync("./alastalon_salissa.txt", "utf8");
}

function cleanData(data: string): string[] {
  return data.match(/\S+/g) || [];
}

main();