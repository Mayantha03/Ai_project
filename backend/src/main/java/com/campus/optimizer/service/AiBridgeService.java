package com.campus.optimizer.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiBridgeService {

    private final WebClient aiWebClient;

    public Map<String, Object> predictAttendance(Map<String, Object> requestPayload) {
        log.info("Forwarding Attendance Prediction request to Python AI Microservice...");
        return aiWebClient.post()
                .uri("/api/v1/ai/predict-attendance")
                .bodyValue(requestPayload)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    public Map<String, Object> optimizeAllocations(Map<String, Object> requestPayload) {
        log.info("Triggering Genetic Algorithm Optimization on Python AI Microservice...");
        return aiWebClient.post()
                .uri("/api/v1/ai/optimize-allocations")
                .bodyValue(requestPayload)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    public Map<String, Object> recommendStudySpaces(Map<String, Object> requestPayload) {
        log.info("Requesting AI Study Space Recommendations...");
        return aiWebClient.post()
                .uri("/api/v1/ai/recommend-study-spaces")
                .bodyValue(requestPayload)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    public Map<String, Object> evaluateSwap(Map<String, Object> requestPayload) {
        log.info("Evaluating Smart Classroom Swap on AI Microservice...");
        return aiWebClient.post()
                .uri("/api/v1/ai/evaluate-swap")
                .bodyValue(requestPayload)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}
