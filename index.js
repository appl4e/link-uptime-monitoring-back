const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");

const app = {};

app.config = {
  port: 3000,
};

app.createServer = () => {
  const server = http.createServer(app.handleRequestResponse);
  server.listen({ port: app.config.port, host: "localhost" }, () => {
    console.log("listening to port " + app.config.port);
  });
};
app.handleRequestResponse = handleReqRes;

app.createServer();
