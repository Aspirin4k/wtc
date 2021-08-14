package com.wtc.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wtc.utils.Strings;
import com.wtc.vk.Constants;
import com.wtc.vk.dto.post.Attachment;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(schema = "posts", name = "posts")
public class Post {
    public static final Integer TITLE_LENGTH = 90;

    @Id
    @Column(name = "post_id")
    private Integer id;
    private String title;
    @ManyToOne
    @JoinColumn(name = "community_id", referencedColumnName = "community_id")
    private Community community;
    private String content;
    @Column(name = "date_published")
    private int datePublished;
    @OneToMany(mappedBy = "post", cascade = {CascadeType.ALL})
    private List<Photo> photos;

    public static Post fromWebPost(com.wtc.vk.dto.post.Post webPost, Community community) {
        Post dbPost = new Post();
        dbPost.setId(webPost.getId());
        dbPost.setContent(Strings.escape(webPost.getText()));
        dbPost.setTitle(Strings.cutByWords(dbPost.getContent(), Post.TITLE_LENGTH));
        dbPost.setDatePublished(webPost.getDate());
        dbPost.setCommunity(community);

        ArrayList<Photo> photos = new ArrayList<>();
        if (null != webPost.getAttachments()) {
            for (Attachment attachment : webPost.getAttachments()) {
                if (attachment.getType().equals(Constants.ATTACHMENT_TYPE_PHOTO)) {
                    photos.add(Photo.fromWebAttachment(attachment.getPhoto(), dbPost));
                }
            }
        }
        dbPost.setPhotos(photos);

        return dbPost;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCommunityId() {
        return this.getCommunity().getId();
    }

    @JsonIgnore
    public Community getCommunity() {
        return community;
    }

    public void setCommunity(Community community) {
        this.community = community;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getDatePublished() {
        return datePublished;
    }

    public void setDatePublished(int datePublished) {
        this.datePublished = datePublished;
    }

    public List<Photo> getPhotos() {
        return photos;
    }

    public void setPhotos(List<Photo> photos) {
        this.photos = photos;
    }
}
