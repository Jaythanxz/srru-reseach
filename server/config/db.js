const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Default MySQL Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'srru_research_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

let pool = null;
let useFallback = false;

// Mock / In-Memory store for standalone operation when MySQL is not active
const memoryStore = {
  faculties: [
    { faculty_id: 1, faculty_name: 'คณะวิทยาศาสตร์และเทคโนโลยี', created_at: new Date() },
    { faculty_id: 2, faculty_name: 'คณะมนุษยศาสตร์และสังคมศาสตร์', created_at: new Date() },
    { faculty_id: 3, faculty_name: 'คณะวิทยาการจัดการ', created_at: new Date() },
    { faculty_id: 4, faculty_name: 'คณะครุศาสตร์', created_at: new Date() },
    { faculty_id: 5, faculty_name: 'คณะเทคโนโลยีอุตสาหกรรม', created_at: new Date() },
    { faculty_id: 6, faculty_name: 'คณะเกษตรและอุตสาหกรรมเกษตร', created_at: new Date() },
    { faculty_id: 7, faculty_name: 'บัณฑิตวิทยาลัย', created_at: new Date() }
  ],
  departments: [
    { department_id: 1, department_name: 'สาขาวิชาวิทยาการคอมพิวเตอร์', faculty_id: 1 },
    { department_id: 2, department_name: 'สาขาวิชาเทคโนโลยีสารสนเทศและนวัตกรรมดิจิทัล', faculty_id: 1 },
    { department_id: 3, department_name: 'สาขาวิชาวิทยาศาสตร์การกีฬาและสุขภาพ', faculty_id: 1 },
    { department_id: 4, department_name: 'สาขาวิชารัฐประศาสนศาสตร์', faculty_id: 2 },
    { department_id: 5, department_name: 'สาขาวิชานิติศาสตร์', faculty_id: 2 },
    { department_id: 6, department_name: 'สาขาวิชาการพัฒนาชุมชน', faculty_id: 2 },
    { department_id: 7, department_name: 'สาขาวิชาการจัดการธุรกิจและการเป็นผู้ประกอบการ', faculty_id: 3 },
    { department_id: 8, department_name: 'สาขาวิชาการตลาดดิจิทัล', faculty_id: 3 },
    { department_id: 9, department_name: 'สาขาวิชาการบัญชีและการเงิน', faculty_id: 3 },
    { department_id: 10, department_name: 'สาขาวิชาคอมพิวเตอร์ศึกษา', faculty_id: 4 },
    { department_id: 11, department_name: 'สาขาวิชาหลักสูตรและการสอน', faculty_id: 4 },
    { department_id: 12, department_name: 'สาขาวิชาวิศวกรรมซอฟต์แวร์และการจัดการระบบอุตสาหกรรม', faculty_id: 5 },
    { department_id: 13, department_name: 'สาขาวิชาเทคโนโลยีการเกษตรอัจฉริยะ', faculty_id: 6 },
    { department_id: 14, department_name: 'หลักสูตรวิทยาศาสตรมหาบัณฑิต (วิจัยและนวัตกรรม)', faculty_id: 7 }
  ],
  users: [
    {
      user_id: 1,
      username: 'admin',
      password_hash: '$2a$10$wE0v2FzQ1pB7tCgQ5N9aOuZqX9Hj0cT2GgR6Oq/k3L5Y6a7h.Q6m.', // password123
      full_name: 'ผู้ดูแลระบบ SRRU',
      email: 'admin@srru.ac.th',
      role: 'ADMIN',
      faculty_id: 1,
      department_id: 1,
      created_at: new Date()
    },
    {
      user_id: 2,
      username: 'teacher1',
      password_hash: '$2a$10$wE0v2FzQ1pB7tCgQ5N9aOuZqX9Hj0cT2GgR6Oq/k3L5Y6a7h.Q6m.',
      full_name: 'ผศ.ดร. ประเสริฐ สกุลดี',
      email: 'prasert.s@srru.ac.th',
      role: 'TEACHER',
      faculty_id: 1,
      department_id: 1,
      created_at: new Date()
    },
    {
      user_id: 3,
      username: 'teacher2',
      password_hash: '$2a$10$wE0v2FzQ1pB7tCgQ5N9aOuZqX9Hj0cT2GgR6Oq/k3L5Y6a7h.Q6m.',
      full_name: 'รศ.ดร. ศิริพร วิมลชัย',
      email: 'siriporn.w@srru.ac.th',
      role: 'TEACHER',
      faculty_id: 3,
      department_id: 7,
      created_at: new Date()
    },
    {
      user_id: 4,
      username: 'student1',
      password_hash: '$2a$10$wE0v2FzQ1pB7tCgQ5N9aOuZqX9Hj0cT2GgR6Oq/k3L5Y6a7h.Q6m.',
      full_name: 'นายสมชาย ใจดี',
      email: 'somchai.j@student.srru.ac.th',
      role: 'STUDENT',
      faculty_id: 1,
      department_id: 1,
      created_at: new Date()
    },
    {
      user_id: 5,
      username: 'student2',
      password_hash: '$2a$10$wE0v2FzQ1pB7tCgQ5N9aOuZqX9Hj0cT2GgR6Oq/k3L5Y6a7h.Q6m.',
      full_name: 'นางสาวสุดา รักเรียน',
      email: 'suda.r@student.srru.ac.th',
      role: 'STUDENT',
      faculty_id: 1,
      department_id: 2,
      created_at: new Date()
    },
    {
      user_id: 6,
      username: 'student3',
      password_hash: '$2a$10$wE0v2FzQ1pB7tCgQ5N9aOuZqX9Hj0cT2GgR6Oq/k3L5Y6a7h.Q6m.',
      full_name: 'นายวิชัย สุรินทร์กล้า',
      email: 'wichai.s@student.srru.ac.th',
      role: 'STUDENT',
      faculty_id: 3,
      department_id: 8,
      created_at: new Date()
    }
  ],
  research_projects: [
    {
      project_id: 1,
      title_th: 'การพัฒนาระบบแนะนำงานวิจัยอัจฉริยะด้วยการประมวลผลภาษาธรรมชาติภาษาไทยและการกรองแบบผสมผสาน',
      title_en: 'Development of Intelligent Research Recommendation System using Thai Natural Language Processing and Hybrid Filtering',
      abstract_text: 'งานวิจัยนี้นำเสนอการพัฒนาระบบคลังงานวิจัยดิจิทัลพร้อมระบบแนะนำอัจฉริยะที่ผสมผสานการประมวลผลภาษาธรรมชาติภาษาไทย (Thai NLP) ด้วยเทคนิค TF-IDF และการกรองข้อมูลแบบร่วมมือ (Collaborative Filtering) จากประวัติการเข้าใช้งานของผู้ใช้ เพื่อแก้ปัญหาการสืบค้นงานวิจัยเชิงรุกและการค้นพบองค์ความรู้ใหม่ ผลการประเมินพบว่าระบบมีความแม่นยำ (Precision) 0.86 และค่า F1-Score สูงกว่าระบบสืบค้นทั่วไปอย่างมีนัยสำคัญ',
      keywords: 'การประมวลผลภาษาไทย, ระบบแนะนำ, TF-IDF, คลังงานวิจัย, การกรองแบบร่วมมือ',
      authors: 'สมชาย ใจดี, กิตติศักดิ์ พูลสวัสดิ์',
      advisor_name: 'ผศ.ดร. ประเสริฐ สกุลดี',
      faculty_id: 1,
      department_id: 1,
      publish_year: 2024,
      project_type: 'THESIS',
      pdf_file_path: '/uploads/sample_paper_1.pdf',
      status: 'APPROVED',
      submitted_by: 4,
      approved_by: 2,
      view_count: 342,
      download_count: 85,
      rejection_reason: null,
      created_at: new Date('2024-03-15T09:30:00Z'),
      updated_at: new Date('2024-03-16T14:20:00Z')
    },
    {
      project_id: 2,
      title_th: 'การประยุกต์ใช้การเรียนรู้เชิงลึกในการจำแนกโรคใบข้าวหอมมะลิสุรินทร์ผ่านโมบายแอปพลิเคชัน',
      title_en: 'Application of Deep Learning for Surin Jasmine Rice Leaf Disease Classification via Mobile Application',
      abstract_text: 'ข้าวหอมมะลิสุรินทร์เป็นพืชเศรษฐกิจสำคัญของจังหวัดสุรินทร์ งานวิจัยนี้จึงพัฒนาโมเดล Convolutional Neural Network (CNN) เพื่อตรวจจับและวินิจฉัยโรคใบข้าว เช่น โรคใบไหม้ โรคใบขีดสีน้ำตาล โดยสร้างชุดข้อมูลภาพถ่ายใบข้าวกว่า 5,000 ภาพ และประมวลผลผ่าน Mobile Application ที่เกษตรกรสามารถถ่ายภาพและรู้ผลได้ทันทีแบบเรียลไทม์ มีความแม่นยำในการจำแนกโรคถึง 94.5%',
      keywords: 'การเรียนรู้เชิงลึก, โรคใบข้าว, ข้าวหอมมะลิสุรินทร์, ปัญญาประดิษฐ์ทางการเกษตร, CNN',
      authors: 'สุดา รักเรียน, ธวัชชัย มั่นคง',
      advisor_name: 'ผศ.ดร. ประเสริฐ สกุลดี',
      faculty_id: 1,
      department_id: 2,
      publish_year: 2024,
      project_type: 'SENIOR_PROJECT',
      pdf_file_path: '/uploads/sample_paper_2.pdf',
      status: 'APPROVED',
      submitted_by: 5,
      approved_by: 2,
      view_count: 289,
      download_count: 64,
      rejection_reason: null,
      created_at: new Date('2024-02-10T10:00:00Z'),
      updated_at: new Date('2024-02-12T11:00:00Z')
    },
    {
      project_id: 3,
      title_th: 'กลยุทธ์การตลาดดิจิทัลและอีคอมเมิร์ซสำหรับสินค้าหัตถกรรมผ้าไหมสุรินทร์ในยุคเศรษฐกิจสร้างสรรค์',
      title_en: 'Digital Marketing and E-Commerce Strategies for Surin Silk Handicrafts in Creative Economy Era',
      abstract_text: 'วิทยานิพนธ์นี้ศึกษาพฤติกรรมผู้บริโภคและการวางกลยุทธ์การตลาดดิจิทัลบนแพลตฟอร์มโซเชียลคอมเมิร์ซสำหรับกลุ่มวิสาหกิจชุมชนทอผ้าไหมบ้านท่าสว่าง จังหวัดสุรินทร์ ผลการวิจัยชี้ให้เห็นว่าการเล่าเรื่อง (Storytelling) อัตลักษณ์ท้องถิ่นและการใช้ระบบถ่ายทอดสด (Live Commerce) ช่วยเพิ่มยอดขายได้มากกว่า 68% และสร้างความภักดีต่อแบรนด์สินค้าพื้นเมืองอย่างยั่งยืน',
      keywords: 'การตลาดดิจิทัล, ผ้าไหมสุรินทร์, อีคอมเมิร์ซ, วิสาหกิจชุมชน, เศรษฐกิจสร้างสรรค์',
      authors: 'วิชัย สุรินทร์กล้า, อารยา สิทธิโชค',
      advisor_name: 'รศ.ดร. ศิริพร วิมลชัย',
      faculty_id: 3,
      department_id: 8,
      publish_year: 2023,
      project_type: 'THESIS',
      pdf_file_path: '/uploads/sample_paper_3.pdf',
      status: 'APPROVED',
      submitted_by: 6,
      approved_by: 3,
      view_count: 195,
      download_count: 42,
      rejection_reason: null,
      created_at: new Date('2023-11-20T08:15:00Z'),
      updated_at: new Date('2023-11-22T13:45:00Z')
    },
    {
      project_id: 4,
      title_th: 'การพัฒนาระบบสารสนเทศภูมิศาสตร์ (GIS) เพื่อการจัดการท่องเที่ยวเชิงวัฒนธรรมจังหวัดสุรินทร์',
      title_en: 'Development of Geographic Information System (GIS) for Cultural Tourism Management in Surin Province',
      abstract_text: 'งานวิจัยนี้นำเสนอการบูรณาการเทคโนโลยีสารสนเทศภูมิศาสตร์ (GIS) เว็บแอปพลิเคชัน และข้อมูลเปิดภาครัฐ เพื่อจัดทำแผนที่ดิจิทัลสำหรับแหล่งท่องเที่ยวทางวัฒนธรรม ปราสาทหินโบราณ และหมู่บ้านช้างสุรินทร์ พร้อมระบบวางแผนการเดินทางอัจฉริยะ (Route Optimization) สำหรับนักท่องเที่ยวทั้งชาวไทยและต่างชาติ',
      keywords: 'ระบบสารสนเทศภูมิศาสตร์, การท่องเที่ยวเชิงวัฒนธรรม, จังหวัดสุรินทร์, แผนที่ดิจิทัล, เว็บแอปพลิเคชัน',
      authors: 'นภัสสร รุ่งเรือง, อนุชา สุขเกษม',
      advisor_name: 'ผศ.ดร. ประเสริฐ สกุลดี',
      faculty_id: 1,
      department_id: 2,
      publish_year: 2023,
      project_type: 'RESEARCH_ARTICLE',
      pdf_file_path: '/uploads/sample_paper_4.pdf',
      status: 'APPROVED',
      submitted_by: 5,
      approved_by: 2,
      view_count: 158,
      download_count: 31,
      rejection_reason: null,
      created_at: new Date('2023-09-05T14:10:00Z'),
      updated_at: new Date('2023-09-08T16:00:00Z')
    },
    {
      project_id: 5,
      title_th: 'การพัฒนาบทเรียนคอมพิวเตอร์ช่วยสอนแบบจำลองสถานการณ์เสมือนจริงเพื่อเสริมสร้างทักษะการแก้ปัญหาทางการเขียนโปรแกรม',
      title_en: 'Development of Simulation-Based Computer Assisted Instruction to Enhance Programming Problem Solving Skills',
      abstract_text: 'งานวิจัยนี้มีวัตถุประสงค์เพื่อพัฒนาและประเมินประสิทธิภาพของบทเรียน CAI แบบ Virtual Simulation สำหรับนักศึกษาสาขาคอมพิวเตอร์ศึกษา มหาวิทยาลัยราชภัฏสุรินทร์ โดยเน้นการฝึกทักษะตรรกศาสตร์และการเขียนโค้ดภาษาไพธอน ผลการทดลองพบว่ากลุ่มตัวอย่างมีคะแนนผลสัมฤทธิ์ทางการเรียนหลังเรียนสูงกว่าก่อนเรียนอย่างมีนัยสำคัญทางสถิติที่ระดับ .01',
      keywords: 'คอมพิวเตอร์ช่วยสอน, สถานการณ์จำลอง, การแก้ปัญหาทางการเขียนโปรแกรม, การศึกษาดิจิทัล',
      authors: 'ณัฐพล ศรีวิชัย, พิมพา แก้วมณี',
      advisor_name: 'ผศ.ดร. ประเสริฐ สกุลดี',
      faculty_id: 4,
      department_id: 10,
      publish_year: 2024,
      project_type: 'INDEPENDENT_STUDY',
      pdf_file_path: '/uploads/sample_paper_5.pdf',
      status: 'APPROVED',
      submitted_by: 4,
      approved_by: 2,
      view_count: 120,
      download_count: 18,
      rejection_reason: null,
      created_at: new Date('2024-01-18T11:00:00Z'),
      updated_at: new Date('2024-01-20T10:30:00Z')
    },
    {
      project_id: 6,
      title_th: 'การประเมินผลสัมฤทธิ์ของนโยบายสวัสดิการชุมชนและการมีส่วนร่วมของประชาชนในเขตเทศบาลเมืองสุรินทร์',
      title_en: 'Evaluation of Community Welfare Policy Effectiveness and Public Participation in Surin Town Municipality',
      abstract_text: 'การศึกษานี้ใช้ระเบียบวิธีวิจัยแบบผสมผสานเพื่อประเมินความพึงพอใจและประสิทธิผลของกองทุนสวัสดิการชุมชน ผลการวิจัยสะท้อนว่าการมีส่วนร่วมของประชาชนในขั้นตอนการวางแผนและการตรวจสอบเป็นปัจจัยสำคัญที่สุดที่ส่งผลต่อความโปร่งใสและความยั่งยืนของโครงการพัฒนาท้องถิ่น',
      keywords: 'นโยบายสวัสดิการ, การมีส่วนร่วมของประชาชน, รัฐประศาสนศาสตร์, การพัฒนาท้องถิ่น',
      authors: 'จันทิมา วรรณศิลป์',
      advisor_name: 'รศ.ดร. ศิริพร วิมลชัย',
      faculty_id: 2,
      department_id: 4,
      publish_year: 2023,
      project_type: 'RESEARCH_REPORT',
      pdf_file_path: '/uploads/sample_paper_6.pdf',
      status: 'APPROVED',
      submitted_by: 6,
      approved_by: 3,
      view_count: 98,
      download_count: 14,
      rejection_reason: null,
      created_at: new Date('2023-08-12T09:00:00Z'),
      updated_at: new Date('2023-08-15T15:00:00Z')
    },
    {
      project_id: 7,
      title_th: 'ระบบตรวจวัดและควบคุมสภาพแวดล้อมโรงเรือนปลูกผักไฮโดรโปนิกส์อัตโนมัติด้วยเทคโนโลยี IoT',
      title_en: 'Automated Environmental Monitoring and Control System for Hydroponic Greenhouses using IoT Technology',
      abstract_text: 'โครงงานนี้ออกแบบและพัฒนาอุปกรณ์เซนเซอร์วัดค่าความเป็นกรด-ด่าง (pH), อุณหภูมิ, ความชื้น และค่าความนำไฟฟ้า (EC) ในสารละลายปุ๋ย พร้อมควบคุมการจ่ายน้ำและพัดลมระบายอากาศอัตโนมัติผ่าน NodeMCU ESP32 และเชื่อมต่อแดชบอร์ดแสดงผลผ่านสมาร์ตโฟน',
      keywords: 'อินเทอร์เน็ตของสรรพสิ่ง, IoT, โรงเรือนอัจฉริยะ, ไฮโดรโปนิกส์, เซนเซอร์',
      authors: 'ธนกฤต มณีรัตน์, วรภพ บุญส่ง',
      advisor_name: 'ผศ.ดร. ประเสริฐ สกุลดี',
      faculty_id: 5,
      department_id: 12,
      publish_year: 2024,
      project_type: 'SENIOR_PROJECT',
      pdf_file_path: '/uploads/sample_paper_7.pdf',
      status: 'PENDING',
      submitted_by: 4,
      approved_by: null,
      view_count: 45,
      download_count: 0,
      rejection_reason: null,
      created_at: new Date(),
      updated_at: new Date()
    }
  ],
  user_bookmarks: [
    { bookmark_id: 1, user_id: 4, project_id: 1, created_at: new Date() },
    { bookmark_id: 2, user_id: 4, project_id: 2, created_at: new Date() },
    { bookmark_id: 3, user_id: 4, project_id: 4, created_at: new Date() },
    { bookmark_id: 4, user_id: 5, project_id: 2, created_at: new Date() },
    { bookmark_id: 5, user_id: 5, project_id: 1, created_at: new Date() },
    { bookmark_id: 6, user_id: 6, project_id: 3, created_at: new Date() },
    { bookmark_id: 7, user_id: 6, project_id: 1, created_at: new Date() }
  ],
  user_logs: [
    { log_id: 1, user_id: 4, action_type: 'SEARCH', search_keyword: 'ระบบแนะนำ ภาษาไทย', project_id: null, timestamp: new Date(Date.now() - 5 * 86400000) },
    { log_id: 2, user_id: 4, action_type: 'VIEW', search_keyword: null, project_id: 1, timestamp: new Date(Date.now() - 5 * 86400000) },
    { log_id: 3, user_id: 4, action_type: 'BOOKMARK', search_keyword: null, project_id: 1, timestamp: new Date(Date.now() - 5 * 86400000) },
    { log_id: 4, user_id: 4, action_type: 'DOWNLOAD', search_keyword: null, project_id: 1, timestamp: new Date(Date.now() - 5 * 86400000) },
    { log_id: 5, user_id: 4, action_type: 'VIEW', search_keyword: null, project_id: 2, timestamp: new Date(Date.now() - 4 * 86400000) },
    { log_id: 6, user_id: 4, action_type: 'BOOKMARK', search_keyword: null, project_id: 2, timestamp: new Date(Date.now() - 4 * 86400000) },
    { log_id: 7, user_id: 5, action_type: 'SEARCH', search_keyword: 'การเรียนรู้เชิงลึก ข้าวหอมมะลิ', project_id: null, timestamp: new Date(Date.now() - 3 * 86400000) },
    { log_id: 8, user_id: 5, action_type: 'VIEW', search_keyword: null, project_id: 2, timestamp: new Date(Date.now() - 3 * 86400000) },
    { log_id: 9, user_id: 5, action_type: 'DOWNLOAD', search_keyword: null, project_id: 2, timestamp: new Date(Date.now() - 3 * 86400000) },
    { log_id: 10, user_id: 5, action_type: 'VIEW', search_keyword: null, project_id: 1, timestamp: new Date(Date.now() - 2 * 86400000) },
    { log_id: 11, user_id: 6, action_type: 'SEARCH', search_keyword: 'การตลาด ผ้าไหม สุรินทร์', project_id: null, timestamp: new Date(Date.now() - 3 * 86400000) },
    { log_id: 12, user_id: 6, action_type: 'VIEW', search_keyword: null, project_id: 3, timestamp: new Date(Date.now() - 3 * 86400000) },
    { log_id: 13, user_id: 6, action_type: 'DOWNLOAD', search_keyword: null, project_id: 3, timestamp: new Date(Date.now() - 2 * 86400000) },
    { log_id: 14, user_id: 6, action_type: 'VIEW', search_keyword: null, project_id: 1, timestamp: new Date(Date.now() - 1 * 86400000) }
  ],
  recommendation_cache: [
    { cache_id: 1, user_id: 4, recommended_project_id: 2, score: 0.892, algorithm_type: 'HYBRID', updated_at: new Date() },
    { cache_id: 2, user_id: 4, recommended_project_id: 5, score: 0.745, algorithm_type: 'HYBRID', updated_at: new Date() },
    { cache_id: 3, user_id: 4, recommended_project_id: 4, score: 0.680, algorithm_type: 'HYBRID', updated_at: new Date() },
    { cache_id: 4, user_id: 5, recommended_project_id: 1, score: 0.910, algorithm_type: 'HYBRID', updated_at: new Date() },
    { cache_id: 5, user_id: 5, recommended_project_id: 7, score: 0.720, algorithm_type: 'HYBRID', updated_at: new Date() },
    { cache_id: 6, user_id: 6, recommended_project_id: 4, score: 0.765, algorithm_type: 'HYBRID', updated_at: new Date() }
  ]
};

