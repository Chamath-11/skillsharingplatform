package com.skillshare.model;

import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Milestone {
    private String id;

    @Field(name = "title")
    private String title;

    @Field(name = "description")
    private String description;

    @Field(name = "target_date")
    private LocalDateTime targetDate;

    @Field(name = "completed")
    private boolean completed;

    @Field(name = "created_at")
    private LocalDateTime createdAt;

    @Field(name = "updated_at")
    private LocalDateTime updatedAt;

    private LearningPlan learningPlan;

    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}