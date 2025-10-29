package com.securedhealthrecords.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class UnifiedStorageService {

    private final CloudinaryService cloudinaryService;
    private final GoogleDriveService googleDriveService;
    private final FirebaseStorageService firebaseStorageService;
    private final Base64StorageService base64StorageService;
    private final LocalFileStorageService localFileStorageService;

    @Value("${app.storage.priority:local,base64,firebase,googledrive,cloudinary}")
    private String storagePriority;

    public UnifiedStorageService(
            CloudinaryService cloudinaryService,
            GoogleDriveService googleDriveService,
            FirebaseStorageService firebaseStorageService,
            Base64StorageService base64StorageService,
            LocalFileStorageService localFileStorageService) {
        
        this.cloudinaryService = cloudinaryService;
        this.googleDriveService = googleDriveService;
        this.firebaseStorageService = firebaseStorageService;
        this.base64StorageService = base64StorageService;
        this.localFileStorageService = localFileStorageService;
    }

    public Map<String, Object> uploadFile(MultipartFile file, String userId, String folder) throws IOException {
        System.out.println("🔄 Unified Storage: Trying multiple storage options...");
        System.out.println("   Priority order: " + storagePriority);
        
        String[] priorities = storagePriority.split(",");
        
        for (String storage : priorities) {
            try {
                switch (storage.trim().toLowerCase()) {
                    case "local":
                        System.out.println("📁 Trying local storage...");
                        return localFileStorageService.uploadFile(file, userId, folder);
                        
                    case "base64":
                        System.out.println("📊 Trying Base64 storage...");
                        if (file.getSize() <= 5 * 1024 * 1024) { // Only for files <= 5MB
                            return base64StorageService.uploadFile(file, userId, folder);
                        } else {
                            System.out.println("⚠️ File too large for Base64, trying next option...");
                            continue;
                        }
                        
                    case "firebase":
                        System.out.println("🔥 Trying Firebase storage...");
                        return firebaseStorageService.uploadFile(file, userId, folder);
                        
                    case "googledrive":
                        System.out.println("📁 Trying Google Drive...");
                        return googleDriveService.uploadFile(file, userId, folder);
                        
                    case "cloudinary":
                        System.out.println("☁️ Trying Cloudinary...");
                        return cloudinaryService.uploadFile(file, userId, folder);
                        
                    default:
                        System.out.println("⚠️ Unknown storage type: " + storage);
                        continue;
                }
            } catch (Exception e) {
                System.err.println("❌ " + storage + " failed: " + e.getMessage());
                // Continue to next storage option
            }
        }
        
        // If all else fails, use local storage as final fallback
        System.out.println("🆘 All configured storage options failed, using local as final fallback...");
        return localFileStorageService.uploadFile(file, userId, folder);
    }

    public void deleteFile(String publicId, String storageType) throws IOException {
        System.out.println("🗑️ Deleting file from " + storageType + ": " + publicId);
        
        try {
            switch (storageType.toLowerCase()) {
                case "local":
                    localFileStorageService.deleteFile(publicId);
                    break;
                case "base64":
                    base64StorageService.deleteFile(publicId);
                    break;
                case "firebase":
                    firebaseStorageService.deleteFile(publicId);
                    break;
                case "google_drive":
                    googleDriveService.deleteFile(publicId);
                    break;
                case "cloudinary":
                    cloudinaryService.deleteFile(publicId);
                    break;
                default:
                    System.out.println("⚠️ Unknown storage type for deletion: " + storageType);
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to delete from " + storageType + ": " + e.getMessage());
        }
    }
}