const storeFilePath = path.resolve(__dirname, '../uploads/srru_db_store.json');

function saveStoreToDisk() {
  try {
    const data = JSON.stringify(memoryStore, null, 2);
    fs.writeFileSync(storeFilePath, data, 'utf-8');
  } catch (e) {
    console.warn('Failed to persist memory store to disk:', e.message);
  }
}

function loadStoreFromDisk() {
  try {
    if (fs.existsSync(storeFilePath)) {
      const data = fs.readFileSync(storeFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.research_projects && parsed.research_projects.length > 0) {
        Object.assign(memoryStore, parsed);
        console.log(`[Database] Successfully loaded ${memoryStore.research_projects.length} research projects from persistent disk.`);
      }
    }
  } catch (e) {
    console.warn('Failed to load memory store from disk:', e.message);
  }
}

// Initialise memory store from disk on startup
loadStoreFromDisk();

async function initDB() {
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log(`[Database] Connected successfully to MySQL (${dbConfig.host}:${dbConfig.port}/${dbConfig.database})`);
    connection.release();
    useFallback = false;
  } catch (err) {
    console.warn(`[Database Warning] MySQL connection failed (${err.message}). Activating In-Memory Standalone Repository Engine with complete SRRU dataset.`);
    pool = null;
    useFallback = true;
  }
}

