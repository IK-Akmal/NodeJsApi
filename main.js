'use strict';

const port = 9999;
const statusNotFound = 404;
const statusOk = 200;
const statusBadRequest = 400;

let nextId = 1;
const posts = [];

const http = require('http');

const methods = new Map();

//Get post api
methods.set('/posts.get', (request, response) => {
    response.writeHead(statusOk, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(posts));
});

methods.set('/posts.getById', (request, response) => {

    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);

    if (!searchParams.has('id')) {
        response.writeHead(statusBadRequest);
        response.end();
        return;
    }
    const id = Number(searchParams.get('id'));

    if (Number.isNaN(id)) {
        response.writeHead(statusBadRequest);
        response.end();
        return;
    }

    const findPost = posts.find(post => post.id === id);

    if (!findPost) {
        response.writeHead(statusNotFound);
        response.end();
        return;
    }

    response.writeHead(statusOk, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(findPost));
});

methods.set('/posts.post', (request, response) => {
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);

    if (!searchParams.has('content')) {
        response.writeHead(statusBadRequest);
        response.end();
        return;
    }
    const content = searchParams.get('content');

    const post = {
        id: nextId++,
        content: content,
        created: Date.now(),
    };

    posts.unshift(post);
    response.writeHead(statusOk, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(post));
});

methods.set('/posts.edit', (request, response) => {
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);

    if (!searchParams.has('id') || !searchParams.has('content')) {
        response.writeHead(statusBadRequest);
        response.end();
        return;
    }

    const id = Number(searchParams.get('id'));
    const content = searchParams.get('content');

    if (Number.isNaN(id) || !content) {
        response.writeHead(statusBadRequest);
        response.end();
        return;
    }

    const indexPost = posts.findIndex(post => post.id === id);

    if (indexPost === -1) {
        response.writeHead(statusNotFound);
        response.end();
        return;
    }

    posts[indexPost].content = content;
    response.writeHead(statusOk, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(posts[indexPost]));
});

methods.set('/posts.delete', (request, response) => {

    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);

    if (!searchParams.has('id')) {
        response.writeHead(statusBadRequest);
        response.end();
        return;
    }
    const id = Number(searchParams.get('id'));

    if (Number.isNaN(id)) {
        response.writeHead(statusBadRequest);
        response.end();
        return;
    }

    const indexPost = posts.findIndex(post => post.id === id);

    if (indexPost === -1) {
        response.writeHead(statusNotFound);
        response.end();
        return;
    }

    posts = posts.slice(indexPost, 1);
    response.writeHead(statusOk,{'Content-Type': "application/json"});
    response.end(JSON.stringify(posts[indexPost]));

});

const server = http.createServer((request, response) => {

    const { pathname } = new URL(request.url, `http://${request.headers.host}`);

    const method = methods.get(pathname);
    if (method === undefined) {
        response.writeHead(statusNotFound);
        response.end();
        return;
    }

    method(request, response);

});


server.listen(port);
