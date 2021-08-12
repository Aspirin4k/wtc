package com.wtc.api.advice;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class MethodArgumentNotValidHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public @ResponseBody ExceptionResponse handle(
            HttpServletResponse response,
            MethodArgumentNotValidException exception
    ) {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        return new ExceptionResponse(
                "Bad request",
                HttpStatus.BAD_REQUEST.value(),
                this.handleMethodArgumentNotValid(exception)
        );
    }

    private List<String> handleMethodArgumentNotValid(MethodArgumentNotValidException error)
    {
        List<ObjectError> bindings = error.getBindingResult().getAllErrors();

        List<String> errors = new ArrayList<>(bindings.size());
        for (ObjectError bindingError : bindings) {
            if (bindingError instanceof FieldError) {
                errors.add(
                        ((FieldError) bindingError).getField() + " "
                                + bindingError.getDefaultMessage()
                );
            } else {
                errors.add(bindingError.toString());
            }
        }

        return errors;
    }
}
