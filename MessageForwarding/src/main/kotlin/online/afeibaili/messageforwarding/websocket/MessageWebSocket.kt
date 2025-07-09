package online.afeibaili.messageforwarding.websocket

import jakarta.websocket.*
import jakarta.websocket.server.ServerEndpoint
import online.afeibaili.messageforwarding.ChannelManager
import online.afeibaili.messageforwarding.MessageManger
import online.afeibaili.messageforwarding.SessionManager
import online.afeibaili.messageforwarding.websocket.pojo.MessageSession
import online.afeibaili.messageforwarding.websocket.util.logger


/**
 * 消息转发主要类
 *
 *@author AfeiBaili
 *@version 2025/7/8 16:41
 */

@ServerEndpoint("/")
class MessageWebSocket : WebSocket {
    @OnOpen
    override fun onOpen(session: Session, config: EndpointConfig) {
        SessionManager.addSession(session)
        logger.info("连接进入：$session")
    }


    @OnMessage
    override fun onMessage(session: Session, message: String) {
        val messageSession: MessageSession = MessageManger.parsing(message).onFailure { exception ->
            return SessionManager.disconnect(
                session,
                "格式错误，正确格式需要包含uuid、频道名、消息内容。错误信息：${exception.message}"
            )
        }.getOrElse { exception ->
            return SessionManager.disconnect(
                session,
                "不可为null：${exception.message}"
            )
        }
        ChannelManager.map[messageSession.name]?.let { it ->
            if (messageSession.uuid != it.uuid) {
                return SessionManager.disconnect(
                    session,
                    "频道uuid校验错误"
                )
            }
            it.set.add(session)
            SessionManager.allMap.put(session, messageSession.name)
            ChannelManager.sendChannelAll(session, messageSession.name, messageSession.message)
            logger.info(messageSession.toString())
            return
        }

        SessionManager.disconnect(session, "没有所谓的频道，请使用\"/channel/get?name=频道名\"创建")
    }

    @OnClose
    override fun onClose(session: Session, closeReason: CloseReason) {
        SessionManager.removeSession(session)
        logger.warn("断开连接原因：${closeReason.reasonPhrase}")
    }

    @OnError
    override fun onError(session: Session, throwable: Throwable) {
        SessionManager.removeSession(session)
        logger.error("错误断开原因：${throwable.message}")
    }
}