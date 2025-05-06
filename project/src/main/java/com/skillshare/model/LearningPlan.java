package com.skillshare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Document(collection = "learning_plans")
public class LearningPlan {
    @Id
    private String id;

    @Field(name = "title")
    private String title;

    @Field(name = "description")
    private String description;

    @Field(name = "milestones")
    private List<Milestone> milestones = new ArrayList<>();

    @DBRef
    private User user;

    @Field(name = "start_date")
    private LocalDateTime startDate;

    @Field(name = "target_date")
    private LocalDateTime targetDate;

    @Field(name = "created_at")
    private LocalDateTime createdAt;

    @Field(name = "updated_at")
    private LocalDateTime updatedAt;

    @Field(name = "tags")
    private Set<String> tags = new HashSet<>();

    @Field(name = "progress")
    private int progress;

    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}