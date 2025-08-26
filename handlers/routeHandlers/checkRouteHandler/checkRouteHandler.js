const { parseJson, createRandomStr } = require("../../../helpers/utilities");
const data = require("../../../lib/data");

const { _tokens } = require("../tokenRouteHandler/tokenRouteHandler");
const { maxChecks } = require("../../../helpers/environments");

handler = {};

handler.checkRouteHandler = (reqResProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];

  if (acceptedMethod.indexOf(reqResProperties.method) > -1) {
    handler._checks[reqResProperties.method](reqResProperties, callback);
  } else {
    callback(405, { error: "The method is not allowed." });
  }
};

handler._checks = {};

/**
 * Checks Post API
 * Payload: Protocol, url, method, successCodes, timeoutSeconds
 */
handler._checks.post = (reqResProperties, callback) => {
  const protocol =
    typeof reqResProperties.body.protocol === "string" &&
    ["https", "http"].indexOf(reqResProperties.body.protocol) > -1
      ? reqResProperties.body.protocol
      : false;

  const url =
    typeof reqResProperties.body.url === "string" &&
    reqResProperties.body.url.trim().length > 0
      ? reqResProperties.body.url
      : false;

  const method =
    typeof reqResProperties.body.method === "string" &&
    ["get", "post", "put", "delete", "GET", "POST", "PUT", "DELETE"].indexOf(
      reqResProperties.body.method
    )
      ? reqResProperties.body.method
      : false;

  const successCodes =
    typeof reqResProperties.body.successCodes === "object" &&
    reqResProperties.body.successCodes instanceof Array &&
    reqResProperties.body.successCodes.length >= 1
      ? reqResProperties.body.successCodes
      : false;

  const timeoutSeconds =
    typeof reqResProperties.body.timeoutSeconds === "number" &&
    reqResProperties.body.timeoutSeconds > 0 &&
    reqResProperties.body.timeoutSeconds < 10 &&
    reqResProperties.body.timeoutSeconds % 1 == 0
      ? reqResProperties.body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    const tokenId =
      typeof reqResProperties.headerObject.bearer === "string" &&
      reqResProperties.headerObject.bearer.trim().length === 20
        ? reqResProperties.headerObject.bearer
        : false;

    console.log(reqResProperties.headerObject.bearer.trim().length);
    console.log(tokenId);

    if (tokenId) {
      data.read("tokens", tokenId, (err1, tokenObj) => {
        if (!err1 && tokenObj) {
          const tokenData = parseJson(tokenObj);
          const phone = tokenData.phone;
          data.read("users", phone, (err2, userObj) => {
            if ((!err2, userObj)) {
              _tokens.verify(tokenId, phone, (isValidToken) => {
                if (isValidToken) {
                  const userData = parseJson(userObj);
                  const userChecks =
                    typeof userData.checks == "object" &&
                    userData.checks instanceof Array
                      ? userData.checks
                      : [];
                  if (userChecks.length < maxChecks) {
                    const checkId = createRandomStr(20);
                    const checkObj = {
                      id: checkId,
                      userPhone: phone,
                      protocol,
                      method,
                      url,
                      successCodes,
                      timeoutSeconds,
                    };
                    data.create(
                      "checks",
                      checkId,
                      checkObj,
                      (checkCreateErr) => {
                        if (!checkCreateErr) {
                          userData.checks = userChecks;
                          userData.checks.push(checkId);
                          data.update(
                            "users",
                            phone,
                            userData,
                            (userUpdateError) => {
                              if (!userUpdateError) {
                                callback(200, checkObj);
                              } else {
                                callback(500, {
                                  error: "Unable to update user table.",
                                });
                              }
                            }
                          );
                        } else {
                          callback(500, {
                            error: "There was a server error.",
                          });
                        }
                      }
                    );
                  } else {
                    callback(401, {
                      error: "The number of check link has exceeded the limit.",
                    });
                  }
                } else {
                  callback(400, { error: "The token is not valid." });
                }
              });
            } else {
              callback(404, {
                error: "User with this phone number not found.",
              });
            }
          });
        } else {
          callback(404, { error: "The token is not valid." });
        }
      });
    } else {
      callback(403, { error: "Authentication Error!" });
    }
  } else {
    callback(400, { error: "There was a problem with your request." });
  }
};

handler._checks.get = (reqResProperties, callback) => {};

module.exports = handler;
