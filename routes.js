const {
  sampleRouteHandler,
} = require("./handlers/routeHandlers/sampleRouteHandler/sampleRouteHandler");

const {
  userRouteHandler,
} = require("./handlers/routeHandlers/userRouteHandler/userRouteHandler");

const routes = {
  sample: sampleRouteHandler,
  user: userRouteHandler,
};

module.exports = routes;
