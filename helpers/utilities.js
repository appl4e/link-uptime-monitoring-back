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

module.exports = utilities;
