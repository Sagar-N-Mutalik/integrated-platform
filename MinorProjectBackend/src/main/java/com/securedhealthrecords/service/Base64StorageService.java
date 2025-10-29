package com.securedhealthrecords.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class Base64StorageService {

    public Map<String, Object> uploadFile(MultipartFile file, String userId, String folder) throws IOException {
        System.out.println("📊 Using Base64 storage (immediate functionality)");
        
        // Convert file to Base64
        byte[] fileBytes = file.getBytes();
        String base64String = Base64.getEncoder().encodeToString(fileBytes);
        String mimeType = file.getContentType();
        
        // Create data URL
        String dataUrl = "data:" + mimeType + ";base64," + base64String;
        String fileId = UUID.randomUUID().toString();
        
        System.out.println("✅ File converted to Base64:");
        System.out.println("   File ID: " + fileId);
        System.out.println("   Size: " + file.getSize() + " bytes");
        System.out.println("   Base64 length: " + base64String.length() + " chars");
        
        Map<String, Object> result = new HashMap<>();
        result.put("public_id", fileId);
        result.put("secure_url", dataUrl);
        result.put("url", dataUrl);
        result.put("bytes", file.getSize());
        result.put("format", getFileExtension(file.getOriginalFilename()));
        result.put("resource_type", file.getContentType().startsWith("image") ? "image" : "raw");
        result.put("storage_type", "base64");
        result.put("base64", base64String);
        
        return result;
    }

    public void deleteFile(String fileId) throws IOException {
        System.out.println("🗑️ Base64 file deletion: " + fileId);
        // Base64 files are stored in database, deletion handled by FileService
    }

    private String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf(".") + 1);
        }
        return "";
    }
}