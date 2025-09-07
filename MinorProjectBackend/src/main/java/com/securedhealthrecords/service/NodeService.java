package com.securedhealthrecords.service;

import com.securedhealthrecords.dto.NodeDTO;
import com.securedhealthrecords.exception.InvalidRequestException;
import com.securedhealthrecords.exception.ResourceNotFoundException;
import com.securedhealthrecords.model.Node;
import com.securedhealthrecords.model.Node.NodeType;
import com.securedhealthrecords.repository.NodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NodeService {
    
    private final NodeRepository nodeRepository;
    private final CloudinaryService cloudinaryService;
    
    public List<NodeDTO> getNodesByParent(String ownerId, String parentId) {
        List<Node> nodes = nodeRepository.findByOwnerIdAndParentId(ownerId, parentId);
        return nodes.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public NodeDTO createFolder(String ownerId, String parentId, String name) {
        // Check if folder with same name exists in parent
        if (nodeRepository.existsByOwnerIdAndParentIdAndName(ownerId, parentId, name)) {
            throw new InvalidRequestException("Folder with name '" + name + "' already exists");
        }
        
        Node folder = new Node(ownerId, parentId, NodeType.FOLDER, name);
        Node savedFolder = nodeRepository.save(folder);
        
        return convertToDTO(savedFolder);
    }
    
    public NodeDTO createFileNode(String ownerId, String parentId, String name, String mimeType, String encryptedFileKey, MultipartFile file) throws IOException {
        // Check if file with same name exists in parent
        if (nodeRepository.existsByOwnerIdAndParentIdAndName(ownerId, parentId, name)) {
            throw new InvalidRequestException("File with name '" + name + "' already exists");
        }
        
        // Upload file to Cloudinary
        String folderName = parentId != null ? "folder_" + parentId : "root";
        Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, ownerId, folderName);
        String cloudinaryUrl = (String) uploadResult.get("secure_url");
        
        Node fileNode = new Node(ownerId, parentId, name, mimeType, cloudinaryUrl, encryptedFileKey);
        Node savedFile = nodeRepository.save(fileNode);
        
        return convertToDTO(savedFile);
    }
    
    public NodeDTO updateNode(String nodeId, String ownerId, String newName) {
        Node node = nodeRepository.findById(nodeId)
            .orElseThrow(() -> new ResourceNotFoundException("Node not found"));
        
        if (!node.getOwnerId().equals(ownerId)) {
            throw new InvalidRequestException("Unauthorized access to node");
        }
        
        // Check if new name conflicts with existing nodes in same parent
        if (!node.getName().equals(newName) && 
            nodeRepository.existsByOwnerIdAndParentIdAndName(ownerId, node.getParentId(), newName)) {
            throw new InvalidRequestException("Name '" + newName + "' already exists in this location");
        }
        
        node.setName(newName);
        Node updatedNode = nodeRepository.save(node);
        
        return convertToDTO(updatedNode);
    }
    
    @Transactional
    public void deleteNode(String nodeId, String ownerId) {
        Node node = nodeRepository.findById(nodeId)
            .orElseThrow(() -> new ResourceNotFoundException("Node not found"));
        
        if (!node.getOwnerId().equals(ownerId)) {
            throw new InvalidRequestException("Unauthorized access to node");
        }
        
        if (node.getType() == NodeType.FOLDER) {
            // Delete all children recursively
            deleteNodeRecursively(nodeId);
        } else {
            // Delete file from Cloudinary
            if (node.getStorageKey() != null) {
                try {
                    String publicId = cloudinaryService.extractPublicIdFromUrl(node.getStorageKey());
                    if (publicId != null) {
                        cloudinaryService.deleteFile(publicId);
                    }
                } catch (IOException e) {
                    log.error("Failed to delete file from Cloudinary: {}", e.getMessage());
                }
            }
            nodeRepository.deleteById(nodeId);
        }
    }
    
    private void deleteNodeRecursively(String nodeId) {
        // Find all children
        List<Node> children = nodeRepository.findByParentId(nodeId);
        
        for (Node child : children) {
            if (child.getType() == NodeType.FOLDER) {
                deleteNodeRecursively(child.getId());
            } else {
                // Delete file from Cloudinary
                if (child.getStorageKey() != null) {
                    try {
                        String publicId = cloudinaryService.extractPublicIdFromUrl(child.getStorageKey());
                        if (publicId != null) {
                            cloudinaryService.deleteFile(publicId);
                        }
                    } catch (IOException e) {
                        log.error("Failed to delete file from Cloudinary: {}", e.getMessage());
                    }
                }
                nodeRepository.deleteById(child.getId());
            }
        }
        
        // Delete the parent node
        nodeRepository.deleteById(nodeId);
    }
    
    
    private NodeDTO convertToDTO(Node node) {
        NodeDTO dto = new NodeDTO();
        dto.setId(node.getId());
        dto.setOwnerId(node.getOwnerId());
        dto.setParentId(node.getParentId());
        dto.setType(node.getType());
        dto.setName(node.getName());
        dto.setMimeType(node.getMimeType());
        dto.setStorageKey(node.getStorageKey());
        dto.setEncryptedFileKey(node.getEncryptedFileKey());
        dto.setCreatedAt(node.getCreatedAt());
        
        // Set download URL for files (Cloudinary URL is already public)
        if (node.getType() == NodeType.FILE && node.getStorageKey() != null) {
            dto.setDownloadUrl(node.getStorageKey()); // Cloudinary URL is the direct download URL
        }
        
        return dto;
    }
}
