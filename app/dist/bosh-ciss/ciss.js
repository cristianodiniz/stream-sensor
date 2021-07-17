"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoschCiss = void 0;
const rxjs_1 = require("rxjs");
const serialport_1 = __importDefault(require("serialport"));
const measured_values_1 = require("./model/measured-values");
const sensor_data_1 = require("./model/sensor-data");
const serial_data_1 = require("./model/serial-data");
class BoschCiss {
    constructor(deviceName) {
        this.subject = new rxjs_1.Subject();
        this.port = new serialport_1.default('/dev/' + deviceName, {
            baudRate: 115200
        }, (error) => {
            if (error) {
                console.log('Error: ' + error);
            }
        });
        this.start();
    }
    async start() {
        console.log('Turn off sensors.');
        await this.write(this.toPayload([0xfe, 0x02, 0x84, 0x00]));
        await this.write(this.toPayload([0xfe, 0x02, 0x81, 0x00]));
        await this.write(this.toPayload([0xfe, 0x02, 0x83, 0x00]));
        await this.write(this.toPayload([0xfe, 0x02, 0x82, 0x00]));
        await this.write(this.toPayload([0xfe, 0x02, 0x80, 0x00]));
        console.log('Sensor configuration.');
        console.log('Set range of acceleration sensor to 16g:');
        await this.write(this.toPayload([0xfe, 0x03, 0x80, 0x04, 0x10]));
        console.log('Configure accelerometer period 100000:');
        await this.write(this.toPayload([0xfe, 0x06, 0x80, 0x02, 0xa0, 0x86, 0x01, 0x00]));
        await this.write(this.toPayload([0xfe, 0x02, 0x80, 0x01]));
        console.log('Configure period 1:');
        await this.write(this.toPayload([0xfe, 0x04, 0x84, 0x02, 0x01, 0x00]));
        await this.write(this.toPayload([0xfe, 0x02, 0x84, 0x01]));
        console.log('Configure magnetometer period 100000:');
        await this.write(this.toPayload([0xfe, 0x06, 0x81, 0x02, 0xa0, 0x86, 0x01, 0x00]));
        await this.write(this.toPayload([0xfe, 0x02, 0x81, 0x01]));
        console.log('Configure period 1:');
        await this.write(this.toPayload([0xfe, 0x04, 0x83, 0x02, 0x01, 0x00]));
        await this.write(this.toPayload([0xfe, 0x02, 0x83, 0x01]));
        console.log('Configure gyroscope period 100000:');
        await this.write(this.toPayload([0xfe, 0x06, 0x82, 0x02, 0xa0, 0x86, 0x01, 0x00]));
        await this.write(this.toPayload([0xfe, 0x02, 0x82, 0x01]));
        this.handleDataEvents();
    }
    handleDataEvents() {
        this.port.on('data', (data) => {
            const serialData = new serial_data_1.SerialData(data);
            const sensorData = measured_values_1.MeasuredValues.toMeasuredValuesArray(serialData)
                .map(sensor_data_1.SensorData.parseData);
            this.subject;
            this.subject.next({ timestamp: new Date(), data: sensorData });
        });
    }
    calcCrc(buffer) {
        let result = 0;
        buffer.forEach((v) => result ^= v);
        result ^= 254;
        return result;
    }
    toPayload(numbers) {
        return [...numbers, this.calcCrc(numbers)];
    }
    toHex(numbers) {
        let dataString = '';
        numbers.forEach((num) => {
            dataString = dataString + (dataString !== '' ? ' ' : '');
            let hexNum = num.toString(16);
            while (hexNum.length < 2) {
                hexNum = '0' + hexNum;
            }
            dataString = dataString + '0x' + hexNum;
        });
        return dataString;
    }
    async write(data, wait = 500) {
        return new Promise((resolve, reject) => {
            this.port.write(data, (error) => {
                console.log('Write: ' + this.toHex(data));
                if (error) {
                    console.log('Error on write: ', error.message);
                    reject();
                }
                setTimeout(() => resolve(), wait);
            });
        });
    }
}
exports.BoschCiss = BoschCiss;
//# sourceMappingURL=ciss.js.map