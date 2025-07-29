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

handler._users.post = (reqResProperties, callback) => {
  const firstName =
    typeof reqResProperties.body.firstName === "string" &&
    reqResProperties.body.firstName.trim().length > 0
      ? reqResProperties.body.firstName
      : false;

  const lastName =
    typeof reqResProperties.body.lastName === "string" &&
    reqResProperties.body.lastName.trim().length > 0
      ? reqResProperties.body.lastName
      : false;

  const email =
    typeof reqResProperties.body.email === "string" &&
    reqResProperties.body.email.trim().length > 0
      ? reqResProperties.body.email
      : false;

  const phone =
    typeof reqResProperties.body.phone === "string" &&
    reqResProperties.body.phone.trim().length == 11
      ? reqResProperties.body.phone
      : false;

  const password =
    typeof reqResProperties.body.password === "string" &&
    reqResProperties.body.password.trim().length == 11
      ? reqResProperties.body.password
      : false;

  const tosAgreement =
    typeof reqResProperties.body.tosAgreement === "string" &&
    reqResProperties.body.tosAgreement.trim().length == 11
      ? reqResProperties.body.tosAgreement
      : false;
};
handler._users.put = (reqResProperties, callback) => {};
handler._users.get = (reqResProperties, callback) => {
  callback(200, { message: "this is get users api" });
};
handler._users.delete = (reqResProperties, callback) => {};

module.exports = handler;
