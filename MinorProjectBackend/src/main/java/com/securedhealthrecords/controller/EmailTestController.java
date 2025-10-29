package com.securedhealthrecords.controller;

import com.securedhealthrecords.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/email-test")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmailTestController {

    private final EmailService emailService;

    /**
     * Test endpoint to verify email configuration
     * Usage: GET http://localhost:8080/api/v1/email-test/send?to=youremail@gmail.com
     */
    @GetMapping("/send")
    public ResponseEntity<Map<String, Object>> testEmail(@RequestParam String to) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Send a test appointment request email
            emailService.sendAppointmentRequestEmail(
                to,
                "Dr. Test Doctor",
                "Test Patient",
                "patient@test.com",
                "+91 9876543210",
                LocalDateTime.now().plusDays(1),
                "This is a test appointment request",
                "test-appointment-id"
            );
            
            response.put("success", true);
            response.put("message", "Test email sent successfully to " + to);
            response.put("note", "Check your inbox (and spam folder)");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send email");
            response.put("error", e.getMessage());
            response.put("tip", "Check your email configuration in application.yml");
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Check email configuration status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> checkStatus() {
        Map<String, Object> response = new HashMap<>();
        
        String username = System.getenv("MAIL_USERNAME");
        String password = System.getenv("MAIL_PASSWORD");
        
        response.put("configured", username != null && password != null);
        response.put("username", username != null ? username : "Not set (using default)");
        response.put("password", password != null ? "Set (hidden)" : "Not set (using default)");
        response.put("note", "Set MAIL_USERNAME and MAIL_PASSWORD environment variables");
        
        return ResponseEntity.ok(response);
    }
}
