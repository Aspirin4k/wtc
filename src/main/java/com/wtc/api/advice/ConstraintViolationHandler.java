package com.wtc.api.advice;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@ControllerAdvice
public class ConstraintViolationHandler {
    @ExceptionHandler(ConstraintViolationException.class)
    public @ResponseBody ExceptionResponse handle(
            HttpServletResponse response,
            ConstraintViolationException exception
    ) {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        return new ExceptionResponse(
                "Bad request",
                HttpStatus.BAD_REQUEST.value(),
                this.handleConstraintViolation(exception)
        );
    }

    private List<String> handleConstraintViolation(ConstraintViolationException error)
    {
        Set<ConstraintViolation<?>> constraints = error.getConstraintViolations();

        List<String> errors = new ArrayList<>(constraints.size());
        for (ConstraintViolation<?> constraintViolation : constraints) {
            errors.add(
                    constraintViolation.getPropertyPath() + " " +
                            constraintViolation.getMessage()
            );
        }

        return errors;
    }
}