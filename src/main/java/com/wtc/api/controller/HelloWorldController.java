package com.wtc.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping(path = "/hello")
public class HelloWorldController {
    @GetMapping(path = "")
    public ResponseEntity<Map<String, String>> hello() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Collections.singletonMap("hello", "world-test"));
    }
}
