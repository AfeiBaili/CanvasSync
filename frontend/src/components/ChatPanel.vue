<script setup>
import {nextTick, ref} from "vue";
import {Message, messageList, messagesElement, scrollView} from "../const/Message.js";
import {canvasConnection} from "../model/websocket/Connection.js";
import {printInfo} from "../const/ErrorMessage.js";
import {focus} from "../const/ChatPanel.js";

const name = ref("")
const message = ref("")

function sendMessage() {
  let tempName = name.value
  if (tempName === "") {
    tempName = "无名称"
  }
  if (message.value === "") {
    printInfo("无消息内容")
    return
  }
  const mes = new Message(tempName, message.value);
  canvasConnection.sendChatMessage(JSON.stringify(mes))
  messageList.value.push(mes)
  focus.value = true
  message.value = ""
  nextTick(() => {
    scrollView(messagesElement)
  })
}

</script>

<template>
  <div @mouseleave="focus = false" @mouseenter="focus = true">
    <div class="chat-panel" v-show="focus" ref="messagesElement">
      <div class="message" v-for="(obj,index) in messageList" :key="index">{{ obj.name }}：{{ obj.message }}</div>
    </div>
    <div class="chat-menu">
      <input class="name-input" type="text" placeholder="聊天名称" v-model="name"/>
      <input class="message-input" type="text" placeholder="输入回车以发送 ↩" v-model="message"
             @keydown.enter="sendMessage"/>
    </div>
  </div>
</template>

<style scoped>
.chat-panel {
  width: 20vw;
  height: 100px;
  position: absolute;
  bottom: 6vh;
  left: 0;
  display: flex;
  flex-direction: column;
  background-color: #ffffff00;
  overflow-y: scroll;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #d5d5d5 transparent;
  border-radius: 5px 5px 0 0;

  .message {
    font-size: 0.8em;
    color: white;
    width: 100%;
  }
}

.chat-panel:hover {
  background-color: rgba(87, 87, 87, 0.5);
}

.chat-menu {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 20vw;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 10px 10px 0 0;

  input {
    position: absolute;
    bottom: 0;
    height: 6vh;
    border: none;
    margin: 0;
    padding: 0;
    color: white;
    text-align: center;
    background-color: transparent;
    transition: all 0.2s;
    border-top: var(--paint-menu-border-color) solid var(--paint-menu-border-width);
    border-left: var(--paint-menu-border-color) solid var(--paint-menu-border-width);
    border-right: var(--paint-menu-border-color) solid var(--paint-menu-border-width);
    box-sizing: border-box;
    font-size: 1em;
  }

  input::placeholder {
    position: relative;
    top: 3px;
  }

  input:focus {
    border: none;
    outline: none;
    background-color: rgba(23, 23, 23, 0.5);
  }

  .name-input {
    width: 30%;
    left: 0;
    color: var(--paint-menu-list-font-color2);
    border-radius: var(--paint-menu-radius) 0 0 0;
  }

  .message-input {
    width: 70%;
    right: 0;
    border-radius: 0 var(--paint-menu-radius) 0 0;
  }
}

</style>