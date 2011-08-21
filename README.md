# couchapp-editor

## Introduction
This is a [nodejs](http://nodejs.org) web server to edit [couchdb](http://couchdb.apache.org/) _design/document directly into your browser with the [ace](https://github.com/ajaxorg/ace) editor.

## Installation
1. First you need a [CouchDB](http://couchdb.apache.org/) server up and running and [NodeJS](http://nodejs.org) and [npm](http://search.npmjs.org/#/_install) installed.

2. Get the couchapp-editor.

        git clone git://github.com/amennelet/couchapp-editor.git
        cd ./couchapp-editor

3. Download the latest [ace editor](https://github.com/ajaxorg/ace)

        curl -L -O -C - https://github.com/downloads/ajaxorg/ace/ace-xxxxxxx.zip

4. Unzip it

        unzip ace-xxxxxxx.zip

5. Link the ace directory to ace

        ln -s ace-xxxxxxx ace

6. Get the last [couchdb-api](https://github.com/dominicbarnes/node-couchdb-api)

        npm install couchdb-api

7. Start the server

        ./couchapp-server.js
