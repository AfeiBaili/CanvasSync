import canvas from "./canvas.js";
import {usePenStore} from "../store/pen-store.js";
import commandParsing from "./command-parsing.js";

// let socket = new WebSocket('ws://127.0.0.1:8080/canvas');
// let chat = new WebSocket('ws://127.0.0.1:8080/chat');
let socket = new WebSocket('ws://afeibaili.online:8080/canvas');
let chat = new WebSocket('ws://afeibaili.online:8080/chat');

const websocket = {
    init() {
        let pen = usePenStore();
        socket.onopen = () => {
            console.log("图形系统对接成功");
        }
        socket.onclose = (e) => {
            console.log("收到了关闭图形系统并留言: ", e.reason)
        }
        socket.onerror = (e) => {
            console.log("收到了错误关闭图形系统, 理由是: ", e.reason)
        }
        socket.onmessage = (e) => {
            console.log(e.data)
            let record = JSON.parse(e.data);
            pen.record.push(record)
            canvas.drawMessage(record)
        }

        chat.onopen = () => {
            console.log("通讯系统对接成功")
        }
        chat.onclose = (e) => {
            console.log("收到了关闭通信系统并留言", e.reason)
        }
        chat.onerror = (e) => {
            console.log("收到了错误关闭通信系统, 理由是: ", e.reason)
        }
        chat.onmessage = (e) => {
            console.log(e.data)
            if (e.data.charAt(0) === '/') {
                commandParsing(e.data)
            } else {
                /////////
            }
        }


        onbeforeunload = () => {
            socket.close(1000, "用户关闭");
            chat.close(1000, "用户关闭")
            return false
        }
    },
    sendCanvas(data) {
        try {
            socket.send(JSON.stringify(data))
        } catch (err) {
            socket = new WebSocket('ws://localhost:8080/canvas')
            socket.send(JSON.stringify(data))
            console.log("图形系统在发送时出错, 原因是: ", err)
        }
    },
    sendChat(message) {
        try {
            chat.send(message)
        } catch (err) {
            chat = new WebSocket('ws://localhost:8080/chat')
            chat.send(message)
            console.log("通讯系统在发送时出错, 原因是: ", err)
        }
    },
    socket: socket,
    chat: chat,
}

export default websocket