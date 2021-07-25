import { BoschCiss } from "./bosh-ciss/ciss";
import { ISensorData } from './bosh-ciss/model/sensor-data';
import axios from "axios";

const NL_SERVER_BASE_ENDPOINT = "http://192.168.130.10:18082/api"
const NL_SERVER_EMAIL = "cristiano@nautiluslog.com"
const NL_SERVER_KEY = "7ac600b59bb8e39733c114485050e30380ae979e"

const requetToken = () => {
    return axios.post(NL_SERVER_BASE_ENDPOINT + "/frontend/v1/sessions", {
        "email": NL_SERVER_EMAIL,
        "account_key": NL_SERVER_KEY
    })
}

const sendSensorValue = (type: String, payload: any, token: String) => {

    const endpoint = NL_SERVER_BASE_ENDPOINT + "/mobile/v1/genericentities"
    const body = {
        "decoration": {
            "channels": ["channel1", "channel2"],
            "metadata": [
                {
                    "name": "name1",
                    "value": "value1"
                },
                {
                    "name": "name2",
                    "value": "value2"
                }
            ]
        },
        "content": {
            "imoNumber": 9535163,
            "teamId": "db6379d4-6c64-4d19-9771-07fd6f9e7aaa",
            "label": type,
            "payloadVersion": 1,
            "payloadType": type,
            "payload": JSON.stringify(payload)
        }
    }
    const options = {
        headers: { "X-NAUTI-SESSION": token }
    }
    axios.post(endpoint, body, options).then((response) => {
        console.log("sendSensorValue", response);
    }, (error) => {
        console.log("sendSensorValue", error);
    });
}

const startSensorAtPort = (usbPort: string) => {
    const ciss = new BoschCiss(usbPort);
    ciss.subject.subscribe((data: any) => {
        console.log(`on subscribe`);
        const sensorData: ISensorData = data as ISensorData
        console.log(`on subscribe`, data);
        handleSendSensorValue("bosch-ciss", data)
    })
}

let shouldSend = true;
setInterval(() => {
    shouldSend = true
}, 60000)
const handleSendSensorValue = (type: String, payload: any) => {
    if (shouldSend) {
        requetToken().then((response) => {
            const token = response.data.data.token
            sendSensorValue(type, payload, token)
        }, (error) => {
            console.log("requetToken", error);
        });
        shouldSend = false
    }

}

startSensorAtPort('ttyACM0');