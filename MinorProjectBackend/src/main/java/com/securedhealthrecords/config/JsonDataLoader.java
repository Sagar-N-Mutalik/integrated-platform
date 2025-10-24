package com.securedhealthrecords.config;

import com.fasterxml.jackson.core.type.TypeReference;
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
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JsonDataLoader implements CommandLineRunner {

    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(String... args) throws Exception {
        loadHospitalsFromJson();
        loadDoctorsFromJson();
    }

    private void loadHospitalsFromJson() {
        try {
            if (hospitalRepository.count() > 0) {
                log.info("Hospitals already exist in database. Skipping JSON load.");
                return;
            }

            ClassPathResource resource = new ClassPathResource("hospital.json");
            if (!resource.exists()) {
                log.warn("hospital.json file not found in classpath. Skipping hospital data load.");
                return;
            }

            List<Map<String, Object>> hospitalData = objectMapper.readValue(
                resource.getInputStream(),
                new TypeReference<List<Map<String, Object>>>() {}
            );

            log.info("Loading {} hospitals from JSON...", hospitalData.size());

            for (Map<String, Object> data : hospitalData) {
                Hospital hospital = new Hospital();
                
                // Map JSON fields to model fields
                hospital.setName(getStringValue(data, "name"));
                hospital.setDistrict(getStringValue(data, "district"));
                hospital.setAddress(getStringValue(data, "address"));
                hospital.setC(getStringValue(data, "C"));
                hospital.setSpecialties(getStringValue(data, "specialties"));
                hospital.setPhone1(getStringValue(data, "phone1"));
                hospital.setPhone2(getStringValue(data, "phone2"));
                hospital.setEmail(getStringValue(data, "email"));
                
                // Set default values
                hospital.setIsActive(true);
                hospital.setCreatedAt(LocalDateTime.now().toString());
                hospital.setUpdatedAt(LocalDateTime.now().toString());
                
                hospitalRepository.save(hospital);
            }

            log.info("Successfully loaded {} hospitals from JSON", hospitalData.size());
        } catch (IOException e) {
            log.error("Error loading hospitals from JSON: {}", e.getMessage());
        }
    }

    private void loadDoctorsFromJson() {
        try {
            if (doctorRepository.count() > 0) {
                log.info("Doctors already exist in database. Skipping JSON load.");
                return;
            }

            ClassPathResource resource = new ClassPathResource("doctor.json");
            if (!resource.exists()) {
                log.warn("doctor.json file not found in classpath. Skipping doctor data load.");
                return;
            }

            List<Map<String, Object>> doctorData = objectMapper.readValue(
                resource.getInputStream(),
                new TypeReference<List<Map<String, Object>>>() {}
            );

            log.info("Loading {} doctors from JSON...", doctorData.size());

            for (Map<String, Object> data : doctorData) {
                Doctor doctor = new Doctor();
                
                // Map JSON fields to model fields
                doctor.setFullName(getStringValue(data, "fullName"));
                doctor.setSpecialization(getStringValue(data, "specialization"));
                doctor.setDistrict(getStringValue(data, "district"));
                doctor.setHospitalName(getStringValue(data, "hospitalName"));
                
                // Set default values
                doctor.setIsAvailable(true);
                doctor.setCreatedAt(LocalDateTime.now().toString());
                doctor.setUpdatedAt(LocalDateTime.now().toString());
                doctor.setRating(4.5);
                doctor.setTotalReviews(20);
                doctor.setConsultationFee("₹600");
                
                doctorRepository.save(doctor);
            }

            log.info("Successfully loaded {} doctors from JSON", doctorData.size());
        } catch (IOException e) {
            log.error("Error loading doctors from JSON: {}", e.getMessage());
        }
    }

    private String getStringValue(Map<String, Object> data, String key) {
        Object value = data.get(key);
        if (value == null) {
            return null;
        }
        String stringValue = value.toString();
        return StringUtils.hasText(stringValue) && !"null".equalsIgnoreCase(stringValue) ? stringValue : null;
    }
}