package com.wtc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;

@SpringBootApplication
@Profile("api")
public class API {
    public static void main(String[] args) {
        SpringApplication.run(API.class, args);
    }
}
