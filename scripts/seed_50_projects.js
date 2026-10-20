const fs = require('fs');
const path = require('path');

const storePath = path.resolve(__dirname, '../server/uploads/srru_db_store.json');
const seedSqlPath = path.resolve(__dirname, '../database/seed.sql');

const existingStore = JSON.parse(fs.readFileSync(storePath, 'utf8'));
const currentProjects = existingStore.research_projects || [];
const startId = currentProjects.length > 0 ? Math.max(...currentProjects.map(p => p.project_id)) + 1 : 10;

console.log(`Starting to generate from project_id: ${startId}`);

// 52 diverse, realistic SRRU research topics covering all 7 faculties
const projectTemplates = [
  // Faculty 1: Science & Tech (Dept 1: CS, Dept 2: IT, Dept 3: Sports Sci)
  {
    title_th: "การประยุกต์ใช้โมเดล Vision Transformer ในการตรวจจับโรคใบไหม้ของข้าวหอมมะลิทุ่งกุลาร้องไห้",
    title_en: "Application of Vision Transformer Model for Blast Disease Detection in Thung Kula Jasmine Rice",
    abstract_th: "งานวิจัยนี้นำเสนอการประยุกต์ใช้สถาปัตยกรรม Vision Transformer (ViT) เพื่อจำแนกและตรวจจับโรคใบไหม้และโรคขอบใบแห้งในแปลงปลูกข้าวหอมมะลิอินทรีย์จังหวัดสุรินทร์ โดยรวบรวมภาพถ่ายโดรนความละเอียดสูงจำนวน 4,500 ภาพ แบบจำลองให้ค่าความแม่นยำ F1-Score 0.94 และสามารถส่งสัญญาณเตือนผ่านไลน์แก่เกษตรกรได้แบบเรียลไทม์",
    keywords: "Vision Transformer, ข้าวหอมมะลิ, โรคใบไหม้, การเรียนรู้เชิงลึก, โดรนเกษตร, สุรินทร์",
    authors: "อานนท์ บุญมี, กิตติยา ศรีวิไล",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 1, department_id: 1, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "ระบบแนะนำแผนการเรียนเฉพาะบุคคลด้วยขั้นตอนวิธี Graph Neural Network สำหรับนักศึกษาวิทยาการคอมพิวเตอร์",
    title_en: "Personalized Learning Path Recommendation using Graph Neural Networks for Computer Science Undergraduates",
    abstract_th: "โครงงานนี้นำเสนอระบบแนะนำรายวิชาเลือกและเส้นทางอาชีพตามความถนัดของผู้เรียน โดยแปลงโครงสร้างหลักสูตรและผลการเรียนเป็นกราฟความรู้ (Curriculum Knowledge Graph) และประมวลผลด้วย Graph Convolutional Networks (GCN) ช่วยให้นักศึกษาสามารถวางแผนการลงทะเบียนเรียนที่สอดคล้องกับตำแหน่งงานในอุตสาหกรรมซอฟต์แวร์",
    keywords: "Graph Neural Network, แผนการเรียนเฉพาะบุคคล, กราฟความรู้, วิทยาการคอมพิวเตอร์, ระบบแนะนำ",
    authors: "ภาณุวัฒน์ สุขเกษม, ธนกร วงศ์ษา",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 1, department_id: 1, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การสืบค้นและจับคู่ลายผ้าไหมมัดหมี่สุรินทร์ด้วยโครงข่ายประสาทเทียมแบบคอนโวลูชันชนิดหลายระดับ",
    title_en: "Surin Mudmee Silk Pattern Retrieval and Matching using Multi-Scale Convolutional Neural Networks",
    abstract_th: "งานวิจัยนี้พัฒนาระบบสืบค้นภาพลวดลายผ้าไหมมัดหมี่โบราณของจังหวัดสุรินทร์ เช่น ลายโฮล ลายอัมปรม และลายอันลูญซีม โดยใช้เทคนิค Multi-scale Feature Pyramid Network เพื่อให้ระบบสามารถจำแนกลายผ้าได้อย่างแม่นยำแม้ภาพถ่ายจะมีความเอียงหรือแสงเงาไม่สม่ำเสมอ ความถูกต้องในการจับคู่อยู่ที่ 92.4%",
    keywords: "ผ้าไหมสุรินทร์, มัดหมี่, ลายโฮล, การจำแนกภาพ, CNN, มรดกภูมิปัญญา",
    authors: "จินตนา แก้วมณี, ปวีณา มงคล",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 1, department_id: 2, year: 2023, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "แพลตฟอร์มคลาวด์เนทีฟสำหรับตรวจวัดและแจ้งเตือนมลพิษทางอากาศ PM 2.5 ในพื้นที่โรงพยาบาลและสถานศึกษา",
    title_en: "Cloud-Native Platform for PM2.5 Air Pollution Monitoring and Alerting in Hospitals and Educational Institutions",
    abstract_th: "การศึกษานี้ได้ออกแบบสถาปัตยกรรมไมโครเซอร์วิสบน Kubernetes เพื่อเชื่อมโยงโครงข่ายเซนเซอร์ IoT วัดฝุ่นละอองขนาดเล็ก PM2.5 และสารประกอบอินทรีย์ระเหยง่าย (VOCs) ติดตั้งตามจุดสำคัญ 20 แห่งทั่วมหาวิทยาลัยราชภัฏสุรินทร์ สามารถประมวลผลข้อมูลสตรีมมิ่งและพยากรณ์ล่วงหน้า 3 ชั่วโมงด้วยโมเดล LSTM",
    keywords: "PM2.5, IoT, คลาวด์เนทีฟ, ไมโครเซอร์วิส, LSTM, คุณภาพอากาศ",
    authors: "วีรภัทร ชาญชัย",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 1, department_id: 2, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การวิเคราะห์ชีวกลศาสตร์ของการเตะลูกตระกร้อด้วยระบบตรวจจับการเคลื่อนไหวสามมิติและการประเมินความเสี่ยงต่อการบาดเจ็บ",
    title_en: "Biomechanical Analysis of Sepak Takraw Spiking using 3D Motion Capture and Injury Risk Assessment",
    abstract_th: "งานวิจัยนี้ใช้กล้องตรวจจับการเคลื่อนไหวความเร็วสูง 8 ตัว และแผ่นวัดแรงกดในการวิเคราะห์การเตะท่าซันแบ็กและท่าโรลสไปก์ของนักกีฬามหาวิทยาลัย ผลการวิจัยพบว่ามุมบิดของข้อเข่าและแรงกระแทกขณะลงสู่พื้นมีความสัมพันธ์อย่างมีนัยสำคัญกับโอกาสเอ็นไขว้หน้าฉีกขาด จึงได้นำเสนอโปรแกรมฝึกกล้ามเนื้อเพื่อลดการบาดเจ็บ",
    keywords: "ชีวกลศาสตร์, ตะกร้อ, การเคลื่อนไหวสามมิติ, การบาดเจ็บทางการกีฬา, วิทยาศาสตร์การกีฬา",
    authors: "วรวุฒิ สมบูรณ์, ธีรเทพ พิทักษ์",
    advisor: "ดร. กานต์ นิธิรักษ์",
    faculty_id: 1, department_id: 3, year: 2023, type: "RESEARCH_ARTICLE", status: "APPROVED"
  },
  {
    title_th: "ผลของการฝึกพลังกล้ามเนื้อแบบคอมเพล็กซ์ที่มีต่อความคล่องแคล่วว่องไวของนักกีฬาฟุตซอลเยาวชนจังหวัดสุรินทร์",
    title_en: "Effects of Complex Training on Agility in Youth Futsal Players in Surin Province",
    abstract_th: "การศึกษาผลของการฝึกผสมผสานระหว่างเวทเทรนนิ่งหนักร่วมกับการฝึกพลัยโอเมตริกซ์ในนักกีฬาฟุตซอลอายุ 16-18 ปี จำนวน 30 คน เป็นเวลา 8 สัปดาห์ ผลการทดลองชี้ว่ากลุ่มทดลองมีเวลาทดสอบ Illinois Agility Test ดีขึ้นกว่ากลุ่มควบคุม 8.7% อย่างมีนัยสำคัญทางสถิติ (p < 0.05)",
    keywords: "การฝึกแบบคอมเพล็กซ์, พลัยโอเมตริกซ์, ฟุตซอล, ความคล่องแคล่วว่องไว, สมรรถภาพทางกาย",
    authors: "ปิยะพงษ์ ดวงแก้ว",
    advisor: "ดร. กานต์ นิธิรักษ์",
    faculty_id: 1, department_id: 3, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },

  // Faculty 2: Humanities & Social Sciences (Dept 4: Public Admin, Dept 5: Law, Dept 6: Community Dev)
  {
    title_th: "การประเมินผลสัมฤทธิ์นโยบายการจัดการท่องเที่ยวเชิงวัฒนธรรมกลุ่มชาติพันธุ์กูยและเขมรในจังหวัดสุรินทร์",
    title_en: "Policy Implementation Assessment of Cultural Tourism Management among Kui and Khmer Ethnic Groups in Surin",
    abstract_th: "การวิจัยเชิงประเมินเพื่อศึกษากลไกการมีส่วนร่วมของชุมชนท้องถิ่นในการบริหารจัดการการท่องเที่ยวเชิงวัฒนธรรม วิเคราะห์ผ่านกรอบแนวคิด CIPP Model เก็บข้อมูลจากผู้นำชุมชน ผู้ประกอบการ และนักท่องเที่ยวจำนวน 400 คน ข้อเสนอแนะเชิงนโยบายมุ่งเน้นการบูรณาการงบประมาณระหว่าง อปท. และการอนุรักษ์ภาษาถิ่น",
    keywords: "นโยบายสาธารณะ, ชาติพันธุ์กูย, ชาติพันธุ์เขมร, การท่องเที่ยวเชิงวัฒนธรรม, สุรินทร์, CIPP Model",
    authors: "รัตนาภรณ์ ศรีสุข",
    advisor: "รศ.ดร. สมเกียรติ สว่างวงศ์",
    faculty_id: 2, department_id: 4, year: 2023, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "การพัฒนารูปแบบการบริการสาธารณะดิจิทัลขององค์กรปกครองส่วนท้องถิ่นเพื่อรองรับสังคมผู้สูงอายุในชนบท",
    title_en: "Development of Digital Public Service Delivery Models by Local Administrative Organizations for Rural Aging Society",
    abstract_th: "การวิจัยเชิงปฏิบัติการแบบมีส่วนร่วมในการออกแบบระบบขอรับเบี้ยยังชีพและการแพทย์ทางไกลระดับตำบลสำหรับ อบต. ในจังหวัดสุรินทร์ 5 แห่ง โดยใช้แอปพลิเคชัน Line Official และอาสาสมัครสาธารณสุขประจำหมู่บ้าน (อสม.) เป็นสะพานดิจิทัล พบว่าความพึงพอใจของประชาชนสูงขึ้นถึง 89%",
    keywords: "บริการสาธารณะดิจิทัล, องค์กรปกครองส่วนท้องถิ่น, สังคมผู้สูงอายุ, อสม., รัฐประศาสนศาสตร์",
    authors: "ชัยวัฒน์ บุญครอง, สุพรรณี นามวงศ์",
    advisor: "รศ.ดร. สมเกียรติ สว่างวงศ์",
    faculty_id: 2, department_id: 4, year: 2024, type: "RESEARCH_REPORT", status: "APPROVED"
  },
  {
    title_th: "มาตรการทางกฎหมายในการคุ้มครองสิ่งบ่งชี้ทางภูมิศาสตร์: ศึกษากรณีข้าวหอมมะลิสุรินทร์และผ้าไหมมัดหมี่",
    title_en: "Legal Measures for Geographical Indication Protection: Case Study of Surin Jasmine Rice and Mudmee Silk",
    abstract_th: "วิทยานิพนธ์ฉบับนี้ศึกษาปัญหาอุปสรรคในการบังคับใช้พระราชบัญญัติคุ้มครองสิ่งบ่งชี้ทางภูมิศาสตร์ พ.ศ. 2546 ต่อการปลอมปนข้าวหอมมะลิและการละเมิดตราสัญลักษณ์ GI สุรินทร์ เสนอแนะให้มีการจัดตั้งคณะกรรมการตรวจประเมินย้อนกลับด้วยเทคโนโลยีบล็อกเชนและการปรับปรุงบทลงโทษทางแพ่ง",
    keywords: "สิ่งบ่งชี้ทางภูมิศาสตร์, GI, ข้าวหอมมะลิสุรินทร์, ทรัพย์สินทางปัญญา, กฎหมายคุ้มครองผู้บริโภค",
    authors: "ศิวกร พิชิตชัย",
    advisor: "ผศ. พิพัฒน์ ศิริธรรม",
    faculty_id: 2, department_id: 5, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "ปัญหาทางกฎหมายเกี่ยวกับการจัดการป่าชุมชนและการใช้ประโยชน์จากทรัพยากรธรรมชาติอย่างยั่งยืนในเขตอีสานใต้",
    title_en: "Legal Issues on Community Forest Management and Sustainable Natural Resource Utilization in Lower Isan",
    abstract_th: "การวิเคราะห์สิทธิชุมชนตาม พ.ร.บ. ป่าชุมชน พ.ศ. 2562 เปรียบเทียบกับวิถีชีวิตดั้งเดิมในการเก็บหาของป่าของชาวบ้านรอบแนวเทือกเขาพนมดงรัก เสนอแนะแนวทางการกำหนดข้อบัญญัติท้องถิ่นเพื่อสร้างความสมดุลระหว่างการอนุรักษ์พื้นที่ต้นน้ำกับการดำรงชีพของราษฎร",
    keywords: "ป่าชุมชน, สิทธิชุมชน, พนมดงรัก, กฎหมายสิ่งแวดล้อม, ทรัพยากรธรรมชาติ",
    authors: "กิตติพงศ์ มงคลชัย",
    advisor: "ผศ. พิพัฒน์ ศิริธรรม",
    faculty_id: 2, department_id: 5, year: 2023, type: "INDEPENDENT_STUDY", status: "APPROVED"
  },
  {
    title_th: "การเสริมสร้างทุนทางสังคมเพื่อความเข้มแข็งของกลุ่มวิสาหกิจชุมชนทอผ้าไหมบ้านท่าสว่าง จังหวัดสุรินทร์",
    title_en: "Strengthening Social Capital for Community Enterprise Resilience in Ban Tha Sawang Silk Weaving, Surin",
    abstract_th: "งานวิจัยนี้ศึกษาการประยุกต์ใช้แนวคิดทุนทางสังคม (Social Capital) 3 มิติ ได้แก่ ความไว้วางใจ เครือข่ายความร่วมมือ และบรรทัดฐานทางวัฒนธรรม ในการฟื้นฟูกลุ่มทอผ้ายกทองโบราณหลังวิกฤตเศรษฐกิจ ส่งผลให้กลุ่มสามารถสร้างช่องทางการจำหน่ายแบบสัจจะออมทรัพย์และรักษาเอกลักษณ์การย้อมสีธรรมชาติไว้ได้",
    keywords: "ทุนทางสังคม, บ้านท่าสว่าง, วิสาหกิจชุมชน, ผ้ายกทอง, การพัฒนาชุมชน, สุรินทร์",
    authors: "มณีรัตน์ วงศ์สวรรค์",
    advisor: "ดร. นันทวัน เกษมสุข",
    faculty_id: 2, department_id: 6, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "กระบวนการฟื้นฟูภูมิปัญญาหมอยาพื้นบ้านและการอนุรักษ์สมุนไพรในป่าชุมชนดงมัน อำเภอเมือง จังหวัดสุรินทร์",
    title_en: "Revitalization Process of Indigenous Herbal Healers and Medicinal Plant Conservation in Dong Man Community Forest",
    abstract_th: "การวิจัยเชิงคุณภาพเพื่อรวบรวมและถอดรหัสตำรับยาสมุนไพรรักษาโรคเรื้อรังจากหมอยาพื้นบ้าน 12 ท่าน พร้อมจัดทำฐานข้อมูลพิกัดดาวเทียมของพืชสมุนไพรหายาก 85 ชนิดในป่าดงมัน และสร้างหลักสูตรท้องถิ่นถ่ายทอดสู่เยาวชนในโรงเรียนชุมชน",
    keywords: "หมอยาพื้นบ้าน, สมุนไพร, ป่าดงมัน, ภูมิปัญญาท้องถิ่น, การอนุรักษ์, สุรินทร์",
    authors: "อุษา แจ่มใส, ภัทรพล ทวีโชค",
    advisor: "ดร. นันทวัน เกษมสุข",
    faculty_id: 2, department_id: 6, year: 2023, type: "RESEARCH_REPORT", status: "APPROVED"
  },

  // Faculty 3: Management Sciences (Dept 7: Business Mgmt, Dept 8: Digital Mkt, Dept 9: Accounting & Finance)
  {
    title_th: "กลยุทธ์การปรับตัวและการสร้างความยืดหยุ่นทางธุรกิจของผู้ประกอบการโรงแรมและโฮมสเตย์ในเมืองรอง: ศึกษากรณีจังหวัดสุรินทร์",
    title_en: "Business Adaptation and Resilience Strategies of Hotel and Homestay Entrepreneurs in Secondary Cities: A Case of Surin",
    abstract_th: "การวิจัยเพื่อพัฒนากลยุทธ์ความยืดหยุ่นของธุรกิจที่พักในสุรินทร์หลังสถานการณ์โควิด-19 โดยใช้การวิเคราะห์แบบ PLS-SEM จากกลุ่มตัวอย่าง 220 กิจการ ผลวิจัยพบว่าภาวะผู้นำเชิงนวัตกรรมและการใช้แพลตฟอร์มการตลาดดิจิทัลมีอิทธิพลทางตรงเชิงบวกสูงสุดต่อความอยู่รอดและความสามารถในการทำกำไร",
    keywords: "ความยืดหยุ่นทางธุรกิจ, การท่องเที่ยวเมืองรอง, โฮมสเตย์, สุรินทร์, การจัดการธุรกิจ",
    authors: "ณัฐพงษ์ ศรีสุวรรณ",
    advisor: "รศ.ดร. ศิริพร วิมลชัย",
    faculty_id: 3, department_id: 7, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "ปัจจัยที่ส่งผลต่อการยอมรับและการใช้ระบบบริหารจัดการห่วงโซ่อุปทานอัจฉริยะในโรงสีข้าวสหกรณ์การเกษตร",
    title_en: "Factors Influencing the Adoption of Smart Supply Chain Management Systems in Agricultural Cooperative Rice Mills",
    abstract_th: "การประยุกต์ใช้ทฤษฎี UTAUT2 ในการสำรวจปัจจัยกำหนดพฤติกรรมการใช้ระบบ ERP และเซนเซอร์วัดความชื้นอัตโนมัติในสหกรณ์การเกษตรเพื่อการตลาดลูกค้า ธ.ก.ส. (สกต.) สุรินทร์ พบว่าความคาดหวังในประสิทธิภาพและสภาพแวดล้อมที่เอื้ออำนวยมีอิทธิพลอย่างมีนัยสำคัญต่อการตัดสินใจลงทุนของคณะกรรมการ",
    keywords: "ห่วงโซ่อุปทาน, สหกรณ์การเกษตร, โรงสีข้าว, UTAUT2, การจัดการโลจิสติกส์",
    authors: "กมลวรรณ ทวีทรัพย์",
    advisor: "รศ.ดร. ศิริพร วิมลชัย",
    faculty_id: 3, department_id: 7, year: 2023, type: "INDEPENDENT_STUDY", status: "APPROVED"
  },
  {
    title_th: "อิทธิพลของคอนเทนต์วิดีโอสั้นบน TikTok และ Live Streaming ต่อพฤติกรรมการตัดสินใจซื้อสินค้าของฝาก OTOP จังหวัดสุรินทร์",
    title_en: "Influence of TikTok Short Video Content and Live Streaming on OTOP Souvenir Purchasing Decisions in Surin",
    abstract_th: "การศึกษาวิจัยเชิงปริมาณจากกลุ่มผู้บริโภคทั่วประเทศ 420 คนที่เคยซื้อสินค้า OTOP สุรินทร์ เช่น กุนเชียง หมูหยอง และข้าวหอมมะลิ ผลการวิเคราะห์การถดถอยพหุคูณพบว่า ความจริงใจของครีเอเตอร์ (Authenticity) และการสาธิตกระบวนการผลิตแบบเรียลไทม์ ส่งผลต่อความตั้งใจซื้อซ้ำมากที่สุด",
    keywords: "TikTok, ไลฟ์สตรีมมิง, สินค้า OTOP, การตลาดดิจิทัล, การตัดสินใจซื้อ, กุนเชียงสุรินทร์",
    authors: "วิชัย สุรินทร์กล้า, กานดา เพชรดี",
    advisor: "ผศ. ดาราวรรณ สังข์ทอง",
    faculty_id: 3, department_id: 8, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การพัฒนากลยุทธ์การตลาดเนื้อหา (Content Marketing) เพื่อยกระดับภาพลักษณ์งานแสดงช้างสุรินทร์สู่สายตานานาชาติ",
    title_en: "Development of Content Marketing Strategies to Elevate the International Brand Image of the Surin Elephant Round-up",
    abstract_th: "งานวิจัยนี้ใช้ระเบียบวิธีผสมในการวิเคราะห์ความคิดเห็นของนักท่องเที่ยวต่างชาติต่องานมหัศจรรย์งานช้างสุรินทร์ผ่าน Social Listening Tool บนแพลตฟอร์ม X และ Tripadvisor นำเสนอโมเดล Storytelling เน้นย้ำความผูกพันเชิงชาติพันธุ์ระหว่างชาวกูยกับช้าง มากกว่าการแสดงเชิงพาณิชย์",
    keywords: "งานช้างสุรินทร์, การตลาดเนื้อหา, การสร้างแบรนด์เมือง, การท่องเที่ยวเชิงวัฒนธรรม, ชาวกูย",
    authors: "ธนาธิป สุวรรณโคตร",
    advisor: "ผศ. ดาราวรรณ สังข์ทอง",
    faculty_id: 3, department_id: 8, year: 2023, type: "RESEARCH_ARTICLE", status: "APPROVED"
  },
  {
    title_th: "การออกแบบระบบบัญชีต้นทุนฐานกิจกรรม (Activity-Based Costing) สำหรับฟาร์มเลี้ยงโคเนื้อวากิวสุรินทร์",
    title_en: "Design of Activity-Based Costing System for Surin Wagyu Beef Cattle Farms",
    abstract_th: "โครงงานนี้ศึกษากระบวนการเลี้ยงและการแปรรูปโคเนื้อลูกผสมวากิวสุรินทร์ เพื่อจัดสรรต้นทุนค่าอาหาร การดูแลสุขภาพ และการขุนเนื้อลายหินอ่อนได้อย่างแม่นยำ ช่วยลดความคลาดเคลื่อนของการคิดต้นทุนแบบเดิมได้ 14.3% และเพิ่มอัตรากำไรสุทธิต่อตัวได้อย่างมีประสิทธิภาพ",
    keywords: "ต้นทุนฐานกิจกรรม, โคขุนวากิว, เกษตรปศุสัตว์, การบัญชีต้นทุน, สุรินทร์",
    authors: "สุดารัตน์ พูลผล, วีระยุทธ พงษ์เพชร",
    advisor: "ดร. อัมพร จิตเจริญ",
    faculty_id: 3, department_id: 9, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "ปัจจัยที่ส่งผลต่อประสิทธิภาพการควบคุมภายในทางการเงินของวิสาหกิจขนาดกลางและขนาดย่อมในกลุ่มจังหวัดอีสานใต้",
    title_en: "Factors Affecting Financial Internal Control Effectiveness in SMEs within the Lower Northeastern Provincial Cluster",
    abstract_th: "การสำรวจผู้จัดการฝ่ายบัญชีและเจ้าของกิจการ SMEs 180 แห่งในสุรินทร์ บุรีรัมย์ และศรีสะเกษ โดยใช้กรอบแนวคิด COSO Internal Control Framework ผลการทดสอบสมมติฐานชี้ให้เห็นว่า สภาพแวดล้อมการควบคุมและการประเมินความเสี่ยงด้านไซเบอร์มีความสัมพันธ์เชิงบวกต่อความน่าเชื่อถือของรายงานทางการเงิน",
    keywords: "การควบคุมภายใน, COSO, SMEs, รายงานทางการเงิน, อีสานใต้, การตรวจสอบบัญชี",
    authors: "พิชชาภา อินทร์แปลง",
    advisor: "ดร. อัมพร จิตเจริญ",
    faculty_id: 3, department_id: 9, year: 2023, type: "THESIS", status: "APPROVED"
  },

  // Faculty 4: Education (Dept 10: Comp Ed, Dept 11: Curriculum & Instruction)
  {
    title_th: "การพัฒนาบทเรียนเสมือนจริงแบบปฏิสัมพันธ์ (Interactive VR) เพื่อส่งเสริมการคิดเชิงคำนวณสำหรับนักเรียนมัธยมศึกษาตอนต้น",
    title_en: "Development of Interactive Virtual Reality Lessons to Promote Computational Thinking for Junior High School Students",
    abstract_th: "งานวิจัยนี้พัฒนาสื่อการเรียนรู้ VR เรื่องการแก้ปัญหาด้วยอัลกอริทึม ทดลองใช้กับนักเรียนชั้น ม.2 โรงเรียนสังกัด สพม.สุรินทร์ จำนวน 65 คน ผลการวิจัยพบว่าทักษะการคิดเชิงคำนวณและผลสัมฤทธิ์ทางการเรียนหลังเรียนสูงกว่าก่อนเรียนอย่างมีนัยสำคัญทางสถิติที่ระดับ .01 และนักเรียนมีความพึงพอใจในระดับมากที่สุด",
    keywords: "ความจริงเสมือน, VR, การคิดเชิงคำนวณ, คอมพิวเตอร์ศึกษา, นวัตกรรมการศึกษา, สพม.สุรินทร์",
    authors: "ทรงพล ประเสริฐยิ่ง, อภิสิทธิ์ ชัยชนะ",
    advisor: "ผศ.ดร. นิตยา ทรงธรรม",
    faculty_id: 4, department_id: 10, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "ผลของการจัดการเรียนรู้แบบผสมผสานโดยใช้โครงงานเป็นฐานร่วมกับ Gamification ในรายวิชาวิทยาการคำนวณ",
    title_en: "Effects of Project-Based Blended Learning with Gamification in Computing Science Subject",
    abstract_th: "การศึกษาผลของการใช้ระบบสะสมแต้ม แบดจ์ และลีดเดอร์บอร์ดร่วมกับการทำโครงงาน IoT สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 4 ผลการวิจัยพบว่านักเรียนมีพฤติกรรมการมีส่วนร่วมในการเรียน (Learning Engagement) สูงขึ้นอย่างเด่นชัด และโครงงานที่พัฒนาขึ้นสามารถนำไปใช้แก้ปัญหาขยะในโรงเรียนได้จริง",
    keywords: "Gamification, การเรียนรู้แบบโครงงาน, วิทยาการคำนวณ, การเรียนรู้แบบผสมผสาน, นักเรียนมัธยม",
    authors: "ชลธิชา สมสุข",
    advisor: "ผศ.ดร. นิตยา ทรงธรรม",
    faculty_id: 4, department_id: 10, year: 2023, type: "RESEARCH_ARTICLE", status: "APPROVED"
  },
  {
    title_th: "การพัฒนาหลักสูตรท้องถิ่นบูรณาการสะเต็มศึกษา (STEM) ตามบริบทภูมิปัญญาการทำเครื่องเงินเขวาสินรินทร์",
    title_en: "Development of a STEM-Integrated Local Curriculum Based on Khwao Sinarin Silver Handicraft Wisdom",
    abstract_th: "วิทยานิพนธ์นี้สร้างหลักสูตรท้องถิ่นที่เชื่อมโยงวิชาเคมี (การหลอมและการเกิดปฏิกิริยาของเงิน), คณิตศาสตร์ (สัดส่วนและเรขาคณิตของลูกปะเกือม) และศิลปะเข้าด้วยกัน ทดลองใช้กับนักเรียนมัธยมศึกษาตอนปลาย ผลการประเมินพบว่านักเรียนมีความตระหนักในคุณค่ามรดกทางวัฒนธรรมและสามารถสร้างสรรค์ผลงานเชิงนวัตกรรมได้",
    keywords: "สะเต็มศึกษา, STEM, เครื่องเงินเขวาสินรินทร์, ลูกปะเกือม, หลักสูตรท้องถิ่น, สุรินทร์",
    authors: "ปิยะนุช สุวรรณมาลี",
    advisor: "รศ.ดร. จินตนา รัตนโชติ",
    faculty_id: 4, department_id: 11, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "การพัฒนารูปแบบการสอนภาษาไทยเพื่อการสื่อสารข้ามวัฒนธรรมสำหรับผู้เรียนในพื้นที่ชายแดนไทย-กัมพูชา",
    title_en: "Development of Thai Instructional Model for Cross-Cultural Communication for Learners in Thai-Cambodian Border Areas",
    abstract_th: "การวิจัยและพัฒนารูปแบบการสอนภาษาไทยสำหรับนักเรียนระดับประถมศึกษาในเขตอำเภอกาบเชิงและพนมดงรักที่ใช้ภาษาเขมรถิ่นไทยเป็นภาษาแม่ ผลการทดลองพบว่ารูปแบบการสอนที่เน้นการใช้สื่อสองภาษาและการเรียนรู้เชิงรุก ช่วยลดอัตราการอ่านไม่ออกเขียนไม่ได้ลงได้ 38.5%",
    keywords: "การสอนภาษาไทย, ชายแดนไทย-กัมพูชา, สื่อสารข้ามวัฒนธรรม, ภาษาเขมร, การศึกษาพหุวัฒนธรรม",
    authors: "วาสนา โพธิ์ทอง",
    advisor: "รศ.ดร. จินตนา รัตนโชติ",
    faculty_id: 4, department_id: 11, year: 2023, type: "RESEARCH_REPORT", status: "APPROVED"
  },

  // Faculty 5: Industrial Tech (Dept 12: Software Eng & Industrial Mgmt)
  {
    title_th: "ระบบบริหารจัดการคลังสินค้าและสายการผลิตอัจฉริยะสำหรับโรงงานแปรรูปแป้งมันสำปะหลังด้วยเทคโนโลยี RFID และ IIoT",
    title_en: "Smart Warehouse and Production Line Management System for Cassava Starch Processing Plants using RFID and IIoT",
    abstract_th: "โครงงานนี้นำเสนอการออกแบบและติดตั้งระบบ Industrial IoT เพื่อตรวจติดตามอัตราการไหลของมันสำปะหลัง ความชื้น และน้ำหนักบรรทุกในคลังสินค้าแบบเรียลไทม์ เชื่อมโยงแท็ก RFID ระบุตำแหน่งพาเลท ลดเวลาในการค้นหาสินค้าลง 60% และลดของเสียในกระบวนการผลิตได้อย่างมีนัยสำคัญ",
    keywords: "IIoT, RFID, คลังสินค้าอัจฉริยะ, แป้งมันสำปะหลัง, การจัดการอุตสาหกรรม, ระบบอัตโนมัติ",
    authors: "เอกภพ กุลวงศ์, สรรเสริญ มุ่งหมาย",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 5, department_id: 12, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การเพิ่มประสิทธิภาพระบบผลิตพลังงานไฟฟ้าเซลล์แสงอาทิตย์บนทุ่นลอยน้ำ (Floating Solar) ในอ่างเก็บน้ำห้วยเสนง",
    title_en: "Efficiency Enhancement of Floating Photovoltaic System at Huai Saneng Reservoir, Surin",
    abstract_th: "การศึกษาวิจัยเชิงทดลองเปรียบเทียบประสิทธิภาพการผลิตกระแสไฟฟ้าระหว่างแผงโซลาร์เซลล์บนหลังคากับแผงบนทุ่นลอยน้ำในอ่างเก็บน้ำห้วยเสนง ผลพบว่าอุณหภูมิน้ำที่ช่วยระบายความร้อนทำให้ระบบ Floating Solar มีค่าประสิทธิภาพการผลิตไฟฟ้าสูงกว่าระบบบนบก 11.2% ต่อปี",
    keywords: "โซลาร์เซลล์ลอยน้ำ, Floating Solar, ห้วยเสนง, พลังงานทดแทน, ประสิทธิภาพพลังงาน, สุรินทร์",
    authors: "ธีรวัฒน์ ชัยมณี, ชัยณรงค์ ดวงจันทร์",
    advisor: "อ. ธีรศักดิ์ เกตุแก้ว",
    faculty_id: 5, department_id: 12, year: 2024, type: "RESEARCH_ARTICLE", status: "APPROVED"
  },
  {
    title_th: "การประยุกต์ใช้เทคนิคการลดความสูญเปล่า (Lean Manufacturing) เพื่อลดรอบเวลาการผลิตอิฐมวลเบาในวิสาหกิจชุมชน",
    title_en: "Application of Lean Manufacturing Techniques to Reduce Cycle Time in Community Light-weight Brick Production",
    abstract_th: "การประยุกต์ใช้แผนผังสายธารแห่งคุณค่า (Value Stream Mapping: VSM) และเทคนิค 5ส ในโรงงานผลิตอิฐมวลเบาชุมชนจังหวัดสุรินทร์ สามารถกำจัดความสูญเปล่าจากการรอคอยและการขนย้ายซ้ำซ้อน ลดเวลานำการผลิต (Lead Time) จาก 5 วันเหลือ 3.2 วัน",
    keywords: "ลีน, VSM, การลดความสูญเปล่า, อิฐมวลเบา, วิศวกรรมอุตสาหการ, การจัดการสายการผลิต",
    authors: "พงศธร สมบูรณ์กุล",
    advisor: "อ. ธีรศักดิ์ เกตุแก้ว",
    faculty_id: 5, department_id: 12, year: 2023, type: "SENIOR_PROJECT", status: "APPROVED"
  },

  // Faculty 6: Agriculture & Agro-Industry (Dept 13: Smart Agriculture Tech)
  {
    title_th: "การศึกษาคุณลักษณะเชิงหน้าที่และสารออกฤทธิ์ต้านอนุมูลอิสระของข้าวกล้องหอมมะลิสุรินทร์งอกสำหรับการพัฒนาเครื่องดื่มเพื่อสุขภาพ",
    title_en: "Functional Properties and Antioxidant Activities of Germinated Surin Jasmine Brown Rice for Health Beverage Development",
    abstract_th: "งานวิจัยนี้ศึกษาผลของอุณหภูมิและระยะเวลาการเพาะงอกต่อปริมาณสารกาบา (GABA) และสารประกอบฟีนอลิกทั้งหมดในข้าวหอมมะลิอินทรีย์สุรินทร์ พบว่าการแช่น้ำ 12 ชั่วโมงและเพาะงอก 24 ชั่วโมง ให้ปริมาณ GABA สูงสุด 38.4 มิลลิกรัมต่อ 100 กรัม เหมาะสมสำหรับการพัฒนาเป็นเครื่องดื่มสุขภาพพร้อมดื่ม",
    keywords: "ข้าวงอก, สารกาบา, ข้าวหอมมะลิสุรินทร์, สารต้านอนุมูลอิสระ, เครื่องดื่มเพื่อสุขภาพ, อุตสาหกรรมเกษตร",
    authors: "ดาริกา อนันตชัย, ศิริพร หวังดี",
    advisor: "รศ.ดร. นฤมล แสนสุข",
    faculty_id: 6, department_id: 13, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "ระบบให้น้ำและปุ๋ยอัจฉริยะตามความต้องการของมันสำปะหลังแปลงใหญ่ด้วยโครงข่ายเซนเซอร์ไร้สายและ LoRaWAN",
    title_en: "Smart Precision Fertigation System for Mega-Scale Cassava Plantation using Wireless Sensor Networks and LoRaWAN",
    abstract_th: "การพัฒนาระบบควบคุมวาล์วจ่ายน้ำและปุ๋ยอัตโนมัติระยะไกลด้วยโปรโตคอล LoRaWAN ครอบคลุมพื้นที่ 200 ไร่ในอำเภอปราสาท โดยประมวลผลข้อมูลความชื้นในดินและพยากรณ์อากาศร่วมกับแบบจำลองการคายระเหยน้ำของพืช ช่วยลดการใช้น้ำลง 28% และเพิ่มผลผลิตหัวมันสำปะหลัง 1.8 ตันต่อไร่",
    keywords: "LoRaWAN, มันสำปะหลัง, เกษตรแม่นยำ, ระบบให้น้ำอัจฉริยะ, เซนเซอร์ไร้สาย, สุรินทร์",
    authors: "ประวิทย์ แก่นจันทร์, ธวัชชัย มั่งมี",
    advisor: "รศ.ดร. นฤมล แสนสุข",
    faculty_id: 6, department_id: 13, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การผลิตและประเมินคุณภาพชีวภัณฑ์ควบคุมโรครากเน่าโคนเน่าในแปลงเมลอนอินทรีย์ด้วยเชื้อราไตรโคเดอร์มาสายพันธุ์ท้องถิ่นสุรินทร์",
    title_en: "Production and Quality Evaluation of Biocontrol Agents for Root Rot in Organic Melon using Native Surin Trichoderma Strains",
    abstract_th: "การคัดแยกเชื้อราไตรโคเดอร์มาจากดินป่าธรรมชาติในจังหวัดสุรินทร์ 15 สายพันธุ์ นำมาทดสอบประสิทธิภาพการยับยั้งเชื้อ Fusarium oxysporum พบว่าสายพันธุ์ SRRU-TR08 สามารถยับยั้งการเจริญของเส้นใยเชื้อราสาเหตุโรคได้ถึง 84.6% และเมื่อนำไปผสมในวัสดุปลูกช่วยเพิ่มอัตราการรอดชีวิตของต้นกล้าเมลอนอย่างมีนัยสำคัญ",
    keywords: "ไตรโคเดอร์มา, ชีวภัณฑ์, โรครากเน่า, เมลอนอินทรีย์, เกษตรอินทรีย์, การควบคุมทางชีววิธี",
    authors: "ขวัญใจ บุญลือ",
    advisor: "รศ.ดร. นฤมล แสนสุข",
    faculty_id: 6, department_id: 13, year: 2023, type: "RESEARCH_REPORT", status: "APPROVED"
  },
  {
    title_th: "การใช้วัตถุดิบท้องถิ่นและแหนแดง (Azolla caroliniana) เสริมในอาหารเพื่อลดต้นทุนการเลี้ยงเป็ดไข่พันธุ์กากีแคมป์เบลล์",
    title_en: "Utilization of Local Feedstuffs and Azolla caroliniana Supplementation to Reduce Production Costs in Khaki Campbell Ducks",
    abstract_th: "การทดลองเลี้ยงเป็ดไข่จำนวน 200 ตัว โดยทดแทนอาหารข้นด้วยแหนแดงสดในระดับ 0%, 10%, 20% และ 30% ผลพบว่าการเสริมแหนแดงที่ระดับ 20% ไม่ส่งผลกระทบต่ออัตราการไข่และน้ำหนักฟองไข่ แต่ช่วยลดต้นทุนค่าอาหารลงได้ฟองละ 0.45 บาท และทำให้สีไข่แดงมีความเข้มขึ้นตามเกณฑ์ที่ตลาดต้องการ",
    keywords: "แหนแดง, เป็ดไข่, อาหารสัตว์ท้องถิ่น, การลดต้นทุน, ปศุสัตว์, เกษตรยั่งยืน",
    authors: "สมบูรณ์ มีทรัพย์",
    advisor: "ผศ. ชัยพร สุวรรณหงส์",
    faculty_id: 6, department_id: 13, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },

  // Faculty 7: Graduate School (Dept 14: Research & Innovation M.Sc.)
  {
    title_th: "การพัฒนาระบบนิเวศนวัตกรรมเศรษฐกิจชีวภาพ เศรษฐกิจหมุนเวียน และเศรษฐกิจสีเขียว (BCG Economy) ในห่วงโซ่คุณค่าไหมสุรินทร์",
    title_en: "Developing a BCG Innovation Ecosystem in the Surin Silk Value Chain",
    abstract_th: "วิทยานิพนธ์ระดับมหาบัณฑิตนี้นำเสนอกรอบการยกระดับอุตสาหกรรมไหมสุรินทร์ทั้งระบบ โดยนำของเสียจากกระบวนการต้มรังไหมมาสกัดโปรตีนเซริซิน (Sericin) เพื่อใช้ในเวชสำอาง และนำมูลหนอนไหมมาผลิตเป็นปุ๋ยอินทรีย์ชีวภาพ สร้างมูลค่าเพิ่มทางเศรษฐกิจหมุนเวียนได้มากกว่า 3.2 เท่าของเส้นไหมดิบ",
    keywords: "BCG Economy, เซริซิน, หม่อนไหม, ห่วงโซ่คุณค่า, นวัตกรรมชีวภาพ, บัณฑิตศึกษา, สุรินทร์",
    authors: "อัจฉราพร ไตรมงคล",
    advisor: "รศ.ดร. สมเกียรติ สว่างวงศ์",
    faculty_id: 7, department_id: 14, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "การสร้างแบบจำลองการทำนายความเสี่ยงอุทกภัยและภัยแล้งลุ่มน้ำชีตอนล่างด้วยการเรียนรู้ของเครื่องเชิงภูมิสารสนเทศ (Spatial ML)",
    title_en: "Spatial Machine Learning Modeling for Flood and Drought Risk Prediction in the Lower Chi River Basin",
    abstract_th: "การบูรณาการข้อมูลสำรวจระยะไกลจากดาวเทียม Sentinel-1/2 ร่วมกับอัลกอริทึม XGBoost และ Random Forest ในการสร้างแผนที่ความเสี่ยงภัยพิบัติทางน้ำระดับแปลงที่ดินในจังหวัดสุรินทร์และยโสธร โมเดลมีความถูกต้องของค่า AUC-ROC อยู่ที่ 0.93 ช่วยให้หน่วยงานบริหารจัดการน้ำแจ้งเตือนประชาชนล่วงหน้าได้ 7 วัน",
    keywords: "ภูมิสารสนเทศ, XGBoost, อุทกภัย, ภัยแล้ง, ลุ่มน้ำชี, การจัดการภัยพิบัติ, วิทยาการข้อมูล",
    authors: "กิตติพงษ์ ทวีชัยกุล",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 7, department_id: 14, year: 2024, type: "THESIS", status: "APPROVED"
  },

  // Extra rich topics to complete 52 items
  {
    title_th: "ระบบฝาแฝดดิจิทัล (Digital Twin) เพื่อการตรวจสอบและควบคุมสภาวะสิ่งแวดล้อมในโรงพยาบาลสนาม",
    title_en: "Digital Twin System for Environmental Monitoring and Control in Field Hospitals",
    abstract_th: "การผสานเทคโนโลยีแบบจำลองข้อมูลอาคาร (BIM) เข้ากับโครงข่ายเซนเซอร์ IoT แสดงผลผ่านเว็บแบบ 3 มิติ เพื่อจำลองทิศทางการไหลของอากาศและแรงดันลบในห้องผู้ป่วยติดเชื้อ ลดความเสี่ยงในการแพร่กระจายเชื้อสู่บุคลากรทางการแพทย์",
    keywords: "Digital Twin, BIM, IoT, ห้องแรงดันลบ, โรงพยาบาลสนาม, นวัตกรรมดิจิทัล",
    authors: "อนุชา สิทธิโชค",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 1, department_id: 1, year: 2023, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "การพัฒนาแช็ตบอตให้คำปรึกษาสุขภาพจิตเบื้องต้นด้วยการรู้จำอารมณ์ในข้อความภาษาไทย",
    title_en: "Development of Mental Health Conversational Agent with Thai Text Emotion Recognition",
    abstract_th: "โครงงานนี้พัฒนาแช็ตบอตบน Line Messaging API สำหรับประเมินความเครียดและภาวะซึมเศร้าของวัยรุ่น โดยใช้โมเดล RoBERTa ร่วมกับพจนานุกรมคำศัพท์อารมณ์ภาษาไทย สามารถจำแนกความรู้สึก 6 ประเภทด้วยความแม่นยำ 88.5% พร้อมระบบส่งต่อสายด่วนสุขภาพจิตอัตโนมัติเมื่อพบความเสี่ยงสูง",
    keywords: "แช็ตบอต, สุขภาพจิต, การรู้จำอารมณ์, NLP ภาษาไทย, RoBERTa, ปัญญาประดิษฐ์",
    authors: "ชญานิศ รัตนวงศ์, ภัทรดนัย บุญช่วย",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 1, department_id: 2, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การประเมินศักยภาพการกักเก็บคาร์บอนในมวลชีวภาพของป่าเต็งรังและป่าเบญจพรรณ จังหวัดสุรินทร์",
    title_en: "Assessment of Carbon Sequestration Potential in Biomass of Dry Dipterocarp and Mixed Deciduous Forests in Surin",
    abstract_th: "การศึกษาปริมาณการกักเก็บคาร์บอนเหนือพื้นดินในแปลงตัวอย่างถาวร 30 แปลงรอบวนอุทยานพนมสวาย พบว่าป่าเบญจพรรณมีศักยภาพการกักเก็บคาร์บอนเฉลี่ย 82.4 ตันคาร์บอนต่อเฮกแตร์ สูงกว่าป่าเต็งรัง 26% ข้อมูลนี้สามารถนำไปใช้อ้างอิงการจัดทำคาร์บอนเครดิตภาคป่าไม้ขององค์กรปกครองส่วนท้องถิ่น",
    keywords: "การกักเก็บคาร์บอน, คาร์บอนเครดิต, ป่าพนมสวาย, ป่าเต็งรัง, มวลชีวภาพ, สิ่งแวดล้อม",
    authors: "ปิยะราช คำดี",
    advisor: "รศ.ดร. สมเกียรติ สว่างวงศ์",
    faculty_id: 2, department_id: 6, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "การพัฒนาแพลตฟอร์มระดมทุนมวลชน (Crowdfunding) เพื่อสนับสนุนโครงการวิจัยและสตาร์ตอัปของนักศึกษามหาวิทยาลัยราชภัฏ",
    title_en: "Development of a Crowdfunding Platform to Support Student Research and Startups at Rajabhat Universities",
    abstract_th: "งานวิจัยนี้พัฒนาระบบระดมทุนแบบ Reward-based บนเว็บเทคโนโลยี Node.js และ Smart Contracts เพื่อเปิดโอกาสให้ศิษย์เก่าและภาคเอกชนร่วมสนับสนุนทุนวิจัยสิ่งประดิษฐ์และนวัตกรรมชุมชนของนักศึกษา มรภ.สุรินทร์ พร้อมระบบรายงานความก้าวหน้าโครงการอย่างโปร่งใส",
    keywords: "คราวด์ฟันดิง, สตาร์ตอัป, มหาวิทยาลัยราชภัฏ, ฟินเทค, สัญญาอัจฉริยะ, ทุนวิจัย",
    authors: "พิทยุตม์ มงคลศรี",
    advisor: "รศ.ดร. ศิริพร วิมลชัย",
    faculty_id: 3, department_id: 7, year: 2024, type: "INDEPENDENT_STUDY", status: "APPROVED"
  },
  {
    title_th: "การศึกษากระบวนการจัดการท่องเที่ยวคาร์บอนต่ำ (Low Carbon Tourism) ในชุมชนหมู่บ้านช้างบ้านตากลาง อำเภอท่าตูม",
    title_en: "Low Carbon Tourism Management Processes in Ban Ta Klang Elephant Village, Tha Tum District",
    abstract_th: "การประเมินรอยเท้าคาร์บอน (Carbon Footprint) ของกิจกรรมการท่องเที่ยวชมช้างและการแสดงพื้นบ้าน นำเสนอแนวทางชดเชยคาร์บอนด้วยการปลูกป่าหญ้าเนเปียร์สำหรับอาหารช้างและการนำมูลช้างมาผลิตก๊าซชีวภาพ ช่วยลดการปล่อยก๊าซเรือนกระจกลงได้ 32 ตันคาร์บอนไดออกไซด์เทียบเท่าต่อปี",
    keywords: "ท่องเที่ยวคาร์บอนต่ำ, ชุมชนบ้านตากลาง, หมู่บ้านช้าง, รอยเท้าคาร์บอน, สุรินทร์, การจัดการสิ่งแวดล้อม",
    authors: "กมลทิพย์ สุขสงวน",
    advisor: "ผศ. ดาราวรรณ สังข์ทอง",
    faculty_id: 3, department_id: 8, year: 2023, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "การพัฒนาชุดกิจกรรมการเรียนรู้แบบสืบเสาะหาความรู้ (5E) ร่วมกับเทคโนโลยี AR เรื่องระบบสุริยะ สำหรับนักเรียนประถมศึกษา",
    title_en: "Development of 5E Inquiry-Based Learning Activities with Augmented Reality on the Solar System for Elementary Students",
    abstract_th: "การวิจัยเชิงทดลองเพื่อพัฒนาแอปพลิเคชัน AR ฉายภาพจำลองดาวเคราะห์ 3 มิติประกอบชุดกิจกรรม 5E ผลการใช้กับนักเรียนชั้น ป.5 พบว่านักเรียนมีพัฒนาการความเข้าใจมโนทัศน์วิทยาศาสตร์สูงขึ้นอย่างมีนัยสำคัญ และช่วยให้ผู้เรียนเข้าใจปรากฏการณ์ดาราศาสตร์ได้ง่ายขึ้น",
    keywords: "เทคโนโลยี AR, การจัดการเรียนรู้ 5E, วิทยาศาสตร์ประถมศึกษา, ดาราศาสตร์, สื่อการสอน 3 มิติ",
    authors: "รัตนพร บุญครอง",
    advisor: "รศ.ดร. จินตนา รัตนโชติ",
    faculty_id: 4, department_id: 11, year: 2024, type: "RESEARCH_REPORT", status: "APPROVED"
  },
  {
    title_th: "การออกแบบและสร้างเครื่องอบแห้งกล้วยน้ำว้าและข้าวเกรียบปลาพลังงานแสงอาทิตย์ร่วมกับฮีตเตอร์อัจฉริยะ",
    title_en: "Design and Construction of a Smart Hybrid Solar-Electric Dryer for Bananas and Fish Crackers",
    abstract_th: "โครงงานนี้สร้างตู้อบแห้งแบบพาความร้อนบังคับ ใช้แผงรับรังสีอาทิตย์ร่วมกับขดลวดความร้อนไฟฟ้าที่ควบคุมอุณหภูมิคงที่ 55 องศาเซลเซียสด้วยระบบ PID Controller ลดระยะเวลาการตากแห้งจาก 3 วันเหลือเพียง 10 ชั่วโมง ปราศจากฝุ่นละอองและแมลงวันรบกวน",
    keywords: "ตู้อบแห้งพลังงานแสงอาทิตย์, PID Controller, การแปรรูปอาหาร, พลังงานความร้อน, เทคโนโลยีอุตสาหกรรม",
    authors: "วรเชษฐ์ สุขสันต์, ธนพล ดวงพร",
    advisor: "อ. ธีรศักดิ์ เกตุแก้ว",
    faculty_id: 5, department_id: 12, year: 2023, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การพัฒนาฟิล์มบริโภคได้ต้านเชื้อแบคทีเรียจากแป้งข้าวหอมมะลิเสริมสารสกัดจากใบกระเพราเพื่อยืดอายุการเก็บรักษาเนื้อสัตว์",
    title_en: "Development of Antimicrobial Edible Films from Jasmine Rice Starch Fortified with Holy Basil Extract for Meat Shelf-Life Extension",
    abstract_th: "การเตรียมฟิล์มชีวภาพที่ย่อยสลายได้ทางชีวภาพ 100% จากแป้งข้าวหอมมะลิสุรินทร์และกลีเซอรอล เสริมด้วยสารสกัดหยาบใบกระเพราเข้มข้น 2-6% ฟิล์มที่พัฒนาขึ้นมีฤทธิ์ยับยั้งเชื้อ E. coli และ S. aureus ได้อย่างมีประสิทธิภาพ และสามารถยืดอายุการเก็บเนื้อหมูสดในตู้เย็นได้นานขึ้น 5 วัน",
    keywords: "ฟิล์มบริโภคได้, แป้งข้าวหอมมะลิ, สารสกัดใบกระเพรา, การยืดอายุอาหาร, บรรจุภัณฑ์ชีวภาพ, อุตสาหกรรมเกษตร",
    authors: "พัชรีวรรณ จันทร์เพ็ญ",
    advisor: "รศ.ดร. นฤมล แสนสุข",
    faculty_id: 6, department_id: 13, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "การเพิ่มประสิทธิภาพการสืบค้นข้อมูลเวชระเบียนผู้ป่วยนอกด้วยระบบฐานข้อมูลแบบกระจายศูนย์บนสถาปัตยกรรมคลาวด์",
    title_en: "Efficiency Enhancement of Outpatient Medical Record Retrieval using Distributed Database on Cloud Architecture",
    abstract_th: "การศึกษาวิจัยเพื่อแก้ปัญหาคอขวดของการสืบค้นประวัติผู้ป่วยในโรงพยาบาลชุมชน โดยออกแบบการแบ่งพาร์ทิชันฐานข้อมูลแบบ Sharding และการทำ Read Replica บน PostgreSQL ผลการทดสอบโหลดทดสอบ 5,000 Concurrent Queries พบว่าเวลาตอบสนองลดลงจาก 3.8 วินาทีเหลือเพียง 0.25 วินาที",
    keywords: "ฐานข้อมูลกระจายศูนย์, เวชระเบียน, Cloud Architecture, PostgreSQL, Sharding, ระบบโรงพยาบาล",
    authors: "กิตติกร อัมพวัน",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 1, department_id: 1, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "ระบบจำแนกสายพันธุ์ปลาน้ำจืดลุ่มน้ำมูลด้วยการเรียนรู้เชิงลึกแบบ Transfer Learning บนอุปกรณ์พกพา",
    title_en: "Freshwater Fish Species Identification in Mun River Basin using Transfer Learning Deep Learning on Mobile Devices",
    abstract_th: "แอปพลิเคชันมือถือช่วยเกษตรกรและชาวประมงจำแนกพันธุ์ปลาน้ำจืดพื้นเมือง 35 สายพันธุ์ในลุ่มน้ำมูล เช่น ปลากดคัง ปลาเนื้ออ่อน และปลาบึก โดยใช้โมเดล MobileNetV3 ที่ผ่านการ Quantization ให้รันบนสมาร์ตโฟนได้โดยไม่ต้องต่ออินเทอร์เน็ต ความแม่นยำ 91.8%",
    keywords: "ปลาน้ำจืด, ลุ่มน้ำมูล, MobileNet, การเรียนรู้เชิงลึก, แอปพลิเคชันมือถือ, การประมง",
    authors: "วิโรจน์ แสงสุริยา",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 1, department_id: 2, year: 2023, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การวิเคราะห์อัตลักษณ์ทางภาษาและวรรณกรรมมุขปาฐะของหมอลำเบื้องโบราณในจังหวัดสุรินทร์และศรีสะเกษ",
    title_en: "Linguistic Identity and Oral Literary Analysis of Ancient Mor Lam Berng in Surin and Sisaket",
    abstract_th: "การศึกษาภาษาศาสตร์เชิงชาติพันธุ์และวรรณคดีท้องถิ่นในการแสดงหมอลำเบื้อง โดยถอดเทปบทกลอนลำโบราณ 25 เรื่อง วิเคราะห์กลวิธีทางวรรณศิลป์ การใช้คำซ้อน และการแฝงคติธรรมทางพุทธศาสนา เพื่อจัดทำเป็นคลังข้อมูลดิจิทัลสำหรับอนุรักษ์มรดกทางวัฒนธรรมที่กำลังจะสูญหาย",
    keywords: "หมอลำเบื้อง, วรรณกรรมมุขปาฐะ, ภาษาศาสตร์ชาติพันธุ์, มรดกวัฒนธรรม, อีสานใต้, มนุษยศาสตร์",
    authors: "สมคิด มิ่งขวัญ",
    advisor: "รศ.ดร. สมเกียรติ สว่างวงศ์",
    faculty_id: 2, department_id: 4, year: 2024, type: "RESEARCH_ARTICLE", status: "APPROVED"
  },
  {
    title_th: "การศึกษาประสิทธิภาพการไกล่เกลี่ยข้อพิพาทในระดับชุมชนตามพระราชบัญญัติการไกล่เกลี่ยข้อพิพาท พ.ศ. 2562: ศึกษากรณีศูนย์ไกล่เกลี่ยข้อพิพาทภาคประชาชนจังหวัดสุรินทร์",
    title_en: "Effectiveness Study of Community Dispute Mediation under the Dispute Mediation Act B.E. 2562: A Case of Surin Public Mediation Centers",
    abstract_th: "วิทยานิพนธ์นี้ประเมินประสิทธิผลของศูนย์ไกล่เกลี่ยข้อพิพาทภาคประชาชน 12 แห่งในสุรินทร์ พบว่าข้อพิพาททางแพ่งเรื่องที่ดินและมรดกสามารถยุติลงได้ในชั้นศูนย์ไกล่เกลี่ยถึง 78.4% ช่วยลดปริมาณคดีขึ้นสู่ศาลและเสริมสร้างความสมานฉันท์ในชุมชนอย่างยั่งยืน",
    keywords: "การไกล่เกลี่ยข้อพิพาท, ข้อพิพาทชุมชน, ความยุติธรรมชุมชน, นิติศาสตร์, สุรินทร์",
    authors: "ณัฐดนัย ศรีโพธิ์",
    advisor: "ผศ. พิพัฒน์ ศิริธรรม",
    faculty_id: 2, department_id: 5, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "โมเดลความตั้งใจซื้อผลิตภัณฑ์เครื่องสำอางสมุนไพรเกษตรอินทรีย์ของผู้บริโภคเจนเนอเรชัน Z ผ่านช่องทาง Social Commerce",
    title_en: "Gen Z Consumers Purchase Intention Model for Organic Herbal Cosmetic Products via Social Commerce",
    abstract_th: "การวิเคราะห์โครงสร้างความสัมพันธ์ระหว่างการรับรู้คุณค่าตราสินค้า ความตระหนักด้านสิ่งแวดล้อม และอิทธิพลของ Micro-influencers ต่อความตั้งใจซื้อเครื่องสำอางสมุนไพรสุรินทร์ ผลวิจัยชี้ว่าความโปร่งใสของส่วนผสมออร์แกนิกที่ตรวจสอบได้ส่งผลต่อความไว้วางใจสูงสุด",
    keywords: "เจนเนอเรชัน Z, Social Commerce, เครื่องสำอางสมุนไพร, การตลาดเพื่อสิ่งแวดล้อม, พฤติกรรมผู้บริโภค",
    authors: "เบญจมาศ ทองสุข",
    advisor: "ผศ. ดาราวรรณ สังข์ทอง",
    faculty_id: 3, department_id: 8, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การพัฒนาระบบบัญชีดิจิทัลด้วย Google Sheets และ AppSheet สำหรับกลุ่มเกษตรกรแปลงใหญ่อำเภอจอมพระ",
    title_en: "Development of Digital Accounting System using Google Sheets and AppSheet for Large-Scale Agricultural Groups in Chom Phra",
    abstract_th: "โครงงานบริการวิชาการเพื่อพัฒนาแอปพลิเคชันบันทึกรายรับ-รายจ่ายและต้นทุนปัจจัยการผลิตที่ใช้งานง่ายผ่านสมาร์ตโฟนสำหรับเกษตรกรผู้สูงอายุ สามารถสรุปงบการเงินและต้นทุนต่อไร่ได้อัตโนมัติ ช่วยให้เกษตรกรทราบกำไรที่แท้จริงและวางแผนลดต้นทุนปุ๋ยเคมีได้",
    keywords: "AppSheet, บัญชีฟาร์ม, เกษตรกรแปลงใหญ่, บัญชีดิจิทัล, จอมพระ, สุรินทร์",
    authors: "พรรณรายณ์ ยิ้มละมัย, ศิรินทิพย์ เจริญจิต",
    advisor: "ดร. อัมพร จิตเจริญ",
    faculty_id: 3, department_id: 9, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การพัฒนารูปแบบการนิเทศแบบโค้ชชิ่ง (Coaching) เพื่อส่งเสริมสมรรถนะการจัดการเรียนรู้เชิงรุกของครูคอมพิวเตอร์ระดับมัธยมศึกษา",
    title_en: "Development of a Coaching Supervision Model to Enhance Active Learning Competencies of Secondary Computing Teachers",
    abstract_th: "การวิจัยและพัฒนาโมเดลการนิเทศ 4 ขั้นตอน (GROW-C Model) เพื่อพัฒนาครูผู้สอนวิชาวิทยาการคำนวณ 24 คนในจังหวัดสุรินทร์ ผลการประเมินพบว่าครูมีทักษะในการออกแบบกิจกรรม Active Learning และการวัดประเมินผลตามสภาพจริงเพิ่มขึ้นอย่างมีนัยสำคัญ",
    keywords: "การนิเทศแบบโค้ชชิ่ง, Active Learning, ครูคอมพิวเตอร์, การจัดการเรียนรู้, การพัฒนาครู, ครุศาสตร์",
    authors: "อารีรัตน์ สมสมัย",
    advisor: "ผศ.ดร. นิตยา ทรงธรรม",
    faculty_id: 4, department_id: 10, year: 2023, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "การออกแบบและพัฒนายานยนต์ไฟฟ้าขนาดเล็กสำหรับขนส่งพืชผลทางการเกษตรในสวนอินทรีย์",
    title_en: "Design and Development of Small Electric Vehicles for Agricultural Produce Transport in Organic Orchards",
    abstract_th: "โครงงานวิศวกรรมสร้างรถบรรทุกไฟฟ้า 4 ล้อขับเคลื่อนด้วยมอเตอร์ BLDC ขนาด 1,500W และแบตเตอรี่ลิเธียมฟอสเฟต (LiFePO4) รองรับน้ำหนักบรรทุก 300 กิโลกรัม สามารถชาร์จไฟจากแผงโซลาร์เซลล์ประจำฟาร์มได้ วิ่งได้ระยะทาง 45 กิโลเมตรต่อการชาร์จหนึ่งครั้ง",
    keywords: "ยานยนต์ไฟฟ้า, รถการเกษตร, BLDC มอเตอร์, LiFePO4, พลังงานสะอาด, เกษตรอัจฉริยะ",
    authors: "กิตติพัทธ์ โพธิ์งาม, สิทธิชัย แสนดี",
    advisor: "อ. ธีรศักดิ์ เกตุแก้ว",
    faculty_id: 5, department_id: 12, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  },
  {
    title_th: "การประเมินความหลากหลายทางชีวภาพของแมลงผสมเกสรและผลกระทบต่อผลผลิตเมล็ดพันธุ์ข้าวหอมมะลิอินทรีย์",
    title_en: "Biodiversity Assessment of Pollinators and Their Impact on Yield of Organic Jasmine Rice Seeds",
    abstract_th: "การสำรวจชนิดและประชากรของผึ้งหลวง ผึ้งโพรง และชันโรงในระบบนิเวศนาข้าวอินทรีย์จังหวัดสุรินทร์ พบแมลงผสมเกสร 42 ชนิด โดยแปลงข้าวที่มีการปลูกพืชอาหารรอบคันนามีประชากรแมลงผสมเกสรสูงกว่าแปลงเคมี 3.4 เท่า และส่งผลต่ออัตราการติดเมล็ดที่สมบูรณ์สูงขึ้น 9.2%",
    keywords: "แมลงผสมเกสร, ชันโรง, ความหลากหลายทางชีวภาพ, ข้าวหอมมะลิอินทรีย์, นิเวศวิทยาเกษตร, สุรินทร์",
    authors: "สุริยา รุ่งเรือง",
    advisor: "ผศ. ชัยพร สุวรรณหงส์",
    faculty_id: 6, department_id: 13, year: 2023, type: "RESEARCH_REPORT", status: "APPROVED"
  },
  {
    title_th: "การพัฒนาต้นแบบระบบตรวจสอบย้อนกลับห่วงโซ่อุปทานเนื้อโคขุนสุรินทร์กูร์เมต์ด้วยเทคโนโลยีไฮเปอร์เลดเจอร์แฟบริก (Hyperledger Fabric)",
    title_en: "Development of a Supply Chain Traceability Prototype for Surin Gourmet Beef using Hyperledger Fabric",
    abstract_th: "วิทยานิพนธ์นี้นำเสนอแพลตฟอร์มบล็อกเชนแบบ Permissioned บันทึกข้อมูลตั้งแต่ประวัติพ่อแม่พันธุ์ การฉีดวัคซีน สูตรอาหาร วันที่เชือด และการบ่มเนื้อ (Dry-aging) เพื่อให้ผู้บริโภคสามารถสแกน QR Code ตรวจสอบความปลอดภัยและมาตรฐานฮาลาลได้ ป้องกันการปลอมแปลงแหล่งกำเนิดเนื้อโคขุนพรีเมียมสุรินทร์ 100%",
    keywords: "บล็อกเชน, ไฮเปอร์เลดเจอร์, ตรวจสอบย้อนกลับ, โคขุนสุรินทร์, ความปลอดภัยทางอาหาร, นวัตกรรมเทคโนโลยี",
    authors: "อัศวิน เจริญผล",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 7, department_id: 14, year: 2024, type: "THESIS", status: "APPROVED"
  },
  {
    title_th: "การศึกษาศักยภาพการสกัดสารสีธรรมชาติจากเปลือกต้นประดู่และผลมะเกลือเพื่ออุตสาหกรรมสิ่งทอที่เป็นมิตรต่อสิ่งแวดล้อม",
    title_en: "Potential Study of Natural Dye Extraction from Pterocarpus macrocarpus Bark and Diospyros mollis Fruit for Eco-friendly Textiles",
    abstract_th: "การวิเคราะห์สภาวะที่เหมาะสมในการสกัดสารสีธรรมชาติด้วยคลื่นอัลตราโซนิกและการใช้สารช่วยติดสี (Mordant) จากธรรมชาติ เช่น โคลนและน้ำขี้เถ้า เพื่อย้อมเส้นไหมสุรินทร์ สีที่ได้มีความคงทนต่อการซักและแสงแดดในระดับ 4-5 ตามมาตรฐานสากล",
    keywords: "สีย้อมธรรมชาติ, สารสกัดจากพืช, มะเกลือ, เปลือกประดู่, สิ่งทอเป็นมิตรต่อสิ่งแวดล้อม, ผ้าไหมสุรินทร์",
    authors: "พนิดา วรรณโชติ",
    advisor: "รศ.ดร. นฤมล แสนสุข",
    faculty_id: 6, department_id: 13, year: 2024, type: "RESEARCH_ARTICLE", status: "APPROVED"
  },
  {
    title_th: "การพัฒนาระบบตรวจจับการล้มของผู้สูงอายุในบ้านเรือนด้วยการประมวลผลสัญญาณคลื่นเรดาร์และอัลกอริทึม Support Vector Machine",
    title_en: "Development of an Elderly Fall Detection System in Households using Radar Signal Processing and SVM Algorithm",
    abstract_th: "โครงงานนี้ใช้เซนเซอร์คลื่นมิลลิเมตร (mmWave Radar 60GHz) ในการตรวจจับความผิดปกติของการเคลื่อนไหวของมนุษย์โดยไม่ใช้กล้องวิดีโอ เพื่อรักษาความเป็นส่วนตัวของผู้สูงอายุ ระบบสามารถจำแนกการหกล้มจากการนอนหรือนั่งลงปกติได้ด้วยความแม่นยำ 95.2% และส่งสัญญาณเตือนผ่าน SMS ทันที",
    keywords: "ตรวจจับการล้ม, mmWave Radar, ผู้สูงอายุ, SVM, สัญญาณเตือนภัย, สมาร์ตโฮม",
    authors: "ภควัต พูลทรัพย์, วงศกร เพลินจิต",
    advisor: "ผศ.ดร. ประเสริฐ สกุลดี",
    faculty_id: 1, department_id: 1, year: 2024, type: "SENIOR_PROJECT", status: "APPROVED"
  }
];

