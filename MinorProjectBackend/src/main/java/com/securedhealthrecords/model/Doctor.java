package com.securedhealthrecords.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List; // Keep if using availableDays

@Data // Lombok generates getters, setters, equals, hashCode, toString
@Document(collection = "doctors")
public class Doctor {
    @Id
    private String id;

    // Fields matching cleaned JSON
    @Field("fullName")
    private String fullName;

    @Indexed
    @Field("specialization")
    private String specialization;

    @Indexed
    @Field("district")
    private String district;

    @Field("hospitalName")
    private String hospitalName;

    // --- Fields REQUIRED by DataInitializer ---
    // Ensure these fields are present for the sample data creation to work
    // Use @Field("...") only if the name in MongoDB differs from the Java name
    private String hospitalId;     // Links sample doctor to sample hospital
    private Boolean isAvailable;   // Set by DataInitializer
    private String createdAt;      // Set by DataInitializer
    private String updatedAt;      // Set by DataInitializer
    private Double rating;         // Set by DataInitializer
    private Integer totalReviews;  // Set by DataInitializer
    private String consultationFee;// Set by DataInitializer

    // --- Other Optional Fields (Uncomment/Add if they exist in your cleaned JSON) ---
    // private String email;
    // private String phone;
    // private String qualification;
    // private String experience;
    // private String profileImage;
    // private String bio;
    // private List<String> availableDays;

}