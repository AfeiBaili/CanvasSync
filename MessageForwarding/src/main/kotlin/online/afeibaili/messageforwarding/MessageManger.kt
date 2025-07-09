package online.afeibaili.messageforwarding

import jakarta.websocket.Session
import online.afeibaili.messageforwarding.websocket.pojo.MessageSession
import online.afeibaili.messageforwarding.websocket.util.json

object MessageManger {

    /**
     * 解析Json消息，消息内容需要包含，频道名、uuid、消息本身
     */

    fun parsing(message: String) = runCatching {
        val value: MessageSession = json.readValue(message, MessageSession::class.java)
        value
    }
}