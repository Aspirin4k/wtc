package com.wtc.cli;

import com.wtc.cli.exception.InvalidCommandException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CommandFactory {
    @Autowired
    private PostLoaderCommand postLoaderCommand;

    public Command createCommand(CommandType type) throws InvalidCommandException {
        switch (type) {
            case POST_LOADER:
                return this.postLoaderCommand;
            default:
                throw new InvalidCommandException();
        }
    }
}
