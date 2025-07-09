<script setup>
import {getChannelUrl, websocketUrl} from "./const/target_url.js";
import axios from "axios";
import MessageSession from "./model/MessageSession.js";
import {ref} from "vue";


let uuid

let socket;

axios.get(getChannelUrl).then(res => {
  uuid = res.data;
  socket = new WebSocket(websocketUrl);

  socket.onopen = () => {
    socket.send(JSON.stringify(new MessageSession(uuid, "test", "init")))
  }

  socket.onmessage = (event) => {
    console.log(event.data);
  }
})

let value = ref(1);

function sendMessage() {
  if (socket === undefined) return
  console.log(new MessageSession(uuid, "test", "消息是：" + value.value));
  socket.send(JSON.stringify(new MessageSession(uuid, "test", "消息是：" + value.value)));
  value.value++;
}

</script>

<template>
  <h1 @click="sendMessage">点我发送消息</h1>
</template>

<style scoped>
h1 {
  user-select: none;
}
</style>