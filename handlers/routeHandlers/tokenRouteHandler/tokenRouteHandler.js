const {
  createRandomStr,
  parseJson,
  hashString,
} = require("../../../helpers/utilities");
const data = require("../../../lib/data");
const { token } = require("../../../routes");
const handler = {};

handler.tokenRouteHandler = (resReqProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];

  if (acceptedMethod.indexOf(resReqProperties.method) > -1) {
    handler._tokens[resReqProperties.method](resReqProperties, callback);
  } else {
    callback(405, { error: "The method is not allowed." });
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

          let tokenObject = {
            phone,
            id: tokenId,
            expires,
          };

          data.create("tokens", tokenId, tokenObject, (createError) => {
            if (!createError) {
              callback(200, {
                message: "Token has been created successfully.",
                ...tokenObject,
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
handler._tokens.get = (resReqProperties, callback) => {
  const tokenId =
    typeof resReqProperties.queryStringObject.id == "string" &&
    resReqProperties.queryStringObject.id.trim().length == 20
      ? resReqProperties.queryStringObject.id
      : false;
  console.log(tokenId);

  if (tokenId) {
    data.read("tokens", tokenId, (readErr, tokenData) => {
      if (!readErr && tokenData) {
        const parsedData = parseJson(tokenData);
        callback(200, parsedData);
      } else {
        callback(404, { error: "Token data with this query is not found." });
      }
    });
  } else {
    callback(404, { error: "There was a problem in you query." });
  }
};
handler._tokens.put = (resReqProperties, callback) => {
  const id =
    typeof resReqProperties.body.id == "string" &&
    resReqProperties.body.id.trim().length == 20
      ? resReqProperties.body.id
      : false;
  const extend =
    typeof resReqProperties.body.extend == "boolean" &&
    resReqProperties.body.extend == true
      ? true
      : false;

  if (id && extend) {
    data.read("tokens", id, (readErr, tokenData) => {
      if (!readErr && tokenData) {
        const parsedData = parseJson(tokenData);
        const expires =
          parsedData.expires > Date.now()
            ? parsedData.expires + 60 * 60 * 1000
            : false;
        if (expires) {
          const tokenObj = {
            id,
            phone: parsedData.phone,
            expires,
          };
          data.update("tokens", id, tokenObj, (updErr) => {
            if (!updErr) {
              callback(200, {
                message: "Token updated successfully.",
                data: tokenObj,
              });
            } else {
              callback(500, {
                error: "There was an error updating your data.",
              });
            }
          });
        } else {
          callback(400, { error: "Your token has already expired." });
        }
      } else {
        callback(404, { error: "Token data with this id is not found." });
      }
    });
  } else {
    callback(400, { error: "There was a problem with your data." });
  }
};
handler._tokens.delete = (resReqProperties, callback) => {
  const tokenId =
    typeof resReqProperties.queryStringObject.id == "string" &&
    resReqProperties.queryStringObject.id.trim().length == 20
      ? resReqProperties.queryStringObject.id
      : false;
  if (tokenId) {
    data.read("tokens", tokenId, (readErr, tokenData) => {
      if (!readErr && tokenData) {
        const parsedData = parseJson(tokenData);
        data.remove("tokens", tokenId, (delErr) => {
          if (!delErr) {
            callback(200, { message: "The token removed successfully" });
          } else {
            callback(500, { error: "There was a error removing the token." });
            console.log(remErr);
          }
        });
      } else {
        callback(404, { error: "Token data with this query is not found." });
      }
    });
  } else {
    callback(404, { error: "There was a problem in you query." });
  }
};

handler._tokens.verify = (id, phone, callback) => {
  if (id && phone) {
    data.read("tokens", id, (readErr, tokenData) => {
      if (!readErr && tokenData) {
        if (
          parseJson(tokenData).phone === phone &&
          parseJson(tokenData).expires > Date.now()
        ) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  } else {
    callback(false);
  }
};

module.exports = handler;
