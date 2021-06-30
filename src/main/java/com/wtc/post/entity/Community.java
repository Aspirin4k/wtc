package com.wtc.post.entity;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "posts.communities")
public class Community {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "community_id")
    private int community;
    @OneToMany(mappedBy = "community")
    private Set<Post> posts;

    public int getCommunity() {
        return community;
    }

    public void setCommunity(int community) {
        this.community = community;
    }

    public Set<Post> getPosts() {
        return posts;
    }

    public void setPosts(Set<Post> posts) {
        this.posts = posts;
    }
}
