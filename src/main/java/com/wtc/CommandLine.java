package com.wtc;

import com.wtc.cli.CommandFactory;
import com.wtc.cli.CommandType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;

import java.util.Arrays;

@SpringBootApplication
@Profile("cli")
public class CommandLine implements CommandLineRunner {
    private static Logger LOG = LoggerFactory.getLogger("application");
    @Autowired
    private CommandFactory factory;

    public static void main(String[] args) {
        SpringApplication.run(CommandLine.class, args);
    }

    public void run(String... args) {
        try {
            String[] emptyArray = {};
            LOG.info("Starting application");
            this.factory
                    .createCommand(
                            args.length == 0 || !CommandType.contains(args[0])
                                ? CommandType.UNKNOWN
                                : CommandType.valueOf(args[0])
                    )
                    .run(
                            args.length <= 1
                                    ? emptyArray
                                    : Arrays.copyOfRange(args, 1, args.length - 1)
                    );
            LOG.info("Finished");
        } catch (Throwable e) {
            LOG.error("Error while executing command", e);
        }
    }
}
