package com.wtc.vk;

import com.wtc.vk.dto.Response;
import com.wtc.vk.dto.post.ResponsePosts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class HttpClient {
    @Autowired
    private Environment env;

    private final WebClient webClient;

    public HttpClient(Environment env) {
        this.env = env;

        this.webClient = WebClient
                .builder()
                .baseUrl(this.env.getProperty("vk.api.url", "https://api.vk.com"))
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public ResponsePosts get(String uri, MultiValueMap<String, String> queryParams) {
        return this.webClient
                .get()
                .uri(
                        uriBuilder -> uriBuilder
                            .path(uri)
                            .queryParam("access_token", this.env.getProperty("vk.api.token", ""))
                            .queryParam("v", this.env.getProperty("vk.api.version", "5.52"))
                            .queryParams(queryParams)
                            .build()
                )
                .retrieve()
                .bodyToMono(ResponsePosts.class)
                .block();
    }
}
