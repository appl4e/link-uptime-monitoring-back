const handler = {};

handler.sampleRouteHandler = (reqResProperties, callback) => {
  console.log(reqResProperties);
  callback(200, {
    message: "Sample route found",
  });
  // console.log("Sample Route");
};

module.exports = handler;
