package com.campus.optimizer.controller;

import com.campus.optimizer.entity.Notification;
import com.campus.optimizer.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getRecentNotifications() {
        return ResponseEntity.ok(notificationRepository.findTop10ByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        return ResponseEntity.ok(notificationRepository.save(notification));
    }
}
