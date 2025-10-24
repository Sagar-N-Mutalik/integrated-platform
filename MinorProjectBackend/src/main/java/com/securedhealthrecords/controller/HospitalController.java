package com.securedhealthrecords.controller;

import com.securedhealthrecords.dto.HospitalDTO;
import com.securedhealthrecords.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// Maps requests starting with /api/v1/hospitals (due to context path + RequestMapping)
@RequestMapping("/hospitals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allows frontend requests
public class HospitalController {

    private final HospitalService hospitalService; // Injects the updated service

    // Handles GET /api/v1/hospitals/search?name=...&district=...
    @GetMapping("/search")
    public ResponseEntity<List<HospitalDTO>> searchHospitals(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String district) { // Parameter name 'district' is correct
        // Calls the service method which handles the logic using district
        // and returns the DTO including the 'c' field
        List<HospitalDTO> hospitals = hospitalService.searchHospitals(name, district);
        return ResponseEntity.ok(hospitals);
    }

    // Handles GET /api/v1/hospitals
    // Returns a list of DTOs including the 'c' field
    @GetMapping
    public ResponseEntity<List<HospitalDTO>> getAllHospitals() {
        List<HospitalDTO> hospitals = hospitalService.getAllHospitals();
        return ResponseEntity.ok(hospitals);
    }
}



