package com.securedhealthrecords.controller;

import com.securedhealthrecords.model.Doctor;
import com.securedhealthrecords.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findByIsAvailable(true);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable String id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        return doctor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Doctor>> getDoctorsByCity(@PathVariable String city) {
        List<Doctor> doctors = doctorRepository.findByCity(city);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable String specialization) {
        List<Doctor> doctors = doctorRepository.findBySpecialization(specialization);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchDoctors(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String specialization) {
        
        List<Doctor> doctors;
        if (city != null && specialization != null) {
            doctors = doctorRepository.findByCityAndSpecialization(city, specialization);
        } else if (city != null) {
            doctors = doctorRepository.findByCity(city);
        } else if (specialization != null) {
            doctors = doctorRepository.findBySpecialization(specialization);
        } else {
            doctors = doctorRepository.findByIsAvailable(true);
        }
        
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Doctor>> getDoctorsByHospital(@PathVariable String hospitalId) {
        List<Doctor> doctors = doctorRepository.findByHospitalId(hospitalId);
        return ResponseEntity.ok(doctors);
    }
}
