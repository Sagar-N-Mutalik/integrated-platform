package com.securedhealthrecords.controller;

import com.securedhealthrecords.model.HealthTip;
import com.securedhealthrecords.repository.HealthTipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/health-tips")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HealthTipController {

    private final HealthTipRepository healthTipRepository;

    @GetMapping
    public ResponseEntity<List<HealthTip>> getAllHealthTips() {
        List<HealthTip> tips = healthTipRepository.findByIsActive(true);
        return ResponseEntity.ok(tips);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<HealthTip>> getHealthTipsByCategory(@PathVariable String category) {
        List<HealthTip> tips = healthTipRepository.findByIsActiveAndCategory(true, category);
        return ResponseEntity.ok(tips);
    }

    @PostMapping
    public ResponseEntity<HealthTip> createHealthTip(@RequestBody HealthTip healthTip) {
        healthTip.setIsActive(true);
        healthTip.setCreatedAt(java.time.LocalDateTime.now().toString());
        healthTip.setUpdatedAt(java.time.LocalDateTime.now().toString());
        HealthTip saved = healthTipRepository.save(healthTip);
        return ResponseEntity.ok(saved);
    }
}