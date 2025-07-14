import {canvas} from "./CanvasManager.js";
import {records} from "./PenManager.js";

class MessageParsing {
    map
    isExistCommand

    paringCommand(command) {
        this.isExistCommand = false
        this.map.get(command)();
        return this.isExistCommand
    }


    init() {
        const map = this.map = new Map();
        map.set("/init", () => {
            this.isExistCommand = true
        })
        map.set("/sync", () => {
            canvas.clearMainCanvas()
            this.isExistCommand = true
        })
        map.set("/reset", () => {
            canvas.clearMainCanvas()
            records.length = 0
            this.isExistCommand = true
        })
        map.set("/retract", () => {
            canvas.clearMainCanvas()
            this.isExistCommand = true
        })

        return this
    }
}

const messageParsing = new MessageParsing().init();
export {messageParsing}