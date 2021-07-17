"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const ciss_1 = require("./bosh-ciss/ciss");
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/positions', (req, res) => {
    res.sendFile(__dirname + '/positions.json');
});
io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});
server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
const startSensorAtPort = (usbPort) => {
    const ciss = new ciss_1.BoschCiss(usbPort);
    ciss.subject.subscribe((data) => {
        console.log(`send ${Date.now()}`, data);
        io.emit('chat message', data);
    });
};
startSensorAtPort('ttyACM0');
//# sourceMappingURL=index.js.map