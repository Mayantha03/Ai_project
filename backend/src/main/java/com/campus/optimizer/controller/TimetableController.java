package com.campus.optimizer.controller;

import com.campus.optimizer.entity.TimetableSlot;
import com.campus.optimizer.repository.TimetableSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/timetables")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TimetableController {

    private final TimetableSlotRepository timetableSlotRepository;

    @GetMapping
    public ResponseEntity<List<TimetableSlot>> getAllSlots() {
        return ResponseEntity.ok(timetableSlotRepository.findByIsCancelledFalse());
    }

    @GetMapping("/day/{day}")
    public ResponseEntity<List<TimetableSlot>> getSlotsByDay(@PathVariable String day) {
        return ResponseEntity.ok(timetableSlotRepository.findByDayOfWeekAndIsCancelledFalse(day.toUpperCase()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelSlot(@PathVariable Long id, @RequestParam(defaultValue = "Lecturer Absent") String reason) {
        return timetableSlotRepository.findById(id).map(slot -> {
            slot.setIsCancelled(true);
            slot.setCancellationReason(reason);
            return ResponseEntity.ok(timetableSlotRepository.save(slot));
        }).orElse(ResponseEntity.notFound().build());
    }
}
