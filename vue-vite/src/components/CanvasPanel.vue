<script setup>

import canvas from "../js/canvas.js";
import {usePenStore} from "../store/pen-store.js";
import {lineT, penT, rectT, roundT} from "../const/pen-state.js";
import Record from "../class/record.js";
import {onMounted} from "vue";
import websocket from "../js/websocket.js";

onMounted(() => {
  canvas.init()
  websocket.init()
})

let pen = usePenStore();

function startDrawing(e) {
  canvas.pen.lineWidth = pen.pen.width
  canvas.pen.strokeStyle = pen.pen.colors[pen.pen.color];
  canvas.pen.lineCap = "round";
  canvas.pen.lineJoin = "round";
  switch (pen.pen.type) {
    case penT:
      canvas.pen.moveTo(e.offsetX, e.offsetY);
      pen.pen.startPointX = e.offsetX
      pen.pen.startPointY = e.offsetY
      pen.record.push(new Record(pen.pen.colors[pen.pen.color], pen.pen.width, pen.pen.type, pen.pen.startPointX, pen.pen.startPointY, 0, 0))
      break
    case lineT:
      canvas.pen.moveTo(e.offsetX, e.offsetY);
      pen.pen.startPointX = e.offsetX
      pen.pen.startPointY = e.offsetY
      break
    case rectT:
      pen.pen.startPointX = e.offsetX
      pen.pen.startPointY = e.offsetY
      break
    case roundT:
      pen.pen.startPointX = e.offsetX
      pen.pen.startPointY = e.offsetY
      break
  }
  pen.pen.isDrawing = true
}

function drawing(e) {
  if (pen.pen.isDrawing) {
    canvas.lastRecord(pen.record)
    canvas.pen.lineWidth = pen.pen.width
    canvas.pen.strokeStyle = pen.pen.colors[pen.pen.color];
    switch (pen.pen.type) {
      case penT:
        canvas.pen.lineTo(e.offsetX, e.offsetY);
        pen.record[pen.record.length - 1].p.push({x: e.offsetX, y: e.offsetY})
        break
      case lineT:
        canvas.pen.beginPath()
        canvas.pen.moveTo(pen.pen.startPointX, pen.pen.startPointY);
        canvas.pen.lineTo(e.offsetX, e.offsetY);
        canvas.pen.stroke();
        break
      case rectT:
        canvas.pen.strokeRect(
            pen.pen.startPointX,
            pen.pen.startPointY,
            e.offsetX - pen.pen.startPointX,
            e.offsetY - pen.pen.startPointY
        );
        break
      case roundT:
        canvas.pen.beginPath()
        let startX = pen.pen.startPointX + (e.offsetX - pen.pen.startPointX) / 2;
        let startY = pen.pen.startPointY + (e.offsetY - pen.pen.startPointY) / 2;
        let radiusX = Math.abs(e.offsetX - startX);
        let radiusY = Math.abs(e.offsetY - startY);
        canvas.pen.ellipse(startX, startY, radiusX, radiusY, 0, 0, Math.PI * 2);
        canvas.pen.stroke();
        break
    }
    canvas.pen.closePath()
  }
}

function endDrawing(e) {
  switch (pen.pen.type) {
    case lineT:
      canvas.pen.beginPath()
      pen.pen.endPointX = e.offsetX
      pen.pen.endPointY = e.offsetY
      canvas.pen.lineTo(pen.pen.endPointX, pen.pen.endPointY);
      canvas.pen.stroke()
      break
    case rectT:
      pen.pen.endPointX = e.offsetX - pen.pen.startPointX
      pen.pen.endPointY = e.offsetY - pen.pen.startPointY
      canvas.pen.strokeRect(
          pen.pen.startPointX,
          pen.pen.startPointY,
          pen.pen.endPointX,
          pen.pen.endPointY
      );
      break
    case roundT:
      canvas.pen.beginPath()
      let startX = pen.pen.startPointX + (e.offsetX - pen.pen.startPointX) / 2;
      let startY = pen.pen.startPointY + (e.offsetY - pen.pen.startPointY) / 2;
      let radiusX = Math.abs(e.offsetX - startX);
      let radiusY = Math.abs(e.offsetY - startY);
      canvas.pen.ellipse(startX, startY, radiusX, radiusY, 0, 0, Math.PI * 2);
      canvas.pen.stroke();
      pen.pen.startPointX = startX;
      pen.pen.startPointY = startY;
      pen.pen.endPointX = radiusX;
      pen.pen.endPointY = radiusY;
      break;
  }
  canvas.pen.closePath()
  pen.pen.isDrawing = false
  if (pen.pen.type !== penT) {
    let record = new Record(pen.pen.colors[pen.pen.color], pen.pen.width, pen.pen.type, pen.pen.startPointX, pen.pen.startPointY, pen.pen.endPointX, pen.pen.endPointY);
    pen.record.push(record)
  }
  canvas.lastRecord(pen.record)
  websocket.sendCanvas(pen.record[pen.record.length - 1])
}

</script>

<template>
  <canvas @mousedown="startDrawing" @mousemove="drawing" @mouseup="endDrawing">
  </canvas>
</template>

<style scoped>
</style>