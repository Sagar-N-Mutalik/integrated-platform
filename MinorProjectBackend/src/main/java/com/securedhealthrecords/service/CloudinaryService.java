package com.securedhealthrecords.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        
<<<<<<< HEAD
        System.out.println("🔧 Initializing Cloudinary with:");
        System.out.println("   Cloud Name: " + cloudName);
        System.out.println("   API Key: " + apiKey);
        System.out.println("   API Secret: " + (apiSecret != null && !apiSecret.isEmpty() ? "***configured***" : "NOT SET"));
        
=======
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
<<<<<<< HEAD
        
        System.out.println("✅ Cloudinary initialized successfully!");
    }

    public Map<String, Object> uploadFile(MultipartFile file, String userId, String folder) throws IOException {
        System.out.println("📤 Starting file upload to Cloudinary:");
        System.out.println("   File: " + file.getOriginalFilename());
        System.out.println("   Size: " + file.getSize() + " bytes");
        System.out.println("   User ID: " + userId);
        
=======
    }

    public Map<String, Object> uploadFile(MultipartFile file, String userId, String folder) throws IOException {
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
        String publicId = userId + "/" + (folder != null ? folder + "/" : "") + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "public_id", publicId,
                "resource_type", "auto",
                "folder", "health_records/" + userId
        );
        
<<<<<<< HEAD
        System.out.println("   Public ID: " + publicId);
        System.out.println("   Uploading to Cloudinary...");
        
        @SuppressWarnings("unchecked")
        Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        
        System.out.println("✅ File uploaded successfully!");
        System.out.println("   URL: " + result.get("secure_url"));
        
=======
        @SuppressWarnings("unchecked")
        Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), uploadParams);
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
        return result;
    }

    public void deleteFile(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    public String generateSecureUrl(String publicId) {
        return cloudinary.url().secure(true).generate(publicId);
    }

    public String extractPublicIdFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }
        try {
            // Extract public_id from Cloudinary URL
            // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/public_id.jpg
            String[] parts = url.split("/");
            if (parts.length >= 2) {
                String lastPart = parts[parts.length - 1];
                // Remove file extension
                int dotIndex = lastPart.lastIndexOf('.');
                if (dotIndex > 0) {
                    return lastPart.substring(0, dotIndex);
                }
                return lastPart;
            }
        } catch (Exception e) {
            // Log error and return null
            System.err.println("Error extracting public ID from URL: " + url);
        }
        return null;
    }
}
