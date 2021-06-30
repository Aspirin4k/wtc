package com.wtc.cli.exception;

import com.wtc.cli.CommandType;

import java.util.EnumSet;
import java.util.stream.Collectors;

public class InvalidCommandException extends Throwable {
    @Override
    public String getMessage() {
        return "Command must be one of "
            + EnumSet
                .allOf(CommandType.class)
                .stream()
                .filter(t -> t != CommandType.UNKNOWN)
                .map(CommandType::toString)
                .collect(Collectors.joining(","));
    }
}
