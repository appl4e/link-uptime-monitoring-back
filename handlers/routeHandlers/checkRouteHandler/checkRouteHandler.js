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

handler._checks.get = (reqResProperties, callback) => {
  const id =
    typeof reqResProperties.queryStringObject.id === "string" &&
    reqResProperties.queryStringObject.id.length === 20
      ? reqResProperties.queryStringObject.id
      : false;

  if (id) {
    data.read("checks", id, (err1, checkRawData) => {
      if (!err1 && checkRawData) {
        const checkData = parseJson(checkRawData);
        const token =
          typeof reqResProperties.headerObject.bearer === "string" &&
          reqResProperties.headerObject.bearer.trim().length === 20
            ? reqResProperties.headerObject.bearer
            : false;
        console.log(token);
        _tokens.verify(token, checkData.userPhone, (isTokenValid) => {
          if (isTokenValid) {
            callback(200, { checkData });
          } else {
            callback(403, { error: "Authentication problem." });
          }
        });
      } else {
        callback(500, { error: "There was a server error!" });
      }
    });
  } else {
    callback(400, { error: "There was a problem with your request." });
  }
};

handler._checks.put = (reqResProperties, callback) => {
  const id =
    typeof reqResProperties.body.id === "string" &&
    reqResProperties.body.id.trim().length === 20
      ? reqResProperties.body.id
      : false;
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

  if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      data.read("checks", id, (err1, checkRawData) => {
        if (!err1) {
          const checkData = parseJson(checkRawData);
          const token =
            typeof reqResProperties.headerObject.bearer === "string" &&
            reqResProperties.headerObject.bearer.trim().length == 20
              ? reqResProperties.headerObject.bearer
              : false;
          _tokens.verify(token, checkData.userPhone, (isValidToken) => {
            if (isValidToken) {
              if (protocol) {
                checkData.protocol = protocol;
              }
              if (url) {
                checkData.url = url;
              }
              if (method) {
                checkData.method = method;
              }
              if (successCodes) {
                checkData.successCodes = successCodes;
              }
              if (timeoutSeconds) {
                checkData.timeoutSeconds = timeoutSeconds;
              }

              data.update("checks", id, checkData, (err3) => {
                if (!err3) {
                  callback(200, { checkData });
                } else {
                  callback(500, {
                    error: "There was a server error updating the data.",
                  });
                }
              });
            } else {
              callback(403, { error: "Authentication error." });
            }
          });
        } else {
          callback(404, { error: "Check links with this id was not found." });
        }
      });
    } else {
      callback(400, {
        error: "There was a problem with your request data.",
      });
    }
  } else {
    callback(400, { error: "There was a problem with your request." });
  }
};

handler._checks.delete = (reqResProperties, callback) => {
  const id =
    typeof reqResProperties.queryStringObject.id == "string" &&
    reqResProperties.queryStringObject.id.length == 20
      ? reqResProperties.queryStringObject.id
      : false;

  if (id) {
    data.read("checks", id, (err1, checkRawData) => {
      if (!err1 && checkRawData) {
        const checkData = parseJson(checkRawData);
        const token =
          typeof reqResProperties.headerObject.bearer == "string" &&
          reqResProperties.headerObject.bearer.trim().length == 20
            ? reqResProperties.headerObject.bearer
            : false;

        _tokens.verify(token, checkData.userPhone, (isTokenValid) => {
          if (isTokenValid) {
            data.remove("checks", id, (err2) => {
              if (!err2) {
                data.read(
                  "users",
                  checkData.userPhone,
                  (err3, userJsonData) => {
                    if (!err3 && userJsonData) {
                      const userData = parseJson(userJsonData);
                      const checksList =
                        typeof userData.checks == "object" &&
                        userData.checks instanceof Array
                          ? userData.checks
                          : [];
                      const checksIndex = checksList.indexOf(id);
                      if (checksIndex > -1) {
                        checksList.splice(checksIndex, 1);

                        userData.checks = checksList;
                        data.update(
                          "users",
                          userData.phone,
                          userData,
                          (err4) => {
                            if (!err4) {
                              callback(200, {
                                message: "Check link deleted successfully.",
                              });
                            } else {
                              callback(500, {
                                error:
                                  "There was a problem removing check link from the user.",
                              });
                            }
                          }
                        );
                      } else {
                        callback(404, {
                          error: "The check id was not found in the user data.",
                        });
                      }
                    } else {
                      callback(500, {
                        error: "There was a problem finding the user data.",
                      });
                    }
                  }
                );
              } else {
                callback(500, {
                  error: "There was a problem deleting the data.",
                });
              }
            });
          } else {
            callback(403, { error: "Authentication failure~" });
          }
        });
      } else {
        callback(500, { error: "There was a problem reading the data." });
      }
    });
  } else {
    callback(400, { error: "There was a problem with your request." });
  }
};

module.exports = handler;
