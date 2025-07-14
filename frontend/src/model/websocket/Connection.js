import {channelName, getChannelUrl, websocketUrl} from "../../const/url.js";
import axios from "axios";
import MessageSession from "../class/MessageSession.js";
import {drawRecord} from "../CanvasManager.js";
import {records} from "../PenManager.js";
import {messageParsing} from "../MessageParsing.js";

class Connection {
    socket
    uuid

    init() {
        let s
        axios.get(getChannelUrl).then((response) => {
            s = new WebSocket(websocketUrl)
            this.uuid = response.data

            s.onopen = () => {
                canvasConnection.sendCommand("/init")
                console.log("已连接至服务器")
            }

            this.socket = s

            this.socket.onmessage = (event) => {
                //解析命令
                if (event.data.charAt(0) === "/")
                    if (messageParsing.paringCommand(event.data)) return
                const parseObj = JSON.parse(event.data);
                records.push(parseObj)
                drawRecord(parseObj)
                console.log(parseObj)
            }
        })

        return this
    }

    sendObjectMessage(message) {
        this.socket.send(JSON.stringify(new MessageSession(this.uuid, channelName, JSON.stringify(message))));
    }

    sendCommand(message) {
        this.socket.send(JSON.stringify(new MessageSession(this.uuid, channelName, message)));
    }
}

export const canvasConnection = new Connection()