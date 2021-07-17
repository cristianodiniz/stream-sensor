import express from 'express';
import http from "http";
import { Server } from "socket.io";
import { BoschCiss } from "./bosh-ciss/ciss";
import { ISensorData } from './bosh-ciss/model/sensor-data';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.get('/', (req: any, res: any) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/positions', (req: any, res: any) => {
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

const startSensorAtPort = (usbPort: string) => {
    const ciss =  new BoschCiss(usbPort);
    ciss.subject.subscribe((data:any)=>{
        const sensorData:ISensorData = data as ISensorData
        
        io.emit('bridge/acceleration', {
            accelerationX: sensorData.accelerationX,
            accelerationY: sensorData.accelerationY,
            accelerationZ: sensorData.accelerationZ,
        });
        io.emit('bridge/gyro', {
            gyroX: sensorData.gyroX,
            gyroY: sensorData.gyroY,
            gyroZ: sensorData.gyroZ,
        });
        io.emit('bridge/humidity', {
            humidity: sensorData.humidity,
        });
        io.emit('bridge/light', {
            light: sensorData.light,
        });
        io.emit('bridge/magnetometer', {
            magnetometerX: sensorData.magnetometerX,
            magnetometerY: sensorData.magnetometerY,
            magnetometerZ: sensorData.magnetometerZ,
        });
        io.emit('bridge/noise', {
            noise: sensorData.noise,
        });
        io.emit('bridge/pressure', {
            pressure: sensorData.pressure,
        });
        io.emit('bridge/temperature', {
            temperature: sensorData.temperature,
        });
    })
}

startSensorAtPort('ttyACM0');