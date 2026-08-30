#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
Evaluation Script: Recommendation System Metrics (Precision, Recall, F1-Score)
สำหรับประเมินประสิทธิภาพระบบแนะนำงานวิจัย มหาวิทยาลัยราชภัฏสุรินทร์
=============================================================================
"""

import json
from recommender import HybridRecommender

def evaluate_metrics():
    print("=" * 65)
    print(" SRRU DIGITAL RESEARCH REPOSITORY - RECOMMENDATION METRICS TEST")
    print("=" * 65)

    # Sample dataset
    sample_projects = [
        {
            "project_id": 1,
            "title_th": "การพัฒนาระบบแนะนำงานวิจัยอัจฉริยะด้วยการประมวลผลภาษาธรรมชาติภาษาไทยและการกรองแบบผสมผสาน",
            "title_en": "Development of Intelligent Research Recommendation System using Thai Natural Language Processing and Hybrid Filtering",
            "abstract_text": "งานวิจัยนี้นำเสนอการพัฒนาระบบคลังงานวิจัยดิจิทัลพร้อมระบบแนะนำอัจฉริยะที่ผสมผสานการประมวลผลภาษาธรรมชาติภาษาไทย ด้วยเทคนิค TF-IDF และการกรองข้อมูลแบบร่วมมือ",
            "keywords": "การประมวลผลภาษาไทย, ระบบแนะนำ, TF-IDF, คลังงานวิจัย",
            "authors": "สมชาย ใจดี",
            "advisor_name": "ผศ.ดร. ประเสริฐ สกุลดี",
            "faculty_id": 1,
            "department_id": 1,
            "publish_year": 2024
        },
        {
            "project_id": 2,
            "title_th": "การประยุกต์ใช้การเรียนรู้เชิงลึกในการจำแนกโรคใบข้าวหอมมะลิสุรินทร์ผ่านโมบายแอปพลิเคชัน",
            "title_en": "Application of Deep Learning for Surin Jasmine Rice Leaf Disease Classification via Mobile Application",
            "abstract_text": "ข้าวหอมมะลิสุรินทร์เป็นพืชเศรษฐกิจสำคัญของจังหวัดสุรินทร์ งานวิจัยนี้จึงพัฒนาโมเดล Convolutional Neural Network เพื่อตรวจจับและวินิจฉัยโรคใบข้าว",
            "keywords": "การเรียนรู้เชิงลึก, โรคใบข้าว, ข้าวหอมมะลิสุรินทร์, ปัญญาประดิษฐ์ทางการเกษตร, CNN",
            "authors": "สุดา รักเรียน",
            "advisor_name": "ผศ.ดร. ประเสริฐ สกุลดี",
            "faculty_id": 1,
            "department_id": 2,
            "publish_year": 2024
        },
        {
            "project_id": 3,
            "title_th": "กลยุทธ์การตลาดดิจิทัลและอีคอมเมิร์ซสำหรับสินค้าหัตถกรรมผ้าไหมสุรินทร์ในยุคเศรษฐกิจสร้างสรรค์",
            "title_en": "Digital Marketing and E-Commerce Strategies for Surin Silk Handicrafts in Creative Economy Era",
            "abstract_text": "วิทยานิพนธ์นี้ศึกษาพฤติกรรมผู้บริโภคและการวางกลยุทธ์การตลาดดิจิทัลบนแพลตฟอร์มโซเชียลคอมเมิร์ซสำหรับกลุ่มวิสาหกิจชุมชนทอผ้าไหมบ้านท่าสว่าง",
            "keywords": "การตลาดดิจิทัล, ผ้าไหมสุรินทร์, อีคอมเมิร์ซ, วิสาหกิจชุมชน",
            "authors": "วิชัย สุรินทร์กล้า",
            "advisor_name": "รศ.ดร. ศิริพร วิมลชัย",
            "faculty_id": 3,
            "department_id": 8,
            "publish_year": 2023
        },
        {
            "project_id": 4,
            "title_th": "การพัฒนาระบบสารสนเทศภูมิศาสตร์ (GIS) เพื่อการจัดการท่องเที่ยวเชิงวัฒนธรรมจังหวัดสุรินทร์",
            "title_en": "Development of Geographic Information System (GIS) for Cultural Tourism Management in Surin Province",
            "abstract_text": "งานวิจัยนี้นำเสนอการบูรณาการเทคโนโลยีสารสนเทศภูมิศาสตร์ เว็บแอปพลิเคชัน สำหรับแหล่งท่องเที่ยวทางวัฒนธรรม ปราสาทหินโบราณ และหมู่บ้านช้างสุรินทร์",
            "keywords": "ระบบสารสนเทศภูมิศาสตร์, การท่องเที่ยวเชิงวัฒนธรรม, จังหวัดสุรินทร์",
            "authors": "นภัสสร รุ่งเรือง",
            "advisor_name": "ผศ.ดร. ประเสริฐ สกุลดี",
            "faculty_id": 1,
            "department_id": 2,
            "publish_year": 2023
        },
        {
            "project_id": 5,
            "title_th": "การพัฒนาบทเรียนคอมพิวเตอร์ช่วยสอนแบบจำลองสถานการณ์เสมือนจริงเพื่อเสริมสร้างทักษะการแก้ปัญหาทางการเขียนโปรแกรม",
            "title_en": "Development of Simulation-Based Computer Assisted Instruction to Enhance Programming Problem Solving Skills",
            "abstract_text": "งานวิจัยนี้มีวัตถุประสงค์เพื่อพัฒนาบทเรียน CAI แบบ Virtual Simulation สำหรับนักศึกษาสาขาคอมพิวเตอร์ศึกษา เพื่อฝึกทักษะตรรกศาสตร์และการเขียนโค้ดภาษาไพธอน",
            "keywords": "คอมพิวเตอร์ช่วยสอน, สถานการณ์จำลอง, การแก้ปัญหาทางการเขียนโปรแกรม",
            "authors": "ณัฐพล ศรีวิชัย",
            "advisor_name": "ผศ.ดร. ประเสริฐ สกุลดี",
            "faculty_id": 4,
            "department_id": 10,
            "publish_year": 2024
        }
    ]

    sample_logs = [
        {"user_id": 4, "action_type": "VIEW", "project_id": 1},
        {"user_id": 4, "action_type": "BOOKMARK", "project_id": 1},
        {"user_id": 4, "action_type": "DOWNLOAD", "project_id": 1},
        {"user_id": 4, "action_type": "VIEW", "project_id": 2},
        {"user_id": 4, "action_type": "BOOKMARK", "project_id": 2},
        {"user_id": 5, "action_type": "VIEW", "project_id": 2},
        {"user_id": 5, "action_type": "DOWNLOAD", "project_id": 2},
        {"user_id": 5, "action_type": "VIEW", "project_id": 1},
        {"user_id": 6, "action_type": "VIEW", "project_id": 3},
        {"user_id": 6, "action_type": "DOWNLOAD", "project_id": 3}
    ]

    recommender = HybridRecommender(alpha=0.6, beta=0.4)
    recommender.fit(sample_projects, sample_logs, [4, 5, 6])

    # Test Ground Truth for User 4 (Target related computer science & AI research: [2, 5, 4])
    ground_truth_user4 = {2, 5, 4}
    recommendations_user4 = recommender.recommend_for_user(user_id=4, interacted_project_ids=[1], top_n=3)
    recommended_ids = {r['project_id'] for r in recommendations_user4}

    true_positives = len(recommended_ids.intersection(ground_truth_user4))
    precision = true_positives / len(recommended_ids) if recommended_ids else 0.0
    recall = true_positives / len(ground_truth_user4) if ground_truth_user4 else 0.0
    f1_score = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    print(f"[*] Evaluated User ID: 4 (Student in Computer Science)")
    print(f"[*] Interacted Projects: [Project 1: Thai NLP Recommendation System]")
    print(f"[*] Top-{len(recommended_ids)} Hybrid Recommended Projects:")
    for idx, r in enumerate(recommendations_user4, 1):
        print(f"    {idx}. [Score: {r['score']:.3f} | CB: {r['score_cb']:.3f} | CF: {r['score_cf']:.3f}] - {r['title_th'][:55]}...")

    print("-" * 65)
    print(f"[*] Evaluation Metrics Summary:")
    print(f"    - Precision@3: {precision:.4f} ({precision*100:.1f}%)")
    print(f"    - Recall@3:    {recall:.4f} ({recall*100:.1f}%)")
    print(f"    - F1-Score:    {f1_score:.4f} ({f1_score*100:.1f}%)")
    print("=" * 65)
    print(" Recommendation Evaluation Completed Successfully!")

if __name__ == '__main__':
    evaluate_metrics()
