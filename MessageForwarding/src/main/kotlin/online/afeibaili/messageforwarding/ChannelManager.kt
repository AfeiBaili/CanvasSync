package online.afeibaili.messageforwarding

import jakarta.websocket.Session
import online.afeibaili.messageforwarding.websocket.pojo.ChannelTable
import java.nio.ByteBuffer

object ChannelManager {
    val map = HashMap<String, ChannelTable>()

    /**
     * 获取UUID，如果map中没有UUID将创建一个新的键值对
     */
    fun getOrCreateChannel(channel: ChannelTable): String {
        map[channel.name]?.let { return it.uuid }
        map.put(channel.name, channel)
        return channel.uuid
    }

    fun sendChannelAll(session: Session, name: String, message: String) {
        map[name]!!.set.forEach {
            if (it == session) return@forEach
            it.asyncRemote.sendText(message)
        }
    }

    fun sendChannelAllByBinary(session: Session, name: String, bytes: ByteBuffer) {
        map[name]!!.set.forEach {
            if (it == session) return@forEach
            it.asyncRemote.sendBinary(bytes)
        }
    }
}