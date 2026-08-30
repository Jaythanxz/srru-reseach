-- =====================================================================
-- Seed Data for SRRU Digital Research Repository
-- มหาวิทยาลัยราชภัฏสุรินทร์ (SRRU)
-- =====================================================================

USE srru_research_db;

-- 1. Insert Faculties (คณะ)
INSERT INTO faculties (faculty_id, faculty_name) VALUES
(1, 'คณะวิทยาศาสตร์และเทคโนโลยี'),
(2, 'คณะมนุษยศาสตร์และสังคมศาสตร์'),
(3, 'คณะวิทยาการจัดการ'),
(4, 'คณะครุศาสตร์'),
(5, 'คณะเทคโนโลยีอุตสาหกรรม'),
(6, 'คณะเกษตรและอุตสาหกรรมเกษตร'),
(7, 'บัณฑิตวิทยาลัย');

-- 2. Insert Departments (สาขาวิชา/ภาควิชา)
INSERT INTO departments (department_id, department_name, faculty_id) VALUES
(1, 'สาขาวิชาวิทยาการคอมพิวเตอร์', 1),
(2, 'สาขาวิชาเทคโนโลยีสารสนเทศและนวัตกรรมดิจิทัล', 1),
(3, 'สาขาวิชาวิทยาศาสตร์การกีฬาและสุขภาพ', 1),
(4, 'สาขาวิชารัฐประศาสนศาสตร์', 2),
(5, 'สาขาวิชานิติศาสตร์', 2),
(6, 'สาขาวิชาการพัฒนาชุมชน', 2),
(7, 'สาขาวิชาการจัดการธุรกิจและการเป็นผู้ประกอบการ', 3),
(8, 'สาขาวิชาการตลาดดิจิทัล', 3),
(9, 'สาขาวิชาการบัญชีและการเงิน', 3),
(10, 'สาขาวิชาคอมพิวเตอร์ศึกษา', 4),
(11, 'สาขาวิชาหลักสูตรและการสอน', 4),
(12, 'สาขาวิชาวิศวกรรมซอฟต์แวร์และการจัดการระบบอุตสาหกรรม', 5),
(13, 'สาขาวิชาเทคโนโลยีการเกษตรอัจฉริยะ', 6),
(14, 'หลักสูตรวิทยาศาสตรมหาบัณฑิต (วิจัยและนวัตกรรม)', 7);

-- 3. Insert Users (รหัสผ่านเริ่มต้น: password123 -> bcrypt hash: $2a$10$wE0v2FzQ1pB7tCgQ5N9aOuZqX9Hj0cT2GgR6Oq/k3L5Y6a7h.Q6m.)
-- แฮชตรงกับ bcrypt: "$2a$10$wT.fGZ8oZ/6l7P9rP2yZqeeV3uF5b5uT24h4U.R4c8mK4B6r6x8rW" หรือสร้างผ่าน Node runtime
INSERT INTO users (user_id, username, password_hash, full_name, email, role, faculty_id, department_id) VALUES
(1, 'admin', '$2a$10$3sF9hT6jT.pGZ8oZ6l7P9rP2yZqeeV3uF5b5uT24h4U.R4c8mK4B6', 'ผู้ดูแลระบบ SRRU', 'admin@srru.ac.th', 'ADMIN', 1, 1),
(2, 'teacher1', '$2a$10$3sF9hT6jT.pGZ8oZ6l7P9rP2yZqeeV3uF5b5uT24h4U.R4c8mK4B6', 'ผศ.ดร. ประเสริฐ สกุลดี', 'prasert.s@srru.ac.th', 'TEACHER', 1, 1),
(3, 'teacher2', '$2a$10$3sF9hT6jT.pGZ8oZ6l7P9rP2yZqeeV3uF5b5uT24h4U.R4c8mK4B6', 'รศ.ดร. ศิริพร วิมลชัย', 'siriporn.w@srru.ac.th', 'TEACHER', 3, 7),
(4, 'student1', '$2a$10$3sF9hT6jT.pGZ8oZ6l7P9rP2yZqeeV3uF5b5uT24h4U.R4c8mK4B6', 'นายสมชาย ใจดี', 'somchai.j@student.srru.ac.th', 'STUDENT', 1, 1),
(5, 'student2', '$2a$10$3sF9hT6jT.pGZ8oZ6l7P9rP2yZqeeV3uF5b5uT24h4U.R4c8mK4B6', 'นางสาวสุดา รักเรียน', 'suda.r@student.srru.ac.th', 'STUDENT', 1, 2),
(6, 'student3', '$2a$10$3sF9hT6jT.pGZ8oZ6l7P9rP2yZqeeV3uF5b5uT24h4U.R4c8mK4B6', 'นายวิชัย สุรินทร์กล้า', 'wichai.s@student.srru.ac.th', 'STUDENT', 3, 8);

