package com.wtc.utils;

import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.util.MultiValueMapAdapter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class QueryParamsMapFactory {
    public MultiValueMap<String, String> createMap(String paramName, String value) {
        MultiValueMap<String, String> map = this.createMap();
        map.add(paramName, value);
        return map;
    }

    public MultiValueMap<String, String> createMap() {
        Map<String, List<String>> innerMap = new HashMap<>();
        return new MultiValueMapAdapter<>(innerMap);
    }
}
