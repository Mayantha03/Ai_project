-- =====================================================================
-- AI-Powered Smart Campus Resource Optimization System
-- REAL KDU FACULTY OF COMPUTING SEED DATA (Intake 42 - Semester IV)
-- Official Timetable Data (Validity Period: 03.08.2026 - 07.08.2026)
-- =====================================================================

USE smart_campus_db;

-- Clear existing sample data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notifications;
TRUNCATE TABLE ai_recommendations;
TRUNCATE TABLE ai_predictions;
TRUNCATE TABLE bookings;
TRUNCATE TABLE study_spaces;
TRUNCATE TABLE historical_attendance;
TRUNCATE TABLE timetable_slots;
TRUNCATE TABLE courses;
TRUNCATE TABLE students;
TRUNCATE TABLE lecturers;
TRUNCATE TABLE classrooms;
TRUNCATE TABLE buildings;
TRUNCATE TABLE faculties;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Faculties
INSERT INTO faculties (id, name, code, description) VALUES
(1, 'Faculty of Computing', 'FOC', 'Department of Computer Science, Software Engineering & IT'),
(2, 'Faculty of Engineering', 'FOE', 'Civil, Mechanical & Electrical Engineering'),
(3, 'Faculty of Management', 'FMS', 'Management, Social Sciences & Humanities'),
(4, 'General Services', 'GEN', 'Central Library & Campus Commons');

-- 2. Insert Buildings
INSERT INTO buildings (id, faculty_id, name, code, latitude, longitude) VALUES
(1, 1, 'Faculty of Management Building (FOM)', 'FOM', 6.819300, 79.887200),
(2, 1, 'Faculty of Graduate Studies Building (FGS)', 'FGS', 6.817500, 79.886000),
(3, 1, 'Computing Lecture Theatres (LT)', 'LT-BLD', 6.819200, 79.887100),
(4, 1, 'Computing Laboratories Complex', 'LAB-COMPLEX', 6.819500, 79.887400),
(5, 2, 'Engineering Main Building', 'FOE-BLD', 6.818900, 79.886800),
(6, 4, 'Central Library Complex', 'LIB-COMPLEX', 6.819100, 79.887900);

