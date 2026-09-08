package com.campus.optimizer.entity;

import com.campus.optimizer.enums.RoomType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "classrooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_code", nullable = false, unique = true, length = 30)
    private String roomCode;

    @Column(name = "room_name", nullable = false, length = 100)
    private String roomName;

    @Column(nullable = false)
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    @Column(name = "has_ac")
    private Boolean hasAc = true;

    @Column(name = "has_projector")
    private Boolean hasProjector = true;

    @Column(name = "is_lab")
    private Boolean isLab = false;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
