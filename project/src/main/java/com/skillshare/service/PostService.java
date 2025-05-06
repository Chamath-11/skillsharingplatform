package com.skillshare.service;

import com.skillshare.model.Post;
import com.skillshare.model.User;
import com.skillshare.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    @Transactional
    public Post updatePost(Post post) {
        return postRepository.save(post);
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
}