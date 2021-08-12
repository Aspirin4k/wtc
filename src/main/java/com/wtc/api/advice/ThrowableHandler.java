package com.wtc.api.advice;

import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@ControllerAdvice
public class ThrowableHandler {
    private final Map<Class<?>, HttpStatus> STATUS_MAP = new HashMap<>() {{
        put(HttpRequestMethodNotSupportedException.class, HttpStatus.METHOD_NOT_ALLOWED);
        put(HttpMessageNotReadableException.class, HttpStatus.BAD_REQUEST);
    }};

    @ExceptionHandler(Throwable.class)
    public @ResponseBody ExceptionResponse handle(HttpServletResponse response, Throwable throwable) {
        HttpStatus status = Optional
                .ofNullable(AnnotationUtils.getAnnotation(throwable.getClass(), ResponseStatus.class))
                .map(ResponseStatus::value)
                .orElse(
                        null == this.STATUS_MAP.get(throwable.getClass())
                                ? HttpStatus.INTERNAL_SERVER_ERROR
                                : this.STATUS_MAP.get(throwable.getClass())
                );
        response.setStatus(status.value());
        return new ExceptionResponse(throwable.getMessage(), status.value());
    }
}