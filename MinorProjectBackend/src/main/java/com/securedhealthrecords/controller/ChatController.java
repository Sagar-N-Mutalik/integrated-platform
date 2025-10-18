package com.securedhealthrecords.controller;

import com.securedhealthrecords.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ChatController {

    private final GeminiService geminiService;

    @PostMapping(value = "/message", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Map<String, String> body) {
        String message = body.getOrDefault("message", "");
        String result = geminiService.chat(message);
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> analyzeReport(@RequestPart("file") MultipartFile file) throws IOException {
        String text = extractText(file);
        String result = geminiService.analyzeReportText(text);
        return ResponseEntity.ok(Map.of("result", result));
    }

    private String extractText(MultipartFile file) throws IOException {
        String contentType = file.getContentType();
        if (contentType != null && contentType.equalsIgnoreCase("application/pdf")) {
            try (InputStream in = file.getInputStream(); PDDocument doc = PDDocument.load(in)) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(doc);
            }
        }
        // Fallback: try to read text content for text-like files
        byte[] bytes = file.getBytes();
        return new String(bytes, StandardCharsets.UTF_8);
    }
}


