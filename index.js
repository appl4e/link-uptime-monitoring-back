const http = require("http");
const url = require("url");

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
app.handleRequestResponse = (req, res) => {
  console.log(url.parse(req.url, true));
  console.log(req);
  res.end("Hello World");
};

app.createServer();
