package com.securedhealthrecords.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "file_records")
public class FileRecord {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String folderId;
    
    private String name;
    private String originalName;
    private String mimeType;
    private Long size;
    
    private String cloudinaryPublicId;
    private String url;
    private String thumbnailUrl;
    
    private String shareToken;
    private LocalDateTime shareExpiresAt;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public FileRecord(String userId, String name, String originalName, String mimeType, Long size, 
                     String cloudinaryPublicId, String url) {
        this.userId = userId;
        this.name = name;
        this.originalName = originalName;
        this.mimeType = mimeType;
        this.size = size;
        this.cloudinaryPublicId = cloudinaryPublicId;
        this.url = url;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
