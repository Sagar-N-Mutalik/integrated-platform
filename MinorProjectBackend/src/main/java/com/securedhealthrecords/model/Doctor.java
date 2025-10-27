package com.securedhealthrecords.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "doctors")
public class Doctor {

    @Id
    private String id;

    @Indexed
    @Field("fullName")
    @JsonProperty("fullName")
    private String fullName;

    @Indexed
    @Field("specialization")
    @JsonProperty("specialization")
    private String specialization;

    @Indexed
    @Field("district")
    @JsonProperty("district")
    private String district;

    @Field("hospitalName")
    @JsonProperty("hospitalName")
    private String hospitalName;

    // New: hospitalId (used by DataInitializer)
    @Field("hospitalId")
    @JsonProperty("hospitalId")
    private String hospitalId;

    private Boolean isAvailable;
    private Double rating;
    private Integer totalReviews;
    private String createdAt;
    private String updatedAt;

    // New: consultationFee (used by DataInitializer)
    @Field("consultationFee")
    @JsonProperty("consultationFee")
    private String consultationFee;
}
