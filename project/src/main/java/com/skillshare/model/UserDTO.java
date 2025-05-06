package com.skillshare.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class UserDTO {
    private String id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String profilePicture;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;

    private String location;
    private String occupation;
    private String website;
    private int followersCount;
    private int followingCount;
    private boolean isFollowing;

    public static UserDTO fromUser(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setBio(user.getBio());
        dto.setLocation(user.getLocation());
        dto.setOccupation(user.getOccupation());
        dto.setWebsite(user.getWebsite());
        dto.setFollowersCount(user.getFollowers().size());
        dto.setFollowingCount(user.getFollowing().size());
        return dto;
    }

    public static UserDTO fromUser(User user, String currentUserId) {
        UserDTO dto = fromUser(user);
        dto.setFollowing(user.getFollowers().stream()
            .anyMatch(follower -> follower.getId().equals(currentUserId)));
        return dto;
    }
}