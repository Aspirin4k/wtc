package com.wtc.vk.dto.post;

import java.util.ArrayList;

public class PhotoSizeCollection extends ArrayList<PhotoSize> {
    public PhotoSize getSmallPhoto() {
        return this.getPhoto("s");
    }

    public PhotoSize getMediumPhoto() {
        return this.getPhoto("x");
    }

    public PhotoSize getLargePhoto() {
        return this.getPhoto("z");
    }

    private PhotoSize getPhoto(String size) {
        return this
                .stream()
                .filter(photo -> photo.getType().equals(size))
                .findFirst()
                .orElse(null);
    }
}
