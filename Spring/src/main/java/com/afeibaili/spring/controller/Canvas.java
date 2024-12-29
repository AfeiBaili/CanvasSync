package com.afeibaili.spring.controller;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.*;

/**
 * 画布信息的接收与发布
 *
 * @author AfeiB
 * {@code @datetime}2024/12/29 12:46
 */

@ServerEndpoint("/canvas")
public class Canvas {
    public static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<Session>());
    public static final List<String> initRecord = Collections.synchronizedList(new ArrayList<String>());

    @OnOpen
    public void onOpen(Session session) {
        if (!sessions.isEmpty()) {
            initRecord.forEach(m -> {
                try {
                    session.getBasicRemote().sendText(m);
                } catch (IOException e) {
                    System.out.println("阻塞发送时发出错误:  " + e);
                }
                System.out.println("向新来的用户添加消息: " + m);
            });
        }
        sessions.add(session);
        System.out.println("将用户添加到用户组: " + session.getId());
    }

    @OnMessage
    public void onMessage(Session session, String message) {
        sessions.forEach(s -> {
            if (!s.getId().equals(session.getId())) {
                s.getAsyncRemote().sendText(message);
            }
        });
        initRecord.add(message);
        System.out.println("用户" + session.getId() + "添加消息到消息组: " + message);
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
        sessions.remove(session);
        System.out.println("用户断开连接并移除用户: " + session.getId() + " 关闭原因: " + reason.getReasonPhrase());
        if (sessions.isEmpty()) {
            initRecord.clear();
            System.out.println("清空消息: " + "onClose");
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) throws IOException {
        session.close(new CloseReason(CloseReason.CloseCodes.UNEXPECTED_CONDITION, "根据错误关闭连接"));
        sessions.remove(session);
        System.out.println("用户断开连接并移除用户 onError: " + session.getId() + " 抛出错误: " + throwable.getMessage());
        if (sessions.isEmpty()) {
            initRecord.clear();
            System.out.println("清空消息: " + "onError");
        }
    }
}
