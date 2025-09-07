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
            FileRecord uploadedFile = fileService.uploadFile(file, userId, folderId);
            return ResponseEntity.ok(uploadedFile);
        } catch (Exception e) {
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
}
