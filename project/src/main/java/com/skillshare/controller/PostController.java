package com.skillshare.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillshare.model.Post;
import com.skillshare.model.User;
import com.skillshare.service.PostService;
import com.skillshare.service.UserService;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin
public class PostController {
    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, Authentication authentication) {
        String userId = authentication.getName();
        User user = userService.getUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        post.setUser(user);
        return ResponseEntity.ok(postService.createPost(post));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String id,
            @RequestBody Post post,
            Authentication authentication) {
        String userId = authentication.getName();
        Post existingPost = postService.getPostById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!existingPost.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        post.setId(id);
        return ResponseEntity.ok(postService.updatePost(post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getName();
        Post existingPost = postService.getPostById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!existingPost.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Post>> getPostsByUser(
            @PathVariable String userId,
            Pageable pageable) {
        User user = userService.getUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(postService.getPostsByUser(user, pageable));
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<Post>> getFeedPosts(
            Pageable pageable,
            Authentication authentication) {
        String userId = authentication.getName();
        User user = userService.getUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(postService.getFeedPosts(user, pageable));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable String postId,
            Authentication authentication) {
        String userId = authentication.getName();
        postService.likePost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/unlike")
    public ResponseEntity<Void> unlikePost(
            @PathVariable String postId,
            Authentication authentication) {
        String userId = authentication.getName();
        postService.unlikePost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Post>> searchPosts(
            @RequestParam String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(postService.searchPosts(keyword, pageable));
    }

    @GetMapping("/search/title")
    public ResponseEntity<Page<Post>> searchByTitle(
            @RequestParam String title,
            Pageable pageable) {
        return ResponseEntity.ok(postService.searchByTitle(title, pageable));
    }

    @GetMapping("/search/content")
    public ResponseEntity<Page<Post>> searchByContent(
            @RequestParam String content,
            Pageable pageable) {
        return ResponseEntity.ok(postService.searchByContent(content, pageable));
    }
}