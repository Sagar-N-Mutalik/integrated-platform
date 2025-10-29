package com.securedhealthrecords.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "appointments")
public class Appointment {
    @Id
    private String id;
    private String patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private String doctorId;
    private String doctorName;
    private String doctorEmail;
    private String hospitalId;
    private String hospitalName;
    private LocalDateTime appointmentDateTime;
    private String appointmentType; // CONSULTATION, FOLLOW_UP, EMERGENCY
    private String status; // PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED
    private String reason; // Reason for appointment
    private String symptoms;
    private String notes;
    private List<String> attachedRecords; // File IDs
    private String consultationFee;
    private Boolean isPaid;
    private String createdAt;
    private String updatedAt;
    private Boolean reminderSent; // Track if reminder was sent
}
