package com.securedhealthrecords.controller;

import com.securedhealthrecords.model.FileRecord;
import com.securedhealthrecords.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FileController {

    private final FileService fileService;



    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") String userId,
            @RequestParam(value = "folderId", required = false) String folderId) {
        try {
            System.out.println("📥 FileController: Upload request received");
            System.out.println("   File: " + file.getOriginalFilename());
            System.out.println("   Size: " + file.getSize() + " bytes");
            System.out.println("   Content Type: " + file.getContentType());
            System.out.println("   User ID: " + userId);
            System.out.println("   Folder ID: " + folderId);
            
            // Validate file
            if (file.isEmpty()) {
                System.err.println("❌ File is empty");
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }
            
            if (file.getSize() > 50 * 1024 * 1024) { // 50MB limit
                System.err.println("❌ File too large: " + file.getSize() + " bytes");
                return ResponseEntity.badRequest().body(Map.of("error", "File size exceeds 50MB limit"));
            }
            
            FileRecord uploadedFile = fileService.uploadFile(file, userId, folderId);
            
            System.out.println("✅ FileController: Upload successful");
            System.out.println("   File ID: " + uploadedFile.getId());
            System.out.println("   URL: " + uploadedFile.getUrl());
            
            return ResponseEntity.ok(uploadedFile);
        } catch (IOException e) {
            System.err.println("❌ FileController: IO Exception - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "File upload failed: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ FileController: Unexpected error - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FileRecord>> getUserFiles(@PathVariable String userId) {
        List<FileRecord> files = fileService.getUserFiles(userId);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/stats/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable String userId) {
        Map<String, Object> stats = fileService.getUserStats(userId);
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/{fileId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteFile(@PathVariable String fileId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();
            fileService.deleteFile(fileId, userId);
            return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{fileId}/share")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> shareFile(@PathVariable String fileId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();
            String shareToken = fileService.generateShareLink(fileId, userId);
            return ResponseEntity.ok(Map.of("shareUrl", shareToken));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/shared/{shareToken}")
    public ResponseEntity<?> getSharedFile(@PathVariable String shareToken) {
        try {
            Optional<FileRecord> fileOpt = fileService.getFileByShareToken(shareToken);
            if (fileOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            FileRecord file = fileOpt.get();
            return ResponseEntity.ok(file);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{fileId}/rename")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> renameFile(
            @PathVariable String fileId,
            @RequestBody Map<String, String> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();
            String newFileName = request.get("newFileName");
            
            if (newFileName == null || newFileName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "New file name is required"));
            }
            
            FileRecord renamedFile = fileService.renameFile(fileId, userId, newFileName);
            return ResponseEntity.ok(renamedFile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{fileId}/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateFile(
            @PathVariable String fileId,
            @RequestParam("file") MultipartFile file) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();
            
            FileRecord updatedFile = fileService.updateFile(fileId, userId, file);
            return ResponseEntity.ok(updatedFile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{fileId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getFile(@PathVariable String fileId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();
            
            Optional<FileRecord> fileOpt = fileService.getFileById(fileId, userId);
            if (fileOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(fileOpt.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/simple-upload")
    public ResponseEntity<?> simpleUpload(@RequestParam("file") MultipartFile file) {
        System.out.println("🚀 SIMPLE UPLOAD - Direct to FileController!");
        System.out.println("   File: " + file.getOriginalFilename());
        System.out.println("   Size: " + file.getSize() + " bytes");
        
        try {
            // Create uploads directory if it doesn't exist
            java.nio.file.Path uploadDir = java.nio.file.Paths.get("uploads");
            if (!java.nio.file.Files.exists(uploadDir)) {
                java.nio.file.Files.createDirectories(uploadDir);
            }
            
            // Save file with timestamp to avoid conflicts
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path filePath = uploadDir.resolve(fileName);
            
            // Save the file
            java.nio.file.Files.copy(file.getInputStream(), filePath);
            
            System.out.println("✅ File saved successfully: " + filePath.toAbsolutePath());
            
            // Return success response
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "File uploaded successfully!",
                "fileName", file.getOriginalFilename(),
                "savedAs", fileName,
                "size", file.getSize(),
                "path", filePath.toAbsolutePath().toString()
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Upload failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Upload failed: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/simple-test")
    public ResponseEntity<?> simpleTest() {
        return ResponseEntity.ok(Map.of(
            "message", "Simple upload controller is working!",
            "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/download/{userId}/{filename}")
    public ResponseEntity<?> downloadLocalFile(@PathVariable String userId, @PathVariable String filename) {
        try {
            // This endpoint serves local files when Cloudinary is not available
            java.nio.file.Path filePath = java.nio.file.Paths.get("uploads", "health_records", userId, filename);
            
            if (!java.nio.file.Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] fileContent = java.nio.file.Files.readAllBytes(filePath);
            String contentType = java.nio.file.Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .header("Content-Disposition", "inline; filename=\"" + filename + "\"")
                    .body(fileContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
