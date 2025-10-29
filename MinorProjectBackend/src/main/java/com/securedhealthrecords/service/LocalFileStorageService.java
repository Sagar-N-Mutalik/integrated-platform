package com.securedhealthrecords.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class LocalFileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public Map<String, Object> uploadFile(MultipartFile file, String userId, String folder) throws IOException {
        System.out.println("📁 Using local file storage (Cloudinary fallback)");
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, "health_records", userId);
        if (folder != null && !folder.isEmpty()) {
            uploadPath = uploadPath.resolve(folder);
        }
        Files.createDirectories(uploadPath);
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Generate URL (for local development)
        String fileUrl = "http://localhost:8080/api/v1/files/download/" + userId + "/" + uniqueFilename;
        String publicId = userId + "/" + uniqueFilename;
        
        System.out.println("✅ File saved locally:");
        System.out.println("   Path: " + filePath.toString());
        System.out.println("   URL: " + fileUrl);
        
        Map<String, Object> result = new HashMap<>();
        result.put("public_id", publicId);
        result.put("secure_url", fileUrl);
        result.put("url", fileUrl);
        result.put("bytes", file.getSize());
        result.put("format", extension.replace(".", ""));
        result.put("resource_type", file.getContentType().startsWith("image") ? "image" : "raw");
        
        return result;
    }

    public void deleteFile(String publicId) throws IOException {
        try {
            Path filePath = Paths.get(uploadDir, "health_records", publicId);
            Files.deleteIfExists(filePath);
            System.out.println("🗑️ Local file deleted: " + filePath);
        } catch (Exception e) {
            System.err.println("❌ Error deleting local file: " + e.getMessage());
        }
    }
}