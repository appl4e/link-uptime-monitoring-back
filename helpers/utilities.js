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
  return "kljfkljfskfjjkl";
};

module.exports = utilities;
