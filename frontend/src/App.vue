<script setup>
import CanvasPanel from "./components/CanvasPanel.vue";
import MainMenu from "./components/MainMenu.vue";
import {onMounted} from "vue";
import {canvasConnection} from "./model/websocket/Connection.js";
import {canvas} from "./model/CanvasManager.js";
import Debug from "./components/Debug.vue";
import ErrorMessage from "./components/ErrorMessage.vue";

onMounted(() => {
  canvasConnection.init()
  canvas.init()
});

</script>

<template>
  <CanvasPanel/>
  <MainMenu/>
<!--  <Debug/>-->

  <ErrorMessage/>
</template>