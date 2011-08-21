#!/usr/bin/env node

var http = require('http')
, serverPort = 8765
, couchClient = require('couchdb-api')
, url = require('url')
, pathSplitRegex = new RegExp('/')
, hostRegex = new RegExp(':')
;

function getServerDesign(uri){
    if(uri.lenght == 0 || uri == '/') uri = '/localhost';
    var paths = uri.split(pathSplitRegex);
    var serverDesign = {};
    if(paths.length > 1 && paths[1].length > 0){
	serverDesign.server = {};
	var host = paths[1].split(hostRegex);
	if(host.lenght == 1){
	    serverDesign.server.host = host[0];
	    serverDesign.server.port = 5984;	    
	}
	else if(host.lenght == 2){
	    serverDesign.server.host = host[0];
	    serverDesign.server.port = parseInt(host[1]);	    
	}
	else{
	    serverDesign.server.host = 'localhost';
	    serverDesign.server.port = 5984;
	}
    }
    if(paths.length > 2 && paths[2].length > 0) serverDesign.database = paths[2];
    if(paths.length > 3 && paths[3].length > 0) serverDesign.design = paths[3];
    return serverDesign;
}

http.createServer(function(request, response){
    var serverDesign = getServerDesign(url.parse(request.url).pathname);

    if(!serverDesign.server){
	serverDesign.server.host = 'localhost';
	serverDesign.server.port = 5984;
    }

    if(serverDesign.design){
	// get the design
	// edit the design
	response.write('database:' + serverDesign.database);
	response.write('\ndesign:' + serverDesign.design);
	response.end();
    }
    else if(serverDesign.database){
	response.write('database:' + serverDesign.database);
	response.end();
    }
    else{
	// get the list of server design
	var server = couchClient.srv(serverDesign.server.host, serverDesign.server.port);
	server.allDbs(function(err, allDbs){
	    if(err)response.write("Error:" + err);
	    else{
		response.write(JSON.stringify(allDbs));		
	    }
	    response.end();
	});
    }
}).listen(serverPort, "0.0.0.0");

console.log("couchapp server running : http://localhost:" + serverPort);