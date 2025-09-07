package com.securedhealthrecords.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "health_tips")
public class HealthTip {
    @Id
    private String id;
    private String title;
    private String content;
    private String category; // NUTRITION, EXERCISE, MENTAL_HEALTH, GENERAL
    private String imageUrl;
    private String author;
    private Boolean isActive;
    private String createdAt;
    private String updatedAt;
}
