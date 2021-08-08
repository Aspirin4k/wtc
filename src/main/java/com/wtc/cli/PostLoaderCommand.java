package com.wtc.cli;

import com.wtc.entity.Community;
import com.wtc.repository.CommunityRepository;
import com.wtc.repository.PostRepository;
import com.wtc.utils.QueryParamsMapFactory;
import com.wtc.vk.Constants;
import com.wtc.vk.HttpClient;
import com.wtc.vk.dto.post.Post;
import com.wtc.vk.dto.post.ResponsePosts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

import java.util.ArrayList;
import java.util.List;

@Component
public class PostLoaderCommand implements Command {
    @Autowired
    private CommunityRepository communityRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private HttpClient httpClient;
    @Autowired
    private QueryParamsMapFactory queryParamsMapFactory;

    private final Integer BATCH_SIZE = 20;

    @Override
    public void run(String... args) {
        List<Community> communities = this.communityRepository.findAll();
        for (Community community: communities) {
            this.downloadPosts(community);
        }
    }

    private MultiValueMap<String, String> getQuery(Community community, int offset) {
        MultiValueMap<String, String> queryParams = this.queryParamsMapFactory.createMap();
        queryParams.add("filter", Constants.POST_TYPE_OWNER);
        queryParams.add("owner_id", Integer.toString(-community.getId()));
        queryParams.add("count", Integer.toString(this.BATCH_SIZE));
        queryParams.add("offset", Integer.toString(offset));
        return queryParams;
    }

    private void downloadPosts(Community community) {
        Pageable request = PageRequest.of(0, 1, Sort.by("datePublished").descending());
        Page<com.wtc.entity.Post> lastPosts = this.postRepository.findAll(request);
        com.wtc.entity.Post lastPost = lastPosts.isEmpty() ? null : lastPosts.getContent().get(0);

        ArrayList<Post> posts;
        boolean hasNewPosts;
        int offset = 0;
        do {
            ResponsePosts responsePosts = this.httpClient.get(
                    "/method/wall.get",
                    this.getQuery(community, offset)
            );

            posts = responsePosts.getResponse().getItems();
            hasNewPosts = this.savePosts(posts, community, lastPost);

            offset += this.BATCH_SIZE;
        } while (posts.size() > 0 && hasNewPosts);
    }

    private boolean savePosts(List<Post> posts, Community community, com.wtc.entity.Post lastPost) {
        ArrayList<com.wtc.entity.Post> dbPosts = new ArrayList<>();
        for (Post post : posts) {
            if (null != lastPost && lastPost.getId().equals(post.getId())) {
                return false;
            }

            if (community.getId() == -post.getOwner_id() && null == post.getCopy_history()) {
                dbPosts.add(com.wtc.entity.Post.fromWebPost(post, community));
            }
        }

        this.postRepository.saveAllAndFlush(dbPosts);
        return true;
    }
}
