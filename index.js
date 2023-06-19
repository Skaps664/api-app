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
  var headers = req.headers;

  //Get the payload, if any
  var decoder = new stringDecoder("utf-8");
  var buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    //choose the handler this request should goto. If one is not found use the notfound handler
    var chosenHandler = typeof (router[trimmedPath] !== undefined
      ? router[trimmedPath]
      : handlers.notFound);

    //construct the data object to send to handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      headers: headers,
      method: method,
      buffer: buffer,
    };

    // route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      //use the status code called by the handler, or default
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      //use the payload callled back by the handler, or default to an empty object
      payload = typeof payload === "object" ? payload : {};

      //convert the payloac to a string
      var payloadString = JSON.stringify(payload);

      //Send the response
      res.writeHead(statusCode);
      res.end(payloadString);

      //Log the requests path
      console.log("Returning thisa reponse: ", statusCode, payloadString);
    });
  });
});

//Start the server, and have it listen on port 3000
server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});

// Defining a request router
var handlers = {};

//sample handler
handlers.sample = (data, callback) => {
  //callback a http status code and payload object
  callback(406, { name: "saple handler" });
};

//Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

//Define the request router
var router = {
  sample: handlers.sample,
};
