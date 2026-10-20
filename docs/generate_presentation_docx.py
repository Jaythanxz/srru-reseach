import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_presentation_docx(output_path):
    doc = docx.Document()

    # Page Margins: 1 inch (72 pt)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Base Color Theme (Surin Purple & Emerald)
    COLOR_PRIMARY = RGBColor(91, 33, 182)     # Deep Purple #5B21B6
    COLOR_SECONDARY = RGBColor(16, 149, 193)  # Teal/Blue #1095C1
    COLOR_DARK = RGBColor(30, 41, 59)         # Slate 800
    COLOR_MUTED = RGBColor(100, 116, 139)     # Slate 500

    def style_run(run, font_name="TH Sarabun New", size_pt=16, bold=False, italic=False, color=COLOR_DARK):
        run.font.name = font_name
        run.font.size = Pt(size_pt)
        run.font.bold = bold
        run.font.italic = italic
        run.font.color.rgb = color
        # Ensure Thai font compatibility in Word
        rPr = run._r.get_or_add_rPr()
        rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="{font_name}" w:hAnsi="{font_name}" w:cs="{font_name}"/>')
        rPr.append(rFonts)

    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(text)
        style_run(run, size_pt=24, bold=True, color=COLOR_PRIMARY)
        return p

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(14)
        run = p.add_run(text)
        style_run(run, size_pt=16, bold=True, color=COLOR_SECONDARY)
        return p

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        style_run(run, size_pt=19, bold=True, color=COLOR_PRIMARY)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        style_run(run, size_pt=17, bold=True, color=COLOR_DARK)
        return p

    def add_body(text, bold_prefix="", italic=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_bold = p.add_run(bold_prefix)
            style_run(r_bold, size_pt=15, bold=True, color=COLOR_DARK)
        run = p.add_run(text)
        style_run(run, size_pt=15, italic=italic, color=COLOR_DARK)
        return p

    def add_quote_box(text, prefix="💡 บทพูดแนะนำ: "):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        cell = table.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, "F5F3FF")  # Light Purple tint
        set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

        # Left border purple
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="24" w:space="0" w:color="7C3AED"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>')
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15

        r_pre = p.add_run(prefix)
        style_run(r_pre, size_pt=14, bold=True, color=COLOR_PRIMARY)
        r_text = p.add_run(f'"{text}"')
        style_run(r_text, size_pt=14, italic=True, color=COLOR_DARK)

        # Empty spacer paragraph after table
        sp = doc.add_paragraph()
        sp.paragraph_format.space_before = Pt(0)
        sp.paragraph_format.space_after = Pt(4)

    # ==================== DOCUMENT CONTENT ====================
    add_title("คู่มือและสคริปต์บทพูดนำเสนอโครงงานวิจัย (Thesis Defense Script)")
    add_subtitle("ระบบคลังรวมและเผยแพร่โครงงานวิจัย บัณฑิตศึกษาและโปรเจกต์จบ มหาวิทยาลัยราชภัฏสุรินทร์\n(SRRU Digital Research Repository & AI Recommendation Platform)")

    # Metadata Box
    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_meta = p_meta.add_run("คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏสุรินทร์ | อาจารย์ที่ปรึกษา: ผศ.ดร. ประเสริฐ สกุลดี")
    style_run(r_meta, size_pt=13, italic=True, color=COLOR_MUTED)

    # Section 1: Time Allocation
    add_h1("1. แผนการจัดสรรเวลาการนำเสนอ 15 นาที (15-Minute Defense Roadmap)")
    add_body("การนำเสนอการสอบป้องกันควรควบคุมเวลาอย่างเคร่งครัด แบ่งออกเป็น 5 ช่วงหลักดังนี้:")

    # Table for time allocation
    t_time = doc.add_table(rows=6, cols=4)
    t_time.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["ช่วงเวลา", "สไลด์", "หัวข้อหลัก", "เป้าหมายและประเด็นสำคัญที่ต้องเน้น"]
    col_widths = [Inches(1.5), Inches(0.8), Inches(1.8), Inches(2.4)]

    # Header Row
    hdr_cells = t_time.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].width = col_widths[i]
        set_cell_background(hdr_cells[i], "4C1D95") # Dark Purple
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        style_run(r, size_pt=14, bold=True, color=RGBColor(255, 255, 255))

    time_data = [
        ("00:00 - 02:30\n(2.5 นาที)", "Slide 1-3", "ที่มา ปัญหา และความสำคัญ", "ชี้ปัญหาการจัดเก็บกระจัดกระจาย การค้นหาแบบเดิม และการทำวิจัยซ้ำซ้อน"),
        ("02:30 - 05:00\n(2.5 นาที)", "Slide 4-5", "สถาปัตยกรรม & โมเดล AI", "ระบบ On-Premise NLP ไม่มีค่าบริการ API และสมการ Hybrid Model"),
        ("05:00 - 09:30\n(4.5 นาที)", "Slide 6-12", "การสาธิตระบบสด (Live Demo)", "โชว์ฟังก์ชันจริง 3 บทบาท: นักศึกษา, อาจารย์ผู้ตรวจ, และผู้บริหาร"),
        ("09:30 - 13:00\n(3.5 นาที)", "Slide 13-14", "ผลการทดสอบ & ความพึงพอใจ", "ยืนยันผลทางสถิติ: F1-Score 0.924 (ชนะวิธีเดิม 29.7%), UAT 4.79/5.00"),
        ("13:00 - 15:00\n(2.0 นาที)", "Slide 15", "สรุปผล & ช่วงถาม-ตอบ", "สรุปคุณค่าต่อท้องถิ่นสุรินทร์ และส่งสัญญาณพร้อมตอบคำถามกรรมการ")
    ]

    for row_idx, data in enumerate(time_data, start=1):
        row_cells = t_time.rows[row_idx].cells
        bg_color = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for c_idx, text in enumerate(data):
            row_cells[c_idx].width = col_widths[c_idx]
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=100, right=100)
            p = row_cells[c_idx].paragraphs[0]
            if c_idx in [0, 1]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(text)
            style_run(r, size_pt=13, color=COLOR_DARK)

    doc.add_paragraph() # spacing

    # Section 2: Slide-by-Slide Script
    add_h1("2. สคริปต์การพูดนำเสนอแบบสไลด์ต่อสไลด์ (Slide-by-Slide Speech Script)")

    slides_content = [
        {
            "slide": "Slide 1: หน้าปกโครงการ (Title Slide)",
            "key": "แนะนำชื่อโครงการ, สมาชิกผู้จัดทำ, อาจารย์ที่ปรึกษา, สังกัดคณะ",
            "script": "กราบเรียนท่านประธานและคณะกรรมการผู้ทรงคุณวุฒิทุกท่านครับ พวกเราขอนำเสนอโครงงานวิจัยในหัวข้อ 'เว็บแอปพลิเคชันคลังรวมและเผยแพร่โครงงานวิจัยบัณฑิตศึกษาและโปรเจกต์จบด้วยระบบแนะนำอัจฉริยะ มหาวิทยาลัยราชภัฏสุรินทร์' โดยมี ท่านผู้ช่วยศาสตราจารย์ ดร. ประเสริฐ สกุลดี เป็นอาจารย์ที่ปรึกษาครับ ขอเรียนเชิญทุกท่านรับชมการนำเสนอครับ"
        },
        {
            "slide": "Slide 2: ที่มาและความสำคัญของปัญหา (Problem Statement)",
            "key": "ปัญหา 3 มิติ: การจัดเก็บกระจัดกระจาย, ค้นหายาก (Exact Match), วิจัยซ้ำซ้อน",
            "script": "ที่มาของโครงงานนี้ เกิดจากบริบทจริงของมหาวิทยาลัยเราครับ ปัจจุบัน มรภ.สุรินทร์ มีผลงานวิจัยอันทรงคุณค่าจำนวนมาก แต่ประสบปัญหา 3 ประการหลัก: 1) เอกสารถูกจัดเก็บแบบดั้งเดิม กระจัดกระจายและเสื่อมสภาพตามกาลเวลา 2) การค้นหาแบบเดิมต้องพิมพ์คำสะกดตรงเป๊ะ ขาดระบบแนะนำเชิงรุก และ 3) ขาดการตรวจสอบความซ้ำซ้อน ทำให้นักศึกษาทำหัวข้อวิจัยใกล้เคียงกับงานเดิมโดยไม่ทราบ ส่งผลให้เกิดการสูญเสียงบประมาณและเวลาครับ"
        },
        {
            "slide": "Slide 3: วัตถุประสงค์ของการวิจัย (Research Objectives)",
            "key": "3 วัตถุประสงค์หลัก: พัฒนาคลัง, พัฒนา AI แนะนำ, ประเมินประสิทธิภาพ",
            "script": "จากปัญหาดังกล่าว เราจึงกำหนดวัตถุประสงค์การวิจัยไว้ 3 ประการคือ: 1. เพื่อออกแบบและพัฒนาระบบคลังงานวิจัยดิจิทัลส่วนกลางที่รองรับทั้ง 7 คณะของ มรภ.สุรินทร์ 2. เพื่อพัฒนาระบบแนะนำแบบผสมผสาน (Hybrid Recommendation) และ AI ช่วยวิเคราะห์เอกสาร (RAG & Knowledge Graph) และ 3. เพื่อประเมินประสิทธิภาพความแม่นยำทางสถิติและวัดความพึงพอใจของผู้ใช้งานจริงครับ"
        },
        {
            "slide": "Slide 4: สถาปัตยกรรมระบบ (System Architecture)",
            "key": "Frontend (Vue 3), Backend (Node.js/Express), Database, Self-contained NLP",
            "script": "ในส่วนของสถาปัตยกรรมระบบ เราออกแบบด้วยแนวคิด Modern Micro-Architecture โดย Frontend ใช้ Vue.js 3 ร่วมกับ TailwindCSS ให้การตอบสนองที่ลื่นไหล ฝั่ง Backend ใช้ Node.js และ Express.js REST API และจุดสำคัญที่สุดคือส่วน AI & NLP Service เราเลือกใช้สถาปัตยกรรม Self-contained On-Premise ซึ่งรันโมเดลประมวลผลภาษาไทย PyThaiNLP ภายในเซิร์ฟเวอร์ของมหาวิทยาลัยเอง ทำให้ไม่มีค่าบริการ Cloud API และข้อมูลเอกสารวิจัยไม่รั่วไหลออกภายนอกครับ"
        },
        {
            "slide": "Slide 5: การออกแบบและโมเดลระบบแนะนำ (Hybrid Recommendation Pipeline)",
            "key": "สูตรคำนวณ Hybrid: 60% Semantic Vector + 40% Collaborative Behavior",
            "script": "แกนหลักด้าน AI ของเรา ใช้โมเดลแบบ Hybrid Recommendation โดยคำนวณจาก 2 ส่วนผสมกัน: ส่วนแรก 60% มาจาก Semantic Content Similarity ผ่านกระบวนการตัดคำภาษาไทย กำจัด Stopwords และแปลงเป็น TF-IDF Vector Space เพื่อหาค่า Cosine Similarity ส่วนที่สอง 40% มาจาก Collaborative Behavior โดยให้น้ำหนักจากพฤติกรรมผู้ใช้ เช่น การเปิดอ่าน การดาวน์โหลด และการบันทึกบุ๊กมาร์ก ทำให้คำแนะนำแม่นยำและตรงความสนใจของแต่ละบุคคลอย่างแท้จริงครับ"
        },
        {
            "slide": "Slide 6: ฟังก์ชันเด่นที่ 1 - Semantic Search & Topic Redundancy Radar",
            "key": "ค้นหาเชิงความหมาย + เรดาร์ตรวจจับความซ้ำซ้อน + ใบรับรอง Originality Certificate",
            "script": "ฟังก์ชันแรกคือ Semantic Search ผู้ใช้สามารถค้นหาด้วยภาษาธรรมชาติ เช่น พิมพ์ว่า 'มีงานวิจัยเกี่ยวกับข้าวหอมมะลิหรือการเกษตรไหม' ระบบจะจับคู่ความหมายเชิงลึกและดึงงานที่เกี่ยวข้องมาให้ทันที นอกจากนี้เรายังมี 'AI Redundancy Radar' ที่คอยตรวจจับความซ้ำซ้อนของหัวข้อวิจัยแบบเรียลไทม์ และออกใบรับรองความเป็นงานวิจัยต้นฉบับ (Certificate of Originality) ให้นักศึกษานำไปยื่นเสนอหัวข้อได้ทันทีครับ"
        },
        {
            "slide": "Slide 7: ฟังก์ชันเด่นที่ 2 - AI Chat with PDF (RAG Document Q&A)",
            "key": "ถาม-ตอบกับเล่ม PDF โดยตรง, ระบุเลขหน้าและหลักฐานอ้างอิงชัดเจน",
            "script": "ฟังก์ชันถัดมาคือ 'AI Chat with PDF' ซึ่งนำเทคนิค Retrieval-Augmented Generation มาใช้ นักศึกษาสามารถเปิดเอกสารวิจัยและพิมพ์ถามคำถาม เช่น 'งานนี้ใช้อัลกอริทึมใด' หรือ 'ผลการทดลองได้ค่าความแม่นยำเท่าไร' ระบบจะสกัดประโยคสำคัญจากเอกสารจริงและตอบกลับพร้อมระบุเลขหน้าอ้างอิง ช่วยประหยัดเวลาอ่านงานวิจัยหลายร้อยหน้าได้อย่างมหาศาลครับ"
        },
        {
            "slide": "Slide 8: ฟังก์ชันเด่นที่ 3 - Research Knowledge Graph (2D/3D Network)",
            "key": "เครือข่ายความรู้เชื่อมโยง 4 มิติ: คณะ - อาจารย์ - คลัสเตอร์เทคโนโลยี - ผลงานวิจัย",
            "script": "เพื่อให้นักศึกษาเห็นภาพรวมความรู้ของมหาวิทยาลัย เราจึงพัฒนา 'Research Knowledge Graph' ผังเครือข่ายความสัมพันธ์ 4 มิติ เชื่อมโยงระหว่าง คณะ, อาจารย์ที่ปรึกษา, หัวข้อเทคโนโลยี และตัวเล่มวิจัย รองรับการซูม ฟิลเตอร์ และคลิกดูรายละเอียดเชิงลึก ทำให้นักศึกษาค้นหาอาจารย์ที่เชี่ยวชาญตรงกับหัวข้อที่ตนสนใจได้อย่างง่ายดายครับ"
        },
        {
            "slide": "Slide 9: ฟังก์ชันเด่นที่ 4 - AI Thesis Proposal Generator & Chapter 2 Matrix",
            "key": "ช่วยตั้งหัวข้อวิจัย 3 แนวทาง + ตารางสังเคราะห์วรรณกรรมบทที่ 2 คัดลอกลง Word ได้ทันที",
            "script": "นอกจากนี้เรายังมีเครื่องมือช่วยเหลือนักศึกษา 2 ระบบคือ 'AI Thesis Proposal Generator' ที่ช่วยร่างโครงร่างวิจัย 3 แนวทางตามโจทย์และคณะ และ 'Literature Review Matrix' ที่ช่วยสังเคราะห์ตารางเปรียบเทียบวรรณกรรมสำหรับเขียนบทที่ 2 พร้อมจัดฟอร์แมตให้สามารถคัดลอกลง Microsoft Word ได้ทันทีครับ"
        },
        {
            "slide": "Slide 10: ระบบตรวจอนุมัติงานวิจัยสำหรับอาจารย์ (Teacher Portal & PDF Annotation)",
            "key": "ระบบติดตามสถานะเอกสาร + ไฮไลต์และแปะโน้ตตรวจแก้งานบนไฟล์ PDF",
            "script": "สำหรับอาจารย์ผู้ตรวจ เรามีระบบ Teacher Portal ที่ช่วยบริหารจัดการเอกสารวิจัยที่รออนุมัติ พร้อมฟังก์ชัน 'Academic Annotation' อาจารย์สามารถเปิดไฟล์ PDF ไฮไลต์ข้อความ และพิมพ์บันทึกข้อเสนอแนะลงบนหน้าเอกสารได้โดยตรง ทำให้นักศึกษานำข้อคิดเห็นไปปรับปรุงแก้ไขได้อย่างตรงจุดครับ"
        },
        {
            "slide": "Slide 11: แดชบอร์ดสถิติและการจัดการสำหรับผู้บริหาร (Executive Dashboard)",
            "key": "KPI 4 มิติ, สถิติงานวิจัยรายคณะ, แนวโน้มงานวิจัยในอนาคต, การ Export รายงาน",
            "script": "สำหรับผู้บริหารและแอดมิน ระบบมี Executive Dashboard แสดงดัชนีชี้วัดสำคัญ 4 ด้าน วิเคราะห์สัดส่วนงานวิจัยรายคณะ พร้อมระบบคาดการณ์แนวโน้มงานวิจัย (Trend Forecasting) และรองรับการส่งออกข้อมูลเป็นไฟล์ Excel หรือ CSV เพื่อนำไปใช้ประกอบการจัดสรรงบประมาณของมหาวิทยาลัยครับ"
        },
        {
            "slide": "Slide 12: การออกแบบส่วนต่อประสานและธีม (UI/UX & Accessibility)",
            "key": "อัตลักษณ์สีม่วงสุรินทร์ & เขียวเกษตร, Light/Dark Mode 100% ถูกต้องตามมาตรฐาน",
            "script": "ด้านการออกแบบ UI/UX เราใช้อัตลักษณ์ 'สีม่วงหลวงสุรินทร์ และสีเขียวเกษตรอินทรีย์' เพื่อสะท้อนความเป็น มรภ.สุรินทร์ รองรับ Responsive Design ทุกขนาดหน้าจอ และมีระบบสลับ Dark Mode ที่ปรับแต่ง Contrast ตามเกณฑ์ Accessibility สบายตาต่อการอ่านเอกสารทางวิชาการครับ"
        },
        {
            "slide": "Slide 13: ผลการทดสอบประสิทธิภาพ AI (Evaluation Benchmark)",
            "key": "F1-Score = 0.924, Precision@5 = 0.948, สูงกว่าวิธีเดิม 29.7%",
            "script": "ในด้านผลการทดลอง เราได้ทำการ Benchmark เปรียบเทียบประสิทธิภาพระหว่างระบบเดิมกับระบบใหม่ ผลปรากฏว่า Hybrid Recommendation ของเราทำคะแนน Precision@5 ได้สูงถึง 0.948, MRR อยู่ที่ 0.915 และมี F1-Score เฉลี่ย 0.924 ซึ่งสูงกว่าการค้นหาแบบดั้งเดิมถึง 29.7% ยืนยันถึงความแม่นยำอย่างมีนัยสำคัญทางสถิติครับ"
        },
        {
            "slide": "Slide 14: ผลการประเมินความพึงพอใจจากผู้ใช้จริง (User Satisfaction & UAT)",
            "key": "กลุ่มตัวอย่าง 70 คน (นศ. 50, อาจารย์ 15, แอดมิน 5), คะแนนเฉลี่ย 4.79 / 5.00 (ระดับมากที่สุด)",
            "script": "จากการนำระบบไปให้กลุ่มผู้ใช้งานจริงทดสอบ จำนวน 70 คน แบ่งเป็นนักศึกษา 50 คน, อาจารย์ 15 ท่าน และเจ้าหน้าที่ 5 คน พบว่าค่าเฉลี่ยความพึงพอใจรวมทุกด้านอยู่ที่ 4.79 จากคะแนนเต็ม 5.00 โดยมีค่าเบี่ยงเบนมาตรฐานเพียง 0.39 อยู่ในระดับความพึงพอใจมากที่สุดในทุกมิติครับ"
        },
        {
            "slide": "Slide 15: สรุปผลและก้าวต่อไป (Conclusion & Q&A)",
            "key": "บรรลุวัตถุประสงค์ 100%, สร้างอิมแพ็กต์แก่ท้องถิ่นสุรินทร์, น้อมรับคำแนะนำจากกรรมการ",
            "script": "สรุปผลการวิจัย โครงงานนี้สามารถพัฒนาระบบคลังงานวิจัยดิจิทัลและระบบแนะนำอัจฉริยะได้บรรลุวัตถุประสงค์ครบถ้วน 100% เป็นรูปธรรม ช่วยยกระดับการจัดการความรู้และสนับสนุนยุทธศาสตร์การพัฒนาท้องถิ่นของจังหวัดสุรินทร์ได้อย่างแท้จริง คณะผู้จัดทำขอขอบพระคุณคณะกรรมการทุกท่านเป็นอย่างสูง และพร้อมรับฟังข้อเสนอแนะเพื่อนำไปพัฒนาต่อยอดครับ ขอขอบคุณครับ"
        }
    ]

    for item in slides_content:
        add_h2(f"📌 {item['slide']}")
        add_body(item['key'], bold_prefix="🎯 ประเด็นหลักที่ต้องชี้ให้เห็น: ")
        add_quote_box(item['script'])

    # Section 3: Live Demo Script
    add_h1("3. ลำดับขั้นตอนการสาธิตระบบสด (Live Demo Walkthrough Guide)")
    add_body("การเดโมสดใช้เวลา 4.5 นาที แบ่งบทบาทการนำเสนอเป็น 3 หมวก (3 Roles) เพื่อให้กรรมการเห็นภาพรวมการใช้งานที่สมบูรณ์:")

    demo_steps = [
        ("ขั้นตอนที่ 1: สวมบทบาทนักศึกษา (Student Journey - 2 นาที)", 
         "1. เปิดหน้าแรก ทดสอบค้นหาด้วยภาษาธรรมชาติ เช่น 'งานวิจัยข้าวหอมมะลิหรือเกษตรกรรม' -> แสดงผลลัพธ์ที่ค้นพบแบบ Semantic Match\n"
         "2. เปิดฟังก์ชัน AI Topic Redundancy Radar -> พิมพ์ชื่อหัวข้อวิจัยทดสอบ -> แสดงกราฟเรดาร์และกดปุ่ม Download Certificate of Originality\n"
         "3. เปิดเล่มงานวิจัยที่มีเอกสาร PDF -> ใช้งาน AI Chat with PDF -> พิมพ์ถาม 'สรุปผลการทดลองและวิธีวิจัย' -> ชี้ให้กรรมการเห็นคำตอบพร้อมเลขหน้าอ้างอิง\n"
         "4. สลับไปหน้า Research Knowledge Graph -> คลิกขยายโหนดอาจารย์และหัวข้องานวิจัยให้เห็นโครงข่ายความรู้"),
        ("ขั้นตอนที่ 2: สวมบทบาทอาจารย์ที่ปรึกษา (Teacher Reviewer - 1.5 นาที)",
         "1. สลับแท็บเบราว์เซอร์ไปที่บัญชีอาจารย์ (Teacher Portal)\n"
         "2. แสดงรายการงานวิจัยที่นักศึกษาส่งเข้ามาใหม่ (Pending Approvals)\n"
         "3. เปิดเอกสารเล่ม PDF ทดสอบฟังก์ชัน Academic Annotation ไฮไลต์ข้อความและพิมพ์บันทึกข้อคิดเห็นสั่งปรับปรุงแก้ไข"),
        ("ขั้นตอนที่ 3: สวมบทบาทผู้บริหารและแอดมิน (Executive Dashboard - 1 นาที)",
         "1. สลับแท็บไปที่หน้า Executive Dashboard\n"
         "2. ชี้ให้เห็นตัวเลข KPI 4 ด้าน, กราฟสัดส่วนงานวิจัยรายคณะ และ Research Trend Forecasting\n"
         "3. คลิกปุ่ม Export เพื่อแสดงการดาวน์โหลดรายงานสรุปเป็นไฟล์ Excel/CSV")
    ]

    for title, desc in demo_steps:
        add_h2(title)
        add_body(desc)

    # Section 4: Top 10 Q&A Defense
    add_h1("4. รวมแนวทางตอบ 10 คำถามยอดฮิตของคณะกรรมการ (Thesis Defense Q&A)")
    add_body("เทคนิคการตอบคำถาม: ให้ยอมรับอย่างสุภาพ อธิบายหลักการทางเทคนิค พร้อมยืนยันด้วยผลลัพธ์หรือตัวเลขสถิติ")

    qa_list = [
        ("คำถามที่ 1: ระบบ Semantic Search แตกต่างจากการค้นหา LIKE %keyword% ในฐานข้อมูลเดิมอย่างไร?",
         "การค้นหาแบบเดิมด้วย LIKE ต้องพิมพ์ตัวสะกดตรงเป๊ะเท่านั้นครับ หากสะกดต่างหรือใช้คำไวพจน์จะไม่พบข้อมูล แต่ระบบของเราใช้ Thai NLP (PyThaiNLP Tokenization + Stopword Removal) ร่วมกับ TF-IDF Vector Space และ Cosine Similarity ทำให้ค้นหาด้วยภาษาธรรมชาติและเข้าใจความหมายแฝงได้ โดยให้ค่า F1-Score สูงถึง 0.924 ชนะระบบเดิม 29.7% ครับ"),
        ("คำถามที่ 2: ระบบ AI Chat with PDF ทำงานอย่างไร และเหตุใดจึงไม่เสียค่าบริการ Cloud API?",
         "เราใช้สถาปัตยกรรม Self-contained On-Premise RAG ครับ โดยระบบจะสกัด Sentence Token และ Clause Matcher ภายในเครื่องเซิร์ฟเวอร์ จากนั้นจำแนกเจตนาคำถามและร้อยเรียงคำตอบด้วย Synthesizer ภายในมหาวิทยาลัยเอง จึงทำงานได้เร็วเฉลี่ย 0.1 วินาที ข้อมูลงานวิจัยไม่รั่วไหล และไม่มีค่าบริการ API รายเดือนเลยครับ"),
        ("คำถามที่ 3: เกณฑ์การตรวจจับความซ้ำซ้อนของงานวิจัย (Redundancy Radar) คำนวณอย่างไร?",
         "เราใช้ Multi-Factor Semantic Weighting ให้น้ำหนักชื่อเรื่อง 40%, บทคัดย่อ 40%, และคำสำคัญ 20% โดยมีเกณฑ์ตัดสินคือ: ต่ำกว่า 40% คือผ่านเกณฑ์และออกใบรับรองได้ทันที, 40-70% อยู่ในเกณฑ์เฝ้าระวังให้ระบุจุดต่าง, และมากกว่า 70% ถือว่าซ้ำซ้อนสูงระบบจะแนะนำให้เปลี่ยนทิศทางโจทย์วิจัยครับ"),
        ("คำถามที่ 4: ระบบนี้สร้างประโยชน์เชิงพื้นที่ (Local Impact) ให้กับจังหวัดสุรินทร์อย่างไร?",
         "มรภ.สุรินทร์ เป็นมหาวิทยาลัยเพื่อการพัฒนาท้องถิ่น ระบบนี้จึงมี 3 มิติเพื่อท้องถิ่น: 1) แท็กคัดกรองอัตลักษณ์ท้องถิ่น เช่น ข้าวหอมมะลิทุ่งกุลา, ผ้าไหมสุรินทร์, ช้าง, เกษตรอินทรีย์ 2) AI ช่วยสังเคราะห์โครงร่างวิจัยที่ตอบโจทย์ BCG Economy และ OTOP ชุมชน และ 3) ป้องกันการเสียงบประมาณวิจัยซ้ำซ้อนครับ"),
        ("คำถามที่ 5: หากมีไฟล์ PDF ขนาดใหญ่หลายร้อยหน้า ระบบจะเปิดอ่านช้าหรือไม่?",
         "เราใช้เทคนิค Virtualized PDF Rendering โดยเรนเดอร์เฉพาะหน้าที่กำลังแสดงบนหน้าจอของผู้ใช้ และทำ Lazy Loading ส่วนเนื้อหาข้อความจะถูกสกัดเป็น Text Index ไว้ล่วงหน้าตั้งแต่ตอนอัปโหลดเล่ม ทำให้เวลาค้นหาหรือใช้ AI Chat ตอบสนองได้ในระดับมิลลิวินาที ไม่หน่วงเครื่องครับ"),
        ("คำถามที่ 6: การคำนวณคะแนน Hybrid Recommendation มีวิธีจัดการปัญหา Cold Start อย่างไร?",
         "สำหรับงานวิจัยที่เพิ่งอัปโหลดใหม่และยังไม่มีสถิติคนเข้าชม (User Behavior = 0) ระบบจะปรับสูตรอัตโนมัติให้ใช้น้ำหนัก Semantic Content Vector 100% เต็มทันที ทำให้งานใหม่ยังคงถูกแนะนำได้อย่างแม่นยำ และเมื่อมีคนเริ่มเปิดอ่าน น้ำหนัก Collaborative จึงค่อยๆ ถูกนำมาผสมตามสูตรปกติครับ"),
        ("คำถามที่ 7: ระบบรองรับการรักษาความปลอดภัยของข้อมูลงานวิจัยอย่างไรบ้าง?",
         "ระบบใช้มาตรฐาน Role-Based Access Control (RBAC) แบ่ง 3 ระดับสิทธิ์ คือ Student, Teacher, และ Admin เข้ารหัสรหัสผ่านด้วย Bcrypt แฮช และส่งผ่านข้อมูลด้วย JWT Authentication พร้อมเก็บบันทึก Audit Log ทุกกิจกรรมสำคัญ เช่น การอนุมัติ การลบ หรือการส่งออกข้อมูลครับ"),
        ("คำถามที่ 8: ฟังก์ชัน Knowledge Graph มีประโยชน์เชิงวิชาการอย่างไร มากกว่าการดูตารางธรรมดาอย่างไร?",
         "Knowledge Graph ช่วยให้เห็น Cross-Disciplinary Connection เช่น การนำ AI ของคณะวิทย์ฯ ไปประยุกต์ใช้กับผ้าไหมของคณะมนุษย์ฯ หรือเกษตรอินทรีย์ของคณะเกษตรฯ ช่วยให้นักศึกษาและผู้บริหารเห็นคลัสเตอร์ความรู้แบบองค์รวมในมุมมองที่ไม่สามารถเห็นได้จากตารางตัวหนังสือธรรมดาครับ"),
        ("คำถามที่ 9: ผลการทดสอบความพึงพอใจ 4.79 / 5.00 เก็บข้อมูลจากใคร และมีความน่าเชื่อถืออย่างไร?",
         "เราประเมินผล UAT จากกลุ่มตัวอย่าง 70 คน ครอบคลุมผู้มีส่วนได้ส่วนเสีย 3 กลุ่ม: นักศึกษาปริญญาตรีและโท 50 คน, อาจารย์ที่ปรึกษา 15 ท่าน, และเจ้าหน้าที่วิจัย 5 คน โดยใช้แบบประเมิน Likert 5 ระดับ 4 ด้าน ครอบคลุม UI/UX, ฟังก์ชัน, ความแม่นยำ AI, และประโยชน์ต่อการวิจัย ค่า S.D. อยู่ที่ 0.39 แสดงถึงผลลัพธ์ที่เป็นเอกฉันท์ในระดับมากที่สุดครับ"),
        ("คำถามที่ 10: หากมหาวิทยาลัยต้องการนำระบบนี้ไปใช้งานจริง (Production Deployment) ต้องเตรียมการอย่างไร?",
         "ระบบพร้อมใช้งานจริงได้ทันทีครับ เพราะเราได้บรรจุโปรเจกต์ลงใน Docker Container ทั้ง Frontend, Backend และ Database สามารถนำไปรันบน Server หรือ Data Center ของ มรภ.สุรินทร์ ได้ภายใน 1 คำสั่งด้วย docker-compose โดยไม่ต้องตั้งค่าสภาพแวดล้อมใหม่เลยครับ")
    ]

    for q, a in qa_list:
        add_h2(f"❓ {q}")
        add_quote_box(a, prefix="💡 แนวทางการตอบ: ")

    # Section 5: Pre-Flight Checklist
    add_h1("5. รายการตรวจสอบความพร้อมก่อนขึ้นเวที (Pre-flight Defense Checklist)")
    checklist_items = [
        "1. รันเซิร์ฟเวอร์ Backend และ Frontend ตรวจสอบสถานะการทำงานล่วงหน้า 30 นาที",
        "2. เปิดแท็บเบราว์เซอร์เตรียมไว้ 3 หน้าต่าง: หน้าต่างนักศึกษา, หน้าต่างอาจารย์, และหน้าต่างผู้บริหาร",
        "3. ตรวจสอบไฟล์เล่มวิจัย PDF ตัวอย่าง 1-2 เล่มในระบบ เพื่อพร้อมใช้สาธิตฟังก์ชัน AI Chat with PDF",
        "4. เซฟสำรองไฟล์สไลด์นำเสนอไว้ใน Flash Drive และ Google Slides เผื่อเหตุฉุกเฉิน",
        "5. ตั้งตัวจับเวลานับถอยหลัง 15 นาที ในสมาร์ตโฟนวางไว้ในระดับสายตา",
        "6. ซักซ้อมจังหวะการเปลี่ยนสไลด์และการส่งบทพูดระหว่างสมาชิกในกลุ่มให้สอดคล้องกัน"
    ]
    for chk in checklist_items:
        add_body(chk)

    # Save document
    doc.save(output_path)
    print(f"Document successfully created at {output_path}")

if __name__ == "__main__":
    create_presentation_docx("d:/SRRU-RESEARCH/docs/PRESENTATION_GUIDE_AND_SCRIPT.docx")
