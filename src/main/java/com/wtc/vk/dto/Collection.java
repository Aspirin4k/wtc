package com.wtc.vk.dto;

import java.util.ArrayList;

abstract public class Collection<T> {
    private Integer count;
    private ArrayList<T> items;

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public ArrayList<T> getItems() {
        return items;
    }

    public void setItems(ArrayList<T> items) {
        this.items = items;
    }
}
