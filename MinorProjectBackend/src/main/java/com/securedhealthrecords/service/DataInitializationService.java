package com.securedhealthrecords.service;

import com.securedhealthrecords.model.Doctor;
import com.securedhealthrecords.model.Hospital;
import com.securedhealthrecords.repository.DoctorRepository;
import com.securedhealthrecords.repository.HospitalRepository;
import com.securedhealthrecords.util.DataParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService implements CommandLineRunner {

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final DataParser dataParser;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data to ensure fresh load
        log.info("Clearing existing hospital and doctor data...");
        hospitalRepository.deleteAll();
        doctorRepository.deleteAll();
        log.info("Existing data cleared");

        log.info("Starting data initialization...");
        
        try {
            // Try multiple possible file paths
            String[] possiblePaths = {
                "C:\\Users\\N Samarth\\Downloads\\hospitalsanddoctorsintegrated.txt",
                "hospitalsanddoctorsintegrated.txt",
                "./hospitalsanddoctorsintegrated.txt"
            };
            
            String filePath = null;
            for (String path : possiblePaths) {
                if (java.nio.file.Files.exists(java.nio.file.Paths.get(path))) {
                    filePath = path;
                    break;
                }
            }
            
            if (filePath == null) {
                log.warn("Data file not found in any of the expected locations. Skipping data initialization.");
                return;
            }
            
            log.info("Using data file: {}", filePath);
            
            // Parse and load hospital data
            List<Hospital> hospitals = dataParser.parseHospitals(filePath);
            
            if (!hospitals.isEmpty()) {
                hospitalRepository.saveAll(hospitals);
                log.info("Loaded {} hospitals into database", hospitals.size());
            } else {
                log.warn("No hospitals found in data file");
            }
            
            // Parse and load doctor data
            List<Doctor> doctors = dataParser.parseDoctors(filePath);
            
            if (!doctors.isEmpty()) {
                doctorRepository.saveAll(doctors);
                log.info("Loaded {} doctors into database", doctors.size());
            } else {
                log.warn("No doctors found in data file");
            }
            
            log.info("Data initialization completed successfully");
            
        } catch (Exception e) {
            log.error("Error during data initialization: ", e);
        }
    }
}
