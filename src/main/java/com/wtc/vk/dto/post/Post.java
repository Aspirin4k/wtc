package com.wtc.vk.dto.post;

import java.util.ArrayList;

public class Post {
    private Integer id;
    private Integer date;
    private Integer owner_id;
    private String text;
    private ArrayList<Attachment> attachments;
    private ArrayList<Post> copy_history;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getDate() {
        return date;
    }

    public void setDate(Integer date) {
        this.date = date;
    }

    public Integer getOwner_id() {
        return owner_id;
    }

    public void setOwner_id(Integer owner_id) {
        this.owner_id = owner_id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public ArrayList<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(ArrayList<Attachment> attachments) {
        this.attachments = attachments;
    }

    public ArrayList<Post> getCopy_history() {
        return copy_history;
    }

    public void setCopy_history(ArrayList<Post> copy_history) {
        this.copy_history = copy_history;
    }
}
