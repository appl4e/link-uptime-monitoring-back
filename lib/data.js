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
              if (closeError) {
                callback("There was an error closing the file.");
                console.log(closeError);
              } else {
                callback(false);
              }
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

lib.read = function (dir, file, callback) {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    "utf8",
    (err, content) => {
      callback(err, content);
    }
  );
};

lib.update = function (dir, file, data, callback) {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "w+",
    (openError, fileDescriptor) => {
      if (!openError && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.ftruncate(fileDescriptor, (truncateError) => {
          if (!truncateError) {
            fs.writeFile(fileDescriptor, stringData, "utf8", (writeError) => {
              if (!writeError) {
                fs.close(fileDescriptor, (closeError) => {
                  if (closeError) {
                    callback("There was an error closing the file");
                  }
                });
              } else {
                callback("There was an error writing in the file.");
              }
            });
          } else {
            callback("There was an error truncating the file.");
          }
        });
      } else {
        console.log(path.join(lib.baseDir + dir + "/" + file + ".json"));

        console.log(openError);
        callback("There was an error opening the file");
      }
    }
  );
};

lib.remove = function (dir, file, callback) {
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("There was an error deleting file");
    }
  });
};

module.exports = lib;
