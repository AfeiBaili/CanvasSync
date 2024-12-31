import {lineT, penT, rectT, roundT} from "../const/pen-state.js";
import {usePenStore} from "../store/pen-store.js";

const canvas = {
    init() {
        let canvas = document.querySelector("canvas");
        canvas.width = 1920;
        canvas.height = 1080;
        this.pen = canvas.getContext("2d")
        this.width = canvas.width;
        this.height = canvas.height;
        drawBackground(20, 0, true)
    },
    pen: null,
    width: 0,
    height: 0,
    drawBackground,
    lastRecord,
    drawMessage,
    clear,
    drawRecord,
}

function drawBackground(count, offset, isInit) {
    if (isInit) {
        offset = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth / count;
    }
    for (let i = 0; i < count; i++) {
        canvas.pen.fillStyle = "#393939"
        canvas.pen.fillRect(offset * i + offset / 2, 0, 1, window.innerHeight)
        canvas.pen.fillRect(0, offset * i + offset / 2, window.innerWidth, 1)
    }
}

function drawRecord(record) {
    record.forEach((r) => {
        drawMessage(r)
    })
}

function drawMessage(r) {
    canvas.pen.beginPath()
    canvas.pen.lineWidth = r.w
    canvas.pen.strokeStyle = r.c
    canvas.pen.lineCap = "round";
    canvas.pen.lineJoin = "round";
    switch (r.t) {
        case penT:
            canvas.pen.moveTo(r.sX, r.sY);
            r.p.forEach((path) => {
                canvas.pen.lineTo(path.x, path.y);
            })
            break
        case lineT:
            canvas.pen.moveTo(r.sX, r.sY);
            canvas.pen.lineTo(r.eX, r.eY);
            canvas.pen.stroke()
            break
        case rectT:
            canvas.pen.strokeRect(r.sX, r.sY, r.eX, r.eY);
            break
        case roundT:
            canvas.pen.ellipse(r.sX, r.sY, r.eX, r.eY, 0, 0, Math.PI * 2);
            canvas.pen.stroke();
            break
    }
    canvas.pen.stroke()
    canvas.pen.closePath()
}

function lastRecord(record) {
    canvas.pen.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(20, 0, true);
    drawRecord(record);
}

function clear() {
    let pen = usePenStore()
    canvas.pen.clearRect(0, 0, canvas.width, canvas.height);
    canvas.drawBackground(20, 0, true)
    pen.record = []
}

export default canvas