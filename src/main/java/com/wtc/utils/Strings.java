package com.wtc.utils;

public class Strings {
    public static String escape(String str) {
        str = str.replaceAll("#.*[\\S\\n\\n]?", "");
        return str.replaceAll("#[\\n\\r]", "&#10;");
    }

    public static String cutByWords(String str, int length) {
        if (str.length() < length) {
            return str;
        }

        int lastSpace = -1;
        for (int i = 0; i < length; i++) {
            if (Character.isWhitespace(str.charAt(i))) {
                lastSpace = i;
            }
        }

        return lastSpace == -1
                ? str.substring(0, length) + ".."
                : str.substring(0, lastSpace) + "..";
    }
}
