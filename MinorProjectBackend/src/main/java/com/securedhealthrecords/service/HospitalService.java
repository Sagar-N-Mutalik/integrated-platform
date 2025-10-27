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

    // Fetch all hospitals
    public List<HospitalDTO> getAllHospitals() {
        return hospitalRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Search by name or district
    public List<HospitalDTO> searchHospitals(String hospitalName, String district) {
        List<Hospital> results;

        boolean hasName = hospitalName != null && !hospitalName.isEmpty();
        boolean hasDistrict = district != null && !district.isEmpty();

        if (hasName && hasDistrict) {
            results = hospitalRepository.findByHospitalNameContainingIgnoreCase(hospitalName)
                    .stream()
                    .filter(h -> h.getDistrict() != null && h.getDistrict().equalsIgnoreCase(district))
                    .collect(Collectors.toList());
        } else if (hasName) {
            results = hospitalRepository.findByHospitalNameContainingIgnoreCase(hospitalName);
        } else if (hasDistrict) {
            // ✅ change here — make sure you use the correct repo method
            results = hospitalRepository.findByDistrictContainingIgnoreCase(district);
        } else {
            results = hospitalRepository.findAll();
        }

        return results.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Convert MongoDB model → frontend DTO
    private HospitalDTO convertToDTO(Hospital h) {
        return new HospitalDTO(
                h.getHospitalName(),
                h.getDistrict(),
                h.getLocation(),
                h.getHospitalType(),
                h.getSpecialties(),
                h.getPhone(),
                h.getAltPhone(),
                h.getContact()
        );
    }
}
