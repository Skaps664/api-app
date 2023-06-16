/*
This is the primary file for the API
*/

//Dependencies
var http = require("http");
var url = require("url");
var stringDecoder = require("string_decoder").StringDecoder;

//The server should respond to all the requests with a string
const server = http.createServer((req, res) => {
  // Get the URL and parse it
  var parsedUrl = url.parse(req.url, true);

  //Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //Get query string as an object
  var queryStringObject = parsedUrl.query;

  //Get the http method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var header = req.headers;

  //Get the payload, if any
  var decoder = new stringDecoder("utf-8");
  var buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    //Send the response
    res.end("Hello, world!\n");

    //Log the requests path
    console.log("Request recieved with this payload: ", payload);
  });
});

//Start the server, and have it listen on port 3000
server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});
