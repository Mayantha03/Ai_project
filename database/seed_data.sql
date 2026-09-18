-- =====================================================================
-- AI-Powered Smart Campus Resource Optimization System
-- REAL KDU FACULTY OF COMPUTING SEED DATA (All Departments & Degree Programmes)
-- Official Timetables:
--   1. Computer Science / Software Eng / Computer Eng (Intakes 41, 42 & 43)
--   2. Data Science & Business Analytics (Intakes 41 & 42)
--   3. Information Technology & Information Systems (Intake 41 IT/IS)
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
(1, 'Faculty of Computing', 'FOC', 'Computer Science, Software Eng, Computer Eng, IT, IS & Computational Mathematics'),
(2, 'Faculty of Engineering', 'FOE', 'Civil, Mechanical & Electrical Engineering'),
(3, 'Faculty of Management', 'FMS', 'Management, Social Sciences & Humanities'),
(4, 'General Services', 'GEN', 'Central Library & Campus Commons');

-- 2. Insert Buildings
INSERT INTO buildings (id, faculty_id, name, code, latitude, longitude) VALUES
(1, 1, 'Faculty of Management Building (FOM)', 'FOM', 6.819300, 79.887200),
(2, 1, 'Faculty of Graduate Studies Building (FGS)', 'FGS', 6.817500, 79.886000),
(3, 1, 'Computing Lecture Theatres (LT)', 'LT-BLD', 6.819200, 79.887100),
(4, 1, 'Computing Laboratories Complex', 'LAB-COMPLEX', 6.819500, 79.887400),
(5, 1, 'Suranimala Lecture Theatre Complex', 'SURANIMALA', 6.819050, 79.887300),
(6, 2, 'Engineering Main Building', 'FOE-BLD', 6.818900, 79.886800),
(7, 4, 'Central Library Complex', 'LIB-COMPLEX', 6.819100, 79.887900);

