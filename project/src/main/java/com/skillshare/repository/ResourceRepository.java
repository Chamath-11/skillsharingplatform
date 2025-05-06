package com.skillshare.repository;

import com.skillshare.model.Resource;
import com.skillshare.model.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    @Query("{ 'skillCategory': ?0 }")
    Page<Resource> findBySkillCategory(String skillCategory, Pageable pageable);
    
    @Query("{ 'resourceType': ?0 }")
    Page<Resource> findByResourceType(ResourceType resourceType, Pageable pageable);
    
    @Query("{ $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } }, " +
           "{ 'skillCategory': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Page<Resource> searchResources(String keyword, Pageable pageable);
    
    @Query("{ 'user.id': ?0 }")
    Page<Resource> findByUserId(String userId, Pageable pageable);

    @Query(value = "{ 'likes': { $size: { $gte: ?0 } } }")
    Page<Resource> findByLikesCountGreaterThan(int likesCount, Pageable pageable);
    
    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 } }")
    Page<Resource> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}