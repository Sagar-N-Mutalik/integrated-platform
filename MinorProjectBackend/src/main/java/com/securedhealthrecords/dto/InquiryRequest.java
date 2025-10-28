package com.securedhealthrecords.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InquiryRequest {
    
    @NotBlank(message = "Recipient email is required")
    @Email(message = "Invalid recipient email format")
    private String recipientEmail;
    
    @NotBlank(message = "Recipient name is required")
    private String recipientName;
    
    @NotBlank(message = "Patient name is required")
    private String patientName;
    
    @NotBlank(message = "Patient email is required")
    @Email(message = "Invalid patient email format")
    private String patientEmail;
    
    @NotBlank(message = "Patient phone is required")
    private String patientPhone;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    private String recipientType; // "doctor" or "hospital"
}
