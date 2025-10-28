package com.securedhealthrecords.service;

import com.securedhealthrecords.model.FileRecord;
import com.securedhealthrecords.repository.FileRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {
    
    private final FileRecordRepository fileRecordRepository;
    private final CloudinaryService cloudinaryService;

    public FileRecord uploadFile(MultipartFile file, String userId, String folderId) throws IOException {
        Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, userId, folderId);
        
        String publicId = (String) uploadResult.get("public_id");
        String url = (String) uploadResult.get("secure_url");
        
        FileRecord fileRecord = new FileRecord(
            userId,
            file.getOriginalFilename(),
            file.getOriginalFilename(),
            file.getContentType(),
            file.getSize(),
            publicId,
            url
        );
        
        if (folderId != null && !folderId.isEmpty()) {
            fileRecord.setFolderId(folderId);
        }
        
        return fileRecordRepository.save(fileRecord);
    }

    public List<FileRecord> getUserFiles(String userId) {
        return fileRecordRepository.findByUserId(userId);
    }

    public List<FileRecord> getFilesInFolder(String userId, String folderId) {
        if (folderId == null || folderId.isEmpty()) {
            return fileRecordRepository.findByUserIdAndFolderIdIsNull(userId);
        }
        return fileRecordRepository.findByUserIdAndFolderId(userId, folderId);
    }

    public Map<String, Object> getUserStats(String userId) {
        List<FileRecord> userFiles = fileRecordRepository.findByUserId(userId);
        long totalFiles = userFiles.size();
        long totalSize = userFiles.stream().mapToLong(FileRecord::getSize).sum();
        
        return Map.of(
            "totalFiles", totalFiles,
            "totalSize", totalSize,
            "storageUsed", formatFileSize(totalSize)
        );
    }

    public void deleteFile(String fileId, String userId) throws IOException {
        Optional<FileRecord> fileRecord = fileRecordRepository.findById(fileId);
        if (fileRecord.isPresent() && fileRecord.get().getUserId().equals(userId)) {
            cloudinaryService.deleteFile(fileRecord.get().getCloudinaryPublicId());
            fileRecordRepository.deleteById(fileId);
        }
    }

    public String generateShareLink(String fileId, String userId) {
        Optional<FileRecord> fileRecord = fileRecordRepository.findById(fileId);
        if (fileRecord.isPresent() && fileRecord.get().getUserId().equals(userId)) {
            FileRecord file = fileRecord.get();
            String shareToken = UUID.randomUUID().toString();
            file.setShareToken(shareToken);
            file.setShareExpiresAt(LocalDateTime.now().plusDays(7)); // 7 days expiry
            fileRecordRepository.save(file);
            return shareToken;
        }
        return null;
    }

    public Optional<FileRecord> getFileByShareToken(String shareToken) {
        Optional<FileRecord> fileRecord = fileRecordRepository.findByShareToken(shareToken);
        if (fileRecord.isPresent()) {
            FileRecord file = fileRecord.get();
            if (file.getShareExpiresAt() != null && file.getShareExpiresAt().isAfter(LocalDateTime.now())) {
                return fileRecord;
            }
        }
        return Optional.empty();
    }

<<<<<<< HEAD
    public FileRecord renameFile(String fileId, String userId, String newFileName) {
        Optional<FileRecord> fileRecord = fileRecordRepository.findById(fileId);
        if (fileRecord.isEmpty()) {
            throw new RuntimeException("File not found");
        }
        
        FileRecord file = fileRecord.get();
        if (!file.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You don't have permission to rename this file");
        }
        
        file.setFileName(newFileName);
        file.setUpdatedAt(LocalDateTime.now());
        return fileRecordRepository.save(file);
    }

    public FileRecord updateFile(String fileId, String userId, MultipartFile newFile) throws IOException {
        Optional<FileRecord> fileRecord = fileRecordRepository.findById(fileId);
        if (fileRecord.isEmpty()) {
            throw new RuntimeException("File not found");
        }
        
        FileRecord file = fileRecord.get();
        if (!file.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You don't have permission to update this file");
        }
        
        // Delete old file from Cloudinary
        cloudinaryService.deleteFile(file.getCloudinaryPublicId());
        
        // Upload new file
        Map<String, Object> uploadResult = cloudinaryService.uploadFile(newFile, userId, file.getFolderId());
        
        String publicId = (String) uploadResult.get("public_id");
        String url = (String) uploadResult.get("secure_url");
        
        // Update file record
        file.setFileName(newFile.getOriginalFilename());
        file.setOriginalFileName(newFile.getOriginalFilename());
        file.setMimeType(newFile.getContentType());
        file.setSize(newFile.getSize());
        file.setCloudinaryPublicId(publicId);
        file.setUrl(url);
        file.setUpdatedAt(LocalDateTime.now());
        
        return fileRecordRepository.save(file);
    }

    public Optional<FileRecord> getFileById(String fileId, String userId) {
        Optional<FileRecord> fileRecord = fileRecordRepository.findById(fileId);
        if (fileRecord.isPresent() && fileRecord.get().getUserId().equals(userId)) {
            return fileRecord;
        }
        return Optional.empty();
    }

=======
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}
