<script setup>
import CanvasPanel from "./components/CanvasPanel.vue";
import MainMenu from "./components/MainMenu.vue";
import {onMounted} from "vue";
import {canvasConnection} from "./model/websocket/Connection.js";
import {canvas} from "./model/CanvasManager.js";
import ErrorMessage from "./components/ErrorMessage.vue";
import ChatPanel from "./components/ChatPanel.vue";

onMounted(() => {
  canvasConnection.init()
  canvas.init()
});

</script>

<template>
  <CanvasPanel/>
  <MainMenu/>
  <!--<Debug/>-->
  <ChatPanel/>
  <ErrorMessage/>
</template>