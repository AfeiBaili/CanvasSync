import canvas from "./canvas.js";
import {usePenStore} from "../store/pen-store.js";

function commandParsing(command) {
    let pen = usePenStore();
    switch (command) {
        case '/clear':
            canvas.pen.clearRect(0, 0, canvas.width, canvas.height);
            canvas.drawBackground(20, 0, true)
            pen.record = []
            break
    }
}

export default commandParsing