#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boschCiss = void 0;
const ciss_1 = require("./ciss");
//'ttyACM0'
const boschCiss = (usbPort) => {
    return new ciss_1.BoschCiss(usbPort);
};
exports.boschCiss = boschCiss;
//# sourceMappingURL=connect.js.map