const data = require("../../../lib/data");
const { parseJson, hashString } = require("../../../helpers/utilities");

const handler = {};

handler.userRouteHandler = (reqResProperties, callback) => {
  console.log(reqResProperties);
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(reqResProperties.method) > -1) {
    handler._users[reqResProperties.method](reqResProperties, callback);
  } else {
    callback(405, { message: "The method is not allowed" });
  }
  // callback(200, { message: "This the user route handler" });
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
    reqResProperties.body.password.trim().length > 0
      ? reqResProperties.body.password
      : false;

  const tosAgreement =
    typeof reqResProperties.body.tosAgreement === "boolean"
      ? reqResProperties.body.tosAgreement
      : false;

  if (firstName && lastName && email && phone && password && tosAgreement) {
    data.read("users", phone, (readError) => {
      if (readError) {
        const body = {
          firstName,
          lastName,
          email,
          phone,
          password: hashString(password),
          tosAgreement,
        };
        data.create("users", phone, body, (createError) => {
          if (!createError) {
            callback(200, { message: "User has been created successfully." });
          } else {
            callback(500, {
              message: "There was a server error creating user.",
            });
            console.log(createError);
          }
        });
      } else {
        callback(400, { error: "user with this phone number already exists." });
      }
    });
  } else {
    callback(422, { error: "User data validation Error" });
  }
};
handler._users.put = (reqResProperties, callback) => {};
handler._users.get = (reqResProperties, callback) => {
  const phone =
    typeof reqResProperties.queryStringObject.phone === "string" &&
    reqResProperties.queryStringObject.phone.trim().length == 11
      ? reqResProperties.queryStringObject.phone
      : false;
  if (phone) {
    data.read("users", phone, (readError, data) => {
      if (!readError && !!data) {
        const userData = parseJson(data);
        callback(200, userData);
      } else {
        callback(404, {
          error: "User with this phone number cannot be found?",
        });
      }
    });
  } else {
    callback(404, { error: "user data with this query is not found." });
  }
};
handler._users.delete = (reqResProperties, callback) => {};

module.exports = handler;
