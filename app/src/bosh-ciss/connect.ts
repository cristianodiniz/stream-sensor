#!/usr/bin/env node

import { BoschCiss } from './ciss';

//'ttyACM0'
export const boschCiss = (usbPort: string): BoschCiss => {
    return new BoschCiss(usbPort);
}