package com.securedhealthrecords.service;

import com.securedhealthrecords.model.Doctor;
import com.securedhealthrecords.model.Hospital;
import com.securedhealthrecords.repository.DoctorRepository;
import com.securedhealthrecords.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .build();

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    public String chat(String userMessage) {
        log.info("Chat request received: {}", userMessage);
        try {
            // First, try to answer using local hospital/doctor data
            String localResponse = getLocalResponse(userMessage);
            if (localResponse != null && !localResponse.isEmpty()) {
                return localResponse;
            }
            
            // Check if API key is configured for general health questions
            if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
                log.warn("Gemini API key is not configured");
                return "I'm a health assistant chatbot. I can help you find hospitals and doctors in your area. I can also answer general health questions, but I need to be configured with an AI service to provide detailed responses. Please contact your administrator to set up the AI service.";
            }
            
            // Minimal proxy to Gemini; keep simple to avoid leaking API key client-side
            String model = "gemini-1.5-flash-latest";
            String path = "/v1beta/models/" + model + ":generateContent?key=" + geminiApiKey;

            String requestJson = "{\n" +
                    "  \"contents\": [{\n" +
                    "    \"parts\": [{ \"text\": " + jsonEscape(userMessage) + "}]\n" +
                    "  }]\n" +
                    "}";

            String response = webClient.post()
                    .uri(path)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestJson)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            // Parse the response to extract the actual text content
            if (response != null && response.contains("\"text\"")) {
                // Simple extraction of text content from Gemini response
                int startIndex = response.indexOf("\"text\":\"") + 8;
                int endIndex = response.indexOf("\"", startIndex);
                if (startIndex > 7 && endIndex > startIndex) {
                    return response.substring(startIndex, endIndex).replace("\\n", "\n").replace("\\\"", "\"");
                }
            }
            return "I'm sorry, I couldn't process your request at the moment. Please try again.";
        } catch (Exception e) {
            log.error("Error in chat service: ", e);
            return "I'm experiencing technical difficulties. Please try again later.";
        }
    }

    public String analyzeReportText(String extractedText) {
        try {
            String prompt = "You are a medical report assistant. Analyze the following report text, " +
                    "summarize key findings, abnormal values (with normal ranges if applicable), and suggest next steps. " +
                    "Use clear bullet points.\n\nReport:\n" + extractedText;
            return chat(prompt);
        } catch (Exception e) {
            return "I'm sorry, I couldn't analyze the report at the moment. Please try again later.";
        }
    }

    private String getLocalResponse(String userMessage) {
        String message = userMessage.toLowerCase();
        
        // Check for hospital-related queries
        if (message.contains("hospital") || message.contains("hospitals")) {
            return getHospitalResponse(message);
        }
        
        // Check for doctor-related queries
        if (message.contains("doctor") || message.contains("doctors") || message.contains("specialist")) {
            return getDoctorResponse(message);
        }
        
        // Check for general medical facility queries
        if (message.contains("medical") || message.contains("clinic") || message.contains("healthcare")) {
            return getGeneralMedicalResponse(message);
        }
        
        return null; // Let Gemini handle other queries
    }
    
    private String getHospitalResponse(String message) {
        List<Hospital> hospitals = hospitalRepository.findAll();
        if (hospitals.isEmpty()) {
            return "I don't have hospital information available at the moment. Please try again later.";
        }
        
        StringBuilder response = new StringBuilder();
        response.append("Here are some hospitals I can help you find:\n\n");
        
        // Check for specific city queries
        String city = extractCity(message);
        List<Hospital> filteredHospitals = hospitals;
        
        if (city != null) {
            filteredHospitals = hospitals.stream()
                    .filter(h -> h.getCity().toLowerCase().contains(city.toLowerCase()))
                    .toList();
        }
        
        // Check for specialty queries
        String specialty = extractSpecialty(message);
        if (specialty != null) {
            filteredHospitals = filteredHospitals.stream()
                    .filter(h -> h.getSpecialties().toLowerCase().contains(specialty.toLowerCase()))
                    .toList();
        }
        
        // Limit to top 10 results
        int limit = Math.min(10, filteredHospitals.size());
        for (int i = 0; i < limit; i++) {
            Hospital hospital = filteredHospitals.get(i);
            response.append(String.format("%d. **%s**\n", i + 1, hospital.getName()));
            response.append(String.format("   Address: %s\n", hospital.getAddress()));
            response.append(String.format("   City: %s\n", hospital.getCity()));
            response.append(String.format("   Type: %s\n", hospital.getType()));
            response.append(String.format("   Specialties: %s\n", hospital.getSpecialties()));
            if (hospital.getPhone() != null && !hospital.getPhone().isEmpty()) {
                response.append(String.format("   Phone: %s\n", hospital.getPhone()));
            }
            response.append("\n");
        }
        
        if (filteredHospitals.size() > 10) {
            response.append(String.format("... and %d more hospitals available.\n", filteredHospitals.size() - 10));
        }
        
        return response.toString();
    }
    
    private String getDoctorResponse(String message) {
        List<Doctor> doctors = doctorRepository.findAll();
        if (doctors.isEmpty()) {
            return "I don't have doctor information available at the moment. Please try again later.";
        }
        
        StringBuilder response = new StringBuilder();
        response.append("Here are some doctors I can help you find:\n\n");
        
        // Check for specific city queries
        String city = extractCity(message);
        List<Doctor> filteredDoctors = doctors;
        
        if (city != null) {
            filteredDoctors = doctors.stream()
                    .filter(d -> d.getCity().toLowerCase().contains(city.toLowerCase()))
                    .toList();
        }
        
        // Check for specialty queries
        String specialty = extractSpecialty(message);
        if (specialty != null) {
            filteredDoctors = filteredDoctors.stream()
                    .filter(d -> d.getSpecialization().toLowerCase().contains(specialty.toLowerCase()))
                    .toList();
        }
        
        // Limit to top 10 results
        int limit = Math.min(10, filteredDoctors.size());
        for (int i = 0; i < limit; i++) {
            Doctor doctor = filteredDoctors.get(i);
            response.append(String.format("%d. **%s**\n", i + 1, doctor.getName()));
            response.append(String.format("   Specialization: %s\n", doctor.getSpecialization()));
            response.append(String.format("   Hospital: %s\n", doctor.getHospital()));
            response.append(String.format("   City: %s\n", doctor.getCity()));
            response.append("\n");
        }
        
        if (filteredDoctors.size() > 10) {
            response.append(String.format("... and %d more doctors available.\n", filteredDoctors.size() - 10));
        }
        
        return response.toString();
    }
    
    private String getGeneralMedicalResponse(String message) {
        return "I can help you find hospitals and doctors in your area. Please specify:\n" +
               "- The city you're looking in\n" +
               "- The type of medical care you need (e.g., cardiology, orthopedics)\n" +
               "- Whether you need a hospital or a specific doctor\n\n" +
               "For example: 'Find cardiology hospitals in Bangalore' or 'Find orthopedic doctors in Mumbai'";
    }
    
    private String extractCity(String message) {
        String[] cities = {"bangalore", "mumbai", "delhi", "chennai", "kolkata", "hyderabad", "pune", "ahmedabad", "jaipur", "lucknow"};
        for (String city : cities) {
            if (message.contains(city)) {
                return city;
            }
        }
        return null;
    }
    
    private String extractSpecialty(String message) {
        String[] specialties = {"cardiology", "orthopedics", "neurology", "oncology", "pediatrics", "gynecology", "dermatology", "psychiatry", "urology", "ophthalmology"};
        for (String specialty : specialties) {
            if (message.contains(specialty)) {
                return specialty;
            }
        }
        return null;
    }

    private String jsonEscape(String text) {
        if (text == null) return "\"\"";
        String escaped = text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n");
        return "\"" + escaped + "\"";
    }
}


