import {ref} from "vue";

const message = ref("无")
const isOk = ref(true)

/**
 * 将消息打印到屏幕
 * @param m 消息
 */
function printInfo(m) {
    message.value = m
    isOk.value = false
}

export {message, isOk, printInfo}