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
        seedHospitals();
        seedDoctors();
    }

    private void seedHospitals() {
        try {
            if (hospitalRepository.count() > 0) {
                log.info("Hospitals collection already has data. Skipping seeding.");
                return;
            }

            ClassPathResource resource = new ClassPathResource("hospital.json");
            if (!resource.exists()) {
                log.warn("hospital.json not found in classpath resources. Skipping hospital seeding.");
                return;
            }

            try (InputStream is = resource.getInputStream()) {
                JsonNode root = mapper.readTree(is);
                if (root == null || !root.isArray()) {
                    log.warn("hospital.json is not a JSON array. Skipping.");
                    return;
                }

                List<Hospital> hospitals = new ArrayList<>();
                for (JsonNode node : root) {
                    // Convert base fields as-is. Your Hospital model must match new schema:
                    // hospitalName, district, location, hospitalType, specialties(List<String>), phone, altPhone, contact
                    Hospital h = mapper.convertValue(node, Hospital.class);

                    // Normalize specialties: accept either array or string in JSON
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
                            // already array in file, mapper likely handled it; keep as-is
                            // (no-op)
                        }
                    }

                    hospitals.add(h);
                }

                hospitalRepository.insert(hospitals);
                log.info("Seeded {} hospitals.", hospitals.size());
            }
        } catch (Exception e) {
            log.error("Failed to seed hospitals", e);
        }
    }

    private void seedDoctors() {
        try {
            if (doctorRepository.count() > 0) {
                log.info("Doctors collection already has data. Skipping seeding.");
                return;
            }

            ClassPathResource resource = new ClassPathResource("doctor.json");
            if (!resource.exists()) {
                log.warn("doctor.json not found in classpath resources. Skipping doctor seeding.");
                return;
            }

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

                doctorRepository.insert(doctors);
                log.info("Seeded {} doctors.", doctors.size());
            }
        } catch (Exception e) {
            log.error("Failed to seed doctors", e);
        }
    }
}