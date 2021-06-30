package com.wtc.post.repository.vk;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

public class HttpClient {
    private WebClient webClient = WebClient
            .builder()
            .baseUrl("https://api.vk.com/method")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();

    public void get(String uri, MultiValueMap<String, String> queryParams) {
//        return this.webClient
//                .get()
//                .uri(
//                        uriBuilder -> uriBuilder
//                            .path(uri)
//                            .queryParam("access_token", System.getenv("VK_TOKEN"))
//                            .queryParam("v", "5.52")
//                            .queryParams(queryParams)
//                            .build()
//                )
//                .retrieve()
//                .toBodilessEntity()
//                .block();
    }
}
