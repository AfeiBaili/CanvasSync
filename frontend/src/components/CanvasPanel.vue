<script setup>
import {pens} from "../model/PenManager.js";
import {isOpenSecondaryCanvas} from "../const/Debug.js";

let startDrawingFunction = pens.value.startDrawing
let drawingFunction = pens.value.drawing
let endDrawingFunction = pens.value.endDrawing
</script>

<template>
  <canvas id="main-canvas">
  </canvas>
  <canvas v-show="isOpenSecondaryCanvas" id="secondary-canvas" @mousedown="startDrawingFunction"
          @mousemove="drawingFunction"
          @mouseup="endDrawingFunction"
          @mouseout="endDrawingFunction">
  </canvas>
</template>

<style scoped>
canvas {
  position: absolute;
}
</style>