-- 4. Insert Research Projects
INSERT INTO research_projects (
    project_id, title_th, title_en, abstract_text, keywords, authors, advisor_name,
    faculty_id, department_id, publish_year, pdf_file_path, status, submitted_by, approved_by,
    view_count, download_count, rejection_reason
) VALUES
(
    1,
    'การพัฒนาระบบแนะนำงานวิจัยอัจฉริยะด้วยการประมวลผลภาษาธรรมชาติภาษาไทยและการกรองแบบผสมผสาน',
    'Development of Intelligent Research Recommendation System using Thai Natural Language Processing and Hybrid Filtering',
    'งานวิจัยนี้นำเสนอการพัฒนาระบบคลังงานวิจัยดิจิทัลพร้อมระบบแนะนำอัจฉริยะที่ผสมผสานการประมวลผลภาษาธรรมชาติภาษาไทย (Thai NLP) ด้วยเทคนิค TF-IDF และการกรองข้อมูลแบบร่วมมือ (Collaborative Filtering) จากประวัติการเข้าใช้งานของผู้ใช้ เพื่อแก้ปัญหาการสืบค้นงานวิจัยเชิงรุกและการค้นพบองค์ความรู้ใหม่ ผลการประเมินพบว่าระบบมีความแม่นยำ (Precision) 0.86 และค่า F1-Score สูงกว่าระบบสืบค้นทั่วไปอย่างมีนัยสำคัญ',
    'การประมวลผลภาษาไทย, ระบบแนะนำ, TF-IDF, คลังงานวิจัย, การกรองแบบร่วมมือ',
    'สมชาย ใจดี, กิตติศักดิ์ พูลสวัสดิ์',
    'ผศ.ดร. ประเสริฐ สกุลดี',
    1, 1, 2024, '/uploads/sample_paper_1.pdf', 'APPROVED', 4, 2,
    342, 85, NULL
),
(
    2,
    'การประยุกต์ใช้การเรียนรู้เชิงลึกในการจำแนกโรคใบข้าวหอมมะลิสุรินทร์ผ่านโมบายแอปพลิเคชัน',
    'Application of Deep Learning for Surin Jasmine Rice Leaf Disease Classification via Mobile Application',
    'ข้าวหอมมะลิสุรินทร์เป็นพืชเศรษฐกิจสำคัญของจังหวัดสุรินทร์ งานวิจัยนี้จึงพัฒนาโมเดล Convolutional Neural Network (CNN) เพื่อตรวจจับและวินิจฉัยโรคใบข้าว เช่น โรคใบไหม้ โรคใบขีดสีน้ำตาล โดยสร้างชุดข้อมูลภาพถ่ายใบข้าวกว่า 5,000 ภาพ และประมวลผลผ่าน Mobile Application ที่เกษตรกรสามารถถ่ายภาพและรู้ผลได้ทันทีแบบเรียลไทม์ มีความแม่นยำในการจำแนกโรคถึง 94.5%',
    'การเรียนรู้เชิงลึก, โรคใบข้าว, ข้าวหอมมะลิสุรินทร์, ปัญญาประดิษฐ์ทางการเกษตร, CNN',
    'สุดา รักเรียน, ธวัชชัย มั่นคง',
    'ผศ.ดร. ประเสริฐ สกุลดี',
    1, 2, 2024, '/uploads/sample_paper_2.pdf', 'APPROVED', 5, 2,
    289, 64, NULL
),
(
    3,
    'กลยุทธ์การตลาดดิจิทัลและอีคอมเมิร์ซสำหรับสินค้าหัตถกรรมผ้าไหมสุรินทร์ในยุคเศรษฐกิจสร้างสรรค์',
    'Digital Marketing and E-Commerce Strategies for Surin Silk Handicrafts in Creative Economy Era',
    'วิทยานิพนธ์นี้ศึกษาพฤติกรรมผู้บริโภคและการวางกลยุทธ์การตลาดดิจิทัลบนแพลตฟอร์มโซเชียลคอมเมิร์ซสำหรับกลุ่มวิสาหกิจชุมชนทอผ้าไหมบ้านท่าสว่าง จังหวัดสุรินทร์ ผลการวิจัยชี้ให้เห็นว่าการเล่าเรื่อง (Storytelling) อัตลักษณ์ท้องถิ่นและการใช้ระบบถ่ายทอดสด (Live Commerce) ช่วยเพิ่มยอดขายได้มากกว่า 68% และสร้างความภักดีต่อแบรนด์สินค้าพื้นเมืองอย่างยั่งยืน',
    'การตลาดดิจิทัล, ผ้าไหมสุรินทร์, อีคอมเมิร์ซ, วิสาหกิจชุมชน, เศรษฐกิจสร้างสรรค์',
    'วิชัย สุรินทร์กล้า, อารยา สิทธิโชค',
    'รศ.ดร. ศิริพร วิมลชัย',
    3, 8, 2023, '/uploads/sample_paper_3.pdf', 'APPROVED', 6, 3,
    195, 42, NULL
),
(
    4,
    'การพัฒนาระบบสารสนเทศภูมิศาสตร์ (GIS) เพื่อการจัดการท่องเที่ยวเชิงวัฒนธรรมจังหวัดสุรินทร์',
    'Development of Geographic Information System (GIS) for Cultural Tourism Management in Surin Province',
    'งานวิจัยนี้นำเสนอการบูรณาการเทคโนโลยีสารสนเทศภูมิศาสตร์ (GIS) เว็บแอปพลิเคชัน และข้อมูลเปิดภาครัฐ เพื่อจัดทำแผนที่ดิจิทัลสำหรับแหล่งท่องเที่ยวทางวัฒนธรรม ปราสาทหินโบราณ และหมู่บ้านช้างสุรินทร์ พร้อมระบบวางแผนการเดินทางอัจฉริยะ (Route Optimization) สำหรับนักท่องเที่ยวทั้งชาวไทยและต่างชาติ',
    'ระบบสารสนเทศภูมิศาสตร์, การท่องเที่ยวเชิงวัฒนธรรม, จังหวัดสุรินทร์, แผนที่ดิจิทัล, เว็บแอปพลิเคชัน',
    'นภัสสร รุ่งเรือง, อนุชา สุขเกษม',
    'ผศ.ดร. ประเสริฐ สกุลดี',
    1, 2, 2023, '/uploads/sample_paper_4.pdf', 'APPROVED', 5, 2,
    158, 31, NULL
),
(
    5,
    'การพัฒนาบทเรียนคอมพิวเตอร์ช่วยสอนแบบจำลองสถานการณ์เสมือนจริงเพื่อเสริมสร้างทักษะการแก้ปัญหาทางการเขียนโปรแกรม',
    'Development of Simulation-Based Computer Assisted Instruction to Enhance Programming Problem Solving Skills',
    'งานวิจัยนี้มีวัตถุประสงค์เพื่อพัฒนาและประเมินประสิทธิภาพของบทเรียน CAI แบบ Virtual Simulation สำหรับนักศึกษาสาขาคอมพิวเตอร์ศึกษา มหาวิทยาลัยราชภัฏสุรินทร์ โดยเน้นการฝึกทักษะตรรกศาสตร์และการเขียนโค้ดภาษาไพธอน ผลการทดลองพบว่ากลุ่มตัวอย่างมีคะแนนผลสัมฤทธิ์ทางการเรียนหลังเรียนสูงกว่าก่อนเรียนอย่างมีนัยสำคัญทางสถิติที่ระดับ .01',
    'คอมพิวเตอร์ช่วยสอน, สถานการณ์จำลอง, การแก้ปัญหาทางการเขียนโปรแกรม, การศึกษาดิจิทัล',
    'ณัฐพล ศรีวิชัย, พิมพา แก้วมณี',
    'ผศ.ดร. ประเสริฐ สกุลดี',
    4, 10, 2024, '/uploads/sample_paper_5.pdf', 'APPROVED', 4, 2,
    120, 18, NULL
),
(
    6,
    'การประเมินผลสัมฤทธิ์ของนโยบายสวัสดิการชุมชนและการมีส่วนร่วมของประชาชนในเขตเทศบาลเมืองสุรินทร์',
    'Evaluation of Community Welfare Policy Effectiveness and Public Participation in Surin Town Municipality',
    'การศึกษานี้ใช้ระเบียบวิธีวิจัยแบบผสมผสานเพื่อประเมินความพึงพอใจและประสิทธิผลของกองทุนสวัสดิการชุมชน ผลการวิจัยสะท้อนว่าการมีส่วนร่วมของประชาชนในขั้นตอนการวางแผนและการตรวจสอบเป็นปัจจัยสำคัญที่สุดที่ส่งผลต่อความโปร่งใสและความยั่งยืนของโครงการพัฒนาท้องถิ่น',
    'นโยบายสวัสดิการ, การมีส่วนร่วมของประชาชน, รัฐประศาสนศาสตร์, การพัฒนาท้องถิ่น',
    'จันทิมา วรรณศิลป์',
    'รศ.ดร. ศิริพร วิมลชัย',
    2, 4, 2023, '/uploads/sample_paper_6.pdf', 'APPROVED', 6, 3,
    98, 14, NULL
),
(
    7,
    'ระบบตรวจวัดและควบคุมสภาพแวดล้อมโรงเรือนปลูกผักไฮโดรโปนิกส์อัตโนมัติด้วยเทคโนโลยี IoT',
    'Automated Environmental Monitoring and Control System for Hydroponic Greenhouses using IoT Technology',
    'โครงงานนี้ออกแบบและพัฒนาอุปกรณ์เซนเซอร์วัดค่าความเป็นกรด-ด่าง (pH), อุณหภูมิ, ความชื้น และค่าความนำไฟฟ้า (EC) ในสารละลายปุ๋ย พร้อมควบคุมการจ่ายน้ำและพัดลมระบายอากาศอัตโนมัติผ่าน NodeMCU ESP32 และเชื่อมต่อแดชบอร์ดแสดงผลผ่านสมาร์ตโฟน',
    'อินเทอร์เน็ตของสรรพสิ่ง, IoT, โรงเรือนอัจฉริยะ, ไฮโดรโปนิกส์, เซนเซอร์',
    'ธนกฤต มณีรัตน์, วรภพ บุญส่ง',
    'ผศ.ดร. ประเสริฐ สกุลดี',
    5, 12, 2024, '/uploads/sample_paper_7.pdf', 'PENDING', 4, NULL,
    45, 0, NULL
);

