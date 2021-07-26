import { MeasuredValues } from './measured-values';
import { Acceleration, Gyro, Humidity, Light, Magnetometer, Noise, Pressure, Temperature } from './models';

export interface ISensorData {
    accelerationX?: number;
    accelerationY?: number;
    accelerationZ?: number;
    gyroX?: number;
    gyroY?: number;
    gyroZ?: number;
    magnetometerX?: number;
    magnetometerY?: number;
    magnetometerZ?: number;
    temperature?: number;
    humidity?: number;
    pressure?: number;
    light?: number;
    noise?: number;
}

export class SensorData {

    public static parseData(measuredValues: MeasuredValues): SensorData {
        const sensorData = new SensorData();

        if (measuredValues.data[2] === 0x05) {
            const temperature: number = SensorData.toSigned16Bit(measuredValues.data[4] << 8 | measuredValues.data[3]) / 10.0;

            sensorData.temperature = new Temperature(temperature);
        }

        if (measuredValues.data[5] === 0x07) {
            const humidity: number = (measuredValues.data[7] << 8 | measuredValues.data[6]) / 100.0;

            sensorData.humidity = new Humidity(humidity);
        }

        if (measuredValues.data[8] === 0x06) {
            const pressure: number = (measuredValues.data[12] << 24 | measuredValues.data[11] << 16 | measuredValues.data[10] << 8 | measuredValues.data[9]) / 100.0;

            sensorData.pressure = new Pressure(pressure);
        }

        if (measuredValues.data[2] === 0x08) {
            const lux: number = measuredValues.data[6] << 24 | measuredValues.data[5] << 16 | measuredValues.data[4] << 8 | measuredValues.data[3];

            sensorData.light = new Light(lux);
        }

        if (measuredValues.data[2] === 0x02) {
            const accelerationX: number = SensorData.toSigned16Bit(measuredValues.data[4] << 8 | measuredValues.data[3]);
            const accelerationY: number = SensorData.toSigned16Bit(measuredValues.data[6] << 8 | measuredValues.data[5]);
            const accelerationZ: number = SensorData.toSigned16Bit(measuredValues.data[8] << 8 | measuredValues.data[7]);

            sensorData.acceleration = new Acceleration(accelerationX, accelerationY, accelerationZ);
        }

        if (measuredValues.data[2] === 0x04) {
            const gyroX: number = measuredValues.data[4] << 8 | measuredValues.data[3];
            const gyroY: number = measuredValues.data[6] << 8 | measuredValues.data[5];
            const gyroZ: number = measuredValues.data[8] << 8 | measuredValues.data[7];
            console.log("GYRO ",gyroX,gyroY,gyroZ)
            sensorData.gyro = new Gyro(gyroX, gyroY, gyroZ);
        }

        if (measuredValues.data[2] === 0x03) {
            const magnetoX: number = measuredValues.data[4] << 8 | measuredValues.data[3];
            const magnetoY: number = measuredValues.data[6] << 8 | measuredValues.data[5];
            const magnetoZ: number = SensorData.toSigned16Bit(measuredValues.data[8] << 8 | measuredValues.data[7]);

            sensorData.magnetometer = new Magnetometer(magnetoX, magnetoY, magnetoZ)
        }
        return sensorData;
    }

    private static toSigned16Bit(unsigned: number): number {
        return -(unsigned & 0x8000) | (unsigned & 0x7fff);
    }

    private static toSigned32Bit(unsigned: number): number {
        return -(unsigned & 0x80000000) | (unsigned & 0x7fffffff);
    }
    public acceleration?: Acceleration = undefined;
    public gyro?: Gyro = undefined;
    public magnetometer?: Magnetometer = undefined;
    public temperature?: Temperature = undefined;
    public humidity?: Humidity = undefined;
    public pressure?: Pressure = undefined;
    public light?: Light = undefined;
    public noise?: Noise = undefined;

    constructor(sensorData?: ISensorData) {
        if (sensorData != null) {
            if (sensorData.accelerationX != null && sensorData.accelerationY != null && sensorData.accelerationZ != null) {
                this.acceleration = new Acceleration(sensorData.accelerationX, sensorData.accelerationY, sensorData.accelerationZ)
            }
            if (sensorData.gyroX != null && sensorData.gyroY != null && sensorData.gyroZ != null) {
                this.gyro = new Gyro(sensorData.gyroX, sensorData.gyroY, sensorData.gyroZ)
            }
            if (sensorData.magnetometerX != null && sensorData.magnetometerY != null && sensorData.magnetometerZ != null) {
                this.magnetometer = new Magnetometer(sensorData.magnetometerX, sensorData.magnetometerY, sensorData.magnetometerZ)
            }
            if (sensorData.temperature != null) {
                this.temperature = new Temperature(sensorData.temperature)
            }
            if (sensorData.humidity != null) {
                this.humidity = new Humidity(sensorData.humidity)
            }
            if (sensorData.pressure != null) {
                this.pressure = new Pressure(sensorData.pressure)
            }
            if (sensorData.light != null) {
                this.light = new Light(sensorData.light)
            }
            if (sensorData.noise != null) {
                this.noise = new Noise(sensorData.noise)
            }

            Object.assign(this, sensorData);
        }
    }

}
