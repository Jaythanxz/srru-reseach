# Specification Document (spec.md)
## System Architecture & Technical Specifications for Digital Research Repository & Recommendation System
**Project Name:** เว็บแอปพลิเคชันคลังรวมและเผยแพร่โครงงานวิจัยบัณฑิตศึกษาและโปรเจกต์จบ (กรณีศึกษา มหาวิทยาลัยราชภัฏสุรินทร์)  
**Target Organization:** Surindra Rajabhat University (SRRU)  
**Document Version:** 1.0.0  

---

## 1. Executive Summary & Project Vision

### 1.1 Problem Statement
In the digital transformation era, higher education institutions require effective Knowledge Management (KM). Research projects and thesis documents at Surindra Rajabhat University (SRRU) represent invaluable intellectual property. However, the current storage process is fragmented across faculties and physical libraries, leading to:
1. Difficulty in searching and retrieving research work.
2. Risk of physical document deterioration.
3. Redundant research topics among students.
4. Existing digital repositories operating passively (Passive Approach), relying strictly on exact user search keywords without offering inspiration or automated recommendations.

### 1.2 Proposed Solution
Development of a modern, responsive Web Application acting as a centralized digital research repository. The platform integrates an intelligent **Hybrid Recommendation System** (combining Content-Based Filtering via Thai Natural Language Processing/TF-IDF and Collaborative Filtering based on User Behavioral Logs) to shift document retrieval from a passive to an **active approach** (Personalized Recommendations).

### 1.3 Key Objectives
- **OBJ-1:** Design and develop a centralized digital repository web application for SRRU graduate research and undergraduate final projects.
- **OBJ-2:** Implement an AI-driven Hybrid Recommendation Engine and Advanced Search leveraging Thai NLP techniques.
- **OBJ-3:** Conduct system testing, evaluate recommendation accuracy metrics (Precision, Recall, F1-Score), and measure user satisfaction across 3 target user groups.

---

## 2. Tech Stack & Architecture Design

```
+-----------------------------------------------------------------------+
|                              CLIENT SIDE                              |
|   Vue.js 3 (Options/Composition API) + Pinia + Vue Router + Tailwind  |
+-----------------------------------------------------------------------+
                                   | RESTful API (JSON)
                                   v
+-----------------------------------------------------------------------+
|                              BACKEND API                              |
|      Node.js + Express.js Framework (JWT Auth, Multer PDF Upload)     |
+-----------------------------------------------------------------------+
                    |                             |
       SQL Queries  v                             v HTTP / Subprocess
+-----------------------+             +---------------------------------+
|   MySQL Database      |             | AI / Recommendation Engine      |
|  (Relational Storage) |             | Python (PyThaiNLP, Scikit-Learn)|
+-----------------------+             +---------------------------------+
```

### 2.1 Technology Specifications
* **Frontend Framework:** Vue.js 3 (Vite, Pinia state management, Vue Router, Axios, TailwindCSS)
* **Backend API Server:** Node.js (v18+) with Express.js framework
* **Database Management System:** MySQL 8.0 (Relational DB with UTF8MB4 charset for full Thai script support)
* **AI & NLP Module:** Python 3.10+ (PyThaiNLP for Thai tokenization/stopword removal, Scikit-learn for TF-IDF vectorization and Cosine Similarity, Pandas/NumPy for matrix operations)
* **Document Processing:** PDF.js for in-browser PDF viewing; Multer for file upload handling.
* **Authentication:** JSON Web Tokens (JWT) with HTTP-only cookies / Bearer tokens and role-based access control (RBAC middleware).

---

## 3. Database Schema Design (MySQL)

### 3.1 Entity Relationship Diagram Structure

```sql
-- 1. Users Table
CREATE TABLE users (
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
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- 2. Faculties Table
CREATE TABLE faculties (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_name VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Departments Table
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(150) NOT NULL,
    faculty_id INT NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE CASCADE
);

-- 4. Research Projects Table
CREATE TABLE research_projects (
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
    FOREIGN KEY (submitted_by) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- 5. Bookmarks Table
CREATE TABLE user_bookmarks (
    bookmark_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_bookmark (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES research_projects(project_id) ON DELETE CASCADE
);

-- 6. User Activity Logs Table
CREATE TABLE user_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action_type ENUM('SEARCH', 'VIEW', 'BOOKMARK', 'DOWNLOAD') NOT NULL,
    search_keyword VARCHAR(255),
    project_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES research_projects(project_id) ON DELETE SET NULL
);

-- 7. Precalculated Recommendations Cache
CREATE TABLE recommendation_cache (
    cache_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recommended_project_id INT NOT NULL,
    score FLOAT NOT NULL,
    algorithm_type ENUM('CONTENT_BASED', 'COLLABORATIVE', 'HYBRID') NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_project_id) REFERENCES research_projects(project_id) ON DELETE CASCADE
);
```

