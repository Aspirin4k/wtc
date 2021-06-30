package com.wtc.post.repository;

import com.wtc.post.entity.Post;

import java.util.Collection;

public interface PostRepository {
    Collection<Post> getPosts();
}
