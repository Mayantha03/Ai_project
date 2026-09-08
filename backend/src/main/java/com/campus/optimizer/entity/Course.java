package com.campus.optimizer.entity;

import com.campus.optimizer.enums.RoomType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_code", nullable = false, unique = true, length = 30)
    private String courseCode;

    @Column(name = "course_name", nullable = false, length = 150)
    private String courseName;

    @Column(name = "enrolled_count", nullable = false)
    private Integer enrolledCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "required_room_type", nullable = false)
    private RoomType requiredRoomType;

    @Column(name = "requires_lab")
    private Boolean requiresLab = false;

    @Column(name = "requires_ac")
    private Boolean requiresAc = true;
}
