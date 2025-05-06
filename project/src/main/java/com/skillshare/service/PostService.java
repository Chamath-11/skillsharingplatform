package com.skillshare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillshare.model.Post;
import com.skillshare.model.User;
import com.skillshare.repository.PostRepository;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public Post createPost(Post post) {
        post.onCreate();
        return postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    @Transactional
    public Post updatePost(Post post) {
        Post existingPost = postRepository.findById(post.getId())
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        existingPost.setTitle(post.getTitle());
        existingPost.setContent(post.getContent());
        existingPost.setImages(post.getImages());
        existingPost.setVideoUrl(post.getVideoUrl());
        existingPost.onUpdate();
        
        return postRepository.save(existingPost);
    }

    @Transactional
    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<Post> getPostsByUser(User user, Pageable pageable) {
        return postRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Post> getFeedPosts(User user, Pageable pageable) {
        List<User> following = List.copyOf(user.getFollowing());
        following.add(user); // Include user's own posts in feed
        return postRepository.findByUserInOrderByCreatedAtDesc(following, pageable);
    }

    @Transactional
    public void likePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userService.getUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        post.getLikes().add(user);
        postRepository.save(post);
    }

    @Transactional
    public void unlikePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userService.getUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        post.getLikes().remove(user);
        postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public Page<Post> searchPosts(String keyword, Pageable pageable) {
        return postRepository.searchPosts(keyword, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Post> searchByTitle(String title, Pageable pageable) {
        return postRepository.findByTitleContainingIgnoreCase(title, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Post> searchByContent(String content, Pageable pageable) {
        return postRepository.findByContentContainingIgnoreCase(content, pageable);
    }
}