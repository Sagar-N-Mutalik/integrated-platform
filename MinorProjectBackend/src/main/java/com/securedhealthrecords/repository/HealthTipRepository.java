package com.securedhealthrecords.repository;

import com.securedhealthrecords.model.HealthTip;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthTipRepository extends MongoRepository<HealthTip, String> {
    List<HealthTip> findByIsActive(Boolean isActive);
    List<HealthTip> findByCategory(String category);
    List<HealthTip> findByIsActiveAndCategory(Boolean isActive, String category);
}
