package com.wtc.entity;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(schema = "posts", name = "communities")
public class Community {
    @Id
    @Column(name = "community_id")
    private int id;
    @OneToMany(mappedBy = "community")
    private Set<Post> posts;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Set<Post> getPosts() {
        return posts;
    }

    public void setPosts(Set<Post> posts) {
        this.posts = posts;
    }
}
