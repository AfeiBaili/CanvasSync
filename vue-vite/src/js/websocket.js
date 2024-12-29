import canvas from "./canvas.js";
import {usePenStore} from "../store/pen-store.js";

let socket = new WebSocket('ws://afeibaili.online:8080/canvas');

const websocket = {
    init() {
        let pen = usePenStore();
        socket.onopen = () => {
            console.log("连接成功");
        }
        socket.onerror = (e) => {
            console.log("连接关闭: ", e.reason)
        }
        socket.onclose = (e) => {
            console.log("错误关闭", e)
        }
        socket.onmessage = (e) => {
            console.log(e.data)
            let record = JSON.parse(e.data);
            pen.record.push(record)
            canvas.drawMessage(record)
        }
        onbeforeunload = () => {
            socket.close(1000, "用户关闭");
            return false
        }
    }, sand(date) {
        try {
            socket.send(JSON.stringify(date))
        } catch (err) {
            socket = new WebSocket('ws://localhost:8080/canvas')
            socket.send(JSON.stringify(date))
        }
    }, socket: socket
}

export default websocket