package com.afeibaili.spring.service;

import jakarta.websocket.Session;

import java.util.*;

/**
 * Canvas的逻辑层处理
 *
 * @author AfeiB
 * {@code @datetime}2024/12/30 00:45
 */

public class CanvasTools {
    public static final Set<Session> canvasSessions = Collections.synchronizedSet(new HashSet<>());
    public static final List<String> initRecord = Collections.synchronizedList(new ArrayList<>());

    public static void sendAll(Session session, String message) {
        canvasSessions.forEach(s -> {
            if (!s.getId().equals(session.getId())) {
                s.getAsyncRemote().sendText(message);
            }
        });
        initRecord.add(message);
        System.out.println("用户" + session.getId() + "添加消息到消息组: " + message);
    }
}
