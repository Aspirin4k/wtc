package com.wtc.post.entity;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "posts.posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "post_id")
    private int id;
    @ManyToOne
    @JoinColumn(name = "community_id", referencedColumnName = "community_id")
    private Community community;
    private String content;
    private int datePublished;
    @OneToMany(mappedBy = "post", cascade = {CascadeType.PERSIST})
    private Set<Photo> photos;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Community getCommunity() {
        return community;
    }

    public void setCommunity(Community community) {
        this.community = community;
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

    public Set<Photo> getPhotos() {
        return photos;
    }

    public void setPhotos(Set<Photo> photos) {
        this.photos = photos;
    }
}
