package com.securedhealthrecords.repository;

import com.securedhealthrecords.model.FileRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRecordRepository extends MongoRepository<FileRecord, String> {
    List<FileRecord> findByUserId(String userId);
    List<FileRecord> findByUserIdAndFolderId(String userId, String folderId);
    List<FileRecord> findByUserIdAndFolderIdIsNull(String userId);
    Optional<FileRecord> findByShareToken(String shareToken);
    long countByUserId(String userId);
}