-- 3. Real KDU Classrooms & Labs from Official Timetable
INSERT INTO classrooms (id, building_id, room_code, room_name, capacity, room_type, has_ac, has_projector, is_lab, is_active) VALUES
(1, 1, 'FOM 4-1', 'FOM Main Lecture Hall 4-1', 93, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(2, 1, 'FOM 4-2', 'FOM Seminar Room 4-2', 50, 'CLASSROOM', TRUE, TRUE, FALSE, TRUE),
(3, 2, 'FGS 3-1', 'FGS Intake 42 Main Lecture Hall', 82, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(4, 2, 'FGS 4-3', 'FGS Secondary Hall 4-3', 45, 'CLASSROOM', TRUE, TRUE, FALSE, TRUE),
(5, 3, 'LT-A', 'Lecture Theatre A', 72, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(6, 3, 'LT-B', 'Lecture Theatre B', 50, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(7, 3, 'LT-C', 'Lecture Theatre C', 70, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(8, 4, 'Com. Eng. Lab', 'Computer Engineering Laboratory', 24, 'HARDWARE_LAB', TRUE, TRUE, TRUE, TRUE),
(9, 4, 'CCNA Lab', 'Cisco CCNA Networking Laboratory', 29, 'COMPUTER_LAB', TRUE, TRUE, TRUE, TRUE),
(10, 4, 'FOM 5th Electronic Lab', 'FOM 5th Floor Electronics Laboratory', 30, 'HARDWARE_LAB', TRUE, TRUE, TRUE, TRUE),
(11, 5, 'FOE 2-4', 'Engineering Drawing Room 2-4', 30, 'CLASSROOM', FALSE, TRUE, FALSE, TRUE),
(12, 6, 'Library Study Hall', 'Central Library Silent Study Area', 40, 'STUDY_SPACE', TRUE, FALSE, FALSE, TRUE);

-- 4. Default Users
INSERT INTO users (id, username, email, password_hash, role, full_name) VALUES
(1, 'admin', 'admin@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'ADMIN', 'Campus Resource Administrator'),
(2, 'mrs_samaraweera', 'samaraweera.wj@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'LECTURER', 'Mrs. WJ Samaraweera (CE Dept)'),
(3, 'dr_kumara', 'kumara.wgcw@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'LECTURER', 'Dr. WGCW Kumara (Visiting Lecturer)'),
(4, 'mrs_sirisuriya', 'sirisuriya.scm@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'LECTURER', 'Mrs. SCM De S Sirisuriya'),
(5, 'student_kasun', 'd-coe-25-0023@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'STUDENT', 'Kasun Bandara (Intake 42 COE)');

-- 5. Real Lecturers
INSERT INTO lecturers (id, user_id, faculty_id, employee_id, department, preferred_building_id) VALUES
(1, 2, 1, 'LEC-FOC-001', 'Computer Engineering', 2),
(2, 3, 1, 'LEC-FOC-002', 'Software Engineering', 3),
(3, 4, 1, 'LEC-FOC-003', 'Computer Science', 2);

-- 6. Real Students
INSERT INTO students (id, user_id, faculty_id, registration_number, degree_program, intake, current_semester) VALUES
(1, 5, 1, 'D-COE-25-0023', 'BSc (Hons) in Computer Engineering', 'Intake 42', 4);

-- 7. Real KDU Intake 42 Courses (Semester IV)
INSERT INTO courses (id, faculty_id, lecturer_id, course_code, course_name, enrolled_count, required_room_type, requires_lab, requires_ac, credits) VALUES
(1, 1, 1, 'CS22023', 'Artificial Intelligence', 82, 'LECTURE_HALL', FALSE, TRUE, 3),
(2, 1, 3, 'CS22012', 'Advanced Data Structures and Algorithms', 82, 'LECTURE_HALL', FALSE, TRUE, 2),
(3, 1, 3, 'CS22993', 'Group Project in Software Development', 82, 'LECTURE_HALL', FALSE, TRUE, 2),
(4, 1, 2, 'SE22013', 'Software Project Management', 58, 'LECTURE_HALL', FALSE, TRUE, 3),
(5, 1, 2, 'SE22022', 'Software Architecture', 58, 'LECTURE_HALL', FALSE, TRUE, 2),
(6, 1, 1, 'COE22032', 'Computer Interfacing and Microprocessors', 82, 'LECTURE_HALL', FALSE, TRUE, 2),
(7, 1, NULL, 'CM22112', 'Numerical Methods', 82, 'LECTURE_HALL', FALSE, TRUE, 2),
(8, 1, NULL, 'DL4162', 'Research Writing Skills', 82, 'COMPUTER_LAB', TRUE, TRUE, 2),
(9, 1, 1, 'COE22012', 'Engineering Drawing', 24, 'CLASSROOM', FALSE, FALSE, 2),
(10, 1, 1, 'COE22023', 'Advanced Computer Architecture', 24, 'HARDWARE_LAB', TRUE, TRUE, 3);

-- 8. Study Spaces
INSERT INTO study_spaces (id, classroom_id, quiet_level, has_charging_ports, has_wifi, is_available_now) VALUES
(1, 12, 'SILENT', TRUE, TRUE, TRUE),
(2, 2, 'MODERATE', TRUE, TRUE, TRUE);

-- 9. Real Official KDU Intake 42 Timetable Allocations (Semester IV - Week 06)
INSERT INTO timetable_slots (id, course_id, classroom_id, lecturer_id, day_of_week, start_time, end_time, is_cancelled) VALUES
(1, 4, 5, 2, 'MONDAY', '09:00:00', '10:30:00', FALSE),     -- SPM (Dr. WGCW Kumara) @ LT-A
(2, 5, 5, 2, 'MONDAY', '12:00:00', '13:30:00', FALSE),     -- SA (Dr. WGCW Kumara) @ LT-A
(3, 10, 8, 1, 'TUESDAY', '09:00:00', '10:30:00', FALSE),    -- ACA (Mr. DH Mudalige) @ Com. Eng. Lab
(4, 9, 11, 1, 'TUESDAY', '13:00:00', '14:30:00', FALSE),    -- ED (Ms. AA Darshani) @ FOE 2-4
(5, 3, 3, 3, 'WEDNESDAY', '09:00:00', '11:00:00', FALSE),  -- GPSD (Ms. KGK Abeywardhane) @ FGS 3-1
(6, 2, 3, 3, 'WEDNESDAY', '12:30:00', '14:30:00', FALSE),  -- ADSA (Mrs. SCM De S Sirisuriya) @ FGS 3-1
(7, 8, 9, 3, 'THURSDAY', '09:00:00', '10:30:00', FALSE),   -- RWS (Ms. L Willarachchi) @ CCNA Lab
(8, 7, 3, 3, 'THURSDAY', '12:00:00', '13:30:00', FALSE),   -- NM (Mrs. RGUI Meththananda) @ FGS 3-1
(9, 6, 3, 1, 'THURSDAY', '14:00:00', '15:30:00', FALSE),   -- CIM (Mrs. MAST Goonathillake) @ FGS 3-1
(10, 1, 3, 1, 'FRIDAY', '09:00:00', '10:30:00', FALSE);     -- AI (Mrs. WJ Samaraweera) @ FGS 3-1

-- 10. Real Initial Notifications
INSERT INTO notifications (id, user_id, title, message, notification_type) VALUES
(1, 1, 'Official Timetable Loaded', 'KDU Intake 42 Semester IV master timetable is active.', 'EMERGENCY'),
(2, 5, 'AI Lecture Notice', 'Artificial Intelligence (CS22023) is scheduled for Friday 09:00-10:30 @ FGS 3-1.', 'BOOKING');
