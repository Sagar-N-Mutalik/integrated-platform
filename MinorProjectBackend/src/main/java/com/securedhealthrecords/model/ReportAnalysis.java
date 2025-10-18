package com.securedhealthrecords.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "report_analysis")
public class ReportAnalysis {
    @Id
    private String id;

    @Indexed
    private String userId;

    private String fileName;
    private String fileMimeType;
    private Long fileSize;

    private String extractedText;
    private String analysisResultJson;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReportAnalysis(String userId, String fileName, String fileMimeType, Long fileSize, String extractedText, String analysisResultJson) {
        this.userId = userId;
        this.fileName = fileName;
        this.fileMimeType = fileMimeType;
        this.fileSize = fileSize;
        this.extractedText = extractedText;
        this.analysisResultJson = analysisResultJson;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}


