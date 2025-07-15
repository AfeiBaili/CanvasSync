import {ref} from "vue";

const messagesElement = ref(null)

class Message {
    name
    message

    constructor(name, message) {
        this.name = name;
        this.message = message;
    }
}

function scrollView(elementRef) {
    elementRef.value.children[elementRef.value.children.length - 1].scrollIntoView({behavior: 'smooth'})
}

const messageList = ref([new Message("无名称", "测试")])
messageList.value.pop()
export {Message, messageList, scrollView, messagesElement};