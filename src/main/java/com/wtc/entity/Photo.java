package com.wtc.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
        dbPhoto.setUrlLarge(webPhoto.getPhoto_1280());
        dbPhoto.setUrlMedium(webPhoto.getPhoto_604());
        dbPhoto.setUrlSmall(webPhoto.getPhoto_75());
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
