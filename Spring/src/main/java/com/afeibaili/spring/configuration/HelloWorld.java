package com.afeibaili.spring.configuration;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HelloWorld
 *
 * @author AfeiB
 * {@code @datetime}2024/12/29 16:45
 */
@RestController
public class HelloWorld {
    @GetMapping("/")
    public String helloWorld() {
        return "Hello World";
    }
}
