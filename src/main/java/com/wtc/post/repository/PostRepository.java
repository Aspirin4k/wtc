package com.wtc.post.repository;

import com.wtc.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource()
public interface PostRepository extends JpaRepository<Post, Integer> {
}
