package com.afeibaili.spring.service;

import jakarta.websocket.Session;

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

    public static void parsing(String message) {
        switch (message) {
            case "/clear":
                initRecord.clear();
                break;
        }
    }
}
