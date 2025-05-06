package com.skillshare.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @Field(name = "name")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Indexed(unique = true)
    @Field(name = "email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Field(name = "password")
    private String password;

    @Field(name = "profile_picture")
    private String profilePicture;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    @Field(name = "bio")
    private String bio;

    @Field(name = "enabled")
    private boolean enabled = true;

    @DBRef
    @JsonManagedReference
    private Set<Resource> resources = new HashSet<>();

    @DBRef
    private Set<Post> posts = new HashSet<>();

    @DBRef
    private Set<LearningPlan> learningPlans = new HashSet<>();

    @DBRef
    private Set<User> followers = new HashSet<>();

    @DBRef
    private Set<User> following = new HashSet<>();

    @Field(name = "location")
    private String location;

    @Field(name = "occupation")
    private String occupation;

    @Field(name = "website")
    private String website;

    @Field(name = "join_date")
    private LocalDateTime joinDate;

    @JsonIgnore
    @Field(name = "reset_token")
    private String resetToken;

    @JsonIgnore
    @Field(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    public User() {
        this.joinDate = LocalDateTime.now();
        this.enabled = true;
    }

    @JsonIgnore
    public Set<User> getFollowers() {
        return followers != null ? followers : new HashSet<>();
    }

    @JsonIgnore
    public Set<User> getFollowing() {
        return following != null ? following : new HashSet<>();
    }

    public int getFollowersCount() {
        return getFollowers().size();
    }

    public int getFollowingCount() {
        return getFollowing().size();
    }

    public boolean isFollowing(String userId) {
        return getFollowing().stream()
            .anyMatch(user -> user.getId().equals(userId));
    }

    public boolean isFollowedBy(String userId) {
        return getFollowers().stream()
            .anyMatch(user -> user.getId().equals(userId));
    }
}