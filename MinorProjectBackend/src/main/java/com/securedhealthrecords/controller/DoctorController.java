package com.securedhealthrecords.controller;

import com.securedhealthrecords.dto.DoctorDTO;
import com.securedhealthrecords.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// Base path → /api/v1/doctors because of server.servlet.context-path=/api/v1
@RequestMapping("/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    /**
     * GET /api/v1/doctors
     * → Returns all doctors
     */
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<DoctorDTO> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    /**
     * GET /api/v1/doctors/search?fullName=&district=&specialization=
     * → Search doctors by name, district, or specialization
     */
    @GetMapping("/search")
    public ResponseEntity<List<DoctorDTO>> searchDoctors(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String specialization) {

        List<DoctorDTO> results = doctorService.searchDoctors(fullName, district, specialization);
        return ResponseEntity.ok(results);
    }
}
