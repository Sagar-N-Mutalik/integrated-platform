package com.securedhealthrecords.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.securedhealthrecords.model.Doctor;
import com.securedhealthrecords.model.Hospital;
import com.securedhealthrecords.repository.DoctorRepository;
import com.securedhealthrecords.repository.HospitalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public DataSeeder(HospitalRepository hospitalRepository, DoctorRepository doctorRepository) {
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
    }

    @Override
    public void run(String... args) {
        log.info("🌱 DataSeeder starting...");
        seedHospitals();
        seedDoctors();
        
        // Final count verification
        long hospitalCount = hospitalRepository.count();
        long doctorCount = doctorRepository.count();
        
        log.info("🏥 Final database counts:");
        log.info("   Hospitals: {}", hospitalCount);
        log.info("   Doctors: {}", doctorCount);
        
        if (hospitalCount == 0 || doctorCount == 0) {
            log.error("❌ Data seeding failed! Database is empty.");
        } else {
            log.info("✅ Data seeding completed successfully!");
        }
    }

    private void seedHospitals() {
        try {
            long existingCount = hospitalRepository.count();
            log.info("🏥 Current hospitals in database: {}", existingCount);
            
            // Force reload for debugging - remove this check temporarily
            // if (existingCount > 0) {
            //     log.info("Hospitals collection already has data. Skipping seeding.");
            //     return;
            // }
            
            // Clear existing data and reload
            if (existingCount > 0) {
                log.info("🔄 Clearing existing hospital data to force reload...");
                hospitalRepository.deleteAll();
            }

            ClassPathResource resource = new ClassPathResource("hospital.json");
            if (!resource.exists()) {
                log.error("❌ hospital.json not found in classpath resources. Skipping hospital seeding.");
                return;
            }
            
            log.info("📄 Found hospital.json file, loading data...");

            try (InputStream is = resource.getInputStream()) {
                JsonNode root = mapper.readTree(is);
                if (root == null || !root.isArray()) {
                    log.warn("hospital.json is not a JSON array. Skipping.");
                    return;
                }

                List<Hospital> hospitals = new ArrayList<>();
                for (JsonNode node : root) {
                    try {
                        // Create hospital object manually to handle specialties properly
                        Hospital h = new Hospital();
                        
                        // Set basic fields
                        if (node.has("district")) h.setDistrict(node.get("district").asText());
                        if (node.has("hospitalName")) h.setHospitalName(node.get("hospitalName").asText());
                        if (node.has("location")) h.setLocation(node.get("location").asText());
                        if (node.has("hospitalType")) h.setHospitalType(node.get("hospitalType").asText());
                        if (node.has("phone")) h.setPhone(node.get("phone").asText());
                        if (node.has("altPhone")) h.setAltPhone(node.get("altPhone").asText());
                        if (node.has("contact")) h.setContact(node.get("contact").asText());

                        // Handle specialties field - convert comma-separated string to List
                        if (node.has("specialties") && !node.get("specialties").isNull()) {
                            JsonNode sp = node.get("specialties");
                            if (sp.isTextual()) {
                                String specStr = sp.asText();
                                if (!specStr.isBlank()) {
                                    List<String> list = Arrays.stream(specStr.split(","))
                                            .map(String::trim)
                                            .filter(s -> !s.isEmpty())
                                            .toList();
                                    h.setSpecialties(list);
                                } else {
                                    h.setSpecialties(List.of());
                                }
                            } else if (sp.isArray()) {
                                // Handle array format
                                List<String> list = new ArrayList<>();
                                for (JsonNode specialty : sp) {
                                    list.add(specialty.asText().trim());
                                }
                                h.setSpecialties(list);
                            }
                        } else {
                            h.setSpecialties(List.of());
                        }

                        hospitals.add(h);
                        
                    } catch (Exception e) {
                        log.error("Error processing hospital: {}", node.toString(), e);
                        // Continue with next hospital
                    }
                }

                if (hospitals.isEmpty()) {
                    log.warn("⚠️ No hospitals parsed from JSON file!");
                } else {
                    hospitalRepository.insert(hospitals);
                    log.info("✅ Successfully seeded {} hospitals.", hospitals.size());
                }
            }
        } catch (Exception e) {
            log.error("Failed to seed hospitals", e);
        }
    }

    private void seedDoctors() {
        try {
            long existingCount = doctorRepository.count();
            log.info("👨‍⚕️ Current doctors in database: {}", existingCount);
            
            // Force reload for debugging - remove this check temporarily
            // if (existingCount > 0) {
            //     log.info("Doctors collection already has data. Skipping seeding.");
            //     return;
            // }
            
            // Clear existing data and reload
            if (existingCount > 0) {
                log.info("🔄 Clearing existing doctor data to force reload...");
                doctorRepository.deleteAll();
            }

            ClassPathResource resource = new ClassPathResource("doctor.json");
            if (!resource.exists()) {
                log.error("❌ doctor.json not found in classpath resources. Skipping doctor seeding.");
                return;
            }
            
            log.info("📄 Found doctor.json file, loading data...");

            try (InputStream is = resource.getInputStream()) {
                JsonNode root = mapper.readTree(is);
                if (root == null || !root.isArray()) {
                    log.warn("doctor.json is not a JSON array. Skipping.");
                    return;
                }

                List<Doctor> doctors = new ArrayList<>();
                String now = Instant.now().toString();

                for (JsonNode node : root) {
                    Doctor d = mapper.convertValue(node, Doctor.class);

                    // Defaults for optional app fields if your model has them
                    // e.g., availability/timestamps/rating/reviews. These are safe no-ops if not present.
                    try {
                        var getIsAvailable = Doctor.class.getMethod("getIsAvailable");
                        var setIsAvailable = Doctor.class.getMethod("setIsAvailable", Boolean.class);
                        if (getIsAvailable.invoke(d) == null) setIsAvailable.invoke(d, Boolean.TRUE);
                    } catch (NoSuchMethodException ignored) {}

                    try {
                        var getCreatedAt = Doctor.class.getMethod("getCreatedAt");
                        var setCreatedAt = Doctor.class.getMethod("setCreatedAt", String.class);
                        if (getCreatedAt.invoke(d) == null) setCreatedAt.invoke(d, now);
                    } catch (NoSuchMethodException ignored) {}

                    try {
                        var getUpdatedAt = Doctor.class.getMethod("getUpdatedAt");
                        var setUpdatedAt = Doctor.class.getMethod("setUpdatedAt", String.class);
                        if (getUpdatedAt.invoke(d) == null) setUpdatedAt.invoke(d, now);
                    } catch (NoSuchMethodException ignored) {}

                    try {
                        var getRating = Doctor.class.getMethod("getRating");
                        var setRating = Doctor.class.getMethod("setRating", Double.class);
                        if (getRating.invoke(d) == null) setRating.invoke(d, 4.5);
                    } catch (NoSuchMethodException ignored) {}

                    try {
                        var getTotalReviews = Doctor.class.getMethod("getTotalReviews");
                        var setTotalReviews = Doctor.class.getMethod("setTotalReviews", Integer.class);
                        if (getTotalReviews.invoke(d) == null) setTotalReviews.invoke(d, 0);
                    } catch (NoSuchMethodException ignored) {}

                    doctors.add(d);
                }

                if (doctors.isEmpty()) {
                    log.warn("⚠️ No doctors parsed from JSON file!");
                } else {
                    doctorRepository.insert(doctors);
                    log.info("✅ Successfully seeded {} doctors.", doctors.size());
                }
            }
        } catch (Exception e) {
            log.error("Failed to seed doctors", e);
        }
    }
}