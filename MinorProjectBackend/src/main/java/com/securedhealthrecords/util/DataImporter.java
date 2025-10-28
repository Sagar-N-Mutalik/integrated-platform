package com.securedhealthrecords.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.securedhealthrecords.model.Doctor;
import com.securedhealthrecords.model.Hospital;
import com.securedhealthrecords.repository.DoctorRepository;
import com.securedhealthrecords.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataImporter implements CommandLineRunner {

    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        long doctorCount = doctorRepository.count();
        long hospitalCount = hospitalRepository.count();

        if (doctorCount > 0 && hospitalCount > 0) {
            log.info("✅ Data already exists: {} doctors, {} hospitals", doctorCount, hospitalCount);
            return;
        }

        log.info("🔄 Starting data import...");
        
        try {
            importDoctors();
            importHospitals();
            log.info("✅ Data import completed successfully!");
        } catch (Exception e) {
            log.error("❌ Error during data import: {}", e.getMessage(), e);
        }
    }

    private void importDoctors() {
        try {
            // Read from classpath or external file
            InputStream inputStream = new ClassPathResource("data/doctors.json").getInputStream();
            JsonNode rootNode = objectMapper.readTree(inputStream);

            List<Doctor> doctors = new ArrayList<>();
            
            // Parse the JSON structure
            JsonNode doctorsNode = rootNode;
            if (doctorsNode.isArray()) {
                for (JsonNode node : doctorsNode) {
                    Doctor doctor = parseDoctor(node);
                    if (doctor != null) {
                        doctors.add(doctor);
                    }
                }
            }

            if (!doctors.isEmpty()) {
                doctorRepository.saveAll(doctors);
                log.info("✅ Imported {} doctors", doctors.size());
            }
        } catch (Exception e) {
            log.warn("⚠️ Could not import doctors from file: {}", e.getMessage());
        }
    }

    private void importHospitals() {
        try {
            InputStream inputStream = new ClassPathResource("data/hospitals.json").getInputStream();
            JsonNode rootNode = objectMapper.readTree(inputStream);

            List<Hospital> hospitals = new ArrayList<>();
            
            if (rootNode.isArray()) {
                for (JsonNode node : rootNode) {
                    Hospital hospital = parseHospital(node);
                    if (hospital != null) {
                        hospitals.add(hospital);
                    }
                }
            }

            if (!hospitals.isEmpty()) {
                hospitalRepository.saveAll(hospitals);
                log.info("✅ Imported {} hospitals", hospitals.size());
            }
        } catch (Exception e) {
            log.warn("⚠️ Could not import hospitals from file: {}", e.getMessage());
        }
    }

    private Doctor parseDoctor(JsonNode node) {
        try {
            Doctor doctor = new Doctor();
            doctor.setDistrict(node.has("district") ? node.get("district").asText() : null);
            doctor.setHospitalName(node.has("A") ? node.get("A").asText() : null);
            doctor.setFullName(node.has("B") ? node.get("B").asText() : null);
            doctor.setSpecialization(node.has("C") ? node.get("C").asText() : null);
            doctor.setIsAvailable(true);
            doctor.setRating(4.0);
            doctor.setTotalReviews(0);
            return doctor;
        } catch (Exception e) {
            log.error("Error parsing doctor: {}", e.getMessage());
            return null;
        }
    }

    private Hospital parseHospital(JsonNode node) {
        try {
            Hospital hospital = new Hospital();
            hospital.setHospitalName(node.has("A") ? node.get("A").asText() : null);
            hospital.setLocation(node.has("B") ? node.get("B").asText() : null);
            hospital.setDistrict(node.has("district") ? node.get("district").asText() : null);
            hospital.setHospitalType(node.has("C") ? node.get("C").asText() : null);
            
            // Parse specialties
            if (node.has("D") && !node.get("D").isNull()) {
                String specialtiesStr = node.get("D").asText();
                List<String> specialties = Arrays.asList(specialtiesStr.split(",\\s*"));
                hospital.setSpecialties(specialties);
            }
            
            hospital.setPhone(node.has("E") ? node.get("E").asText() : null);
            hospital.setAltPhone(node.has("F") ? node.get("F").asText() : null);
            hospital.setContact(node.has("G") ? node.get("G").asText() : null);
            hospital.setIsActive(true);
            
            return hospital;
        } catch (Exception e) {
            log.error("Error parsing hospital: {}", e.getMessage());
            return null;
        }
    }
}
