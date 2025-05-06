package com.skillshare.controller;

import com.skillshare.model.Post;
import com.skillshare.model.User;
import com.skillshare.service.PostService;
import com.skillshare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.createPost(post));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        post.setId(id);
        return ResponseEntity.ok(postService.updatePost(post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Post>> getPostsByUser(
        @PathVariable String userId,
        Pageable pageable
    ) {
        User user = userService.getUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(postService.getPostsByUser(user, pageable));
    }

    @GetMapping("/feed/{userId}")
    public ResponseEntity<Page<Post>> getFeedPosts(
        @PathVariable String userId,
        Pageable pageable
    ) {
        User user = userService.getUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(postService.getFeedPosts(user, pageable));
    }

    @PostMapping("/{postId}/like/{userId}")
    public ResponseEntity<Void> likePost(
        @PathVariable String postId,
        @PathVariable String userId
    ) {
        postService.likePost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/unlike/{userId}")
    public ResponseEntity<Void> unlikePost(
        @PathVariable String postId,
        @PathVariable String userId
    ) {
        postService.unlikePost(postId, userId);
        return ResponseEntity.ok().build();
    }
<<<<<<< Updated upstream
=======

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

    @PostMapping("/{postId}/commit")
    public ResponseEntity<Post> commitToPost(
            @PathVariable String postId,
            Authentication authentication) {
        String userId = authentication.getName();
        try {
            return ResponseEntity.ok(postService.commitToPost(postId, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{postId}/withdraw-commitment")
    public ResponseEntity<Post> withdrawCommitment(
            @PathVariable String postId,
            Authentication authentication) {
        String userId = authentication.getName();
        try {
            return ResponseEntity.ok(postService.withdrawCommitment(postId, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/committed")
    public ResponseEntity<Page<Post>> getCommittedPosts(
            Pageable pageable,
            Authentication authentication) {
        String userId = authentication.getName();
        User user = userService.getUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(postService.getCommittedPosts(user, pageable));
    }

    @GetMapping("/active-commitments")
    public ResponseEntity<Page<Post>> getActiveCommitmentPosts(Pageable pageable) {
        return ResponseEntity.ok(postService.getActiveCommitmentPosts(pageable));
    }

    @GetMapping("/open-commitments")
    public ResponseEntity<Page<Post>> getOpenCommitments(Pageable pageable) {
        return ResponseEntity.ok(postService.getOpenCommitments(pageable));
    }
>>>>>>> Stashed changes
}