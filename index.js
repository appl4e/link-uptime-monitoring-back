const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environmentVariable = require("./helpers/environments");
const data = require("./lib/data");

const app = {};

// app.config = {
//   port: environmentVariable.port,
// };

// testing file writing
// data.create(
//   "test",
//   "text",
//   {
//     name: "Apple Mahmood Anas",
//     phone: "01678116782",
//     email: "apple@yopmail.com",
//   },
//   (error) => {
//     console.log(error);
//   }
// );

// testing file creation
// data.read("test", "text", (error, content) => {
//   console.log(error, content);
// });

// testing file updating
// data.update(
//   "test",
//   "text",
//   {
//     name: "Anas",
//     email: "anas@yopmail.com",
//   },
//   (error) => {
//     console.log(error);
//   }
// );

// testing file deleting
data.remove("test", "text", (error) => {
  console.log(error);
});

app.createServer = () => {
  const server = http.createServer(app.handleRequestResponse);
  server.listen({ port: environmentVariable.port, host: "localhost" }, () => {
    console.log("listening to port " + environmentVariable.port);
  });
};
app.handleRequestResponse = handleReqRes;

app.createServer();
