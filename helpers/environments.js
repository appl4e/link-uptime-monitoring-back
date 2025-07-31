const environment = {};

environment.staging = {
  port: "3000",
  environment: "staging",
  hashSecretKey: "lkjsadklfjdslkfjkljdfskl",
};

environment.production = {
  port: "5000",
  environment: "production",
  hashSecretKey: "lkjsadklfjdslkfjkljdfskl",
};

const chosenEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

const environmentVariable =
  typeof environment[chosenEnvironment] === "object"
    ? environment[chosenEnvironment]
    : environment.staging;

module.exports = environmentVariable;
