"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorData = void 0;
class SensorData {
    constructor(sensorData) {
        if (sensorData != null) {
            Object.assign(this, sensorData);
        }
    }
    static parseData(measuredValues) {
        const sensorData = new SensorData();
        if (measuredValues.data[2] === 0x05) {
            const temperature = SensorData.toSigned16Bit(measuredValues.data[4] << 8 | measuredValues.data[3]) / 10.0;
            sensorData.temperature = temperature;
        }
        if (measuredValues.data[5] === 0x07) {
            const humidity = (measuredValues.data[7] << 8 | measuredValues.data[6]) / 100.0;
            sensorData.humidity = humidity;
        }
        if (measuredValues.data[8] === 0x06) {
            const pressure = (measuredValues.data[12] << 24 | measuredValues.data[11] << 16 | measuredValues.data[10] << 8 | measuredValues.data[9]) / 100.0;
            sensorData.pressure = pressure;
        }
        if (measuredValues.data[2] === 0x08) {
            const lux = measuredValues.data[6] << 24 | measuredValues.data[5] << 16 | measuredValues.data[4] << 8 | measuredValues.data[3];
            sensorData.light = lux;
        }
        if (measuredValues.data[2] === 0x02) {
            const accelerationX = SensorData.toSigned16Bit(measuredValues.data[4] << 8 | measuredValues.data[3]);
            const accelerationY = SensorData.toSigned16Bit(measuredValues.data[6] << 8 | measuredValues.data[5]);
            const accelerationZ = SensorData.toSigned16Bit(measuredValues.data[8] << 8 | measuredValues.data[7]);
            sensorData.accelerationX = accelerationX;
            sensorData.accelerationY = accelerationY;
            sensorData.accelerationZ = accelerationZ;
        }
        if (measuredValues.data[2] === 0x04) {
            const gyroX = measuredValues.data[4] << 8 | measuredValues.data[3];
            const gyroY = measuredValues.data[6] << 8 | measuredValues.data[5];
            const gyroZ = measuredValues.data[8] << 8 | measuredValues.data[7];
            sensorData.gyroX = gyroX;
            sensorData.gyroY = gyroY;
            sensorData.gyroZ = gyroZ;
        }
        if (measuredValues.data[2] === 0x03) {
            const magnetoX = measuredValues.data[4] << 8 | measuredValues.data[3];
            const magnetoY = measuredValues.data[6] << 8 | measuredValues.data[5];
            const magnetoZ = SensorData.toSigned16Bit(measuredValues.data[8] << 8 | measuredValues.data[7]);
            sensorData.magnetometerX = magnetoX;
            sensorData.magnetometerY = magnetoY;
            sensorData.magnetometerZ = magnetoZ;
        }
        return sensorData;
    }
    static toSigned16Bit(unsigned) {
        return -(unsigned & 0x8000) | (unsigned & 0x7fff);
    }
    static toSigned32Bit(unsigned) {
        return -(unsigned & 0x80000000) | (unsigned & 0x7fffffff);
    }
}
exports.SensorData = SensorData;
//# sourceMappingURL=sensor-data.js.map