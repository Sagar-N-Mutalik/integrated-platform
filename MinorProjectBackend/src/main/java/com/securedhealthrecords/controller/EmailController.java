package com.securedhealthrecords.controller;

import com.securedhealthrecords.dto.InquiryRequest;
import com.securedhealthrecords.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send-inquiry")
    public ResponseEntity<?> sendInquiry(@Valid @RequestBody InquiryRequest request) {
        try {
            log.info("📧 Received inquiry request from {} to {}", 
                    request.getPatientEmail(), request.getRecipientEmail());

            // Send inquiry email to hospital/doctor
            emailService.sendInquiryEmail(
                    request.getRecipientEmail(),
                    request.getRecipientName(),
                    request.getPatientName(),
                    request.getPatientEmail(),
                    request.getPatientPhone(),
                    request.getMessage()
            );

            // Send confirmation email to patient
            emailService.sendConfirmationEmail(
                    request.getPatientEmail(),
                    request.getPatientName(),
                    request.getRecipientName()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Your inquiry has been sent successfully!");
            
            log.info("✅ Inquiry sent successfully from {} to {}", 
                    request.getPatientEmail(), request.getRecipientEmail());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Error sending inquiry: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to send inquiry. Please try again later.");
            errorResponse.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEmail() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Email service is running");
        response.put("message", "Use POST /email/send-inquiry to send emails");
        return ResponseEntity.ok(response);
    }
}
