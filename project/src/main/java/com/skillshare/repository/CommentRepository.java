package com.skillshare.repository;

import com.skillshare.model.Comment;
import com.skillshare.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    Page<Comment> findByPostOrderByCreatedAtDesc(Post post, Pageable pageable);
}