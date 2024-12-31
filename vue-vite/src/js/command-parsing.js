import canvas from "./canvas.js";
import {usePenStore} from "../store/pen-store.js";

function commandParsing(command) {
    let pen = usePenStore();
    let parameters = command.split(/ +/)
    switch (parameters[0]) {
        case '/clear':
            canvas.clear();
            break
        case "/sync" :
            if (parameters[1] === "record") {
                let m = JSON.parse(parameters[2]);
                pen.record.push(m);
                canvas.drawMessage(m)
            }
            break
        case "/withdrawn":
            pen.record.pop()
            canvas.lastRecord(pen.record)
            break
    }
}

export default commandParsing