const http = require('http');
const url = require('url');
const WebSocket = require('ws');

// Import the clients object from the websocket server
const clients = require('./websocket_server');

const sendMessageToClient = (clientId, message) => {
    if (clients[clientId]) {
        clients[clientId].send(JSON.stringify(message));
    } else {
        console.log(`Client ${clientId} not connected`);
    }
};

const requestHandler = (req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { cid, ch, data } = JSON.parse(body);
            sendMessageToClient(cid, { ch, data });
            res.end('Notification sent');
        });
    } else {
        res.end('Send POST request with notification data');
    }
};

const httpServer = http.createServer(requestHandler);
httpServer.listen(2087, () => {
    console.log('HTTP server is listening on port 2087');
});
