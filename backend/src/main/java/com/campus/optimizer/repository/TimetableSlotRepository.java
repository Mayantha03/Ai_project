package com.campus.optimizer.repository;

import com.campus.optimizer.entity.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, Long> {
    List<TimetableSlot> findByDayOfWeekAndIsCancelledFalse(String dayOfWeek);
    List<TimetableSlot> findByClassroomIdAndDayOfWeekAndIsCancelledFalse(Long classroomId, String dayOfWeek);
    List<TimetableSlot> findByIsCancelledFalse();
}
