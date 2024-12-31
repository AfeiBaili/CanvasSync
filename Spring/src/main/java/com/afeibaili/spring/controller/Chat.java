package com.afeibaili.spring.controller;

import com.afeibaili.spring.service.ChatTools;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;

import static com.afeibaili.spring.service.CanvasTools.canvasSessions;
import static com.afeibaili.spring.service.ChatTools.chatSessions;

/**
 * 同步画布的聊天模块
 *
 * @author AfeiB
 * {@code @datetime}2024/12/29 23:47
 */

@ServerEndpoint("/chat")
public class Chat {

    @OnOpen
    public void onOpen(Session session) {
        chatSessions.add(session);
        System.out.println("将用户添加到聊天组: " + session.getId());
        chatSessions.forEach(s -> {
            s.getAsyncRemote().sendText("在线数量chat: " + chatSessions.size() + "、 canvas: " + canvasSessions.size());
        });
    }

    @OnMessage
    public void onMessage(Session session, String message) {
        if (message.charAt(0) == '/') {
            ChatTools.parsing(session, message);
        } else {
            ChatTools.sendAll(session, message);
        }
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
        chatSessions.remove(session);
        System.out.println("用户断开聊天组并移除用户: " + session.getId() + " 关闭原因: " + reason.getReasonPhrase());
        chatSessions.forEach(s -> {
            s.getAsyncRemote().sendText("在线数量chat: " + chatSessions.size() + "、 canvas: " + canvasSessions.size());
        });
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        chatSessions.remove(session);
        System.out.println("用户断开聊天组并移除用户 onError: " + session.getId() + " 抛出错误: " + throwable.getMessage());
        chatSessions.forEach(s -> {
            s.getAsyncRemote().sendText("在线数量chat: " + chatSessions.size() + "、 canvas: " + canvasSessions.size());
        });
    }
}
