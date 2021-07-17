"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasuredValues = void 0;
class MeasuredValues {
    constructor(measuredValues) {
        this.data = [];
        if (measuredValues instanceof MeasuredValues) {
            Object.assign(this, measuredValues);
        }
        else {
            this.data = measuredValues;
        }
    }
    static isInstanceOfMeasuredValues(object) {
        return 'data' in object;
    }
    static toMeasuredValuesArray(serialData) {
        const measuredValues = [];
        while (serialData.data.length > 2 && serialData.data[1] - 3 < serialData.data.length) {
            measuredValues.push(new MeasuredValues(serialData.data.slice(0, serialData.data[1] + 3)));
            serialData.data = serialData.data.slice(serialData.data[1] + 3, serialData.data.length + 1);
        }
        return measuredValues;
    }
}
exports.MeasuredValues = MeasuredValues;
//# sourceMappingURL=measured-values.js.map