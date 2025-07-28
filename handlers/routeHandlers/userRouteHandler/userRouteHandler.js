const handler = {};

handler.userRouteHandler = (reqResProperties, callback) => {
  console.log(reqResProperties);
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(reqResProperties.method) > -1) {
    handler._users[reqResProperties.method](reqResProperties, callback);
  } else {
    callback(405, { message: "The method is not allowed" });
  }
  callback(200, { message: "This the user route handler" });
};

handler._users = {};

handler._users.post = (reqResProperties, callback) => {};
handler._users.put = (reqResProperties, callback) => {};
handler._users.get = (reqResProperties, callback) => {
  callback(200, { message: "this is get users api" });
};
handler._users.delete = (reqResProperties, callback) => {};

module.exports = handler;
