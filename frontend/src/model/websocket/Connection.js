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
                if (typeof (event.data) == "string") {
                    //解析命令
                    if (event.data.charAt(0) === "/")
                        if (messageParsing.paringCommand(event.data)) return
                    processMessage(event.data)
                    return;
                }

                receivedGzipMessage(event.data).then(response => {
                    processMessage(response)
                })
            }
        })

        return this
    }

    sendObjectMessage(message) {
        const stringMessage = JSON.stringify(new MessageSession(this.uuid, channelName, JSON.stringify(message)));

        this.sendBinaryMessage(stringMessage).then(response => {
            this.socket.send(response);
        });
    }

    sendCommand(message) {
        this.socket.send(JSON.stringify(new MessageSession(this.uuid, channelName, message)));
    }

    async sendBinaryMessage(text) {
        const input = new TextEncoder().encode(text);
        const stream = new Blob([input]).stream();
        const gzipStream = stream.pipeThrough(new CompressionStream("gzip"));
        return await new Response(gzipStream).arrayBuffer()
    }
}

function processMessage(message) {
    const parseObj = JSON.parse(message);
    records.push(parseObj)
    drawRecord(parseObj)
    console.log(parseObj)
}

async function receivedGzipMessage(blob) {
    const ungzipStream =
        blob.stream().pipeThrough(new DecompressionStream("gzip"));
    return await new Response(ungzipStream).text()
}

export const canvasConnection = new Connection()