console.log(`Loaded ${projectTemplates.length} rich templates.`);

// Convert templates to full project objects
const newProjects = projectTemplates.map((t, idx) => {
  const projId = startId + idx;
  const samplePdfNum = (projId % 5) + 1; // Map to existing sample_paper_1 to 5.pdf
  const viewCount = Math.floor(Math.random() * 350) + 40;
  const downloadCount = Math.floor(viewCount * (0.2 + Math.random() * 0.25));
  
  // Date in the past 1-2 years
  const daysAgo = Math.floor(Math.random() * 400) + 10;
  const createdDate = new Date(Date.now() - daysAgo * 86400000).toISOString();
  const updatedDate = new Date(Date.now() - (daysAgo - 2) * 86400000).toISOString();

  return {
    project_id: projId,
    title_th: t.title_th,
    title_en: t.title_en,
    abstract_text: t.abstract_th,
    keywords: t.keywords,
    authors: t.authors,
    advisor_name: t.advisor,
    faculty_id: t.faculty_id,
    department_id: t.department_id,
    publish_year: t.year,
    project_type: t.type,
    pdf_file_path: `/uploads/sample_paper_${samplePdfNum}.pdf`,
    status: t.status,
    submitted_by: 4 + (projId % 3), // student1, student2, student3
    approved_by: 2 + (projId % 2), // teacher1, teacher2
    view_count: viewCount,
    download_count: downloadCount,
    rejection_reason: null,
    created_at: createdDate,
    updated_at: updatedDate
  };
});

