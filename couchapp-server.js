#!/usr/bin/env node

var http = require('http')
, serverPort = 8765
, couchClient = require('couchdb-api')
, url = require('url')
, pathSplitRegex = new RegExp('/')
, hostRegex = new RegExp(':')
;

function getServerDesign(uri){
    if(uri.lenght == 0 || uri == '/') uri = 'localhost';
    if(uri[0] == '/') uri = uri.substring(1);
    var paths = uri.split(pathSplitRegex);
    var server = {};
    var host = 'localhost';
    var port = 5984;
    if(paths.length > 0 && paths[0].length > 0){
	var fullHost = paths[0].split(hostRegex);
	if(fullHost.lenght == 1){
	    host = fullHost[0];
	}
	else if(host.lenght == 2){
	    host = fullHost[0];
	    port = parseInt(fullHost[1]);	    
	}
    }
    server.srv = couchClient.srv(host, port);

    if(paths.length > 1 && paths[1].length > 0) server.database = server.srv.db(paths[1]);
    if(paths.length > 2 && paths[2].length > 0) server.design = server.database.designDoc(paths[2]);
    return server;
}

http.createServer(function(request, response){
    var server = getServerDesign(url.parse(request.url).pathname);
    debugger;
//    response.write(JSON.stringify(server) + '\n');
    if(server.srv){
	server.srv.allDbs(function(err, allDbs){
	    var dbs = [];
	    for(dbId in allDbs){
		var db = allDbs[dbId];
		if(db.search('_') != 0){
		    dbs.push(db);
		}
	    }
	    response.write('allDbs=' + JSON.stringify(dbs) + '\n');
	    if(server.database){
		server.database.allDocs(function(err, allDocs){
		    var designs = [];
		    for(docId in allDocs.rows){
			var doc = allDocs.rows[docId];
			if(doc.id.search('_design/') == 0){
			    designs.push(doc.id.substring(8));
			}
		    }
		    response.write('allDesigns=' + JSON.stringify(designs) + '\n');
		    if(server.design){
			server.design.get(function(err, body){
			    //response.write(JSON.stringify(body) + '\n');
			    response.write(JSON.stringify(server.design.body) + '\n');
			    response.end();
			})
		    }
		    else{
			response.end();
		    }
		})
	    }
	    else{
		response.end();
	    }
	})
    }
    else{
	response.write('nothing to get' + JSON.stringify(server));
	response.end();
    }
}).listen(serverPort, "0.0.0.0");

console.log("couchapp server running : http://localhost:" + serverPort);