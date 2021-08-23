package com.wtc.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wtc.vk.dto.post.PhotoSize;

import javax.persistence.*;

@Entity
@Table(schema = "posts", name = "photos")
public class Photo {
    @Id
    @Column(name = "photo_id")
    private int id;
    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "post_id")
    private Post post;
    private String urlLarge;
    private String urlMedium;
    private String urlSmall;

    public static Photo fromWebAttachment(com.wtc.vk.dto.post.Photo webPhoto, Post dbPost) {
        Photo dbPhoto = new Photo();
        dbPhoto.setId(webPhoto.getId());

        PhotoSize largePhoto = webPhoto.getSizes().getLargePhoto();
        dbPhoto.setUrlLarge(null == largePhoto ? null : largePhoto.getUrl());

        PhotoSize mediumPhoto = webPhoto.getSizes().getMediumPhoto();
        dbPhoto.setUrlMedium(null == mediumPhoto ? null : mediumPhoto.getUrl());

        PhotoSize smallPhoto = webPhoto.getSizes().getSmallPhoto();
        dbPhoto.setUrlSmall(null == smallPhoto ? null : smallPhoto.getUrl());

        dbPhoto.setPost(dbPost);
        return dbPhoto;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @JsonIgnore
    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public String getUrlLarge() {
        return urlLarge;
    }

    public void setUrlLarge(String urlLarge) {
        this.urlLarge = urlLarge;
    }

    public String getUrlMedium() {
        return urlMedium;
    }

    public void setUrlMedium(String urlMedium) {
        this.urlMedium = urlMedium;
    }

    public String getUrlSmall() {
        return urlSmall;
    }

    public void setUrlSmall(String urlSmall) {
        this.urlSmall = urlSmall;
    }
}
