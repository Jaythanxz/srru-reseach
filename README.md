# คลังรวมและเผยแพร่โครงงานวิจัยบัณฑิตศึกษาและโปรเจกต์จบ (กรณีศึกษา มหาวิทยาลัยราชภัฏสุรินทร์)
## Digital Research Repository & Hybrid Recommendation System (SRRU)

เว็บแอปพลิเคชันบริหารจัดการและสืบค้นคลังโครงงานวิจัยบัณฑิตศึกษาและโปรเจกต์จบ มหาวิทยาลัยราชภัฏสุรินทร์ พัฒนาตามข้อกำหนดใน `spec.md` พร้อมระบบแนะนำงานวิจัยอัจฉริยะแบบผสม (Hybrid Recommendation Engine) ด้วย Thai NLP (PyThaiNLP + Scikit-Learn TF-IDF + Collaborative Filtering)

---

## 🌟 โครงสร้างระบบ (Architecture Overview)

```
d:/Showroom Car 3D/
├── database/
│   ├── schema.sql              # MySQL DDL 7 ตารางพร้อม Charset utf8mb4
│   └── seed.sql                # ข้อมูลตั้งต้นสมจริงของ มรภ.สุรินทร์ (คณะ/สาขา, ผู้ใช้, งานวิจัย, Logs)
├── server/                     # Backend RESTful API (Node.js + Express.js)
│   ├── config/db.js            # การเชื่อมต่อ MySQL (mysql2/promise) พร้อม In-Memory Standalone Fallback
│   ├── middlewares/            # JWT Authentication, RBAC (Student/Teacher/Admin), Multer PDF Upload
│   ├── controllers/            # Auth, Projects, Approvals, Users/Bookmarks, Recommendations, Admin
│   ├── routes/                 # Express Router ตาม API Spec
│   ├── services/aiService.js   # โมดูลคำนวณ TF-IDF และ Hybrid Score ฝั่ง Node.js
│   ├── uploads/                # โฟลเดอร์จัดเก็บไฟล์เอกสาร PDF
│   └── server.js               # Entry point ของ Express Server (Port 5000)
├── ai-engine/                  # AI Microservice & Recommendation Scripts
│   ├── recommender.py          # Thai NLP (PyThaiNLP newmm) + TF-IDF Vectorizer + Collaborative Matrix
│   ├── test_recommendation.py  # สคริปต์ทดสอบและประเมินค่า Precision@K, Recall@K, F1-Score
│   └── requirements.txt        # แพ็กเกจไพธอนที่จำเป็น
└── client/                     # Frontend SPA (Vue.js 3 + Vite + TailwindCSS + Pinia)
    ├── src/
    │   ├── components/         # Navbar, Footer, ProjectCard, PDFViewer, StatusBadge
    │   ├── views/              # Home, Search, ProjectDetail, Submit, TeacherReview, AdminDashboard, Auth
    │   ├── stores/             # Pinia Stores (auth, project, bookmark, recommendation)
    │   └── router/             # Vue Router พร้อม Navigation Guard ตรวจสอบ RBAC
    └── vite.config.js          # Vite Configuration (Port 3000 พร้อม Reverse Proxy ไปยัง Backend)
```

---

## 🚀 วิธีการติดตั้งและรันระบบ (How to Run)

### 1. รัน Backend API Server (Node.js Express)
```powershell
cd "d:/Showroom Car 3D/server"
npm install
node server.js
```
* Backend Server จะทำงานที่: `http://localhost:5000`
* Health Check: `http://localhost:5000/api/health`

### 2. รัน Frontend Web Client (Vue 3 + Vite)
```powershell
cd "d:/Showroom Car 3D/client"
npm install
npm run dev
```
* Frontend Web App จะทำงานที่: `http://localhost:3000`

### 3. รันสคริปต์ประเมินผล Recommendation Engine (Python)
```powershell
cd "d:/Showroom Car 3D/ai-engine"
pip install -r requirements.txt
python test_recommendation.py
```

---

## 🔑 บัญชีผู้ใช้งานตัวอย่าง (Demo Accounts)

ระบบมีปุ่ม Quick Switch Role บน Navbar และหน้า Login ให้สลับบทบาทได้อย่างรวดเร็ว:

| บทบาท (Role) | ชื่อผู้ใช้ (Username) | รหัสผ่าน (Password) | สิทธิ์การเข้าถึง |
|---|---|---|---|
| **นักศึกษา (STUDENT)** | `student1` | `password123` | ค้นหา, อ่าน PDF, บุ๊กมาร์ก, ส่งผลงานวิจัยใหม่ |
| **อาจารย์ (TEACHER)** | `teacher1` | `password123` | ตรวจสอบเอกสาร PDF, อนุมัติ/ส่งกลับแก้ไขผลงาน |
| **ผู้ดูแลระบบ (ADMIN)** | `admin` | `password123` | เข้าถึงทุกส่วน, ดูแดชบอร์ดสถิติ KPI, จัดการผู้ใช้ |

---

## 🧠 อัลกอริทึม Hybrid Recommendation Engine & Thai NLP

1. **Content-Based Component ($\text{Score}_{\text{CB}}$)**:
   - สกัดข้อความจาก Title (TH/EN) + Abstract + Keywords
   - ตัดคำภาษาไทยด้วย PyThaiNLP (`word_tokenize(engine='newmm')`) และกรอง Stopwords
   - แปลงเป็น Term Frequency - Inverse Document Frequency (TF-IDF Matrix)
   - คำนวณ Cosine Similarity ระหว่างผลงานวิจัยที่ผู้ใช้สนใจกับบทความอื่นๆ

2. **Collaborative Filtering Component ($\text{Score}_{\text{CF}}$)**:
   - สร้าง User-Item Interaction Matrix จากตาราง `user_logs`
   - กำหนดค่าน้ำหนัก: View = 1.0, Download = 2.0, Bookmark = 3.0
   - คำนวณ Item-Item / User-User Cosine Similarity

3. **Hybrid Combiner Formula**:
   $$\text{Final Score} = (0.6 \times \text{Score}_{\text{CB}}) + (0.4 \times \text{Score}_{\text{CF}})$$
