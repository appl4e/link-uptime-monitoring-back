const environmentVariable = require("./environments");
const crypto = require("crypto");

const utilities = {};

utilities.parseJson = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

utilities.hashString = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environmentVariable.hashSecretKey)
      .update("")
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

utilities.createRandomStr = (strLength) => {
  let length = typeof strLength == "number" && strLength > 0 ? strLength : 0;
  if (length) {
    const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 0; i < length; i++) {
      const randomCharacter = characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      output += randomCharacter;
    }

    return output;
  }
};

module.exports = utilities;
