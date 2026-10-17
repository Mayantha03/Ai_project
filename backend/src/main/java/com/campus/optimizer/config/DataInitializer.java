package com.campus.optimizer.config;

import com.campus.optimizer.entity.*;
import com.campus.optimizer.enums.*;
import com.campus.optimizer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClassroomRepository classroomRepository;
    private final CourseRepository courseRepository;
    private final TimetableSlotRepository timetableSlotRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public void run(String... args) {
        if (classroomRepository.count() > 0) {
            log.info("Database already contains campus data. Skipping initial seeding.");
            return;
        }

        log.info("Seeding initial KDU Faculty of Computing data into database...");

        // 1. Users
        User admin = userRepository.save(User.builder()
                .username("admin")
                .email("admin@kdu.ac.lk")
                .password("$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe")
                .role(Role.ADMIN)
                .fullName("Campus Resource Administrator")
                .build());

        userRepository.save(User.builder()
                .username("mrs_samaraweera")
                .email("samaraweera.wj@kdu.ac.lk")
                .password("$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe")
                .role(Role.LECTURER)
                .fullName("Mrs. WJ Samaraweera (CE Dept)")
                .build());

        userRepository.save(User.builder()
                .username("dr_kalansooriya")
                .email("kalansooriya.lp@kdu.ac.lk")
                .password("$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe")
                .role(Role.LECTURER)
                .fullName("Dr. LP Kalansooriya (Dean - Faculty of Computing)")
                .build());

        userRepository.save(User.builder()
                .username("dr_vidanagama")
                .email("vidanagama.du@kdu.ac.lk")
                .password("$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe")
                .role(Role.LECTURER)
                .fullName("Dr. DU Vidanagama (HOD - Computational Math)")
                .build());

        userRepository.save(User.builder()
                .username("mr_wanniarachchi")
                .email("wanniarachchi.waam@kdu.ac.lk")
                .password("$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe")
                .role(Role.LECTURER)
                .fullName("Mr. WAAM Wanniarachchi (HOD - Department of IT)")
                .build());

        userRepository.save(User.builder()
                .username("student_kasun")
                .email("d-coe-25-0023@kdu.ac.lk")
                .password("$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe")
                .role(Role.STUDENT)
                .fullName("Kasun Bandara (Intake 42 COE)")
                .build());

        User student2 = userRepository.save(User.builder()
                .username("student_harshani")
                .email("d-bit-24-0044@kdu.ac.lk")
                .password("$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe")
                .role(Role.STUDENT)
                .fullName("HAID Harshani (Intake 41 IT)")
                .build());

        // 2. Real KDU Classrooms & Labs
        classroomRepository.save(Classroom.builder()
                .roomCode("FOM 4-1").roomName("FOM Main Lecture Hall 4-1").capacity(93)
                .roomType(RoomType.LECTURE_HALL).hasAc(true).hasProjector(true).isLab(false).isActive(true).build());

        Classroom fom42 = classroomRepository.save(Classroom.builder()
                .roomCode("FOM 4-2").roomName("FOM Seminar Room 4-2").capacity(124)
                .roomType(RoomType.LECTURE_HALL).hasAc(true).hasProjector(true).isLab(false).isActive(true).build());

        classroomRepository.save(Classroom.builder()
                .roomCode("FOM Roof Top").roomName("FOM Roof Top Classroom").capacity(43)
                .roomType(RoomType.CLASSROOM).hasAc(true).hasProjector(true).isLab(false).isActive(true).build());

        Classroom fgs31 = classroomRepository.save(Classroom.builder()
                .roomCode("FGS 3-1").roomName("FGS 3rd Floor Lecture Hall 3-1").capacity(82)
                .roomType(RoomType.LECTURE_HALL).hasAc(true).hasProjector(true).isLab(false).isActive(true).build());

        classroomRepository.save(Classroom.builder()
                .roomCode("FGS 4-3").roomName("FGS 4th Floor Lecture Room 4-3").capacity(45)
                .roomType(RoomType.CLASSROOM).hasAc(true).hasProjector(true).isLab(false).isActive(true).build());

        classroomRepository.save(Classroom.builder()
                .roomCode("LT-A").roomName("Lecture Theatre A").capacity(72)
                .roomType(RoomType.LECTURE_HALL).hasAc(true).hasProjector(true).isLab(false).isActive(true).build());

        classroomRepository.save(Classroom.builder()
                .roomCode("LT-B").roomName("Lecture Theatre B").capacity(50)
                .roomType(RoomType.LECTURE_HALL).hasAc(true).hasProjector(true).isLab(false).isActive(true).build());

        classroomRepository.save(Classroom.builder()
                .roomCode("LT-C").roomName("Lecture Theatre C").capacity(70)
                .roomType(RoomType.LECTURE_HALL).hasAc(true).hasProjector(true).isLab(false).isActive(true).build());

        classroomRepository.save(Classroom.builder()
                .roomCode("Com. Eng. Lab").roomName("Computer Engineering Laboratory").capacity(24)
                .roomType(RoomType.HARDWARE_LAB).hasAc(true).hasProjector(true).isLab(true).isActive(true).build());

        classroomRepository.save(Classroom.builder()
                .roomCode("CCNA Lab").roomName("Cisco CCNA Networking Laboratory").capacity(40)
                .roomType(RoomType.COMPUTER_LAB).hasAc(true).hasProjector(true).isLab(true).isActive(true).build());

        classroomRepository.save(Classroom.builder()
                .roomCode("Suranimala LT-B").roomName("Suranimala Lecture Theatre B").capacity(50)
                .roomType(RoomType.LECTURE_HALL).hasAc(true).hasProjector(true).isLab(false).isActive(true).build());

        Classroom suranimalaC = classroomRepository.save(Classroom.builder()
                .roomCode("Suranimala LT-C").roomName("Suranimala Lecture Theatre C").capacity(95)
                .roomType(RoomType.LECTURE_HALL).hasAc(true).hasProjector(true).isLab(false).isActive(true).build());

        classroomRepository.save(Classroom.builder()
                .roomCode("Library Study Hall").roomName("Central Library Silent Study Area").capacity(40)
                .roomType(RoomType.STUDY_SPACE).hasAc(true).hasProjector(false).isLab(false).isActive(true).build());

        // 3. Real KDU Courses
        Course cs22023 = courseRepository.save(Course.builder()
                .courseCode("CS22023").courseName("Artificial Intelligence").enrolledCount(82)
                .requiredRoomType(RoomType.LECTURE_HALL).requiresLab(false).requiresAc(true).build());

        courseRepository.save(Course.builder()
                .courseCode("CS22012").courseName("Advanced Data Structures and Algorithms").enrolledCount(82)
                .requiredRoomType(RoomType.LECTURE_HALL).requiresLab(false).requiresAc(true).build());

        courseRepository.save(Course.builder()
                .courseCode("CS22993").courseName("Group Project in Software Development").enrolledCount(82)
                .requiredRoomType(RoomType.LECTURE_HALL).requiresLab(false).requiresAc(true).build());

        courseRepository.save(Course.builder()
                .courseCode("SE22013").courseName("Software Project Management").enrolledCount(58)
                .requiredRoomType(RoomType.LECTURE_HALL).requiresLab(false).requiresAc(true).build());

        Course it3103 = courseRepository.save(Course.builder()
                .courseCode("IT3103").courseName("Service Oriented Web Programming (SOWP)").enrolledCount(89)
                .requiredRoomType(RoomType.LECTURE_HALL).requiresLab(false).requiresAc(true).build());

        Course it3113 = courseRepository.save(Course.builder()
                .courseCode("IT3113").courseName("Cyber Security (CS)").enrolledCount(89)
                .requiredRoomType(RoomType.LECTURE_HALL).requiresLab(false).requiresAc(true).build());

        Course it3153 = courseRepository.save(Course.builder()
                .courseCode("IT3153").courseName("Software Quality Assurance (SQA)").enrolledCount(124)
                .requiredRoomType(RoomType.LECTURE_HALL).requiresLab(false).requiresAc(true).build());

        // 4. Real Master Timetable Slots
        timetableSlotRepository.save(TimetableSlot.builder()
                .course(it3103).classroom(suranimalaC).dayOfWeek("MONDAY")
                .startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(11, 0)).isCancelled(false).build());

        timetableSlotRepository.save(TimetableSlot.builder()
                .course(it3153).classroom(fom42).dayOfWeek("MONDAY")
                .startTime(LocalTime.of(11, 30)).endTime(LocalTime.of(14, 30)).isCancelled(false).build());

        timetableSlotRepository.save(TimetableSlot.builder()
                .course(it3113).classroom(suranimalaC).dayOfWeek("TUESDAY")
                .startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(11, 0)).isCancelled(false).build());

        timetableSlotRepository.save(TimetableSlot.builder()
                .course(cs22023).classroom(fgs31).dayOfWeek("FRIDAY")
                .startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(10, 30)).isCancelled(false).build());

        // 5. Initial Notifications
        notificationRepository.save(Notification.builder()
                .user(admin).title("All IT & IS Master Timetables Active")
                .message("KDU Faculty of Computing Department of IT Intake 41 IT & IS master schedules active.")
                .notificationType(NotificationType.EMERGENCY).isRead(false).build());

        notificationRepository.save(Notification.builder()
                .user(student2).title("Intake 41 IT Lecture Alert")
                .message("Service Oriented Web Programming (IT3103) scheduled on Monday 09:00-11:00 @ Suranimala LT-C.")
                .notificationType(NotificationType.BOOKING).isRead(false).build());

        log.info("KDU Campus data successfully seeded into database ({} classrooms, {} timetable slots).",
                classroomRepository.count(), timetableSlotRepository.count());
    }
}
