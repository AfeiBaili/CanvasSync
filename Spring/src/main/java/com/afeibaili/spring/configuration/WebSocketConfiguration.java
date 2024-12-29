package com.afeibaili.spring.configuration;

import com.afeibaili.spring.controller.Canvas;
import com.afeibaili.spring.controller.Chat;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

/**
 * WebSocket配置类
 *
 * @author AfeiB
 * {@code @datetime}2024/12/29 12:54
 */
@Configuration
public class WebSocketConfiguration {

    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        ServerEndpointExporter serverEndpointExporter = new ServerEndpointExporter();
        serverEndpointExporter.setAnnotatedEndpointClasses(Canvas.class, Chat.class);
        return serverEndpointExporter;
    }
}
