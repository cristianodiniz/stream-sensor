import express from 'express';
import http from "http";
import { Server } from "socket.io";
import { BoschCiss } from "./bosh-ciss/ciss";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.get('/', (req: any, res: any) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

const startSensorAtPort = (usbPort: string) => {
    const ciss =  new BoschCiss(usbPort);
    ciss.subject.subscribe((data:any)=>{
        console.log(`send ${Date.now()}`,data)
        io.emit('chat message', data);
    })
}

startSensorAtPort('ttyACM0');