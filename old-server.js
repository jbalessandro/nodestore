'use strict'
// import packages
const http = require('http');
const debug = require('debug')('nodestr:server');
const express = require('express');

// set server http listen
const app = express();
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// server and routes
const server = http.createServer(app);
const router = express.Router();
const route = router.get('/', (req, res, next) => {
    res.status(200).send({
        title: "Node Store API",
        version: "0.0.1"
    });
});
app.use('/', route);

// start to listen
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port == 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated priviles');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is aready in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'Pipe ' + addr
        : 'Port ' + addr.port;
    debug('Listening on ' + bind);
}