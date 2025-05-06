package com.skillshare.model;

import lombok.Data;

@Data
public class ResourceDTO {
    private String id;
    private String title;
    private String description;
    private String url;
    private ResourceType resourceType;
    private String skillCategory;
    private String userId;
    private String userName;
    private String userEmail;
    private int likes;
    private String createdAt;
    private boolean isOwner;
    private boolean isLiked;

    public static ResourceDTO fromResource(Resource resource, String currentUserId) {
        ResourceDTO dto = new ResourceDTO();
        dto.setId(resource.getId());
        dto.setTitle(resource.getTitle());
        dto.setDescription(resource.getDescription());
        dto.setUrl(resource.getUrl());
        dto.setResourceType(resource.getResourceType());
        dto.setSkillCategory(resource.getSkillCategory());
        
        if (resource.getUser() != null) {
            dto.setUserId(resource.getUser().getId());
            dto.setUserName(resource.getUser().getName());
            dto.setUserEmail(resource.getUser().getEmail());
        }
        
        dto.setLikes(resource.getLikesCount());
        dto.setCreatedAt(resource.getCreatedAt().toString());
        dto.setOwner(resource.isOwner(currentUserId));
        
        // Check if current user has liked this resource
        if (currentUserId != null) {
            dto.setLiked(resource.getLikes().stream()
                .anyMatch(user -> user.getId().equals(currentUserId)));
        }
        
        return dto;
    }
}