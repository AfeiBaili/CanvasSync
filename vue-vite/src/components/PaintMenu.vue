<script setup>
import {usePenStore} from "../store/pen-store.js";
import {lineT, penT, rectT, roundT} from "../const/pen-state.js";
import canvas from "../js/canvas.js";
import {ref} from "vue";

let pen = usePenStore();

let isLastColor = ref(false);
let isMiniSize = ref(false);

function usePen() {
  pen.pen.type = penT
}

function useRect() {
  pen.pen.type = rectT
}

function useRound() {
  pen.pen.type = roundT
}

function useLine() {
  pen.pen.type = lineT
}

function changeColor(e) {
  if (e.shiftKey || isLastColor.value) {
    if (pen.pen.color <= 0) {
      pen.pen.color = pen.pen.colors.length
    }
    pen.pen.color -= 1
  } else {
    pen.pen.color += 1
    if (pen.pen.color >= pen.pen.colors.length) {
      pen.pen.color = 0
    }
  }
}

function changeSize(e) {
  if (e.shiftKey || isMiniSize.value) {
    pen.pen.width -= 1
    if (pen.pen.width < 1) pen.pen.width = 1
  } else {
    pen.pen.width += 1
  }
}

function setting() {
}

function clearAll() {
  canvas.pen.clearRect(0, 0, canvas.width, canvas.height);
  canvas.drawBackground(canvas.pen, 20, 0, true)
  pen.record = []
}
</script>

<template>
  <menu>
    <li @click="usePen">画笔
      <span class="pen"></span>
    </li>
    <li class="line">|</li>
    <li @click="useRect">方形
      <span class="rect"></span>
    </li>
    <li class="line">|</li>
    <li @click="useRound">圆形
      <span class="round"></span>
    </li>
    <li class="line">|</li>
    <li @click="useLine">线
      <span class="line-t"></span>
    </li>
    <li class="line">|</li>
    <li @click="changeSize">更改大小
      <span class="add-size">{{ pen.pen.width }}</span>
      <span class="is-shift" @click.stop="isMiniSize=!isMiniSize">{{ isMiniSize ? "↓" : "↑" }}</span>
    </li>
    <li class="line">|</li>
    <li @click="changeColor">更改颜色
      <span class="color" :style="{backgroundColor:pen.pen.colors[pen.pen.color]}"></span>
      <span class="is-shift" @click.stop="isLastColor=!isLastColor">{{ isLastColor ? "↓" : "↑" }}</span>
    </li>
    <li class="line">|</li>
    <li @click="setting">设置
      <span></span>
    </li>
    <li class="line">|</li>
    <li @click="clearAll">重置
      <span class="clear">C</span>
    </li>
  </menu>
</template>

<style scoped>
menu {
  /*
    background: linear-gradient(30deg, var(--paint-menu-list-font-color1), var(--paint-menu-list-font-color2));
    background-clip: text;*/
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