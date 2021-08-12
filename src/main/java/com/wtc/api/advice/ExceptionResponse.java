package com.wtc.api.advice;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.ArrayList;
import java.util.List;

public class ExceptionResponse {
    private final long timestamp = System.currentTimeMillis();
    private final String message;
    private final List<String> details;
    private final int status;

    public ExceptionResponse(String message, int status, List<String> details) {
        this.message = message;
        this.details = details;
        this.status = status;
    }

    @JsonCreator
    public ExceptionResponse(String message, int status) {
        this.message = message;
        this.details = new ArrayList<>();
        this.status = status;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getDetails() {
        return details;
    }

    public int getStatus() {
        return status;
    }
}
