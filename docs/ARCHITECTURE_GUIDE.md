# รายงานสถาปัตยกรรมระบบ (System Architecture Guide)
## เว็บแอปพลิเคชันคลังรวมและเผยแพร่โครงงานวิจัยบัณฑิตศึกษาและโปรเจกต์จบ มหาวิทยาลัยราชภัฏสุรินทร์ (SRRU)

---

## 1. ภาพรวมสถาปัตยกรรมระบบ (System Architecture Overview)

ระบบถูกออกแบบด้วยสถาปัตยกรรมแบบ **Decoupled Client-Server & AI Micro-Engine Architecture** เพื่อรองรับความเร็ว ความปลอดภัย และความยืดหยุ่นในการประมวลผลโมเดลภาษาธรรมชาติภาษาไทย (Thai NLP)

```mermaid
graph TD
    subgraph ClientLayer ["1. Frontend Presentation Layer (Port 3000)"]
        UI["Vue 3 SPA + Vite + TailwindCSS"]
        Stores["Pinia State Management (Auth, Project, Rec, Bookmark)"]
        PDF["Embedded PDF Viewer & Annotator"]
        ChatbotUI["✨ AI Assistant Floating Widget"]
    end

    subgraph APILayer ["2. Application & API Layer (Port 5000)"]
        Router["Express Router & Route Guards"]
        AuthMiddleware["JWT Authentication & RBAC Middleware"]
        Controllers["Project, Approval, Admin, Bookmark Controllers"]
        Upload["Multer PDF Storage Engine"]
    end

    subgraph AIEngine ["3. AI & Thai NLP Intelligence Engine"]
        Tokenizer["Thai Word Segmentation & Stopwords Filter"]
        TFIDF["TF-IDF Vector Space Model"]
        Semantic["Dense Semantic Vectorizer (WangchanBERTa/Synonym Concepts)"]
        HybridRecommender["Hybrid Recommender Engine (0.6 CB + 0.4 CF)"]
        RedundancyRadar["Real-Time Topic Redundancy & Plagiarism Radar"]
        AISummarizer["AI Executive 3-Bullet Takeaways Generator"]
    end

    subgraph DataLayer ["4. Data & Persistence Layer"]
        MySQL[("MySQL 8.0 Database (utf8mb4)")]
        MemoryFallback[("Automated In-Memory Engine")]
        PDFStorage[("Local PDF Document Repository (/uploads)")]
    end

    UI --> Router
    ChatbotUI --> Router
    Router --> AuthMiddleware --> Controllers
    Controllers --> AIEngine
    Controllers --> MySQL
    Controllers --> MemoryFallback
    Controllers --> Upload --> PDFStorage
```

---

## 2. โครงสร้างฐานข้อมูล E-R Diagram (Database Schema)

ระบบประกอบด้วย 7 ตารางหลักที่เชื่อมโยงกันอย่างสมบูรณ์:

```mermaid
erDiagram
    FACULTIES ||--o{ DEPARTMENTS : "contains"
    FACULTIES ||--o{ USERS : "belongs to"
    DEPARTMENTS ||--o{ USERS : "belongs to"
    FACULTIES ||--o{ RESEARCH_PROJECTS : "categorized under"
    DEPARTMENTS ||--o{ RESEARCH_PROJECTS : "categorized under"
    USERS ||--o{ RESEARCH_PROJECTS : "submits / approves"
    USERS ||--o{ USER_BOOKMARKS : "creates"
    RESEARCH_PROJECTS ||--o{ USER_BOOKMARKS : "bookmarked in"
    USERS ||--o{ USER_LOGS : "generates"
    RESEARCH_PROJECTS ||--o{ USER_LOGS : "subject of"
    USERS ||--o{ RECOMMENDATION_CACHE : "receives"
    RESEARCH_PROJECTS ||--o{ RECOMMENDATION_CACHE : "recommended"

    FACULTIES {
        int faculty_id PK
        string faculty_name
        timestamp created_at
    }

    DEPARTMENTS {
        int department_id PK
        string department_name
        int faculty_id FK
        timestamp created_at
    }

    USERS {
        int user_id PK
        string username UK
        string password_hash
        string full_name
        string email UK
        enum role "STUDENT, TEACHER, ADMIN"
        int faculty_id FK
        int department_id FK
    }

    RESEARCH_PROJECTS {
        int project_id PK
        string title_th
        string title_en
        text abstract_text
        string keywords
        string authors
        string advisor_name
        int faculty_id FK
        int department_id FK
        int publish_year
        enum project_type "THESIS, SENIOR_PROJECT, INDEPENDENT_STUDY, RESEARCH_ARTICLE, RESEARCH_REPORT"
        string pdf_file_path
        enum status "PENDING, APPROVED, REJECTED"
        int submitted_by FK
        int approved_by FK
        int view_count
        int download_count
        text rejection_reason
    }

    USER_BOOKMARKS {
        int bookmark_id PK
        int user_id FK
        int project_id FK
        timestamp created_at
    }

    USER_LOGS {
        int log_id PK
        int user_id FK
        enum action_type "SEARCH, VIEW, DOWNLOAD, BOOKMARK"
        string search_keyword
        int project_id FK
        timestamp timestamp
    }

    RECOMMENDATION_CACHE {
        int cache_id PK
        int user_id FK
        int recommended_project_id FK
        float score
        string algorithm_type
        timestamp updated_at
    }
```

