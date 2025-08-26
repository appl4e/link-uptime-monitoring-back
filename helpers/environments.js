const environment = {};

environment.staging = {
  port: "3000",
  environment: "staging",
  hashSecretKey: "lkjsadklfjdslkfjkljdfskl",
  maxChecks: 5,
};

environment.production = {
  port: "5000",
  environment: "production",
  hashSecretKey: "lkjsadklfjdslkfjkljdfskl",
  maxChecks: 5,
};

const chosenEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

const environmentVariable =
  typeof environment[chosenEnvironment] === "object"
    ? environment[chosenEnvironment]
    : environment.staging;

module.exports = environmentVariable;
