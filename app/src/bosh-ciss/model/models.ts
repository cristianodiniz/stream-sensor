
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

export interface IData {
    timestamp: number,
}

export class Acceleration implements IData {
    public readonly timestamp: number = Date.now();
    public readonly accelerationX: number = NaN;
    public readonly accelerationY: number = NaN;
    public readonly accelerationZ: number = NaN;
    constructor(x: number, y: number, z: number) {
        this.accelerationX = x
        this.accelerationY = y
        this.accelerationZ = z
    }
}
export class Gyro implements IData {
    public readonly timestamp: number = Date.now();
    public readonly gyroX: number = NaN;
    public readonly gyroY: number = NaN;
    public readonly gyroZ: number = NaN;
    constructor(x: number, y: number, z: number) {
        this.gyroX = x
        this.gyroY = y
        this.gyroZ = z
    }
}
export class Magnetometer implements IData {
    public readonly timestamp: number = Date.now();
    public readonly magnetometerX: number = NaN;
    public readonly magnetometerY: number = NaN;
    public readonly magnetometerZ: number = NaN;
    constructor(x: number, y: number, z: number) {
        this.magnetometerX = x
        this.magnetometerY = y
        this.magnetometerZ = z
    }
}
export class Temperature implements IData {
    public readonly timestamp: number = Date.now();
    public temperature: number = NaN;
    constructor(t: number) {
        this.temperature = t
    }
}
export class Humidity implements IData {
    public readonly timestamp: number = Date.now();
    public readonly humidity: number = NaN;
    constructor(h: number) {
        this.humidity = h
    }
}
export class Pressure implements IData {
    public readonly timestamp: number = Date.now();
    public readonly pressure: number = NaN;
    constructor(p: number) {
        this.pressure = p
    }
}
export class Light implements IData {
    public readonly timestamp: number = Date.now();
    public readonly light: number = NaN;
    constructor(l: number) {
        this.light = l
    }
}
export class Noise implements IData {
    public readonly timestamp: number = Date.now();
    public readonly noise: number = NaN;
    constructor(n: number) {
        this.noise = n
    }
}