package com.securedhealthrecords.repository;

import com.securedhealthrecords.model.ReportAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReportAnalysisRepository extends MongoRepository<ReportAnalysis, String> {
    List<ReportAnalysis> findByUserIdOrderByCreatedAtDesc(String userId);
}


