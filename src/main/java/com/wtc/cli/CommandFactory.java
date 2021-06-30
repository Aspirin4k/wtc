package com.wtc.cli;

import com.wtc.cli.exception.InvalidCommandException;
import org.springframework.stereotype.Component;

@Component
public class CommandFactory {
    public Command createCommand(CommandType type) throws InvalidCommandException {
        switch (type) {
            case POST_LOADER:
                return null;
            default:
                throw new InvalidCommandException();
        }
    }
}
