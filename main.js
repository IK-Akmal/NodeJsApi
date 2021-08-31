'use strict';

const port = 9999;
const statusNotFound = 404;
const statusOk = 200;
const posts = []; 

const http = require('http');

const methods = new Map();

//Get post api
methods.set('/posts.get', (request, response)=>{
    response.writeHead(statusOk,{'Content-Type': 'application/json'});
    response.end(JSON.stringify(posts));
});

methods.set('/posts.getById', (request, response)=>{});
methods.set('/posts.post', (request, response)=>{});
methods.set('/posts.edit', (request, response)=>{});
methods.set('/posts.delete', (request, response)=>{});

const server = http.createServer((request, response) => {

    const {pathname, searchParams} = new URL(request.url,`http://${request.headers.host}`);

    const method = methods.get(pathname);
    if(method === undefined){
        response.writeHead(statusNotFound);
        response.end();
        return;
    }

    method(request,response);

});


server.listen(port);
