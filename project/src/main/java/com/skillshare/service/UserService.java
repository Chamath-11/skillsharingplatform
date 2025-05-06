package com.skillshare.service;

import com.skillshare.model.User;
import com.skillshare.repository.UserRepository;
import com.skillshare.exception.UserExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordService passwordService;

    @Transactional
    public User createUser(User user) {
        log.debug("Creating new user with email: {}", user.getEmail());
        
        if (userRepository.existsByEmail(user.getEmail())) {
            log.warn("User already exists with email: {}", user.getEmail());
            throw new UserExistsException("Email is already registered");
        }

        // Encode password before saving
        user.setPassword(passwordService.encodePassword(user.getPassword()));
        
        User savedUser = userRepository.save(user);
        log.debug("User created successfully: {}", savedUser.getEmail());
        return savedUser;
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        log.debug("Checking if user exists with email: {}", email);
        return userRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        log.debug("Fetching user by email: {}", email);
        return userRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserById(String id) {
        log.debug("Fetching user by ID: {}", id);
        return userRepository.findById(id);
    }

    @Transactional
    public User updateUser(String userId, User updatedUser) {
        log.debug("Updating user with ID: {}", userId);
        
        return userRepository.findById(userId)
            .map(user -> {
                if (updatedUser.getName() != null) {
                    user.setName(updatedUser.getName());
                }
                if (updatedUser.getBio() != null) {
                    user.setBio(updatedUser.getBio());
                }
                if (updatedUser.getProfilePicture() != null) {
                    user.setProfilePicture(updatedUser.getProfilePicture());
                }
                if (updatedUser.getLocation() != null) {
                    user.setLocation(updatedUser.getLocation());
                }
                if (updatedUser.getOccupation() != null) {
                    user.setOccupation(updatedUser.getOccupation());
                }
                if (updatedUser.getWebsite() != null) {
                    user.setWebsite(updatedUser.getWebsite());
                }
                
                User savedUser = userRepository.save(user);
                log.debug("User updated successfully: {}", savedUser.getEmail());
                return savedUser;
            })
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    @Transactional
    public User updatePassword(String userId, String currentPassword, String newPassword) {
        log.debug("Updating password for user with ID: {}", userId);
        
        return userRepository.findById(userId)
            .map(user -> {
                if (!passwordService.matches(currentPassword, user.getPassword())) {
                    throw new RuntimeException("Current password is incorrect");
                }
                
                user.setPassword(passwordService.encodePassword(newPassword));
                User savedUser = userRepository.save(user);
                log.debug("Password updated successfully for user: {}", savedUser.getEmail());
                return savedUser;
            })
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    @Transactional
    public void deleteUser(String userId) {
        log.debug("Deleting user with ID: {}", userId);
        userRepository.findById(userId).ifPresent(user -> {
            userRepository.delete(user);
            log.debug("User deleted successfully: {}", user.getEmail());
        });
    }

    @Transactional
    public User toggleFollowUser(String userId, String targetUserId) {
        log.debug("Toggling follow for user {} -> {}", userId, targetUserId);
        
        if (userId.equals(targetUserId)) {
            throw new RuntimeException("Users cannot follow themselves");
        }

        User currentUser = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
        User targetUser = userRepository.findById(targetUserId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + targetUserId));

        // Check if currentUser is already following targetUser
        boolean isAlreadyFollowing = currentUser.getFollowing().stream()
            .anyMatch(user -> user.getId().equals(targetUserId));

        if (isAlreadyFollowing) {
            // Remove the relationship if already following
            currentUser.getFollowing().removeIf(user -> user.getId().equals(targetUserId));
            targetUser.getFollowers().removeIf(user -> user.getId().equals(userId));
            log.debug("User {} unfollowed {}", userId, targetUserId);
        } else {
            // Add the relationship if not following
            currentUser.getFollowing().add(targetUser);
            targetUser.getFollowers().add(currentUser);
            log.debug("User {} followed {}", userId, targetUserId);
        }

        userRepository.save(targetUser);
        return userRepository.save(currentUser);
    }
}