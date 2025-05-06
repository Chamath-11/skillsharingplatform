package com.skillshare.controller;

import com.skillshare.model.Resource;
import com.skillshare.model.ResourceDTO;
import com.skillshare.model.ResourceType;
import com.skillshare.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@Slf4j
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {
    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<Page<ResourceDTO>> getAllResources(Pageable pageable, Authentication authentication) {
        String currentUserId = authentication != null ? authentication.getName() : null;
        log.debug("Getting all resources for user: {}, pageable: {}", currentUserId, pageable);
        
        Page<Resource> resources = resourceService.getAllResources(pageable);
        Page<ResourceDTO> dtos = resources.map(r -> ResourceDTO.fromResource(r, currentUserId));
        
        log.debug("Returning {} resources", dtos.getTotalElements());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceDTO> getResource(@PathVariable String id, Authentication authentication) {
        String currentUserId = authentication != null ? authentication.getName() : null;
        log.debug("Getting resource with id: {} for user: {}", id, currentUserId);
        
        Resource resource = resourceService.getResourceById(id);
        ResourceDTO dto = ResourceDTO.fromResource(resource, currentUserId);
        
        log.debug("Found resource: {}", dto);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ResourceDTO>> searchResources(
            @RequestParam String keyword,
            Pageable pageable,
            Authentication authentication) {
        String currentUserId = authentication != null ? authentication.getName() : null;
        log.debug("Searching resources with keyword: {} for user: {}, pageable: {}", 
                 keyword, currentUserId, pageable);
        
        Page<Resource> resources = resourceService.searchResources(keyword, pageable);
        Page<ResourceDTO> dtos = resources.map(r -> ResourceDTO.fromResource(r, currentUserId));
        
        log.debug("Found {} resources matching keyword: {}", dtos.getTotalElements(), keyword);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<ResourceDTO>> getResourcesByCategory(
            @PathVariable String category,
            Pageable pageable,
            Authentication authentication) {
        String currentUserId = authentication != null ? authentication.getName() : null;
        log.debug("Getting resources by category: {} for user: {}, pageable: {}", 
                 category, currentUserId, pageable);
        
        Page<Resource> resources = resourceService.getResourcesByCategory(category, pageable);
        Page<ResourceDTO> dtos = resources.map(r -> ResourceDTO.fromResource(r, currentUserId));
        
        log.debug("Found {} resources in category: {}", dtos.getTotalElements(), category);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Page<ResourceDTO>> getResourcesByType(
            @PathVariable ResourceType type,
            Pageable pageable,
            Authentication authentication) {
        String currentUserId = authentication != null ? authentication.getName() : null;
        log.debug("Getting resources by type: {} for user: {}, pageable: {}", 
                 type, currentUserId, pageable);
        
        Page<Resource> resources = resourceService.getResourcesByType(type, pageable);
        Page<ResourceDTO> dtos = resources.map(r -> ResourceDTO.fromResource(r, currentUserId));
        
        log.debug("Found {} resources of type: {}", dtos.getTotalElements(), type);
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<ResourceDTO> createResource(
            @Valid @RequestBody Resource resource,
            Authentication authentication) {
        try {
            if (authentication == null) {
                log.warn("Attempt to create resource without authentication");
                return ResponseEntity.status(401).build();
            }
            String currentUserId = authentication.getName();
            log.debug("Creating new resource for user: {}, resource: {}", currentUserId, resource);
            
            Resource savedResource = resourceService.createResource(resource, currentUserId);
            ResourceDTO dto = ResourceDTO.fromResource(savedResource, currentUserId);
            
            log.debug("Successfully created resource: {}", dto);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            log.error("Error creating resource: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceDTO> updateResource(
            @PathVariable String id,
            @Valid @RequestBody Resource resource,
            Authentication authentication) {
        try {
            if (authentication == null) {
                log.warn("Attempt to update resource without authentication");
                return ResponseEntity.status(401).build();
            }
            String currentUserId = authentication.getName();
            log.debug("Updating resource {} for user: {}, resource: {}", id, currentUserId, resource);
            
            Resource existingResource = resourceService.getResourceById(id);
            if (!existingResource.isOwner(currentUserId)) {
                log.warn("User {} attempted to update resource {} owned by {}", 
                        currentUserId, id, existingResource.getUser().getId());
                return ResponseEntity.status(403).build();
            }
            
            resource.setId(id);
            resource.onUpdate();
            Resource updatedResource = resourceService.updateResource(id, resource);
            ResourceDTO dto = ResourceDTO.fromResource(updatedResource, currentUserId);
            
            log.debug("Successfully updated resource: {}", dto);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            log.error("Error updating resource {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id, Authentication authentication) {
        try {
            if (authentication == null) {
                log.warn("Attempt to delete resource without authentication");
                return ResponseEntity.status(401).build();
            }
            String currentUserId = authentication.getName();
            log.debug("Deleting resource {} for user: {}", id, currentUserId);
            
            Resource resource = resourceService.getResourceById(id);
            if (!resource.isOwner(currentUserId)) {
                log.warn("User {} attempted to delete resource {} owned by {}", 
                        currentUserId, id, resource.getUser().getId());
                return ResponseEntity.status(403).build();
            }
            
            resourceService.deleteResource(id);
            log.debug("Successfully deleted resource: {}", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting resource {}: {}", id, e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ResourceDTO>> getUserResources(
            @PathVariable String userId,
            Pageable pageable,
            Authentication authentication) {
        String currentUserId = authentication != null ? authentication.getName() : null;
        log.debug("Getting resources for user: {}, requested by: {}, pageable: {}", 
                 userId, currentUserId, pageable);
        
        Page<Resource> resources = resourceService.getUserResources(userId, pageable);
        Page<ResourceDTO> dtos = resources.map(r -> ResourceDTO.fromResource(r, currentUserId));
        
        log.debug("Found {} resources for user: {}", dtos.getTotalElements(), userId);
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ResourceDTO> toggleLike(
            @PathVariable String id,
            Authentication authentication) {
        try {
            if (authentication == null) {
                log.warn("Attempt to like resource without authentication");
                return ResponseEntity.status(401).build();
            }
            String currentUserId = authentication.getName();
            log.debug("Toggling like on resource {} for user: {}", id, currentUserId);
            
            Resource resource = resourceService.toggleLike(id, currentUserId);
            ResourceDTO dto = ResourceDTO.fromResource(resource, currentUserId);
            
            log.debug("Successfully toggled like on resource: {}", dto);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            log.error("Error toggling like on resource {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
}