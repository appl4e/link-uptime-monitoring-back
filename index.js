const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environmentVariable = require("./helpers/environments");
const { create } = require("./lib/data");

const app = {};

// app.config = {
//   port: environmentVariable.port,
// };

// testing file creation
create(
  "test",
  "text",
  { name: "Apple Mahmood", phone: "01678116782", email: "appl4e@gmail.com" },
  (error) => {
    console.log(error);
  }
);

app.createServer = () => {
  const server = http.createServer(app.handleRequestResponse);
  server.listen({ port: environmentVariable.port, host: "localhost" }, () => {
    console.log("listening to port " + environmentVariable.port);
  });
};
app.handleRequestResponse = handleReqRes;

app.createServer();
