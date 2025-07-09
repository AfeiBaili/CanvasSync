package online.afeibaili.messageforwarding.websocket

import jakarta.websocket.*
import jakarta.websocket.server.ServerEndpoint


/**
 * WebSocket接口
 *
 *@author AfeiBaili
 *@version 2025/7/9 16:25
 */
interface WebSocket {
    fun onOpen(session: Session, config: EndpointConfig)

    fun onMessage(session: Session, message: String)

    fun onClose(session: Session, closeReason: CloseReason)

    fun onError(session: Session, throwable: Throwable)
}