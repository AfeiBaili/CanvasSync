import {ref} from "vue";
import {lineType, penType, rectType, roundType} from "../const/PenType.js";
import Record from "./class/Record.js";
import {canvas} from "./CanvasManager.js";
import {canvasConnection} from "./websocket/Connection.js";

const pens = ref({
    colorIndex: 0,
    colors: [
        "#ccdde6",
        "#000000",
        "#ffffff",
        "#a151e0",
        "#42b883",
        "#57965c",
        "#39c5bb",
        "#4970c1",
        "#548af7",
        "#7c3f42",
        "#c94f4f",
        "#ce7241",
        "#ce4167",
        "#b3042f",
        "#ffd875",
        "#0ab30d",
        "#20b4e1",
        "#2057e1",
        "#6720e1",
        "#cc50d8",
    ],
    width: 5,
    type: penType,
    isDrawing: false,
    startPointX: 0,
    startPointY: 0,
    endPointX: 0,
    endPointY: 0,
    isRectSolid: false,
    isRoundSolid: false,
    startDrawing,
    drawing,
    endDrawing,
})

const records = [new Record(null, null, null, null, null, null, null, null)]
records.pop()

let pen = pens.value
let context = canvas.secondaryContext

/**
 * 开始绘制时
 * @param e 事件对象
 */
function startDrawing(e) {
    if (pen == null) pen = pens.value
    context = canvas.secondaryContext

    context.lineWidth = pen.width
    context.strokeStyle = pen.colors[pen.colorIndex]
    context.fillStyle = pen.colors[pen.colorIndex]
    context.lineCap = 'round';
    context.lineJoin = 'round';
    pen.startPointX = e.offsetX;
    pen.startPointY = e.offsetY;

    switch (pen.type) {
        case penType: {
            context.moveTo(e.offsetX, e.offsetY);
            records.push(new Record(
                pen.colors[pen.colorIndex],
                pen.width,
                pen.type,
                pen.startPointX,
                pen.startPointY,
                0,
                0,
                false
            ))
            break
        }
        case lineType: {
            context.moveTo(e.offsetX, e.offsetY);
            break
        }
        case rectType: {
            break
        }
        case roundType: {
            break
        }
    }
    pen.isDrawing = true
}

/**
 * 正在绘制时
 * @param e 事件对象
 */
function drawing(e) {
    if (!pen.isDrawing) return
    if (pen.type !== penType) _ClearBackground()
    context.lineWidth = pen.width
    context.strokeStyle = pen.colors[pen.colorIndex]
    context.fillStyle = pen.colors[pen.colorIndex]

    switch (pen.type) {
        case penType: {
            context.lineTo(e.offsetX, e.offsetY);
            context.moveTo(e.offsetX, e.offsetY);
            context.stroke()
            records[records.length - 1].p.push({x: e.offsetX, y: e.offsetY});
            break
        }
        case lineType: {
            context.beginPath()
            context.moveTo(pen.startPointX, pen.startPointY);
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke()
            break
        }
        case rectType: {
            if (pens.value.isRectSolid)
                context.fillRect(
                    pen.startPointX,
                    pen.startPointY,
                    e.offsetX - pen.startPointX,
                    e.offsetY - pen.startPointY
                )
            else context.strokeRect(
                pen.startPointX,
                pen.startPointY,
                e.offsetX - pen.startPointX,
                e.offsetY - pen.startPointY
            )
            break
        }
        case roundType: {
            _DrawEllipse(e, false)
            break
        }
    }
    context.closePath()
}

/**
 * 结束绘制时
 * @param e 事件对象
 */

function endDrawing(e) {
    if (!pen.isDrawing) return
    _ClearBackground()
    context = canvas.mainContext
    context.lineWidth = pen.width + 1
    context.strokeStyle = pen.colors[pen.colorIndex]
    context.fillStyle = pen.colors[pen.colorIndex]
    context.lineCap = 'round';
    context.lineJoin = 'round';

    switch (pen.type) {
        case penType: {
            canvas.secondaryContext.beginPath()
            canvas.secondaryContext.clearRect(0, 0, window.innerWidth, window.innerHeight)
            context.beginPath()
            context.moveTo(records[records.length - 1].sX, records[records.length - 1].sY)
            records[records.length - 1].p.forEach(p => {
                context.lineTo(p.x, p.y);
                context.moveTo(p.x, p.y);
            })
            context.stroke()
            break
        }
        case lineType: {
            context.beginPath()
            context.moveTo(pen.startPointX, pen.startPointY);
            pen.endPointX = e.offsetX;
            pen.endPointY = e.offsetY;
            context.lineTo(pen.endPointX, pen.endPointY);
            context.stroke()
            break
        }
        case rectType: {
            pen.endPointX = e.offsetX - pen.startPointX
            pen.endPointY = e.offsetY - pen.startPointY
            if (pens.value.isRectSolid)
                context.fillRect(
                    pen.startPointX,
                    pen.startPointY,
                    pen.endPointX,
                    pen.endPointY
                )
            else context.strokeRect(
                pen.startPointX,
                pen.startPointY,
                pen.endPointX,
                pen.endPointY
            )
            break
        }
        case roundType: {
            _DrawEllipse(e)
            break
        }
    }
    context.closePath()
    pen.isDrawing = false
    if (pen.type !== penType) {
        let record = new Record(pen.colors[pen.colorIndex],
            pen.width,
            pen.type,
            pen.startPointX,
            pen.startPointY,
            pen.endPointX,
            pen.endPointY,
            judgeSolid()
        )
        records.push(record);
    }
    canvasConnection.sendObjectMessage(records[records.length - 1])
}

/**
 * 返回是否是实心
 * @returns {boolean} 是否是实心
 */
function judgeSolid() {
    if (pen.type === rectType) return pens.value.isRectSolid
    if (pen.type === roundType) return pens.value.isRoundSolid
    return false
}

/**
 * 封装方法
 * @param e event对象
 * @param isEndDrawing 是否是最后操作
 * @private 私有的
 */
function _DrawEllipse(e, isEndDrawing = true) {
    context.beginPath()
    let startX = pen.startPointX + (e.offsetX - pen.startPointX) / 2;
    let startY = pen.startPointY + (e.offsetY - pen.startPointY) / 2;
    let radiusX = Math.abs(e.offsetX - startX);
    let radiusY = Math.abs(e.offsetY - startY);
    context.ellipse(startX, startY, radiusX, radiusY, 0, 0, Math.PI * 2);
    if (pens.value.isRoundSolid) context.fill()
    else context.stroke();

    if (isEndDrawing) {
        pen.startPointX = startX;
        pen.startPointY = startY;
        pen.endPointX = radiusX;
        pen.endPointY = radiusY;
    }
}


function _ClearBackground() {
    context.beginPath()
    context.clearRect(0, 0, window.innerWidth, window.innerHeight)
}

export {pens, records};