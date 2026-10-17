-- =====================================================================
-- AI-Powered Smart Campus Resource Optimization System
-- Database Schema DDL (MySQL 8.0)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS smart_campus_db;
USE smart_campus_db;

-- 1. Users & Authentication Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'LECTURER', 'STUDENT') NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Faculties Table
CREATE TABLE IF NOT EXISTS faculties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Buildings Table
CREATE TABLE IF NOT EXISTS buildings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    faculty_id BIGINT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Classrooms Table
CREATE TABLE IF NOT EXISTS classrooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    building_id BIGINT NOT NULL,
    room_code VARCHAR(30) NOT NULL UNIQUE,
    room_name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    room_type ENUM('LECTURE_HALL', 'CLASSROOM', 'COMPUTER_LAB', 'HARDWARE_LAB', 'AUDITORIUM', 'STUDY_SPACE') NOT NULL,
    has_ac BOOLEAN DEFAULT TRUE,
    has_projector BOOLEAN DEFAULT TRUE,
    has_smartboard BOOLEAN DEFAULT FALSE,
    is_lab BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Lecturers Table
CREATE TABLE IF NOT EXISTS lecturers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    faculty_id BIGINT NOT NULL,
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    department VARCHAR(100),
    preferred_building_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
    FOREIGN KEY (preferred_building_id) REFERENCES buildings(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Students Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    faculty_id BIGINT NOT NULL,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    degree_program VARCHAR(100) NOT NULL,
    intake VARCHAR(20) NOT NULL,
    current_semester INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    faculty_id BIGINT NOT NULL,
    lecturer_id BIGINT,
    course_code VARCHAR(30) NOT NULL UNIQUE,
    course_name VARCHAR(150) NOT NULL,
    enrolled_count INT NOT NULL DEFAULT 0,
    required_room_type ENUM('LECTURE_HALL', 'CLASSROOM', 'COMPUTER_LAB', 'HARDWARE_LAB', 'AUDITORIUM') NOT NULL,
    requires_lab BOOLEAN DEFAULT FALSE,
    requires_ac BOOLEAN DEFAULT TRUE,
    credits INT DEFAULT 3,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Timetable Slots Table
CREATE TABLE IF NOT EXISTS timetable_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    classroom_id BIGINT NOT NULL,
    lecturer_id BIGINT NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancellation_reason VARCHAR(255),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Historical Attendance Table (For AI Model Training/Validation)
CREATE TABLE IF NOT EXISTS historical_attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    course_type VARCHAR(30) NOT NULL,
    enrolled_count INT NOT NULL,
    actual_attendance INT NOT NULL,
    is_exam_near BOOLEAN DEFAULT FALSE,
    recorded_date DATE NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Study Spaces Table
CREATE TABLE IF NOT EXISTS study_spaces (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    classroom_id BIGINT NOT NULL UNIQUE,
    quiet_level ENUM('SILENT', 'MODERATE', 'GROUP_DISCUSSION') NOT NULL,
    has_charging_ports BOOLEAN DEFAULT TRUE,
    has_wifi BOOLEAN DEFAULT TRUE,
    is_available_now BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Bookings Table (For ad-hoc reservation & conflict check)
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    classroom_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    event_title VARCHAR(150) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    attendee_count INT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'APPROVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. AI Predictions & Optimization Logs
CREATE TABLE IF NOT EXISTS ai_predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    enrolled_students INT NOT NULL,
    predicted_attendance INT NOT NULL,
    confidence_score DECIMAL(5, 2),
    model_name VARCHAR(50) DEFAULT 'RandomForestRegressor_v1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. AI Recommendations Table
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    original_room_id BIGINT,
    recommended_room_id BIGINT NOT NULL,
    predicted_attendance INT NOT NULL,
    utilization_score DECIMAL(5, 2) NOT NULL,
    is_cross_faculty BOOLEAN DEFAULT FALSE,
    reasoning_summary TEXT,
    status ENUM('SUGGESTED', 'ACCEPTED', 'REJECTED') DEFAULT 'SUGGESTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (original_room_id) REFERENCES classrooms(id) ON DELETE SET NULL,
    FOREIGN KEY (recommended_room_id) REFERENCES classrooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Smart Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('ROOM_SWAP', 'CANCELLATION', 'CROSS_FACULTY', 'EMERGENCY', 'BOOKING', 'STUDY_SPACE') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indices for high performance queries
CREATE INDEX idx_timetable_day_slot ON timetable_slots(day_of_week, start_time, end_time);
CREATE INDEX idx_classrooms_capacity ON classrooms(capacity, is_lab, has_ac);
CREATE INDEX idx_bookings_date_time ON bookings(booking_date, start_time, end_time);
