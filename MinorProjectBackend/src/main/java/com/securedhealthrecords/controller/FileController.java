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

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") String userId,
            @RequestParam(value = "folderId", required = false) String folderId) {
        try {
            System.out.println("📥 FileController: Upload request received");
            System.out.println("   File: " + file.getOriginalFilename());
            System.out.println("   User ID: " + userId);
            System.out.println("   Folder ID: " + folderId);
            
            FileRecord uploadedFile = fileService.uploadFile(file, userId, folderId);
            
            System.out.println("✅ FileController: Upload successful");
            return ResponseEntity.ok(uploadedFile);
        } catch (Exception e) {
            System.err.println("❌ FileController: Upload failed - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
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
}
