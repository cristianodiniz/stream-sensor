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
            "teamId": "d7ef066d-bbd3-4e99-a40c-0fd59d64e0dd",
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

let shouldSend = true;
const startSensorAtPort = (usbPort: string) => {
    const ciss = new BoschCiss(usbPort);
    ciss.subject.subscribe((data: any) => {
        const sensorData: ISensorData = data as ISensorData
        handleSendSensorValue("bosch-ciss", data)
    })
    setInterval(() => {
        shouldSend = true
    }, 60000)
}

const handleSendSensorValue = (type: String, payload: any) => {
    if (shouldSend) {
        requetToken().then((response) => {
            const token = response.data.data.token
            const userId  = response.data.data.user_d
            sendSensorValue(type, payload, token)
        }, (error) => {
            console.log("requetToken", error);
        });
        shouldSend = false
    }

}

startSensorAtPort('ttyACM0');