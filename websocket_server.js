const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 2053 });

let clients = {};

server.on('connection', (ws) => {
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        const { cid } = parsedMessage;

        if (cid) {
            clients[cid] = ws;
            ws.send(JSON.stringify({ message: `Connected as ${cid}` }));
        } else {
            console.log('Received message without cid:', parsedMessage);
        }
    });

    ws.on('close', () => {
        for (let clientId in clients) {
            if (clients[clientId] === ws) {
                delete clients[clientId];
                console.log(`Client ${clientId} disconnected`);
                break;
            }
        }
    });
});

console.log('WebSocket server is running on port 2053');

// Export clients object for use in other modules
module.exports = clients;
