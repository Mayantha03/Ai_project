package com.campus.optimizer.controller;

import com.campus.optimizer.service.AiBridgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiOptimizationController {

    private final AiBridgeService aiBridgeService;

    @PostMapping("/predict-attendance")
    public ResponseEntity<?> predictAttendance(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(aiBridgeService.predictAttendance(payload));
    }

    @PostMapping("/optimize-allocations")
    public ResponseEntity<?> optimizeAllocations(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(aiBridgeService.optimizeAllocations(payload));
    }

    @PostMapping("/recommend-study-spaces")
    public ResponseEntity<?> recommendStudySpaces(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(aiBridgeService.recommendStudySpaces(payload));
    }

    @PostMapping("/evaluate-swap")
    public ResponseEntity<?> evaluateSwap(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(aiBridgeService.evaluateSwap(payload));
    }

    @PostMapping("/detect-conflicts")
    public ResponseEntity<?> detectConflicts(@RequestBody Object payload) {
        return ResponseEntity.ok(aiBridgeService.detectConflicts(payload));
    }

    @PostMapping("/emergency-reallocate")
    public ResponseEntity<?> emergencyReallocate(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(aiBridgeService.emergencyReallocate(payload));
    }
}
