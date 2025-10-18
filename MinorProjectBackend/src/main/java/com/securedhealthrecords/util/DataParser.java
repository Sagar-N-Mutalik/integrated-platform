package com.securedhealthrecords.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.securedhealthrecords.model.Doctor;
import com.securedhealthrecords.model.Hospital;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class DataParser {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Hospital> parseHospitals(String filePath) {
        List<Hospital> hospitals = new ArrayList<>();
        try {
            String content = Files.readString(Paths.get(filePath));
            
            // Find the hospital section
            int hospitalStart = content.indexOf("HOSPITAL");
            int doctorStart = content.indexOf("DOCTOR");
            
            if (hospitalStart == -1 || doctorStart == -1) {
                log.error("Could not find HOSPITAL or DOCTOR sections in file");
                return hospitals;
            }
            
            String hospitalSection = content.substring(hospitalStart, doctorStart);
            
            // Extract JSON array from hospital section
            int jsonStart = hospitalSection.indexOf('[');
            int jsonEnd = hospitalSection.lastIndexOf(']') + 1;
            
            if (jsonStart == -1 || jsonEnd == -1) {
                log.error("Could not find JSON array in hospital section");
                return hospitals;
            }
            
            String jsonArray = hospitalSection.substring(jsonStart, jsonEnd);
            JsonNode hospitalArray = objectMapper.readTree(jsonArray);
            
            for (JsonNode hospitalNode : hospitalArray) {
                Hospital hospital = new Hospital();
                hospital.setName(hospitalNode.get("A").asText());
                hospital.setAddress(hospitalNode.get("B").asText());
                hospital.setType(hospitalNode.get("C").asText());
                hospital.setSpecialties(hospitalNode.get("D").asText());
                hospital.setPhone(hospitalNode.get("E").asText());
                hospital.setEmergency(hospitalNode.get("F").asText());
                hospital.setWebsite(hospitalNode.get("G").asText());
                hospital.setCity(hospitalNode.get("district").asText());
                hospital.setIsActive(true);
                
                hospitals.add(hospital);
            }
            
            log.info("Parsed {} hospitals", hospitals.size());
            
        } catch (IOException e) {
            log.error("Error parsing hospital data: ", e);
        }
        
        return hospitals;
    }

    public List<Doctor> parseDoctors(String filePath) {
        List<Doctor> doctors = new ArrayList<>();
        try {
            String content = Files.readString(Paths.get(filePath));
            
            // Find the doctor section
            int doctorStart = content.indexOf("DOCTOR");
            
            if (doctorStart == -1) {
                log.error("Could not find DOCTOR section in file");
                return doctors;
            }
            
            String doctorSection = content.substring(doctorStart);
            
            // Extract JSON array from doctor section
            int jsonStart = doctorSection.indexOf('[');
            int jsonEnd = doctorSection.lastIndexOf(']') + 1;
            
            if (jsonStart == -1 || jsonEnd == -1) {
                log.error("Could not find JSON array in doctor section");
                return doctors;
            }
            
            String jsonArray = doctorSection.substring(jsonStart, jsonEnd);
            JsonNode doctorArray = objectMapper.readTree(jsonArray);
            
            for (JsonNode doctorNode : doctorArray) {
                Doctor doctor = new Doctor();
                doctor.setName(doctorNode.get("B").asText());
                doctor.setFullName(doctorNode.get("B").asText());
                doctor.setSpecialization(doctorNode.get("C").asText());
                doctor.setHospital(doctorNode.get("A").asText());
                doctor.setHospitalName(doctorNode.get("A").asText());
                doctor.setCity(doctorNode.get("district").asText());
                doctor.setIsAvailable(true);
                
                doctors.add(doctor);
            }
            
            log.info("Parsed {} doctors", doctors.size());
            
        } catch (IOException e) {
            log.error("Error parsing doctor data: ", e);
        }
        
        return doctors;
    }
}
