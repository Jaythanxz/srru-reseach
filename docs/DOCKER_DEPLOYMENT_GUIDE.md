# 🐳 คู่มือการติดตั้งและรันระบบด้วย Docker (Docker Deployment Guide)
## SRRU Digital Research Repository & AI Assistant

ระบบได้รับการออกแบบโครงสร้างแบบ **Microservices & Multi-Stage Containers** พร้อมรันได้ทันทีด้วยคำสั่งเดียวผ่าน **Docker Compose**

---

## 🏗️ โครงสร้าง Docker ภายในระบบ

```
Showroom Car 3D/
├── docker-compose.yml          # ไฟล์รวมบริการ Backend + Frontend + Volume
├── server/
│   ├── Dockerfile             # Node.js 20 Alpine (Production API + AI Engine)
│   └── .dockerignore          # ป้องกัน node_modules เข้า Image
├── client/
│   ├── Dockerfile             # Multi-stage: Build Vue 3 -> Serve via Nginx Alpine
│   ├── nginx.conf             # Nginx Reverse Proxy จัดการ Routing & /api
│   └── .dockerignore          # ป้องกันไฟล์ไม่จำเป็นเข้า Image
└── server/uploads/            # Volume สำหรับจัดเก็บไฟล์ PDF วิทยานิพนธ์จริง
```

---

## 🚀 คำสั่งเริ่มต้นใช้งาน (Quick Start)

### 1. สั่งรันทั้งระบบด้วย Docker Compose (คำสั่งเดียวจบ)
เปิด Terminal ในโฟลเดอร์โปรเจกต์ แล้วพิมพ์:

```bash
docker compose up --build -d
```

> **คำอธิบาย:**
> - `--build`: สั่ง Compile โค้ด Frontend Vue และติดตั้ง Dependency ฝั่ง Backend ใหม่
> - `-d` (Detached Mode): สั่งให้ระบบทำงานใน Background

---

### 2. ตรวจสอบสถานะการทำงานของ Container
```bash
docker compose ps
```

| Service Name | Container Name | Port Mapping | สถานะ |
| :--- | :--- | :--- | :--- |
| `srru-backend` | `srru_research_backend` | `0.0.0.0:5000->5000/tcp` | Up (Healthy) |
| `srru-frontend` | `srru_research_frontend` | `0.0.0.0:80->80/tcp, 0.0.0.0:5173->80/tcp` | Up |

---

### 3. เข้าใช้งานระบบผ่านเว็บเบราว์เซอร์
- 🌐 **Frontend Application:** [http://localhost](http://localhost) หรือ [http://localhost:5173](http://localhost:5173)
- 🔌 **Backend API Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### 4. การดู Log การทำงาน
```bash
# ดู Log รวมทั้งหมด
docker compose logs -f

# ดูเฉพาะ Backend API
docker compose logs -f srru-backend

# ดูเฉพาะ Frontend Nginx
docker compose logs -f srru-frontend
```

---

### 5. คำสั่งหยุดการทำงาน (Stop Services)
```bash
docker compose down
```

---

## 🌟 จุดเด่นของการใช้ Docker ในงานวิจัยนี้ (ข้อดีสำหรับนำเสนออาจารย์)
1. **Zero-Configuration Deployment:** ใครดาวน์โหลดโปรเจกต์ไป ไม่ต้องลง Node.js หรือติดตั้ง Library เอง แค่มี Docker ก็รันได้ทันที
2. **Production-Grade Performance:** ฝั่ง Frontend รันบน **Nginx Alpine** ที่กินทรัพยากรน้อยมาก (RAM ไม่เกิน 15 MB) พร้อมรองรับ Gzip Compression
3. **Data Persistence:** ไฟล์ PDF ผลงานวิจัยจะถูกเชื่อมต่อผ่าน **Docker Volume (`./server/uploads`)** ข้อมูลจะไม่สูญหายแม้จะหยุดหรือลบ Container
4. **ความปลอดภัยสูง:** แยกเครือข่าย Container Network ภายใน (`srru_network`) และ Nginx ทำหน้าที่เป็น Reverse Proxy ป้องกันการโจมตีโดยตรง
