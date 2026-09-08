package com.campus.optimizer.repository;

import com.campus.optimizer.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByBookingDateAndClassroomId(LocalDate bookingDate, Long classroomId);
    List<Booking> findByUserId(Long userId);
    List<Booking> findByStatus(String status);
}