---

## 4. RESTful API Endpoints Specification

### 4.1 Authentication Module (`/api/auth`)
* `POST /api/auth/register` - Student registration.
* `POST /api/auth/login` - User login (returns JWT token and user profile details).
* `GET /api/auth/profile` - Fetch current user profile.

### 4.2 Research Management Module (`/api/projects`)
* `GET /api/projects` - Public search endpoint (supports filters: keyword, year, faculty, department, status=APPROVED).
* `GET /api/projects/:id` - Fetch project details by ID + log view event.
* `POST /api/projects` - Submit new project paper + PDF upload (Student role, sets status to `PENDING`).
* `PUT /api/projects/:id` - Edit project metadata (Owner / Admin).
* `DELETE /api/projects/:id` - Delete project (Admin only).
* `GET /api/projects/:id/pdf` - Stream/View PDF file.
* `POST /api/projects/:id/download` - Increment download count + log download event.

### 4.3 Evaluation & Approval Module (`/api/approvals`)
* `GET /api/approvals/pending` - Get list of pending submissions (Teacher / Admin).
* `PATCH /api/approvals/:id/status` - Approve or reject project with status and optional feedback (`APPROVED` / `REJECTED`).

### 4.4 User Interaction & Bookmarks (`/api/user`)
* `GET /api/user/bookmarks` - List bookmarked projects for current user.
* `POST /api/user/bookmarks/:projectId` - Add to bookmarks.
* `DELETE /api/user/bookmarks/:projectId` - Remove from bookmarks.
* `POST /api/user/logs` - Record explicit user activity log.

### 4.5 Recommendation System (`/api/recommendations`)
* `GET /api/recommendations/personalized` - Get top N personalized recommended research papers for logged-in user.
* `GET /api/recommendations/similar/:projectId` - Get item-item recommendations based on content similarity.

### 4.6 Analytics & Administration (`/api/admin`)
* `GET /api/admin/dashboard` - Summary metrics (total users, total papers, pending count, total views/downloads).
* `GET /api/admin/trending-keywords` - Frequency table of search logs for word cloud and analytics.
* `GET /api/admin/users` - User management list & role updates.
* `CRUD /api/admin/faculties` & `/api/admin/departments` - Master data management.

---

## 5. Hybrid Recommendation Engine & Thai NLP Architecture

```
+-------------------------------------------------------------------------+
|                        HYBRID RECOMMENDATION ENGINE                     |
+-------------------------------------------------------------------------+
|                                                                         |
|  [ Content-Based Component ]           [ Collaborative Filtering ]       |
|  - Abstract & Keyword Text             - User Log Matrix (View/Bookmark)|
|  - Tokenize via PyThaiNLP              - User-Item Interaction Matrix   |
|  - TF-IDF Vector Generation            - Cosine Similarity across users |
|  - Cosine Similarity with User Profile - Predict unrated paper scores   |
|         (Score_CB)                                (Score_CF)            |
|                                                                         |
|                                    |                                    |
|                                    v                                    |
|           HYBRID COMBINER SCORE = (w1 * Score_CB) + (w2 * Score_CF)     |
|                        (Default Weights: w1 = 0.6, w2 = 0.4)            |
+-------------------------------------------------------------------------+
```

### 5.1 Thai NLP Pipeline (Content-Based)
1. **Text Preprocessing:** Extract Title, Abstract, and Keywords.
2. **Tokenization:** Use `pythainlp.tokenize.word_tokenize(engine='newmm')`.
3. **Stopword Removal:** Filter out common Thai stopwords (`pythainlp.corpus.thai_stopwords()`).
4. **Vectorization:** Compute TF-IDF Matrix (Term Frequency - Inverse Document Frequency).
5. **Similarity Calculation:** Calculate Cosine Similarity between user profile text vector (derived from bookmarked and viewed research) and candidate research documents.

