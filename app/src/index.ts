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
    const ciss = new BoschCiss(usbPort);
    ciss.subject.subscribe((data: any) => {
        console.log(`on subscribe`);
        const sensorData: ISensorData = data as ISensorData
        console.log(`on subscribe`, data);

        const { accelerationX, accelerationY, accelerationZ } = sensorData
        if (accelerationX != null && accelerationY != null && accelerationZ != null) {
            io.emit('bridge/acceleration', {
                accelerationX,
                accelerationY,
                accelerationZ,
            });
        }

        const { gyroX, gyroY, gyroZ } = sensorData
        if (gyroX != null && gyroY != null && gyroZ != null) {
            io.emit('bridge/gyro', {
                gyroX,
                gyroY,
                gyroZ,
            });
        }

        const { humidity } = sensorData
        if (humidity != null) {
            io.emit('bridge/humidity', {
                humidity
            });
        }

        const { light } = sensorData
        if (light != null) {
            io.emit('bridge/light', {
                light,
            });
        }

        const { magnetometerX, magnetometerY, magnetometerZ } = sensorData
        if (magnetometerX != null && magnetometerY != null && magnetometerZ != null) {
            io.emit('bridge/magnetometer', {
                magnetometerX,
                magnetometerY,
                magnetometerZ,
            });
        }

        const { noise } = sensorData
        if (noise != null) {
            io.emit('bridge/noise', {
                noise
            });
        }

        const { pressure } = sensorData
        if (pressure != null) {
            io.emit('bridge/pressure', {
                pressure,
            });
        }

        const { temperature } = sensorData
        if (temperature != null) {
            io.emit('bridge/temperature', {
                temperature,
            });
        }

        io.emit('bridge/raw', sensorData);

    })
}

startSensorAtPort('ttyACM0');