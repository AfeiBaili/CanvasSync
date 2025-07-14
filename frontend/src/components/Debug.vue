<script setup>
import {isOpenSecondaryCanvas} from "../const/Debug.js";
</script>

<template>
  <button @click="isOpenSecondaryCanvas = !isOpenSecondaryCanvas">开/关次要画布：{{ isOpenSecondaryCanvas}}</button>
</template>

<style scoped>
* {
  position: absolute;
}
</style>