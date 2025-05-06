package com.skillshare.repository;

import com.skillshare.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("{ 'followers': ?0 }")
    List<User> findFollowers(String userId);
    
    @Query("{ 'following': ?0 }")
    List<User> findFollowing(String userId);
    
    @Query("{ $or: [{ 'name': { $regex: ?0, $options: 'i' } }, { 'email': { $regex: ?0, $options: 'i' } }] }")
    List<User> searchUsers(String searchTerm);
    
    @Query(value = "{ '_id': ?0 }", fields = "{ 'password': 0, 'resetToken': 0, 'resetTokenExpiry': 0 }")
    Optional<User> findByIdWithoutSensitiveData(String id);
}