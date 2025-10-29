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
    private final LocalFileStorageService localFileStorageService;
    private final boolean useCloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret,
            LocalFileStorageService localFileStorageService) {
        
        this.localFileStorageService = localFileStorageService;
        
        System.out.println("🔧 Initializing Cloudinary with:");
        System.out.println("   Cloud Name: " + cloudName);
        System.out.println("   API Key: " + apiKey);
        System.out.println("   API Secret: " + (apiSecret != null && !apiSecret.isEmpty() ? "***configured***" : "NOT SET"));
        
        // Check if Cloudinary credentials are properly configured
        boolean hasValidCredentials = cloudName != null && !cloudName.isEmpty() && 
                                    apiKey != null && !apiKey.isEmpty() && 
                                    apiSecret != null && !apiSecret.isEmpty() &&
                                    !apiSecret.equals("your-api-secret"); // Check for placeholder
        
        if (hasValidCredentials) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret
            ));
            this.useCloudinary = true;
            System.out.println("✅ Cloudinary initialized successfully!");
        } else {
            this.cloudinary = null;
            this.useCloudinary = false;
            System.out.println("⚠️ Cloudinary credentials not configured properly. Using local file storage.");
        }
    }

    public Map<String, Object> uploadFile(MultipartFile file, String userId, String folder) throws IOException {
        System.out.println("📤 Starting file upload:");
        System.out.println("   File: " + file.getOriginalFilename());
        System.out.println("   Size: " + file.getSize() + " bytes");
        System.out.println("   Content Type: " + file.getContentType());
        System.out.println("   User ID: " + userId);
        System.out.println("   Using Cloudinary: " + useCloudinary);
        
        // Validate file
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }
        
        if (file.getSize() > 50 * 1024 * 1024) { // 50MB limit
            throw new IOException("File size exceeds 50MB limit");
        }
        
        if (!useCloudinary) {
            System.out.println("📁 Using local file storage...");
            return localFileStorageService.uploadFile(file, userId, folder);
        }
        
        try {
            String publicId = userId + "/" + (folder != null ? folder + "/" : "") + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "public_id", publicId,
                    "resource_type", "auto",
                    "folder", "health_records/" + userId
            );
            
            System.out.println("   Public ID: " + publicId);
            System.out.println("   Uploading to Cloudinary...");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            
            System.out.println("✅ File uploaded to Cloudinary successfully!");
            System.out.println("   URL: " + result.get("secure_url"));
            System.out.println("   Public ID: " + result.get("public_id"));
            
            return result;
        } catch (Exception e) {
            // Check if it's a Cloudinary API exception by checking the class name
            if (e.getClass().getSimpleName().contains("ApiException")) {
                System.err.println("❌ Cloudinary API Error: " + e.getMessage());
                System.err.println("   Falling back to local storage...");
            } else {
                System.err.println("❌ Unexpected error during Cloudinary upload: " + e.getMessage());
                System.err.println("   Falling back to local storage...");
            }
            return localFileStorageService.uploadFile(file, userId, folder);
        }
    }

    public void deleteFile(String publicId) throws IOException {
        if (!useCloudinary) {
            localFileStorageService.deleteFile(publicId);
            return;
        }
        
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            System.err.println("❌ Error deleting from Cloudinary, trying local storage: " + e.getMessage());
            localFileStorageService.deleteFile(publicId);
        }
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
