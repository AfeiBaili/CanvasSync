import {lineType, penType, rectType, roundType} from "../const/PenType.js";
import {records} from "./PenManager.js";

const canvas = {
    mainCanvas: null,
    mainContext: null,
    secondaryCanvas: null,
    secondaryContext: null,
    /**
     * 初始化canvas画布及其环境
     */
    init() {
        this.mainCanvas = document.getElementById("main-canvas");
        this.mainContext = this.mainCanvas.getContext("2d")
        this.secondaryCanvas = document.getElementById("secondary-canvas");
        this.secondaryContext = this.secondaryCanvas.getContext("2d");
        resize()
        window.onresize = resize
        drawBackground(backgroundLineCount)
    },
    clearMainCanvas,
    clearSecondaryCanvas
}

const backgroundLineColor = "#494949"
const backgroundLineCount = 15

/**
 * 绘制背景线
 * @param count 背景线的数量
 */
function drawBackground(count) {
    let offset = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth / count;
    let pen = canvas.mainContext;
    for (let i = 0; i < count; i++) {
        pen.fillStyle = backgroundLineColor;
        canvas.mainContext.fillRect(offset * i + offset / 2, 0, 1, window.innerHeight)
        canvas.mainContext.fillRect(0, offset * i + offset / 2, window.innerWidth, 1)
    }
}

/**
 * 设置canvas大小，通过上方代码实时设置
 */
function resize() {
    canvas.mainCanvas.width = window.innerWidth
    canvas.mainCanvas.height = window.innerHeight
    canvas.secondaryCanvas.width = window.innerWidth
    canvas.secondaryCanvas.height = window.innerHeight
    drawBackground(backgroundLineCount)
    drawRecords(records)
}

/**
 * 重置主要画布
 */
function clearMainCanvas() {
    canvas.mainContext.beginPath();
    canvas.mainContext.clearRect(0, 0, window.innerWidth, window.innerHeight)
    drawBackground(backgroundLineCount)
}

/**
 * 重置次要画布
 */
function clearSecondaryCanvas() {
    canvas.secondaryContext.beginPath();
    canvas.secondaryContext.clearRect(0, 0, window.innerWidth, window.innerHeight)
}

function drawRecords(records) {
    canvas.mainContext.beginPath();
    canvas.mainContext.clearRect(0, 0, innerWidth, innerHeight);
    drawBackground(backgroundLineCount)
    records.forEach((record) => {
        drawRecord(record)
    })
}

function drawRecord(message) {
    let pen = canvas.mainContext;
    pen.beginPath();
    pen.lineWidth = message.w
    pen.strokeStyle = message.c
    pen.fillStyle = message.c
    pen.lineCap = "round";
    pen.lineJoin = "round";

    switch (message.t) {
        case penType:
            pen.moveTo(message.sX, message.sY);
            message.p.forEach((path) => {
                pen.lineTo(path.x, path.y);
            })
            pen.stroke();
            break
        case lineType:
            pen.moveTo(message.sX, message.sY);
            pen.lineTo(message.eX, message.eY);
            pen.stroke()
            break
        case rectType:
            if (message.isS) pen.fillRect(message.sX, message.sY, message.eX, message.eY)
            else pen.strokeRect(message.sX, message.sY, message.eX, message.eY);
            break
        case roundType:
            pen.ellipse(message.sX, message.sY, message.eX, message.eY, 0, 0, Math.PI * 2);
            if (message.isS) pen.fill()
            else pen.stroke();
            break
    }
    pen.closePath()
}

export {canvas, drawRecord,drawRecords}