package com.securedhealthrecords.controller;

import com.securedhealthrecords.dto.HospitalDTO;
import com.securedhealthrecords.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// Final path becomes /api/v1/hospitals because server.servlet.context-path=/api/v1
@RequestMapping("/hospitals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalService hospitalService;

    // GET /api/v1/hospitals/search?name=&district=
    @GetMapping("/search")
    public ResponseEntity<List<HospitalDTO>> searchHospitals(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String district) {
        List<HospitalDTO> hospitals = hospitalService.searchHospitals(name, district);
        return ResponseEntity.ok(hospitals);
    }

    // GET /api/v1/hospitals
    @GetMapping
    public ResponseEntity<List<HospitalDTO>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }
}