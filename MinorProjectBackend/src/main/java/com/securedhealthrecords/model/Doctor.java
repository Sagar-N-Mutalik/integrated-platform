package com.securedhealthrecords.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "doctors")
public class Doctor {
    @Id
    private String id;
    private String fullName;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private String qualification;
    private String experience;
    private String city;
    private String hospitalId;
    private String hospitalName;
    private String hospital;
    private String profileImage;
    private String bio;
    private List<String> availableDays;
    private String consultationFee;
    private Double rating;
    private Integer totalReviews;
    private Boolean isAvailable;
    private String createdAt;
    private String updatedAt;
}