// Append to store
existingStore.research_projects = [...currentProjects, ...newProjects];

// Write back to server/uploads/srru_db_store.json
fs.writeFileSync(storePath, JSON.stringify(existingStore, null, 2), 'utf8');
console.log(`[Success] server/uploads/srru_db_store.json now has ${existingStore.research_projects.length} research projects!`);

// Generate SQL INSERT statements to append to database/seed.sql
function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

const sqlInserts = newProjects.map(p => {
  return `(${p.project_id}, ${escapeSql(p.title_th)}, ${escapeSql(p.title_en)}, ${escapeSql(p.abstract_text)}, ${escapeSql(p.keywords)}, ${escapeSql(p.authors)}, ${escapeSql(p.advisor_name)}, ${p.faculty_id}, ${p.department_id}, ${p.publish_year}, '${p.project_type}', ${escapeSql(p.pdf_file_path)}, '${p.status}', ${p.submitted_by}, ${p.approved_by}, ${p.view_count}, ${p.download_count}, NULL, '${p.created_at.slice(0, 19).replace('T', ' ')}')`;
}).join(',\n');

const fullSqlBlock = `\n\n-- =====================================================================\n-- Additional 50+ Real SRRU Research Projects Seed Data\n-- =====================================================================\nINSERT INTO research_projects (\n    project_id, title_th, title_en, abstract_text, keywords, authors, advisor_name,\n    faculty_id, department_id, publish_year, project_type, pdf_file_path, status, submitted_by, approved_by,\n    view_count, download_count, rejection_reason, created_at\n) VALUES\n${sqlInserts}\nON DUPLICATE KEY UPDATE title_th=VALUES(title_th);\n`;

fs.appendFileSync(seedSqlPath, fullSqlBlock, 'utf8');
console.log(`[Success] Appended ${newProjects.length} projects to database/seed.sql!`);
