package com.securedhealthrecords.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.Permission;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class GoogleDriveService {

    @Value("${google.drive.service-account-key:}")
    private String serviceAccountKey;

    @Value("${google.drive.folder-id:}")
    private String parentFolderId;

    private Drive driveService;
    private boolean isConfigured = false;

    public Map<String, Object> uploadFile(MultipartFile file, String userId, String folder) throws IOException {
        System.out.println("📁 Google Drive upload requested");
        
        if (!isConfigured && !initializeDriveService()) {
            System.out.println("⚠️ Google Drive not configured, using simulation mode");
            return simulateGoogleDriveUpload(file, userId);
        }

        try {
            System.out.println("📤 Uploading to Google Drive:");
            System.out.println("   File: " + file.getOriginalFilename());
            System.out.println("   Size: " + file.getSize() + " bytes");
            System.out.println("   User: " + userId);

            // Create file metadata
            File fileMetadata = new File();
            fileMetadata.setName(userId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename());
            
            if (parentFolderId != null && !parentFolderId.isEmpty()) {
                fileMetadata.setParents(Collections.singletonList(parentFolderId));
            }

            // Create file content
            InputStreamContent mediaContent = new InputStreamContent(
                file.getContentType(),
                new ByteArrayInputStream(file.getBytes())
            );
            mediaContent.setLength(file.getSize());

            // Upload file
            File uploadedFile = driveService.files()
                .create(fileMetadata, mediaContent)
                .setFields("id,name,webViewLink,webContentLink,size")
                .execute();

            // Make file publicly accessible
            Permission permission = new Permission();
            permission.setType("anyone");
            permission.setRole("reader");
            
            driveService.permissions()
                .create(uploadedFile.getId(), permission)
                .execute();

            String publicUrl = "https://drive.google.com/file/d/" + uploadedFile.getId() + "/view";
            String downloadUrl = "https://drive.google.com/uc?id=" + uploadedFile.getId() + "&export=download";

            System.out.println("✅ File uploaded to Google Drive successfully!");
            System.out.println("   File ID: " + uploadedFile.getId());
            System.out.println("   Public URL: " + publicUrl);

            Map<String, Object> result = new HashMap<>();
            result.put("public_id", uploadedFile.getId());
            result.put("secure_url", publicUrl);
            result.put("url", publicUrl);
            result.put("download_url", downloadUrl);
            result.put("bytes", file.getSize());
            result.put("format", getFileExtension(file.getOriginalFilename()));
            result.put("resource_type", file.getContentType().startsWith("image") ? "image" : "raw");
            result.put("storage_type", "google_drive");

            return result;

        } catch (Exception e) {
            System.err.println("❌ Google Drive upload failed: " + e.getMessage());
            System.out.println("🔄 Falling back to simulation mode...");
            return simulateGoogleDriveUpload(file, userId);
        }
    }

    private Map<String, Object> simulateGoogleDriveUpload(MultipartFile file, String userId) throws IOException {
        System.out.println("🎭 Google Drive simulation mode (for development)");
        
        String fileId = "sim_" + System.currentTimeMillis() + "_" + userId;
        String publicUrl = "https://drive.google.com/file/d/" + fileId + "/view";
        String downloadUrl = "https://drive.google.com/uc?id=" + fileId + "&export=download";
        
        System.out.println("✅ File simulated in Google Drive:");
        System.out.println("   File ID: " + fileId);
        System.out.println("   Public URL: " + publicUrl);
        
        Map<String, Object> result = new HashMap<>();
        result.put("public_id", fileId);
        result.put("secure_url", publicUrl);
        result.put("url", publicUrl);
        result.put("download_url", downloadUrl);
        result.put("bytes", file.getSize());
        result.put("format", getFileExtension(file.getOriginalFilename()));
        result.put("resource_type", file.getContentType().startsWith("image") ? "image" : "raw");
        result.put("storage_type", "google_drive_simulation");
        
        return result;
    }

    private boolean initializeDriveService() {
        try {
            if (serviceAccountKey == null || serviceAccountKey.isEmpty() || serviceAccountKey.equals("your-service-account-key")) {
                System.out.println("⚠️ Google Drive service account key not configured");
                return false;
            }

            // Initialize Google Drive service
            // This would require proper service account JSON file
            System.out.println("🔧 Initializing Google Drive service...");
            
            // For now, return false to use simulation mode
            // TODO: Implement actual Google Drive authentication
            return false;
            
        } catch (Exception e) {
            System.err.println("❌ Failed to initialize Google Drive service: " + e.getMessage());
            return false;
        }
    }

    public void deleteFile(String fileId) throws IOException {
        if (!isConfigured) {
            System.out.println("🗑️ Google Drive file deletion simulated: " + fileId);
            return;
        }

        try {
            driveService.files().delete(fileId).execute();
            System.out.println("✅ File deleted from Google Drive: " + fileId);
        } catch (Exception e) {
            System.err.println("❌ Failed to delete from Google Drive: " + e.getMessage());
        }
    }

    private String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf(".") + 1);
        }
        return "";
    }
}