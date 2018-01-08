import * as fs from "fs";
import * as _ from "lodash";

function main() {
  const data = readData();
  const cleanedData = cleanData(data);
  console.log(cleanedData.length);
}

function readData(): string {
  return fs.readFileSync("./alastalon_salissa.txt", "utf8");
}

function cleanData(data: string): string[] {
  return data.match(/\S+/g) || [];
}

main();