### 5.2 Collaborative Filtering Pipeline
1. Construct User-Item Matrix from `user_logs` (Weights: View = 1.0, Download = 2.0, Bookmark = 3.0).
2. Calculate User-User similarity or Item-Item similarity matrix using Cosine Similarity.
3. Compute predicted affinity scores for unread papers.

### 5.3 Hybrid Scoring Formula
$$	ext{Final Score} = (lpha 	imes 	ext{Score}_{	ext{Content-Based}}) + (eta 	imes 	ext{Score}_{	ext{Collaborative}})$$
* Standard default configuration: $lpha = 0.6$, $eta = 0.4$.

---

## 6. Detailed User Roles & Functional Modules

| Feature / Module | Student (นักศึกษา) | Teacher / Expert (อาจารย์) | Admin (ผู้ดูแลระบบ) |
|---|---|---|---|
| User Authentication | Login / Register | Login | Login |
| Basic & Advanced Search | Yes | Yes | Yes |
| View Details & Read PDF | Yes | Yes | Yes |
| Personalized AI Recommendation | Yes | Yes | Yes |
| Bookmark Research | Yes | Yes | Yes |
| Submit Research Project | Yes (Create/Upload) | No | Optional |
| Approve / Reject Submissions | No | Yes (Approve/Reject) | Yes |
| Faculty/Dept Analytics Dashboard | No | Yes (Faculty scope) | Yes (Global scope) |
| Manage Users & Roles | No | No | Yes |
| Master Data (Faculties/Depts) | No | No | Yes |

---

## 7. Key User Interfaces & Layout Specifications

1. **Student Homepage & Active Search Portal:**
   - Hero banner with prominent smart search bar.
   - Dynamic recommendation carousel: "แนะนำสำหรับคุณ (Personalized for You)".
   - Advanced Search Filter drawer (Faculty, Department, Publication Year, Keyword tags).
2. **Research Detail & PDF Reader View:**
   - Metadata header: Title (TH/EN), Authors, Advisor, Publication Year, Views, Downloads.
   - Embedded responsive PDF Viewer with bookmark button.
   - "งานวิจัยที่เกี่ยวข้อง (Related Research)" panel on the right sidebar.
3. **Teacher Approval Portal:**
   - Data table of pending project submissions with status badges (`PENDING`, `APPROVED`, `REJECTED`).
   - Quick preview modal showing submitted metadata and full PDF file.
   - Approve/Reject form modal with comment box for rejection reason.
4. **Admin Dashboard:**
   - KPI cards: Total Papers, Total Downloads, Active Users, Pending Approvals.
   - Interactive charts: Submissions by Faculty (Bar chart), Top Search Keywords (Word cloud / horizontal bar chart).
   - User management table with quick role assignment dropdown.

---

## 8. Development Roadmap & Task Checklist for Antigravity AI

- [ ] **Phase 1: Database Setup & Infrastructure**
  - Create MySQL database tables using provided DDL.
  - Setup Node.js Express server with CORS, dotenv, and DB connection pooling.
- [ ] **Phase 2: Authentication & RBAC Middleware**
  - Implement JWT registration and login routes.
  - Create auth middleware verifying user role permissions (`STUDENT`, `TEACHER`, `ADMIN`).
- [ ] **Phase 3: Core CRUD & PDF Upload Engine**
  - Build Multer middleware for secure file upload (`.pdf` validation).
  - Implement project submission, approval/rejection endpoints, and search filtering APIs.
- [ ] **Phase 4: Frontend Development (Vue 3 + Tailwind)**
  - Setup Vue 3 project with Router & Pinia store.
  - Build Responsive Navigation Bar, Student Home, Research Detail + PDF Viewer, Teacher Review Table, and Admin Dashboard.
- [ ] **Phase 5: Hybrid Recommendation & Thai NLP Integration**
  - Write Python microservice script for Thai tokenization, TF-IDF calculation, and Hybrid scoring.
  - Integrate AI engine API with Node.js backend.
- [ ] **Phase 6: Verification, Testing & Refinement**
  - Perform API integration testing.
  - Calculate Precision, Recall, and F1-score metrics for recommendations.
