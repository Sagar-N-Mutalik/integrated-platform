package com.securedhealthrecords.controller;

import com.securedhealthrecords.model.Doctor;
import com.securedhealthrecords.model.Hospital;
import com.securedhealthrecords.repository.DoctorRepository;
import com.securedhealthrecords.repository.HospitalRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Search", description = "Search hospitals and doctors")
@RestController
@RequestMapping("/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private static final Logger log = LoggerFactory.getLogger(SearchController.class);

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;

    public SearchController(HospitalRepository hospitalRepository, DoctorRepository doctorRepository) {
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
        log.info(">>>>>>>>>> SearchController initialized successfully! <<<<<<<<<<");
    }

    // ====================== HOSPITAL SEARCH =======================
    @Operation(
            summary = "Search hospitals",
            description = "Filter hospitals by district, specialty, or hospital name."
    )
    @ApiResponse(responseCode = "200", description = "Successful search")
    @GetMapping("/hospitals")
    public ResponseEntity<List<Hospital>> searchHospitals(
            @Parameter(description = "District name (e.g., Mysuru, Bengaluru)")
            @RequestParam(required = false) String district,
            @Parameter(description = "Specialty (case-insensitive match)")
            @RequestParam(required = false) String specialty,
            @Parameter(description = "Hospital name (partial match)")
            @RequestParam(required = false) String hospitalName) {

        log.info("searchHospitals called with district: [{}], specialty: [{}], hospitalName: [{}]",
                district, specialty, hospitalName);

        boolean hasDistrict = district != null && !district.isEmpty();
        boolean hasSpecialty = specialty != null && !specialty.isEmpty();
        boolean hasName = hospitalName != null && !hospitalName.isEmpty();

        List<Hospital> results;

        if (hasName) {
            results = hospitalRepository.findByHospitalNameContainingIgnoreCase(hospitalName);
            if (hasDistrict) {
                results = results.stream()
                        .filter(h -> h.getDistrict() != null && h.getDistrict().equalsIgnoreCase(district))
                        .collect(Collectors.toList());
            }
            if (hasSpecialty) {
                results = results.stream()
                        .filter(h -> h.getSpecialties() != null &&
                                h.getSpecialties().stream()
                                        .anyMatch(s -> s != null && s.toLowerCase().contains(specialty.toLowerCase())))
                        .collect(Collectors.toList());
            }
        } else if (hasDistrict && hasSpecialty) {
            results = hospitalRepository.findByDistrictContainingIgnoreCase(district);
            results = results.stream()
                    .filter(h -> h.getSpecialties() != null &&
                            h.getSpecialties().stream()
                                    .anyMatch(s -> s != null && s.toLowerCase().contains(specialty.toLowerCase())))
                    .collect(Collectors.toList());
        } else if (hasDistrict) {
            results = hospitalRepository.findByDistrictContainingIgnoreCase(district);
        } else if (hasSpecialty) {
            results = hospitalRepository.findAll().stream()
                    .filter(h -> h.getSpecialties() != null &&
                            h.getSpecialties().stream()
                                    .anyMatch(s -> s != null && s.toLowerCase().contains(specialty.toLowerCase())))
                    .collect(Collectors.toList());
        } else {
            results = hospitalRepository.findAll();
        }

        log.info("searchHospitals returning {} results.", results.size());
        return ResponseEntity.ok(results);
    }

    // ====================== DOCTOR SEARCH =======================
    @Operation(
            summary = "Search doctors",
            description = "Filter doctors by district, specialization, or full name."
    )
    @ApiResponse(responseCode = "200", description = "Successful search")
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> searchDoctors(
            @Parameter(description = "District name")
            @RequestParam(required = false) String district,
            @Parameter(description = "Doctor specialization (partial, case-insensitive)")
            @RequestParam(required = false) String specialization,
            @Parameter(description = "Doctor full name (partial, case-insensitive)")
            @RequestParam(required = false) String fullName) {

        log.info("searchDoctors called with district: [{}], specialization: [{}], fullName: [{}]",
                district, specialization, fullName);

        boolean hasDistrict = district != null && !district.isEmpty();
        boolean hasSpecialization = specialization != null && !specialization.isEmpty();
        boolean hasFullName = fullName != null && !fullName.isEmpty();

        List<Doctor> results;

        if (hasFullName) {
            results = doctorRepository.findByFullNameContainingIgnoreCase(fullName);
            if (hasDistrict) {
                results = results.stream()
                        .filter(d -> d.getDistrict() != null && d.getDistrict().equalsIgnoreCase(district))
                        .collect(Collectors.toList());
            }
            if (hasSpecialization) {
                results = results.stream()
                        .filter(d -> d.getSpecialization() != null &&
                                d.getSpecialization().toLowerCase().contains(specialization.toLowerCase()))
                        .collect(Collectors.toList());
            }
        } else if (hasDistrict && hasSpecialization) {
            results = doctorRepository.findByDistrictIgnoreCaseAndSpecializationContainingIgnoreCase(district, specialization);
        } else if (hasDistrict) {
            results = doctorRepository.findByDistrictIgnoreCase(district);
        } else if (hasSpecialization) {
            results = doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
        } else {
            results = doctorRepository.findAll();
        }

        log.info("searchDoctors returning {} results.", results.size());
        return ResponseEntity.ok(results);
    }
}