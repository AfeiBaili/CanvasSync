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
    public static final Set<Session> canvasSessions = Collections.synchronizedSet(new HashSet<Session>());
    public static final List<String> initRecord = Collections.synchronizedList(new ArrayList<String>());
}
