package online.afeibaili.messageforwarding.websocket.util

import com.fasterxml.jackson.databind.json.JsonMapper
import online.afeibaili.messageforwarding.ChannelManager
import online.afeibaili.messageforwarding.SessionManager
import org.slf4j.Logger
import org.slf4j.LoggerFactory


/**
 * 一些工具方法和属性
 *
 *@author AfeiBaili
 *@version 2025/7/8 18:03
 */

val json: JsonMapper = JsonMapper()

val logger: Logger = LoggerFactory.getLogger("Channel")


fun printInfo() {
    logger.info("当前的频道数量：${ChannelManager.map.size}")
    logger.info("全部人数：${SessionManager.allMap}")
    logger.info(
        "频道人数：${
            ChannelManager.map.values.joinToString(" | ") { it ->
                " ${it.name}：${it.set.size} "
            }
        }")
}