-- 5. Insert Bookmarks
INSERT INTO user_bookmarks (user_id, project_id) VALUES
(4, 1),
(4, 2),
(4, 4),
(5, 2),
(5, 1),
(6, 3),
(6, 1);

-- 6. Insert User Logs (Activity History for Collaborative Filtering)
INSERT INTO user_logs (user_id, action_type, search_keyword, project_id, timestamp) VALUES
(4, 'SEARCH', 'ระบบแนะนำ ภาษาไทย', NULL, NOW() - INTERVAL 5 DAY),
(4, 'VIEW', NULL, 1, NOW() - INTERVAL 5 DAY),
(4, 'BOOKMARK', NULL, 1, NOW() - INTERVAL 5 DAY),
(4, 'DOWNLOAD', NULL, 1, NOW() - INTERVAL 5 DAY),
(4, 'VIEW', NULL, 2, NOW() - INTERVAL 4 DAY),
(4, 'BOOKMARK', NULL, 2, NOW() - INTERVAL 4 DAY),
(5, 'SEARCH', 'การเรียนรู้เชิงลึก ข้าวหอมมะลิ', NULL, NOW() - INTERVAL 3 DAY),
(5, 'VIEW', NULL, 2, NOW() - INTERVAL 3 DAY),
(5, 'DOWNLOAD', NULL, 2, NOW() - INTERVAL 3 DAY),
(5, 'VIEW', NULL, 1, NOW() - INTERVAL 2 DAY),
(6, 'SEARCH', 'การตลาด ผ้าไหม สุรินทร์', NULL, NOW() - INTERVAL 3 DAY),
(6, 'VIEW', NULL, 3, NOW() - INTERVAL 3 DAY),
(6, 'DOWNLOAD', NULL, 3, NOW() - INTERVAL 2 DAY),
(6, 'VIEW', NULL, 1, NOW() - INTERVAL 1 DAY);

-- 7. Insert Initial Recommendation Cache
INSERT INTO recommendation_cache (user_id, recommended_project_id, score, algorithm_type) VALUES
(4, 2, 0.892, 'HYBRID'),
(4, 5, 0.745, 'HYBRID'),
(4, 4, 0.680, 'HYBRID'),
(5, 1, 0.910, 'HYBRID'),
(5, 7, 0.720, 'HYBRID'),
(6, 4, 0.765, 'HYBRID');
