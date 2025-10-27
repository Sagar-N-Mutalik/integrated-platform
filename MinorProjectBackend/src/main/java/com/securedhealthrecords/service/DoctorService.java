package com.securedhealthrecords.service;

import com.securedhealthrecords.dto.DoctorDTO;
import com.securedhealthrecords.model.Doctor;
import com.securedhealthrecords.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> searchDoctors(String fullName, String district, String specialization) {
        List<Doctor> doctors = doctorRepository.findAll();

        return doctors.stream()
                .filter(d -> (fullName == null || d.getFullName().toLowerCase().contains(fullName.toLowerCase())))
                .filter(d -> (district == null || d.getDistrict().equalsIgnoreCase(district)))
                .filter(d -> (specialization == null || 
                        (d.getSpecialization() != null && 
                         d.getSpecialization().toLowerCase().contains(specialization.toLowerCase()))))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private DoctorDTO convertToDTO(Doctor doctor) {
        return new DoctorDTO(
                doctor.getFullName(),
                doctor.getSpecialization(),
                doctor.getDistrict(),
                doctor.getHospitalName(),
                doctor.getIsAvailable(),
                doctor.getRating(),
                doctor.getTotalReviews()
        );
    }
}
