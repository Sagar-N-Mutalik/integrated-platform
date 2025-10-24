package com.securedhealthrecords.service;

import com.securedhealthrecords.dto.HospitalDTO;
import com.securedhealthrecords.model.Hospital;
import com.securedhealthrecords.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    // Search logic uses 'district' and 'name' which match the updated model/repo
    public List<HospitalDTO> searchHospitals(String name, String district) {
        List<Hospital> hospitals;

        if (name != null && !name.isEmpty() && district != null && !district.isEmpty()) {
            // Filter by district first (indexed), then by name in memory
            hospitals = hospitalRepository.findByDistrictIgnoreCase(district).stream()
                .filter(h -> h.getName() != null && h.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
        } else if (name != null && !name.isEmpty()) {
            hospitals = hospitalRepository.findByNameContainingIgnoreCase(name);
        } else if (district != null && !district.isEmpty()) {
            hospitals = hospitalRepository.findByDistrictIgnoreCase(district);
        } else {
            hospitals = hospitalRepository.findAll();
        }

        // Convert the found Hospital entities to HospitalDTOs
        return hospitals.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // Gets all hospitals and converts them to DTOs
    public List<HospitalDTO> getAllHospitals() {
        return hospitalRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // *** CRITICAL UPDATE HERE ***
    // This method now correctly maps ALL fields from the Hospital model
    // (including 'c') to the HospitalDTO object.
    private HospitalDTO convertToDTO(Hospital hospital) {
        return new HospitalDTO(
            hospital.getId(),
            hospital.getName(),
            hospital.getDistrict(),
            hospital.getAddress(),
            hospital.getC(), // Added 'c' field mapping
            hospital.getSpecialties(),
            hospital.getPhone1(),
            hospital.getPhone2(),
            hospital.getEmail()
        );
    }
}

