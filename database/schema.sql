-- =====================================================================
-- Database Schema for SRRU Digital Research Repository
-- เว็บแอปพลิเคชันคลังรวมและเผยแพร่โครงงานวิจัยบัณฑิตศึกษาและโปรเจกต์จบ
-- มหาวิทยาลัยราชภัฏสุรินทร์ (SRRU)
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS srru_research_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE srru_research_db;

-- 1. Faculties Table (ตารางข้อมูลคณะ)
CREATE TABLE IF NOT EXISTS faculties (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_name VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Departments Table (ตารางข้อมูลสาขาวิชา/ภาควิชา)
CREATE TABLE IF NOT EXISTS departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(150) NOT NULL,
    faculty_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Users Table (ตารางข้อมูลผู้ใช้งาน: นักศึกษา, อาจารย์, แอดมิน)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('STUDENT', 'TEACHER', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    faculty_id INT,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Research Projects Table (ตารางข้อมูลโครงงานวิจัยและวิทยานิพนธ์)
CREATE TABLE IF NOT EXISTS research_projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    title_th VARCHAR(300) NOT NULL,
    title_en VARCHAR(300),
    abstract_text TEXT NOT NULL,
    keywords VARCHAR(255) NOT NULL, -- Comma-separated or JSON array
    authors VARCHAR(255) NOT NULL,
    advisor_name VARCHAR(150) NOT NULL,
    faculty_id INT NOT NULL,
    department_id INT NOT NULL,
    publish_year INT NOT NULL,
    project_type ENUM('THESIS', 'INDEPENDENT_STUDY', 'SENIOR_PROJECT', 'RESEARCH_ARTICLE', 'RESEARCH_REPORT') DEFAULT 'THESIS',
    pdf_file_path VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    submitted_by INT NOT NULL,
    approved_by INT,
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (submitted_by) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_status_year (status, publish_year),
    INDEX idx_faculty_dept (faculty_id, department_id),
    FULLTEXT INDEX idx_ft_title_abstract (title_th, abstract_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bookmarks Table (ตารางบันทึกบุ๊กมาร์กงานวิจัยที่ผู้ใช้สนใจ)
CREATE TABLE IF NOT EXISTS user_bookmarks (
    bookmark_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_bookmark (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES research_projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. User Activity Logs Table (ตารางบันทึกประวัติพฤติกรรมผู้ใช้เพื่อใช้คำนวณ Collaborative Filtering)
CREATE TABLE IF NOT EXISTS user_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action_type ENUM('SEARCH', 'VIEW', 'BOOKMARK', 'DOWNLOAD') NOT NULL,
    search_keyword VARCHAR(255),
    project_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES research_projects(project_id) ON DELETE SET NULL,
    INDEX idx_user_action (user_id, action_type),
    INDEX idx_project_action (project_id, action_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Recommendation Cache Table (ตารางแคชผลลัพธ์การแนะนำงานวิจัย)
CREATE TABLE IF NOT EXISTS recommendation_cache (
    cache_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recommended_project_id INT NOT NULL,
    score FLOAT NOT NULL,
    algorithm_type ENUM('CONTENT_BASED', 'COLLABORATIVE', 'HYBRID') NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_rec (user_id, recommended_project_id, algorithm_type),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_project_id) REFERENCES research_projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
