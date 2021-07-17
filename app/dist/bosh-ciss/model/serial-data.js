"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialData = void 0;
class SerialData {
    constructor(serialData) {
        this.type = '';
        this.data = [];
        if (serialData instanceof SerialData) {
            Object.assign(this, serialData);
        }
        else {
            Object.assign(this, JSON.parse(JSON.stringify(serialData)));
        }
    }
    static isInstanceOfSerialData(object) {
        return 'type' in object && 'data' in object;
    }
}
exports.SerialData = SerialData;
//# sourceMappingURL=serial-data.js.map