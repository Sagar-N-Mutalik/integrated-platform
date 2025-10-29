package com.securedhealthrecords.controller;

import com.securedhealthrecords.repository.DoctorRepository;
import com.securedhealthrecords.repository.HospitalRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class DataTestController {

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;

    public DataTestController(HospitalRepository hospitalRepository, DoctorRepository doctorRepository) {
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/data-count")
    public Map<String, Object> getDataCount() {
        long doctorCount = doctorRepository.count();
        long hospitalCount = hospitalRepository.count();
        
        System.out.println("🔍 Database Status:");
        System.out.println("   Doctors in DB: " + doctorCount);
        System.out.println("   Hospitals in DB: " + hospitalCount);
        
        return Map.of(
            "doctorsInDatabase", doctorCount,
            "hospitalsInDatabase", hospitalCount,
            "expectedDoctors", 514,
            "expectedHospitals", 109,
            "dataSeeded", doctorCount > 0 && hospitalCount > 0
        );
    }

    @GetMapping("/reseed")
    public Map<String, Object> reseedData() {
        try {
            System.out.println("🔄 Clearing existing data...");
            doctorRepository.deleteAll();
            hospitalRepository.deleteAll();
            
            System.out.println("🌱 Re-running data seeder...");
            // The DataSeeder will run automatically on next restart
            // For immediate effect, we'd need to inject and call it manually
            
            return Map.of(
                "message", "Data cleared. Restart the application to reseed data.",
                "doctorsCleared", true,
                "hospitalsCleared", true
            );
        } catch (Exception e) {
            return Map.of(
                "error", "Failed to clear data: " + e.getMessage()
            );
        }
    }

    @GetMapping("/db-health")
    public Map<String, Object> checkDatabaseHealth() {
        try {
            // Test basic database operations
            long doctorCount = doctorRepository.count();
            long hospitalCount = hospitalRepository.count();
            
            // Test if we can read from collections
            boolean canReadDoctors = doctorRepository.findAll().size() >= 0;
            boolean canReadHospitals = hospitalRepository.findAll().size() >= 0;
            
            return Map.of(
                "databaseConnected", true,
                "doctorCount", doctorCount,
                "hospitalCount", hospitalCount,
                "canReadDoctors", canReadDoctors,
                "canReadHospitals", canReadHospitals,
                "status", "healthy"
            );
        } catch (Exception e) {
            return Map.of(
                "databaseConnected", false,
                "error", e.getMessage(),
                "status", "unhealthy"
            );
        }
    }

    @GetMapping("/upload-test")
    public Map<String, Object> testUploadEndpoint() {
        try {
            // Check if uploads directory exists
            java.nio.file.Path uploadsPath = java.nio.file.Paths.get("uploads");
            boolean uploadsExists = java.nio.file.Files.exists(uploadsPath);
            boolean uploadsWritable = java.nio.file.Files.isWritable(uploadsPath);
            
            // Create uploads directory if it doesn't exist
            if (!uploadsExists) {
                java.nio.file.Files.createDirectories(uploadsPath);
                uploadsExists = true;
                uploadsWritable = java.nio.file.Files.isWritable(uploadsPath);
            }
            
            return Map.of(
                "uploadsDirectoryExists", uploadsExists,
                "uploadsDirectoryWritable", uploadsWritable,
                "uploadsPath", uploadsPath.toAbsolutePath().toString(),
                "status", "ready"
            );
        } catch (Exception e) {
            return Map.of(
                "error", e.getMessage(),
                "status", "error"
            );
        }
    }

    @PostMapping("/simple-upload")
    public Map<String, Object> simpleUploadTest(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            System.out.println("🧪 Simple upload test received:");
            System.out.println("   File: " + file.getOriginalFilename());
            System.out.println("   Size: " + file.getSize() + " bytes");
            System.out.println("   Content Type: " + file.getContentType());
            
            if (file.isEmpty()) {
                return Map.of("error", "File is empty", "status", "failed");
            }
            
            // Try to save to uploads directory
            java.nio.file.Path uploadsPath = java.nio.file.Paths.get("uploads", "test");
            java.nio.file.Files.createDirectories(uploadsPath);
            
            String filename = "test_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path filePath = uploadsPath.resolve(filename);
            
            java.nio.file.Files.copy(file.getInputStream(), filePath, 
                java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            System.out.println("✅ Test file saved: " + filePath);
            
            return Map.of(
                "message", "File uploaded successfully",
                "filename", filename,
                "path", filePath.toString(),
                "size", file.getSize(),
                "status", "success"
            );
        } catch (Exception e) {
            System.err.println("❌ Simple upload test failed: " + e.getMessage());
            e.printStackTrace();
            return Map.of(
                "error", e.getMessage(),
                "status", "failed"
            );
        }
    }
}