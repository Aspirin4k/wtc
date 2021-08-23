package com.wtc.vk.dto.post;

public class Photo {
    private Integer id;
    private PhotoSizeCollection sizes;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PhotoSizeCollection getSizes() {
        return sizes;
    }

    public void setSizes(PhotoSizeCollection sizes) {
        this.sizes = sizes;
    }
}
