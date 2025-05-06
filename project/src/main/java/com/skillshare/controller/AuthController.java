package com.skillshare.controller;

import com.skillshare.model.User;
import com.skillshare.service.JwtService;
import com.skillshare.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        log.debug("Attempting login for user: {}", request.email());
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            User user = userService.getUserByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtService.generateToken(authentication);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            response.put("status", "success");
            response.put("message", "Login successful");

            log.debug("Login successful for user: {}", request.email());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", request.email());
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "status", "error",
                    "message", "Invalid email or password"
                ));
        } catch (AuthenticationException e) {
            log.error("Authentication failed for user: {}", request.email(), e);
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "status", "error",
                    "message", "Authentication failed: " + e.getMessage()
                ));
        } catch (Exception e) {
            log.error("Login failed for user: {}", request.email(), e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "status", "error",
                    "message", "An unexpected error occurred"
                ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        log.debug("Processing registration for user: {}", request.email());
        try {
            if (!request.password().equals(request.confirmPassword())) {
                return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                        "status", "error",
                        "message", "Passwords do not match"
                    ));
            }

            // Check if user already exists
            if (userService.existsByEmail(request.email())) {
                return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                        "status", "error",
                        "message", "Email already registered"
                    ));
            }

            User user = new User();
            user.setName(request.name());
            user.setEmail(request.email());
            user.setPassword(request.password());

            User savedUser = userService.createUser(user);
            String token = jwtService.generateToken(savedUser);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", savedUser);
            response.put("status", "success");
            response.put("message", "Registration successful");

            log.debug("Registration successful for user: {}", request.email());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Registration failed for user: {}", request.email(), e);
            return ResponseEntity
                .badRequest()
                .body(Map.of(
                    "status", "error", 
                    "message", e.getMessage()
                ));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "status", "error",
                    "message", "No authentication provided"
                ));
        }
        
        log.debug("Validating token for user: {}", authentication.getName());
        try {
            User user = userService.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "user", user,
                "message", "Token is valid"
            ));
        } catch (Exception e) {
            log.error("Token validation failed", e);
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "status", "error",
                    "message", "Invalid token or user not found"
                ));
        }
    }
}

record LoginRequest(
    String email,
    String password
) {}

record RegisterRequest(
    String name,
    String email,
    String password,
    String confirmPassword
) {}