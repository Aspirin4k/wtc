package com.wtc.api.advice;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class DataIntegrityViolationHandler {
    @ExceptionHandler(DataIntegrityViolationException.class)
    public @ResponseBody ExceptionResponse handle(
            HttpServletResponse response,
            DataIntegrityViolationException exception
    ) {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        return new ExceptionResponse(
                "Bad request",
                HttpStatus.BAD_REQUEST.value(),
                this.handleSQLIntegrityViolation(exception)
        );
    }

    private List<String> handleSQLIntegrityViolation(DataIntegrityViolationException error)
    {
        List<String> errors = new ArrayList<>();
        errors.add(
                null == error.getRootCause()
                        ? error.getLocalizedMessage()
                        : error.getRootCause().getLocalizedMessage()
        );
        return errors;
    }
}