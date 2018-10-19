var http = require('http');
var url = require('url');
var config = require('./config.js');

var server = http.createServer(function(req, res){
  var parsedUrl = url.parse(req.url, true);

  var data = {
    path: parsedUrl.pathname.replace(/^\/+|\/$/g, ''),
    method: req.method,
    query: parsedUrl.query,
    headers: req.headers
  }

  var chosenHandler = typeof(router[data.path]) !== 'undefined' ? router[data.path] : handlers.notFound;

  chosenHandler(data, function(statusCode, payload) {
    payload = typeof(payload) === 'object' ? payload : {};

    var payloadString = JSON.stringify(payload);

    res.writeHead(statusCode);
    res.end(payloadString);
  });
});

server.listen(config.port, function(){
  console.log('server is listening on port:' + config.port);
});

// Define request handlers
var handlers = {};

handlers.hello = function(data, callback){
  if (typeof(callback) === 'function'){
    callback(200, { 'message' : 'Welcome to our first Node API' });
  }
};

handlers.notFound = function(data, callback){
  callback(406, { 'status' : 'page not found' });
};

// Define our request router
var router = {
  hello: handlers.hello
};
