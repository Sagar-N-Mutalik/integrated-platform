package com.securedhealthrecords.controller;

import com.securedhealthrecords.model.Folder;
import com.securedhealthrecords.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/folders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FolderController {

    private final FolderService folderService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createFolder(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String userId = request.get("userId");
            String parentFolderId = request.get("parentFolderId");
            
            Folder folder = folderService.createFolder(name, userId, parentFolderId);
            return ResponseEntity.ok(folder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Folder>> getUserFolders(@PathVariable String userId) {
        List<Folder> folders = folderService.getUserFolders(userId);
        return ResponseEntity.ok(folders);
    }

    @DeleteMapping("/{folderId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteFolder(@PathVariable String folderId) {
        try {
            folderService.deleteFolder(folderId);
            return ResponseEntity.ok(Map.of("message", "Folder deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
