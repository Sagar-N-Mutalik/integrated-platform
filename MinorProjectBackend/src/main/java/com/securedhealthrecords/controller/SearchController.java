package com.securedhealthrecords.controller;

import com.securedhealthrecords.model.Doctor;
import com.securedhealthrecords.model.Hospital;
import com.securedhealthrecords.repository.DoctorRepository;
import com.securedhealthrecords.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private static final Logger log = LoggerFactory.getLogger(SearchController.class);

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;

    @Autowired
    public SearchController(HospitalRepository hospitalRepository, DoctorRepository doctorRepository) {
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
        log.info(">>>>>>>>>> SearchController initialized successfully! <<<<<<<<<<");
    }

    /**
     * Endpoint to search for hospitals.
     * Handles GET /api/v1/search/hospitals?district=...&specialty=...&name=...
     */
    @GetMapping("/hospitals")
    public ResponseEntity<List<Hospital>> searchHospitals(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String name) {

        log.info(">>>>>>>>>> searchHospitals called with district: [{}], specialty: [{}], name: [{}] <<<<<<<<<<", district, specialty, name);

        boolean hasDistrict = district != null && !district.isEmpty();
        boolean hasSpecialty = specialty != null && !specialty.isEmpty();
        boolean hasName = name != null && !name.isEmpty();

        List<Hospital> results;

        if (hasName) {
            log.info("Searching hospitals by name: {}", name);
            results = hospitalRepository.findByNameContainingIgnoreCase(name);
            if (hasDistrict) {
                results = results.stream()
                                 .filter(h -> district.equalsIgnoreCase(h.getDistrict()))
                                 .collect(Collectors.toList());
            }
            if (hasSpecialty) {
                 results = results.stream()
                                 .filter(h -> h.getSpecialties() != null && h.getSpecialties().toLowerCase().contains(specialty.toLowerCase()))
                                 .collect(Collectors.toList());
            }
        } else if (hasDistrict && hasSpecialty) {
             log.info("Searching hospitals by district '{}' AND specialty '{}'", district, specialty);
             results = hospitalRepository.findByDistrictIgnoreCase(district);
             results = results.stream()
                             .filter(h -> h.getSpecialties() != null && h.getSpecialties().toLowerCase().contains(specialty.toLowerCase()))
                             .collect(Collectors.toList());
        } else if (hasDistrict) {
             log.info("Searching hospitals by district: {}", district);
            results = hospitalRepository.findByDistrictIgnoreCase(district);
        } else if (hasSpecialty) {
             log.info("Searching hospitals by specialty: {}", specialty);
            results = hospitalRepository.findBySpecialtiesContainingIgnoreCase(specialty);
        } else {
             log.info("No specific criteria for hospitals, returning all.");
            results = hospitalRepository.findAll();
        }

        log.info("<<<<<<<<<< searchHospitals returning {} results. >>>>>>>>>>", results.size());
        return ResponseEntity.ok(results);
    }

    /**
     * Endpoint to search for doctors.
     * Handles GET /api/v1/search/doctors?district=...&specialization=...&fullName=...
     */
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> searchDoctors(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String fullName) {

        log.info(">>>>>>>>>> searchDoctors called with district: [{}], specialization: [{}], fullName: [{}] <<<<<<<<<<", district, specialization, fullName);

        boolean hasDistrict = district != null && !district.isEmpty();
        boolean hasSpecialization = specialization != null && !specialization.isEmpty();
        boolean hasFullName = fullName != null && !fullName.isEmpty();

        List<Doctor> results;

        if (hasFullName) {
            log.info("Searching doctors by fullName: {}", fullName);
            results = doctorRepository.findByFullNameContainingIgnoreCase(fullName);
            if (hasDistrict) {
                results = results.stream()
                                 .filter(d -> district.equalsIgnoreCase(d.getDistrict()))
                                 .collect(Collectors.toList());
            }
            if (hasSpecialization) {
                results = results.stream()
                                 .filter(d -> d.getSpecialization() != null && d.getSpecialization().toLowerCase().contains(specialization.toLowerCase()))
                                 .collect(Collectors.toList());
            }
        } else if (hasDistrict && hasSpecialization) {
            log.info("Searching doctors by district '{}' AND specialization '{}'", district, specialization);
            results = doctorRepository.findByDistrictIgnoreCaseAndSpecializationContainingIgnoreCase(district, specialization);
        } else if (hasDistrict) {
            log.info("Searching doctors by district: {}", district);
            results = doctorRepository.findByDistrictIgnoreCase(district);
        } else if (hasSpecialization) {
            log.info("Searching doctors by specialization: {}", specialization);
            results = doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
        } else {
            log.info("No specific criteria for doctors, returning all.");
            results = doctorRepository.findAll();
        }

        log.info("<<<<<<<<<< searchDoctors returning {} results. >>>>>>>>>>", results.size());
        return ResponseEntity.ok(results);
    }
}




