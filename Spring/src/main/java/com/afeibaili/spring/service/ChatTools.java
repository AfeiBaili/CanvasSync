package com.afeibaili.spring.service;

import jakarta.websocket.Session;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.afeibaili.spring.service.CanvasTools.initRecord;

/**
 * Chat的逻辑层处理，用于解析命令
 *
 * @author AfeiB
 * {@code @datetime}2024/12/30 00:45
 */

public class ChatTools {
    public static final List<Session> chatSessions = Collections.synchronizedList(new ArrayList<Session>());

    public static void parsing(Session session, String message) {
        switch (message) {
            case "/clear":
                initRecord.clear();
                sendAll(session, message);
                break;
            case "/sync":
                initRecord.forEach(m -> {
                    try {
                        session.getBasicRemote().sendText("/sync record " + m);
                    } catch (IOException e) {
                        System.out.println("同步消息时发出错误:  " + e);
                    }
                });
                break;
            case "/withdrawn":
                if (!initRecord.isEmpty()) {
                    initRecord.remove(initRecord.size() - 1);
                    sendAll(session, message);
                    System.out.println("用户撤回了一条绘画消息");
                }
                break;
        }
    }

    public static void sendAll(Session session, String message) {
        chatSessions.forEach(s -> {
            if (!s.getId().equals(session.getId())) {
                s.getAsyncRemote().sendText(message);
            }
        });
        System.out.println("用户" + session.getId() + "发送聊天消息: " + message);
    }
}
