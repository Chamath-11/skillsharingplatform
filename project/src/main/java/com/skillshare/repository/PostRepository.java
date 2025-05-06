package com.skillshare.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.skillshare.model.Post;
import com.skillshare.model.User;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    Page<Post> findByUserInOrderByCreatedAtDesc(List<User> users, Pageable pageable);
    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'content': { $regex: ?0, $options: 'i' } } ] }")
    Page<Post> searchPosts(String keyword, Pageable pageable);
    
    @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
    Page<Post> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    @Query("{ 'content': { $regex: ?0, $options: 'i' } }")
    Page<Post> findByContentContainingIgnoreCase(String content, Pageable pageable);
}