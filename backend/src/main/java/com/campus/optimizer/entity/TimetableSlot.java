package com.campus.optimizer.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "timetable_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimetableSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    @Column(name = "day_of_week", nullable = false, length = 20)
    private String dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "is_cancelled")
    private Boolean isCancelled = false;

    @Column(name = "cancellation_reason")
    private String cancellationReason;
}
