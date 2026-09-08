package com.campus.optimizer.controller;

import com.campus.optimizer.entity.Classroom;
import com.campus.optimizer.repository.ClassroomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/classrooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClassroomController {

    private final ClassroomRepository classroomRepository;

    @GetMapping
    public ResponseEntity<List<Classroom>> getAllClassrooms() {
        return ResponseEntity.ok(classroomRepository.findByIsActiveTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClassroomById(@PathVariable Long id) {
        return classroomRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Classroom> createClassroom(@RequestBody Classroom classroom) {
        return ResponseEntity.ok(classroomRepository.save(classroom));
    }
}