-- 3. Real KDU Classrooms & Labs from Official Timetables
INSERT INTO classrooms (id, building_id, room_code, room_name, capacity, room_type, has_ac, has_projector, is_lab, is_active) VALUES
(1, 1, 'FOM 4-1', 'FOM Main Lecture Hall 4-1', 93, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(2, 1, 'FOM 4-2', 'FOM Seminar Room 4-2', 124, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(3, 1, 'FOM Roof Top', 'FOM Roof Top Classroom', 43, 'CLASSROOM', TRUE, TRUE, FALSE, TRUE),
(4, 2, 'FGS 3-1', 'FGS 3rd Floor Lecture Hall 3-1', 82, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(5, 2, 'FGS 4-3', 'FGS 4th Floor Lecture Room 4-3', 45, 'CLASSROOM', TRUE, TRUE, FALSE, TRUE),
(6, 3, 'LT-A', 'Lecture Theatre A', 72, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(7, 3, 'LT-B', 'Lecture Theatre B', 50, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(8, 3, 'LT-C', 'Lecture Theatre C', 70, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(9, 4, 'Com. Eng. Lab', 'Computer Engineering Laboratory', 24, 'HARDWARE_LAB', TRUE, TRUE, TRUE, TRUE),
(10, 4, 'CCNA Lab', 'Cisco CCNA Networking Laboratory', 40, 'COMPUTER_LAB', TRUE, TRUE, TRUE, TRUE),
(11, 4, 'FOM 5th Electronic Lab', 'FOM 5th Floor Electronics Laboratory', 30, 'HARDWARE_LAB', TRUE, TRUE, TRUE, TRUE),
(12, 5, 'Suranimala LT-B', 'Suranimala Lecture Theatre B', 50, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(13, 5, 'Suranimala LT-C', 'Suranimala Lecture Theatre C', 95, 'LECTURE_HALL', TRUE, TRUE, FALSE, TRUE),
(14, 6, 'FOE 2-4', 'Engineering Drawing Room 2-4', 30, 'CLASSROOM', FALSE, TRUE, FALSE, TRUE),
(15, 7, 'Library Study Hall', 'Central Library Silent Study Area', 40, 'STUDY_SPACE', TRUE, FALSE, FALSE, TRUE);

-- 4. Default Users
INSERT INTO users (id, username, email, password_hash, role, full_name) VALUES
(1, 'admin', 'admin@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'ADMIN', 'Campus Resource Administrator'),
(2, 'mrs_samaraweera', 'samaraweera.wj@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'LECTURER', 'Mrs. WJ Samaraweera (CE Dept)'),
(3, 'dr_kalansooriya', 'kalansooriya.lp@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'LECTURER', 'Dr. LP Kalansooriya (Dean - Faculty of Computing)'),
(4, 'dr_vidanagama', 'vidanagama.du@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'LECTURER', 'Dr. DU Vidanagama (HOD - Computational Math)'),
(5, 'mr_wanniarachchi', 'wanniarachchi.waam@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'LECTURER', 'Mr. WAAM Wanniarachchi (HOD - Department of IT)'),
(6, 'student_kasun', 'd-coe-25-0023@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'STUDENT', 'Kasun Bandara (Intake 42 COE)'),
(7, 'student_harshani', 'd-bit-24-0044@kdu.ac.lk', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8v9pQ6M7v9VwQ.u9tF.v/0hL9t4vGe', 'STUDENT', 'HAID Harshani (Intake 41 IT)');

-- 5. Real Lecturers
INSERT INTO lecturers (id, user_id, faculty_id, employee_id, department, preferred_building_id) VALUES
(1, 2, 1, 'LEC-FOC-001', 'Computer Engineering', 2),
(2, 3, 1, 'LEC-FOC-002', 'Software Engineering & Dean FOC', 1),
(3, 4, 1, 'LEC-FOC-003', 'Computational Mathematics', 3),
(4, 5, 1, 'LEC-FOC-004', 'Department of Information Technology', 5);

-- 6. Real Students
INSERT INTO students (id, user_id, faculty_id, registration_number, degree_program, intake, current_semester) VALUES
(1, 6, 1, 'D-COE-25-0023', 'BSc (Hons) in Computer Engineering', 'Intake 42', 4),
(2, 7, 1, 'D-BIT-24-0044', 'BSc (Hons) in Information Technology', 'Intake 41', 6);

-- 7. Real KDU Courses (CS, SE, CE, Data Science, IT & IS)
INSERT INTO courses (id, faculty_id, lecturer_id, course_code, course_name, enrolled_count, required_room_type, requires_lab, requires_ac, credits) VALUES
-- Intake 42 CS / SE / CE Courses
(1, 1, 1, 'CS22023', 'Artificial Intelligence', 82, 'LECTURE_HALL', FALSE, TRUE, 3),
(2, 1, 3, 'CS22012', 'Advanced Data Structures and Algorithms', 82, 'LECTURE_HALL', FALSE, TRUE, 2),
(3, 1, 3, 'CS22993', 'Group Project in Software Development', 82, 'LECTURE_HALL', FALSE, TRUE, 2),
(4, 1, 2, 'SE22013', 'Software Project Management', 58, 'LECTURE_HALL', FALSE, TRUE, 3),

-- Intake 41 Information Technology (IT) Courses
(5, 1, 4, 'IT3103', 'Service Oriented Web Programming (SOWP)', 89, 'LECTURE_HALL', FALSE, TRUE, 3),
(6, 1, 4, 'IT3113', 'Cyber Security (CS)', 89, 'LECTURE_HALL', FALSE, TRUE, 3),
(7, 1, 4, 'IT3123', 'Cloud Computing and Virtualization (CC&V)', 89, 'LECTURE_HALL', FALSE, TRUE, 3),
(8, 1, 4, 'IT3133', 'Programming Distributed Components (PDC)', 89, 'LECTURE_HALL', FALSE, TRUE, 3),
(9, 1, 4, 'IT3143', 'Independent Study (IS)', 124, 'LECTURE_HALL', FALSE, TRUE, 3),
(10, 1, 4, 'IT3153', 'Software Quality Assurance (SQA)', 124, 'LECTURE_HALL', FALSE, TRUE, 3),
(11, 1, 4, 'IT3162', 'GIS and Remote Sensing (GIS&RS)', 124, 'LECTURE_HALL', FALSE, TRUE, 2),
(12, 1, 1, 'IT3182', 'Essentials of Artificial Intelligence (EAI)', 124, 'LECTURE_HALL', FALSE, TRUE, 2),

-- Intake 41 Information Systems (IS) Courses
(13, 1, 4, 'IS3073', 'Management Information Systems (MIS)', 35, 'LECTURE_HALL', FALSE, TRUE, 3),
(14, 1, 4, 'IS3112', 'Marketing Management (MM)', 35, 'LECTURE_HALL', FALSE, TRUE, 2),
(15, 1, 4, 'IS3083', 'E-Commerce (EC)', 35, 'LECTURE_HALL', FALSE, TRUE, 3),
(16, 1, 4, 'IS3093', 'Financial Management Concepts (FMC)', 35, 'LECTURE_HALL', FALSE, TRUE, 3),
(17, 1, 4, 'IS3102', 'Organizational Behaviour (OB)', 35, 'LECTURE_HALL', FALSE, TRUE, 2),

-- Data Science & CS Courses
(18, 1, 3, 'CS3253', 'Big Data Analytics (BA)', 40, 'LECTURE_HALL', FALSE, TRUE, 3),
(19, 1, NULL, 'DS22012', 'Categorical Data Analysis (CDA)', 83, 'LECTURE_HALL', FALSE, TRUE, 2);

-- 8. Study Spaces
INSERT INTO study_spaces (id, classroom_id, quiet_level, has_charging_ports, has_wifi, is_available_now) VALUES
(1, 15, 'SILENT', TRUE, TRUE, TRUE),
(2, 2, 'MODERATE', TRUE, TRUE, TRUE);

-- 9. Real Official KDU Master Timetable Allocations (IT / IS / CS / SE / CE)
INSERT INTO timetable_slots (id, course_id, classroom_id, lecturer_id, day_of_week, start_time, end_time, is_cancelled) VALUES
-- Intake 41 IT & IS Slots
(1, 5, 13, 4, 'MONDAY', '09:00:00', '11:00:00', FALSE),     -- SOWP @ Suranimala LT-C
(2, 17, 5, 4, 'MONDAY', '09:00:00', '11:00:00', FALSE),     -- OB @ FGS 4-3
(3, 10, 2, 4, 'MONDAY', '11:30:00', '14:30:00', FALSE),     -- SQA @ FOM 4-2
(4, 6, 13, 4, 'TUESDAY', '09:00:00', '11:00:00', FALSE),    -- Cyber Security @ Suranimala LT-C
(5, 14, 2, 4, 'TUESDAY', '09:00:00', '11:00:00', FALSE),    -- MM @ FOM 4-2
(6, 7, 13, 4, 'TUESDAY', '11:30:00', '14:30:00', FALSE),    -- CC&V @ Suranimala LT-C
(7, 13, 12, 4, 'TUESDAY', '11:30:00', '14:30:00', FALSE),   -- MIS @ Suranimala LT-B
(8, 9, 2, 4, 'WEDNESDAY', '09:00:00', '11:00:00', FALSE),   -- Independent Study @ FOM 4-2
(9, 12, 2, 1, 'WEDNESDAY', '11:30:00', '14:30:00', FALSE),  -- EAI @ FOM 4-2
(10, 8, 13, 4, 'THURSDAY', '09:00:00', '11:00:00', FALSE),  -- PDC @ Suranimala LT-C
(11, 11, 2, 4, 'THURSDAY', '11:30:00', '14:30:00', FALSE),  -- GIS&RS @ FOM 4-2
(12, 16, 5, 4, 'FRIDAY', '09:00:00', '11:00:00', FALSE),    -- FMC @ FGS 4-3
(13, 15, 5, 4, 'FRIDAY', '11:30:00', '14:30:00', FALSE),    -- E-Commerce @ FGS 4-3
(14, 1, 4, 1, 'FRIDAY', '09:00:00', '10:30:00', FALSE);     -- AI @ FGS 3-1

-- 10. Initial Notifications
INSERT INTO notifications (id, user_id, title, message, notification_type) VALUES
(1, 1, 'All IT & IS Master Timetables Active', 'KDU Faculty of Computing Department of IT Intake 41 IT & IS master schedules active.', 'EMERGENCY'),
(2, 7, 'Intake 41 IT Lecture Alert', 'Service Oriented Web Programming (IT3103) scheduled on Monday 09:00-11:00 @ Suranimala LT-C.', 'BOOKING');
