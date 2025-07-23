const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environmentVariable = require("./helpers/environments");

const app = {};

// app.config = {
//   port: environmentVariable.port,
// };

app.createServer = () => {
  const server = http.createServer(app.handleRequestResponse);
  server.listen({ port: environmentVariable.port, host: "localhost" }, () => {
    console.log("listening to port " + environmentVariable.port);
  });
};
app.handleRequestResponse = handleReqRes;

app.createServer();
