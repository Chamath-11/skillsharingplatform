package com.skillshare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String id;

    @Field(name = "title")
    private String title;

    @Field(name = "content")
    private String content;

    @Field(name = "images")
    private Set<String> images = new HashSet<>();

    @Field(name = "video_url")
    private String videoUrl;

    @DBRef
    private User user;

    @DBRef
    private Set<Comment> comments = new HashSet<>();

    @DBRef
    private Set<User> likes = new HashSet<>();

    @Field(name = "created_at")
    private LocalDateTime createdAt;

    @Field(name = "updated_at")
    private LocalDateTime updatedAt;

    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}