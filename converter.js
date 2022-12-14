// reading csv file
const fs = require("fs");
csvFile = fs.readFileSync("./inputFile.csv");
const givenData = csvFile.toString().split("\r\n");
var n = givenData.length;

var headers = givenData[0].split(",");
var m = headers.length;
for (let i = 0; i < m; i++) {
  headers[i] = headers[i].split(".");
}

// custom function to check whether the value is boolen
function isBoolean(x) {
  if (x == "true" || x == "false") return true;
  return false;
}

// recursive function which generates JSON object
function getObject(entry, ind, L, R) {
  var curObj = {};
  let l = L;
  while (l <= R) {
    if (ind >= headers[l].length) {
      l++;
    } else {
      let r = l;
      while (
        r <= R &&
        ind < headers[r].length &&
        headers[l][ind].trim() == headers[r][ind].trim()
      )
        r++;
      if (r - l == 1) {
        var data = entry[l].trim();
        curObj[headers[l][ind].trim()] = isNaN(data)
          ? isBoolean(data)
            ? data == "true"
              ? true
              : false
            : data
          : parseInt(data);
      } else {
        curObj[headers[l][ind].trim()] = getObject(entry, ind + 1, l, r - 1);
      }
      l = r;
    }
  }
  return curObj;
}

// main loop which calls the recusrive function (getObject()) to convert each CSV entry into JSON format
var jsonObjects = [];
for (let i = 1; i < n; i++) {
  const entry = givenData[i].split(",");
  var m = entry.length;
  var object = getObject(entry, 0, 0, m - 1);
  jsonObjects.push(object);
}

// saving JSON array of all entries in outputFile.txt
fs.writeFile("./outputFile.txt", JSON.stringify(jsonObjects), function (err) {
  if (err) throw err;
  console.log(
    "Inputted CSV file is converted to JSON and saved in outputFile.txt!"
  );
});
