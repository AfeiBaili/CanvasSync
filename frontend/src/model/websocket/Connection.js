import {
    canvasChannelName,
    chatChannelName,
    getCanvasChannelUrl,
    getChatChannelUrl,
    websocketUrl
} from "../../const/url.js";
import axios from "axios";
import MessageSession from "../class/MessageSession.js";
import {drawRecord} from "../CanvasManager.js";
import {records} from "../PenManager.js";
import {messageParsing} from "../MessageParsing.js";
import {messageList, messagesElement, scrollView} from "../../const/Message.js";
import {focus} from "../../const/ChatPanel.js";
import {nextTick} from "vue";

class Connection {
    socket
    uuid
    chatUuid
    chatSocket

    init() {
        let s
        axios.get(getCanvasChannelUrl).then((response) => {
            this.uuid = response.data
            s = new WebSocket(websocketUrl)
            this.socket = s

            this.socket.onopen = () => {
                canvasConnection.sendCommand("/init")
                console.log("已连接画布至服务器")
            }

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
        /** 定义聊天socket */
        axios.get(getChatChannelUrl).then((response) => {
            this.chatUuid = response.data
            s = new WebSocket(websocketUrl)
            this.chatSocket = s

            this.chatSocket.onopen = () => {
                const stringMessage =
                    JSON.stringify(new MessageSession(this.chatUuid, chatChannelName, "/init-chat"));
                s.send(stringMessage)
                console.log("已连接聊天至服务器")
            }

            this.chatSocket.onmessage = (event) => {
                if (event.data === "/init-chat") return
                messageList.value.push(JSON.parse(event.data))
                focus.value = true
                nextTick(() => {
                    scrollView(messagesElement)
                }).then(r =>
                    null
                )
                console.log(event.data)
            }
        })

        return this
    }

    /**
     * 使用ChatSocket发送聊天信息
     * @param message
     */
    sendChatMessage(message) {
        const stringMessage = JSON.stringify(new MessageSession(this.chatUuid, chatChannelName, message));
        this.chatSocket.send(stringMessage)
    }

    sendObjectMessage(message) {
        const stringMessage = JSON.stringify(new MessageSession(this.uuid, canvasChannelName, JSON.stringify(message)));

        this.sendBinaryMessage(stringMessage).then(response => {
            this.socket.send(response);
        });
    }

    sendCommand(message) {
        this.socket.send(JSON.stringify(new MessageSession(this.uuid, canvasChannelName, message)));
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