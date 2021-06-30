package com.wtc.cli;

public enum CommandType {
    POST_LOADER("post_loader"),
    UNKNOWN("unknown");

    private final String type;

    CommandType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public static boolean contains(String value) {
        for (CommandType type: CommandType.values()) {
            if (type.name().equals(value)) {
                return true;
            }
        }

        return false;
    }
}
