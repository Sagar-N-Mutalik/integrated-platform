package com.securedhealthrecords.controller;

import com.securedhealthrecords.dto.UserDTO;
import com.securedhealthrecords.model.User;
import com.securedhealthrecords.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOpt.get();
        return ResponseEntity.ok(toDTO(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMe(@RequestBody UserDTO request, Authentication authentication) {
        String email = authentication.getName();
        System.out.println("📝 Updating profile for: " + email);
        System.out.println("📝 Request data: " + request);
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            System.out.println("❌ User not found: " + email);
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        System.out.println("📝 Current user: " + user);
        
        if (request.getFullName() != null) {
            System.out.println("✏️ Updating fullName: " + request.getFullName());
            user.setFullName(request.getFullName());
        }
        if (request.getAge() != null) {
            System.out.println("✏️ Updating age: " + request.getAge());
            user.setAge(request.getAge());
        }
        if (request.getGender() != null) {
            System.out.println("✏️ Updating gender: " + request.getGender());
            user.setGender(request.getGender());
        }
        if (request.getPhone() != null) {
            System.out.println("✏️ Updating phone: " + request.getPhone());
            user.setPhone(request.getPhone());
        }
        if (request.getNotificationsEnabled() != null) {
            System.out.println("✏️ Updating notificationsEnabled: " + request.getNotificationsEnabled());
            user.setNotificationsEnabled(request.getNotificationsEnabled());
        }
        
        User savedUser = userRepository.save(user);
        System.out.println("✅ User saved: " + savedUser);
        
        return ResponseEntity.ok(toDTO(savedUser));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(userOpt.get().getId());
        return ResponseEntity.noContent().build();
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender());
        dto.setPhone(user.getPhone());
        dto.setNotificationsEnabled(user.getNotificationsEnabled());
        return dto;
    }
}
