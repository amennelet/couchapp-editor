#!/usr/bin/env node

var http = require('http')
, serverPort = 8765
;

http.createServer(function(request, response){
}).listen(serverPort, "0.0.0.0");

console.log("couchapp server running : http://localhost:" + serverPort);