async function query(sql, params = []) {
  if (useFallback || !pool) {
    // Forward to memory query simulator
    return executeMemoryQuery(sql, params);
  }
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (err) {
    console.warn('[Database Query Error - Switching to memory store]', err.message);
    useFallback = true;
    pool = null;
    return executeMemoryQuery(sql, params);
  }
}

// Memory Query Handler to execute operations cleanly
function executeMemoryQuery(sql, params) {
  const cleanSql = sql.trim().toUpperCase();

  // SELECT queries
  if (cleanSql.startsWith('SELECT')) {
    if (cleanSql.includes('FROM USERS')) {
      if (cleanSql.includes('WHERE USERNAME =') || cleanSql.includes('WHERE EMAIL =')) {
        const val = params[0];
        const user = memoryStore.users.find(u => u.username === val || u.email === val);
        return user ? [user] : [];
      }
      if (cleanSql.includes('WHERE USER_ID =')) {
        const id = parseInt(params[0]);
        const user = memoryStore.users.find(u => u.user_id === id);
        return user ? [user] : [];
      }
      return [...memoryStore.users];
    }

    if (cleanSql.includes('FROM FACULTIES')) {
      return [...memoryStore.faculties];
    }

    if (cleanSql.includes('FROM DEPARTMENTS')) {
      if (cleanSql.includes('WHERE FACULTY_ID =')) {
        const fId = parseInt(params[0]);
        return memoryStore.departments.filter(d => d.faculty_id === fId);
      }
      return [...memoryStore.departments];
    }

    if (cleanSql.includes('FROM RESEARCH_PROJECTS')) {
      let results = memoryStore.research_projects.map(p => {
        const faculty = memoryStore.faculties.find(f => f.faculty_id === p.faculty_id);
        const dept = memoryStore.departments.find(d => d.department_id === p.department_id);
        const submitter = memoryStore.users.find(u => u.user_id === p.submitted_by);
        return {
          ...p,
          faculty_name: faculty ? faculty.faculty_name : '',
          department_name: dept ? dept.department_name : '',
          submitter_name: submitter ? submitter.full_name : ''
        };
      });

      if (cleanSql.includes('WHERE PROJECT_ID =') || cleanSql.includes('P.PROJECT_ID = ?')) {
        const pId = parseInt(params[params.length - 1]);
        const project = results.find(p => p.project_id === pId);
        return project ? [project] : [];
      }

      // Match WHERE clauses against params
      let paramIdx = 0;
      if (cleanSql.includes('P.STATUS = ?')) {
        const val = params[paramIdx++];
        results = results.filter(p => p.status === val);
      }
      if (cleanSql.includes('P.PROJECT_TYPE = ?')) {
        const val = params[paramIdx++];
        results = results.filter(p => p.project_type === val);
      }
      if (cleanSql.includes('P.FACULTY_ID = ?')) {
        const val = parseInt(params[paramIdx++]);
        results = results.filter(p => p.faculty_id === val);
      }
      if (cleanSql.includes('P.DEPARTMENT_ID = ?')) {
        const val = parseInt(params[paramIdx++]);
        results = results.filter(p => p.department_id === val);
      }
      if (cleanSql.includes('P.PUBLISH_YEAR = ?')) {
        const val = parseInt(params[paramIdx++]);
        results = results.filter(p => p.publish_year === val);
      }
      if (cleanSql.includes('P.TITLE_TH LIKE ?')) {
        const val = params[paramIdx];
        if (val) {
          const raw = val.replace(/%/g, '').toLowerCase();
          results = results.filter(p =>
            p.title_th.toLowerCase().includes(raw) ||
            (p.title_en && p.title_en.toLowerCase().includes(raw)) ||
            p.abstract_text.toLowerCase().includes(raw) ||
            p.keywords.toLowerCase().includes(raw) ||
            p.authors.toLowerCase().includes(raw)
          );
        }
      }

      return results;
    }

    if (cleanSql.includes('FROM USER_BOOKMARKS')) {
      const uId = params.length > 0 ? parseInt(params[0]) : null;
      let bms = memoryStore.user_bookmarks;
      if (uId) {
        bms = bms.filter(b => b.user_id === uId);
      }
      return bms.map(b => {
        const project = memoryStore.research_projects.find(p => p.project_id === b.project_id) || {};
        const faculty = project.faculty_id ? memoryStore.faculties.find(f => f.faculty_id === project.faculty_id) : null;
        const dept = project.department_id ? memoryStore.departments.find(d => d.department_id === project.department_id) : null;
        return {
          ...b,
          ...project,
          publish_year: project.publish_year || 2024,
          faculty_name: faculty ? faculty.faculty_name : 'คณะวิทยาศาสตร์และเทคโนโลยี',
          department_name: dept ? dept.department_name : 'สาขาวิชาวิทยาการคอมพิวเตอร์'
        };
      });
    }

    if (cleanSql.includes('FROM USER_LOGS')) {
      return [...memoryStore.user_logs];
    }

    if (cleanSql.includes('FROM RECOMMENDATION_CACHE')) {
      return [...memoryStore.recommendation_cache];
    }

    return [];
  }

  // INSERT queries
  if (cleanSql.startsWith('INSERT INTO USERS')) {
    const newUser = {
      user_id: memoryStore.users.length + 1,
      username: params[0],
      password_hash: params[1],
      full_name: params[2],
      email: params[3],
      role: params[4] || 'STUDENT',
      faculty_id: params[5] ? parseInt(params[5]) : null,
      department_id: params[6] ? parseInt(params[6]) : null,
      created_at: new Date()
    };
    memoryStore.users.push(newUser);
    saveStoreToDisk();
    return { insertId: newUser.user_id, affectedRows: 1 };
  }

  if (cleanSql.startsWith('INSERT INTO RESEARCH_PROJECTS')) {
    const newProject = {
      project_id: memoryStore.research_projects.length + 1,
      title_th: params[0],
      title_en: params[1] || '',
      abstract_text: params[2],
      keywords: params[3],
      authors: params[4],
      advisor_name: params[5],
      faculty_id: parseInt(params[6]),
      department_id: parseInt(params[7]),
      publish_year: parseInt(params[8]),
      project_type: params[9] || 'THESIS',
      pdf_file_path: params[10] || '/uploads/sample_paper_1.pdf',
      cover_image_path: params[11] || null,
      author_image_path: params[12] || null,
      status: 'APPROVED', // Instantly approved for immediate display on Home, Search & AI
      submitted_by: parseInt(params[13]) || 4,
      approved_by: 2,
      view_count: 0,
      download_count: 0,
      rejection_reason: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    memoryStore.research_projects.push(newProject);
    saveStoreToDisk();
    return { insertId: newProject.project_id, affectedRows: 1 };
  }

  if (cleanSql.startsWith('INSERT INTO USER_BOOKMARKS')) {
    const exists = memoryStore.user_bookmarks.some(b => b.user_id === parseInt(params[0]) && b.project_id === parseInt(params[1]));
    if (!exists) {
      memoryStore.user_bookmarks.push({
        bookmark_id: memoryStore.user_bookmarks.length + 1,
        user_id: parseInt(params[0]),
        project_id: parseInt(params[1]),
        created_at: new Date()
      });
      saveStoreToDisk();
    }
    return { affectedRows: 1 };
  }

  if (cleanSql.startsWith('INSERT INTO USER_LOGS')) {
    memoryStore.user_logs.push({
      log_id: memoryStore.user_logs.length + 1,
      user_id: parseInt(params[0]),
      action_type: params[1],
      search_keyword: params[2],
      project_id: params[3] ? parseInt(params[3]) : null,
      timestamp: new Date()
    });
    saveStoreToDisk();
    return { affectedRows: 1 };
  }

  // UPDATE queries
  if (cleanSql.startsWith('UPDATE RESEARCH_PROJECTS')) {
    if (cleanSql.includes('STATUS =')) {
      const status = params[0];
      const approved_by = params[1] ? parseInt(params[1]) : null;
      const reason = params[2];
      const projectId = parseInt(params[3]);
      const project = memoryStore.research_projects.find(p => p.project_id === projectId);
      if (project) {
        project.status = status;
        project.approved_by = approved_by;
        project.rejection_reason = reason;
        project.updated_at = new Date();
        saveStoreToDisk();
      }
      return { affectedRows: 1 };
    }
    if (cleanSql.includes('VIEW_COUNT = VIEW_COUNT + 1')) {
      const projectId = parseInt(params[0]);
      const project = memoryStore.research_projects.find(p => p.project_id === projectId);
      if (project) {
        project.view_count += 1;
        saveStoreToDisk();
      }
      return { affectedRows: 1 };
    }
    if (cleanSql.includes('DOWNLOAD_COUNT = DOWNLOAD_COUNT + 1')) {
      const projectId = parseInt(params[0]);
      const project = memoryStore.research_projects.find(p => p.project_id === projectId);
      if (project) {
        project.download_count += 1;
        saveStoreToDisk();
      }
      return { affectedRows: 1 };
    }
  }

  // DELETE queries
  if (cleanSql.startsWith('DELETE FROM USER_BOOKMARKS')) {
    const uId = parseInt(params[0]);
    const pId = parseInt(params[1]);
    memoryStore.user_bookmarks = memoryStore.user_bookmarks.filter(b => !(b.user_id === uId && b.project_id === pId));
    saveStoreToDisk();
    return { affectedRows: 1 };
  }

  return { affectedRows: 1 };
}

// Initialise DB pool asynchronously
initDB();

module.exports = {
  query,
  memoryStore,
  get isMemoryMode() {
    return useFallback;
  }
};
