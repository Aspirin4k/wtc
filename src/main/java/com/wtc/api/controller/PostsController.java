package com.wtc.api.controller;

import com.wtc.entity.Post;
import com.wtc.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Min;

@Validated
@RestController
@RequestMapping(path = "/post")
public class PostsController {
    private final int PAGE_SIZE = 15;
    @Autowired
    private PostRepository repository;

    @GetMapping("/{page_num}")
    public Iterable<Post> list(@PathVariable("page_num") @Min(value = 1) int pageNum) {
        Pageable request = PageRequest.of(pageNum - 1, this.PAGE_SIZE, Sort.by("datePublished").descending());
        return this.repository.findAll(request);
    }
}
