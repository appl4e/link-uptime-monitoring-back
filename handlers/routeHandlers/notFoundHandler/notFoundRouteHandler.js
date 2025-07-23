const handler = {};
handler.notFoundHandler = (reqResObj, callback) => {
  callback(404, {
    message: "The requested url not found",
  });
  console.log("Not Found");
};
module.exports = handler;
