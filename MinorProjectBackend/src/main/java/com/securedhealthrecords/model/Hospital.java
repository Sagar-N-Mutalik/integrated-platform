package com.securedhealthrecords.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field; // Import Field

// Removed List import as 'specialties' is a String

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hospitals")
public class Hospital {

    @Id
    private String id;

    @Indexed
    @Field("name") // Maps to "name" in cleaned JSON (from "A")
    private String name;

    @Indexed
    @Field("district") // Maps to "district" in cleaned JSON (kept as is)
    private String district;

    @Field("address") // Maps to "address" in cleaned JSON (from "B")
    private String address;

    // Kept 'c' as the Java field name as requested, mapped to JSON field "C"
    @Field("C")
    private String c; // Represents hospital type ("Private", "Government", etc.)

    @Field("specialties") // Maps to "specialties" (String) in cleaned JSON (from "D")
    private String specialties; // Kept as String as per cleaned JSON

    @Field("phone1") // Maps to "phone1" in cleaned JSON (from "E")
    private String phone1;

    @Field("phone2") // Maps to "phone2" in cleaned JSON (from "F")
    private String phone2;

    @Field("email") // Maps to "email" in cleaned JSON (from "G")
    private String email;

    // --- Optional fields (Keep if needed for your application) ---
    private String description; // No mapping specified, might be null
    private Boolean isActive;   // No mapping specified, might be null or default
    private String createdAt;   // No mapping specified, might be null
    private String updatedAt;   // No mapping specified, might be null

    // --- Optional Constructor ---
    // Lombok's @AllArgsConstructor handles this, but if you need a specific one:
    // Ensure it includes the 'c' field
    public Hospital(String name, String district, String address, String c, String phone1) {
        this.name = name;
        this.district = district;
        this.address = address;
        this.c = c; // Use 'c' here
        this.phone1 = phone1;
        // Initialize other fields if necessary
        this.isActive = true; // Example default
    }
}

