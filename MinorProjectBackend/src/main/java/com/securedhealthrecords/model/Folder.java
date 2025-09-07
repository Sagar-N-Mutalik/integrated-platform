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
@Document(collection = "folders")
public class Folder {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String parentFolderId;
    private String name;
    private String description;
    
    private Integer fileCount;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Folder(String userId, String name, String parentFolderId) {
        this.userId = userId;
        this.name = name;
        this.parentFolderId = parentFolderId;
        this.fileCount = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
