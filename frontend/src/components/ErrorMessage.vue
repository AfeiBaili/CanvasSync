<script setup>
import {isOk, message} from "../const/ErrorMessage.js";
</script>

<template>
  <transition name="fade">
    <div v-show="!isOk" class="message">{{ message }}
      <button @click="isOk = true">确认</button>
    </div>
  </transition>
</template>

<style scoped>
.message {
  position: absolute;
  left: 50%;
  top: 15%;
  transform: translateX(-50%);
  color: #da3648;
  text-shadow: 2px 2px 0 #ffffff;
  font-size: 2em;

  button {
    border: none;
    background-color: transparent;
    color: #4cb9f6;
    text-shadow: 2px 2px 0 #ffffff;
    vertical-align: text-bottom;
    text-decoration-line: underline;

    font-size: 0.5em;

    transition: all 0.2s;
  }

  button:hover {
    font-size: 1em;
  }

  button:active {
    color: #b9e6ff;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-leave-to {
  opacity: 0;
}
</style>