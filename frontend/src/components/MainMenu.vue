<script setup>
import {pens, records} from "../model/PenManager.js";
import {ref} from "vue";
import {lineType, penType, rectType, roundType} from "../const/PenType.js";
import {canvas, drawRecords} from "../model/CanvasManager.js";
import {canvasConnection} from "../model/websocket/Connection.js";
import {printInfo} from "../const/ErrorMessage.js";
import ChatPanel from "./ChatPanel.vue";

const pen = pens.value;
const isLastColor = ref(false);
const isMinusWidth = ref(false);

function usePen() {
  pen.type = penType
}

function useRect() {
  pen.type = rectType
}

function useRound() {
  pen.type = roundType
}

function useLine() {
  pen.type = lineType
}

function changeWidthSize(e) {
  if (isMinusWidth.value || e.shiftKey) {
    if (pen.width <= 1) pen.width = 1
    else pen.width--
  } else {
    pen.width++
  }
}

function changeColor(e) {
  if (e.shiftKey || isLastColor.value) {
    if (pen.colorIndex <= 0) {
      pen.colorIndex = pen.colors.length
    }
    pen.colorIndex -= 1
  } else {
    pen.colorIndex += 1
    if (pen.colorIndex >= pen.colors.length) {
      pen.colorIndex = 0
    }
  }
}

function clearCanvas() {
  canvas.clearMainCanvas()
  canvas.clearSecondaryCanvas()
}

function resetCanvas() {
  clearCanvas()
  records.length = 0
  canvasConnection.sendCommand("/reset")
}

function retract() {
  canvasConnection.sendCommand("/retract")
  records.pop()
  drawRecords(records)
}

</script>

<template>
  <menu>
    <li @click="usePen">画笔
      <span class="pen"></span>
    </li>
    <li class="line">|</li>
    <li @click="useRect">方形
      <span @click="pens.isRectSolid = !pens.isRectSolid" :class="pens.isRectSolid? 'rect':'rect-hollow'"></span>
    </li>
    <li class="line">|</li>
    <li @click="useRound">圆形
      <span @click="pens.isRoundSolid =!pens.isRoundSolid" :class="pens.isRoundSolid?'round':'round-hollow'"></span>
    </li>
    <li class="line">|</li>
    <li @click="useLine">线
      <span class="line-t"></span>
    </li>
    <li class="line">|</li>
    <li @click="changeWidthSize">更改大小
      <span class="add-size">{{ pen.width }}</span>
      <span class="is-shift" @click.stop="isMinusWidth = !isMinusWidth">{{ isMinusWidth ? "↓" : "↑" }}</span>
    </li>
    <li class="line">|</li>
    <li @click="changeColor">更改颜色
      <span class="color" :style="{backgroundColor: pen.colors[pen.colorIndex]}"></span>
      <span class="is-shift" @click.stop="isLastColor = !isLastColor">{{ isLastColor ? "↓" : "↑" }}</span>
    </li>
    <li class="line">|</li>
    <li @click="printInfo('暂无实现功能')">设置
      <span></span>
    </li>
    <li class="line">|</li>
    <li @click="retract">撤回
      <span class="withdrawn">↩</span>
    </li>
    <li class="line">|</li>
    <li @click="resetCanvas">重置
      <span class="clear">↺</span>
    </li>
  </menu>
</template>

<style scoped>
menu {
  /*
    background: linear-gradient(30deg, var(--paint-menu-list-font-color1), var(--paint-menu-list-font-color2));
    background-clip: text;
  */
  color: var(--paint-menu-list-font-color1);

  height: 6vh;
  width: 60vw;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);

  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  border-radius: var(--paint-menu-radius) var(--paint-menu-radius) 0 0;
  border-top: var(--paint-menu-border-color) solid var(--paint-menu-border-width);
  border-left: var(--paint-menu-border-color) solid var(--paint-menu-border-width);
  border-right: var(--paint-menu-border-color) solid var(--paint-menu-border-width);
  box-sizing: border-box;

  li {
    list-style: none;
    user-select: none;
    border-radius: 3px;
    margin-top: 5px;
    font-size: 1em;

    transition: all 0.2s;

    .pen {
      width: 6px;
      height: 15px;
      display: inline-block;
      background-color: #4cb9f6;
      vertical-align: center;
      border-radius: 2px;

      transform: translateY(2px);
    }

    .rect {
      width: 14px;
      height: 14px;
      display: inline-block;
      background-color: #4cb9f6;
      border-radius: 2px;
      vertical-align: center;

      transform: translateY(1px);
    }

    .round {
      width: 16px;
      height: 16px;
      display: inline-block;
      background-color: #4cb9f6;
      border-radius: 50%;
      vertical-align: center;

      transform: translateY(2px);
    }

    .round-hollow {
      width: 16px;
      height: 16px;
      display: inline-block;
      box-shadow: inset 0 0 0 2px #4cb9f6;
      border-radius: 50%;
      vertical-align: center;

      transform: translateY(2px);
    }

    .rect-hollow {
      width: 14px;
      height: 14px;
      display: inline-block;
      box-shadow: inset 0 0 0 2px #4cb9f6;
      border-radius: 2px;
      vertical-align: center;

      transform: translateY(1px);
    }

    .line-t {
      width: 3px;
      height: 18px;
      display: inline-block;
      background-color: #4cb9f6;
      vertical-align: center;
      border-radius: 2px;

      transform: translateY(3px);
    }

    .color {
      width: 15px;
      height: 15px;
      display: inline-block;
      background-color: #4cb9f6;
      border-radius: 2px;
      vertical-align: center;

      transform: translateY(2px);
    }

    .clear {
      color: #4cb9f6;
      display: inline-block;
      transform: translateY(1px);
    }

    .withdrawn {
      color: #4cb9f6;
      display: inline-block;
      transform: translateY(1px);
    }

    .sync {
      color: #4cb9f6;
      display: inline-block;
      transform: translateY(1px);
    }

    .is-shift {
      color: #4cb9f6;
      font-size: 20px;
      display: inline-block;
      border-radius: 2px;
      vertical-align: center;
      margin-left: 4px;

      transform: translateY(2px);
    }

    .add-size {
      display: inline-block;

      font-weight: bolder;
      transform: translateY(1px);
    }
  }

  li:hover:not(.line) {
    transform: translateY(-15px) rotate(2deg) scale(2);
  }

  li:active:not(.line) {
    transform: translateY(-7px) rotate(10deg) scale(2);
  }

  .line {
    color: var(--paint-menu-list-line-color);
  }
}
</style>