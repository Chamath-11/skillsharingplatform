package com.skillshare.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "resources")
@CompoundIndexes({
    @CompoundIndex(name = "skill_type_idx", def = "{'skillCategory': 1, 'resourceType': 1}"),
    @CompoundIndex(name = "created_type_idx", def = "{'createdAt': -1, 'resourceType': 1}")
})
public class Resource {
    @Id
    private String id;

    @Field(name = "title")
    @Indexed
    private String title;

    @Field(name = "description")
    private String description;

    @Field(name = "url")
    private String url;

    @Field(name = "resource_type")
    @Indexed
    private ResourceType resourceType;

    @Field(name = "skill_category")
    @Indexed
    private String skillCategory;

    @DBRef
    @JsonBackReference
    private User user;

    @DBRef
    private Set<User> likes = new HashSet<>();

    @Field(name = "created_at")
    @Indexed
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

    public int getLikesCount() {
        return likes != null ? likes.size() : 0;
    }

    public boolean isOwner(String userId) {
        return user != null && user.getId().equals(userId);
    }
}