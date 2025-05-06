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
}