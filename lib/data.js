const fs = require("fs");
const path = require("path");

const lib = {};

lib.baseDir = path.join(__dirname + "./../.data/");

lib.create = function (dir, file, data, callback) {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (openError, fileDescriptor) => {
      if (!openError && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, stringData, "utf8", (writeError) => {
          if (!writeError) {
            fs.close(fileDescriptor, (closeError) => {
              callback("There was an error closing the file.");
              console.log(closeError);
            });
          } else {
            callback("There was an error writing in the file.");
            console.log(writeError);
          }
        });
      } else {
        callback("An error occurred when opening the file.");
        console.log(openError);
      }
    }
  );
};

module.exports = lib;
