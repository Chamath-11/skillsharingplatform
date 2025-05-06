package com.skillshare.service;

import com.skillshare.model.Resource;
import com.skillshare.model.User;
import com.skillshare.model.ResourceType;
import com.skillshare.repository.ResourceRepository;
import com.skillshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.NoSuchElementException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResourceService {
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public Page<Resource> getAllResources(Pageable pageable) {
        log.debug("Fetching all resources with pageable: {}", pageable);
        Page<Resource> resources = resourceRepository.findAll(pageable);
        log.debug("Found {} resources", resources.getTotalElements());
        return resources;
    }

    public Resource getResourceById(String id) {
        log.debug("Fetching resource with id: {}", id);
        Resource resource = resourceRepository.findById(id)
            .orElseThrow(() -> {
                log.error("Resource not found with id: {}", id);
                return new NoSuchElementException("Resource not found with id: " + id);
            });
        log.debug("Found resource: {}", resource);
        return resource;
    }

    public Page<Resource> searchResources(String keyword, Pageable pageable) {
        log.debug("Searching resources with keyword: {} and pageable: {}", keyword, pageable);
        Page<Resource> resources = resourceRepository.searchResources(keyword, pageable);
        log.debug("Found {} resources matching keyword: {}", resources.getTotalElements(), keyword);
        return resources;
    }

    public Page<Resource> getResourcesByCategory(String category, Pageable pageable) {
        log.debug("Fetching resources by category: {} with pageable: {}", category, pageable);
        Page<Resource> resources = resourceRepository.findBySkillCategory(category, pageable);
        log.debug("Found {} resources in category: {}", resources.getTotalElements(), category);
        return resources;
    }

    public Page<Resource> getResourcesByType(ResourceType type, Pageable pageable) {
        log.debug("Fetching resources by type: {} with pageable: {}", type, pageable);
        Page<Resource> resources = resourceRepository.findByResourceType(type, pageable);
        log.debug("Found {} resources of type: {}", resources.getTotalElements(), type);
        return resources;
    }

    @Transactional
    public Resource createResource(Resource resource, String userId) {
        log.debug("Creating resource for user {}: {}", userId, resource);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> {
                log.error("User not found with id: {}", userId);
                return new NoSuchElementException("User not found with id: " + userId);
            });
        
        resource.setUser(user);
        resource.onCreate();
        Resource savedResource = resourceRepository.save(resource);
        log.debug("Created resource: {}", savedResource);
        
        // Update user's resources
        user.getResources().add(savedResource);
        userRepository.save(user);
        log.debug("Updated user's resources list");
        
        return savedResource;
    }

    @Transactional
    public Resource updateResource(String id, Resource resourceDetails) {
        log.debug("Updating resource {}: {}", id, resourceDetails);
        Resource resource = getResourceById(id);
        
        resource.setTitle(resourceDetails.getTitle());
        resource.setDescription(resourceDetails.getDescription());
        resource.setUrl(resourceDetails.getUrl());
        resource.setResourceType(resourceDetails.getResourceType());
        resource.setSkillCategory(resourceDetails.getSkillCategory());
        resource.onUpdate();
        
        Resource updatedResource = resourceRepository.save(resource);
        log.debug("Updated resource: {}", updatedResource);
        return updatedResource;
    }

    @Transactional
    public void deleteResource(String id) {
        log.debug("Deleting resource: {}", id);
        Resource resource = getResourceById(id);
        
        // Remove resource from user's resources
        if (resource.getUser() != null) {
            User user = resource.getUser();
            user.getResources().remove(resource);
            userRepository.save(user);
            log.debug("Removed resource from user's resources list");
        }
        
        resourceRepository.delete(resource);
        log.debug("Deleted resource: {}", id);
    }

    public Page<Resource> getUserResources(String userId, Pageable pageable) {
        log.debug("Fetching resources for user: {} with pageable: {}", userId, pageable);
        Page<Resource> resources = resourceRepository.findByUserId(userId, pageable);
        log.debug("Found {} resources for user: {}", resources.getTotalElements(), userId);
        return resources;
    }

    @Transactional
    public Resource toggleLike(String resourceId, String userId) {
        log.debug("Toggling like on resource {} for user {}", resourceId, userId);
        Resource resource = getResourceById(resourceId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> {
                log.error("User not found with id: {}", userId);
                return new NoSuchElementException("User not found with id: " + userId);
            });

        if (resource.getLikes().contains(user)) {
            resource.getLikes().remove(user);
            log.debug("Removed like from resource {} by user {}", resourceId, userId);
        } else {
            resource.getLikes().add(user);
            log.debug("Added like to resource {} by user {}", resourceId, userId);
        }

        Resource updatedResource = resourceRepository.save(resource);
        log.debug("Updated resource likes: {}", updatedResource);
        return updatedResource;
    }
}