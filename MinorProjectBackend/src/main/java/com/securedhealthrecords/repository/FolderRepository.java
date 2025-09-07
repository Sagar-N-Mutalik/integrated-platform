package com.securedhealthrecords.repository;

import com.securedhealthrecords.model.Folder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends MongoRepository<Folder, String> {
    List<Folder> findByUserId(String userId);
    List<Folder> findByUserIdAndParentFolderId(String userId, String parentFolderId);
    List<Folder> findByUserIdAndParentFolderIdIsNull(String userId);
}
