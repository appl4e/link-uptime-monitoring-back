const {
  sampleRouteHandler,
} = require("./handlers/routeHandlers/sampleRouteHandler/sampleRouteHandler");
const {
  tokenRouteHandler,
} = require("./handlers/routeHandlers/tokenRouteHandler/tokenRouteHandler");

const {
  userRouteHandler,
} = require("./handlers/routeHandlers/userRouteHandler/userRouteHandler");

const {
  checkRouteHandler,
} = require("./handlers/routeHandlers/checkRouteHandler/checkRouteHandler");

const routes = {
  sample: sampleRouteHandler,
  user: userRouteHandler,
  token: tokenRouteHandler,
  check: checkRouteHandler,
};

module.exports = routes;
