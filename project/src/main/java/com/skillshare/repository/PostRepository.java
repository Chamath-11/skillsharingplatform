package com.skillshare.repository;

<<<<<<< Updated upstream
=======
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

>>>>>>> Stashed changes
import com.skillshare.model.Post;
import com.skillshare.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    Page<Post> findByUserInOrderByCreatedAtDesc(List<User> users, Pageable pageable);
    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
<<<<<<< Updated upstream
=======
    
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'content': { $regex: ?0, $options: 'i' } } ] }")
    Page<Post> searchPosts(String keyword, Pageable pageable);
    
    @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
    Page<Post> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    @Query("{ 'content': { $regex: ?0, $options: 'i' } }")
    Page<Post> findByContentContainingIgnoreCase(String content, Pageable pageable);
    
    // New commitment-related queries
    Page<Post> findByCommitsContainingOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<Post> findByCommitmentDeadlineGreaterThanAndIsCommitmentCompleteFalseOrderByCommitmentDeadlineAsc(
        LocalDateTime deadline, Pageable pageable);
        
    @Query("{ 'commitmentGoal': { $gt: { $size: '$commits' } }, 'commitmentDeadline': { $gt: ?0 } }")
    Page<Post> findOpenCommitments(LocalDateTime now, Pageable pageable);
>>>>>>> Stashed changes
}