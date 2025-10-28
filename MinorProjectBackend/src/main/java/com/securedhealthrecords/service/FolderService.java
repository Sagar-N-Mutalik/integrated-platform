package com.securedhealthrecords.service;

import com.securedhealthrecords.model.Folder;
import com.securedhealthrecords.repository.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FolderService {
    
    private final FolderRepository folderRepository;

    public Folder createFolder(String name, String userId, String parentFolderId) {
        Folder folder = new Folder(userId, name, parentFolderId);
        return folderRepository.save(folder);
    }

    public List<Folder> getUserFolders(String userId) {
        return folderRepository.findByUserId(userId);
    }

    public List<Folder> getRootFolders(String userId) {
        return folderRepository.findByUserIdAndParentFolderIdIsNull(userId);
    }

    public List<Folder> getSubFolders(String userId, String parentFolderId) {
        return folderRepository.findByUserIdAndParentFolderId(userId, parentFolderId);
    }

    public void deleteFolder(String folderId) {
        folderRepository.deleteById(folderId);
    }

    public Optional<Folder> getFolderById(String folderId) {
        return folderRepository.findById(folderId);
    }

    public Folder updateFolder(String folderId, String userId, String name, String description) {
        Optional<Folder> folderOpt = folderRepository.findById(folderId);
        if (folderOpt.isPresent() && folderOpt.get().getUserId().equals(userId)) {
            Folder folder = folderOpt.get();
            if (name != null) folder.setName(name);
            if (description != null) folder.setDescription(description);
            folder.setUpdatedAt(LocalDateTime.now());
            return folderRepository.save(folder);
        }
        return null;
    }
}
