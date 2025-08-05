const {
  createRandomStr,
  parseJson,
  hashString,
} = require("../../../helpers/utilities");
const data = require("../../../lib/data");
const handler = {};

handler.tokenRouteHandler = (resReqProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];

  if (acceptedMethod.indexOf(resReqProperties.method) > -1) {
    handler._tokens[resReqProperties.method](resReqProperties, callback);
  } else {
    callback(405, { message: "The method is not allowed" });
  }
};

handler._tokens = {};

handler._tokens.post = (resReqProperties, callback) => {
  const phone =
    typeof resReqProperties.body.phone == "string" &&
    resReqProperties.body.phone.trim().length == 11
      ? resReqProperties.body.phone
      : false;

  const password =
    typeof resReqProperties.body.password == "string" &&
    resReqProperties.body.password.trim().length > 0
      ? resReqProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (readErr, uData) => {
      if (!readErr) {
        const userData = parseJson(uData);
        const hashedPassword = hashString(password);
        if (phone == userData.phone && hashedPassword == userData.password) {
          const tokenId = createRandomStr(20);
          const expires = Date.now() + 60 * 60 * 1000;

          const tokenObject = {
            phone,
            id: tokenId,
            expires,
          };

          data.create("tokens", tokenObject.id, tokenObject, (createError) => {
            if (!createError) {
              callback(200, {
                message: "Token has been created successfully.",
              });
            } else {
              callback(500, {
                message: "There was a server error creating token.",
              });
              console.log(createError);
            }
          });
        } else {
          callback(400, {
            error: "There is a problem with your request data.",
          });
        }
      } else {
        callback(400, { error: "There is a problem with your request data." });
      }
    });
  } else {
    callback(422, { error: "User data validation Error" });
  }
};
handler._tokens.get = (resReqProperties, callback) => {};
handler._tokens.put = (resReqProperties, callback) => {};
handler._tokens.delete = (resReqProperties, callback) => {};

module.exports = handler;
