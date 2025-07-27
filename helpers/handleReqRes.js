const url = require("url");
const { StringDecoder } = require("string_decoder");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler/notFoundRouteHandler");
const routes = require("../routes");

const handler = {};
handler.handleReqRes = (req, res) => {
  console.log(url.parse(req.url, true));
  const parsedUrl = url.parse(req.url, true);
  const rawPath = parsedUrl.pathname;
  const path = rawPath.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headerObject = req.headers;

  const reqResObj = {
    parsedUrl,
    path,
    method,
    queryStringObject,
    headerObject,
  };

  const chosenHandler = routes[path] || notFoundHandler;

  const decoder = new StringDecoder();
  let realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  // res.end("Hello World");
  req.on("end", () => {
    realData += decoder.end();

    chosenHandler(reqResObj, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload == "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
    // res.end(realData);
  });
};

module.exports = handler;