---

## 3. หลักการทำงานของอัลกอริทึมปัญญาประดิษฐ์ (AI & Thai NLP Mathematical Models)

### 3.1 การประมวลผลข้อความภาษาไทย (Thai NLP & TF-IDF)
1. **การตัดคำและกำจัดคำหยุด (Tokenization & Stopwords Removal)**:
   ข้อความภาษาไทยจะถูกทำความสะอาดและตัดคำผ่านพจนานุกรมคำศัพท์วิชาการภาษาไทย และกรองคำที่ไม่สื่อความหมาย (Stopwords) ออก
2. **การแปลงข้อความเป็นเวกเตอร์ (Vector Space Model)**:
   $$\text{TF}(t, d) = \frac{f_{t, d}}{\sum_{t' \in d} f_{t', d}}$$
   $$\text{IDF}(t, D) = \ln\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$$
   $$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$

### 3.2 การสืบค้นเชิงความหมาย (Dense Semantic Vector Search)
ระบบแมปคำศัพท์เข้าสู่แนวคิดทางความหมาย (Semantic Concept Clusters) เช่น *AI, Machine Learning, Deep Learning, CNN, Thai NLP, ข้าวหอมมะลิ, ผ้าไหมสุรินทร์, IoT, GIS* เพื่อให้คำนวณ Cosine Similarity ได้แม้ใช้คำคนละคำ:
$$\text{Similarity}(A, B) = \frac{A \cdot B}{\|A\| \|B\|} = \frac{\sum_{i=1}^n A_i B_i}{\sqrt{\sum_{i=1}^n A_i^2} \sqrt{\sum_{i=1}^n B_i^2}}$$

### 3.3 ระบบแนะนำแบบผสมผสาน (Hybrid Recommendation Formula)
$$\text{Score}_{\text{Hybrid}}(u, p) = 0.6 \times \text{Score}_{\text{CB}}(u, p) + 0.4 \times \text{Score}_{\text{CF}}(u, p)$$
* **Content-Based Filtering (CB - 60%)**: วิเคราะห์ความคล้ายคลึงระหว่างบทคัดย่อของผลงานในคลังกับงานที่ผู้ใช้เคยเปิดอ่าน/บุ๊กมาร์ก
* **Collaborative Filtering (CF - 40%)**: วิเคราะห์พฤติกรรมร่วมจาก User Interaction Logs โดยกำหนดค่าน้ำหนัก:
  - $\text{Bookmark} = 3.0$
  - $\text{Download} = 2.0$
  - $\text{View} = 1.0$

---

## 4. เมทริกซ์สิทธิ์การใช้งาน (Role-Based Access Control - RBAC)

| ความสามารถ / หน้าจอ | บุคคลทั่วไป (Guest) | นักศึกษา (STUDENT) | อาจารย์ (TEACHER) | ผู้ดูแลระบบ (ADMIN) |
| :--- | :---: | :---: | :---: | :---: |
| สืบค้นงานวิจัย / ค้นหา Semantic AI | ✅ | ✅ | ✅ | ✅ |
| เปิดอ่านเอกสาร PDF ฉบับเต็ม | ✅ | ✅ | ✅ | ✅ |
| ส่งออกไฟล์บรรณานุกรม (.RIS / .BIB) | ✅ | ✅ | ✅ | ✅ |
| ใช้งาน AI Chatbot ผู้ช่วยวิจัย | ✅ | ✅ | ✅ | ✅ |
| บันทึกงานวิจัย (Bookmarks) | ❌ | ✅ | ✅ | ✅ |
| ส่งผลงานวิจัยใหม่ & ตรวจซ้ำซ้อน | ❌ | ✅ | ❌ | ✅ |
| ตรวจอนุมัติ & คอมเมนต์ PDF (Annotation) | ❌ | ❌ | ✅ | ✅ |
| แดชบอร์ดสถิติ KPI และจัดการผู้ใช้งาน | ❌ | ❌ | ❌ | ✅ |
