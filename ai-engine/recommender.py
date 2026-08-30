#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
Hybrid Recommendation Engine & Thai NLP Module
คลังรวมและเผยแพร่โครงงานวิจัยบัณฑิตศึกษาและโปรเจกต์จบ มหาวิทยาลัยราชภัฏสุรินทร์
=============================================================================
Combines Content-Based Filtering (PyThaiNLP + TF-IDF) and Collaborative
Filtering (User Activity Log Matrix) with standard weights: w1=0.6, w2=0.4
"""

import sys
import json
import re
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple

# Try importing pythainlp and sklearn, fallback gracefully if not installed
try:
    from pythainlp.tokenize import word_tokenize
    from pythainlp.corpus import thai_stopwords
    PYTHAINLP_AVAILABLE = True
except ImportError:
    PYTHAINLP_AVAILABLE = False

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


# Default Thai Stopwords list (Comprehensive backup in case pythainlp corpus is offline)
DEFAULT_THAI_STOPWORDS = {
    'การ', 'ความ', 'ที่', 'และ', 'ใน', 'ของ', 'เป็น', 'ได้', 'มี', 'ให้', 'โดย', 'จาก',
    'เพื่อ', 'นี้', 'นั้น', 'ไป', 'มา', 'กับ', 'กัน', 'จะ', 'แล้ว', 'ซึ่ง', 'หรือ',
    'ผู้', 'ว่า', 'จึง', 'ทำ', 'ถึง', 'ตาม', 'เข้า', 'ออก', 'อยู่', 'ขึ้น', 'ลง', 'ตน',
    'ตัว', 'ด้วย', 'อัน', 'พบ', 'งาน', 'ผล', 'วิจัย', 'ศึกษา', 'พัฒนา', 'ระบบ', 'โครงการ'
}


class ThaiNLPProcessor:
    """Thai NLP Text Preprocessor with PyThaiNLP support."""

    def __init__(self):
        if PYTHAINLP_AVAILABLE:
            self.stopwords = set(thai_stopwords())
        else:
            self.stopwords = DEFAULT_THAI_STOPWORDS

    def clean_text(self, text: str) -> str:
        """Remove punctuation, special characters, multiple whitespaces."""
        if not text:
            return ""
        # Remove URLs, email, numbers and special symbols
        text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
        text = re.sub(r'[^\w\s\u0E00-\u0E7F]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def tokenize(self, text: str) -> List[str]:
        """Tokenize Thai text and filter stopwords."""
        cleaned = self.clean_text(text)
        if not cleaned:
            return []

        if PYTHAINLP_AVAILABLE:
            tokens = word_tokenize(cleaned, engine='newmm', keep_whitespace=False)
        else:
            # Fallback simple Thai syllable/word boundary splitter
            tokens = [w for w in re.split(r'(\s+)', cleaned) if w.strip()]

        filtered_tokens = [
            t.lower() for t in tokens
            if len(t.strip()) > 1 and t.lower() not in self.stopwords and not t.isnumeric()
        ]
        return filtered_tokens


class ContentBasedRecommender:
    """Content-Based Filtering using Thai TF-IDF and Cosine Similarity."""

    def __init__(self):
        self.nlp = ThaiNLPProcessor()
        self.tfidf_vectorizer = None
        self.tfidf_matrix = None
        self.project_ids = []
        self.projects_dict = {}

    def fit(self, projects: List[Dict[str, Any]]):
        """Fit TF-IDF matrix on project titles, abstracts, and keywords."""
        self.project_ids = [p['project_id'] for p in projects]
        self.projects_dict = {p['project_id']: p for p in projects}

        # Combine text fields: title_th + title_en + abstract_text + keywords
        corpus = []
        for p in projects:
            text_content = f"{p.get('title_th', '')} {p.get('title_en', '')} {p.get('abstract_text', '')} {p.get('keywords', '')}"
            tokenized_words = self.nlp.tokenize(text_content)
            corpus.append(" ".join(tokenized_words))

        if SKLEARN_AVAILABLE and len(corpus) > 0:
            self.tfidf_vectorizer = TfidfVectorizer()
            self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(corpus)
        else:
            # Simple term-frequency fallback
            self.tfidf_matrix = None

    def get_item_similarity_scores(self, target_project_id: int) -> Dict[int, float]:
        """Compute cosine similarity of target_project with all other projects."""
        scores = {}
        if target_project_id not in self.project_ids:
            return scores

        idx = self.project_ids.index(target_project_id)

        if SKLEARN_AVAILABLE and self.tfidf_matrix is not None:
            target_vec = self.tfidf_matrix[idx]
            sim_scores = cosine_similarity(target_vec, self.tfidf_matrix).flatten()
            for i, p_id in enumerate(self.project_ids):
                if p_id != target_project_id:
                    scores[p_id] = float(sim_scores[i])
        else:
            # Fallback keyword overlap Jaccard similarity
            target_p = self.projects_dict[target_project_id]
            target_words = set(self.nlp.tokenize(f"{target_p.get('title_th', '')} {target_p.get('keywords', '')}"))
            for p_id, p in self.projects_dict.items():
                if p_id != target_project_id:
                    p_words = set(self.nlp.tokenize(f"{p.get('title_th', '')} {p.get('keywords', '')}"))
                    intersection = len(target_words.intersection(p_words))
                    union = len(target_words.union(p_words)) or 1
                    scores[p_id] = float(intersection / union)

        return scores

    def get_user_profile_scores(self, user_interaction_project_ids: List[int]) -> Dict[int, float]:
        """Generate user profile from interacted research papers and compute candidate scores."""
        scores = {p_id: 0.0 for p_id in self.project_ids}
        if not user_interaction_project_ids or not self.project_ids:
            return scores

        valid_ids = [pid for pid in user_interaction_project_ids if pid in self.project_ids]
        if not valid_ids:
            return scores

        for pid in valid_ids:
            item_sims = self.get_item_similarity_scores(pid)
            for other_id, sim in item_sims.items():
                scores[other_id] += sim

        # Normalize scores
        max_score = max(scores.values()) if scores and max(scores.values()) > 0 else 1.0
        for pid in scores:
            scores[pid] = scores[pid] / max_score

        return scores


class CollaborativeFilteringRecommender:
    """Collaborative Filtering from User Activity Logs (View: 1.0, Download: 2.0, Bookmark: 3.0)."""

    WEIGHTS = {
        'VIEW': 1.0,
        'DOWNLOAD': 2.0,
        'BOOKMARK': 3.0
    }

    def __init__(self):
        self.user_item_matrix = None
        self.users = []
        self.projects = []

    def fit(self, user_logs: List[Dict[str, Any]], all_project_ids: List[int], all_user_ids: List[int]):
        """Construct User-Item interaction matrix."""
        self.projects = all_project_ids
        self.users = all_user_ids

        # Build interaction dictionary: (user_id, project_id) -> score
        interactions = {}
        for log in user_logs:
            u_id = log.get('user_id')
            p_id = log.get('project_id')
            act = log.get('action_type')
            if u_id and p_id and act in self.WEIGHTS:
                weight = self.WEIGHTS[act]
                key = (u_id, p_id)
                interactions[key] = interactions.get(key, 0.0) + weight

        # Build matrix
        matrix = np.zeros((len(self.users), len(self.projects)))
        user_map = {u: i for i, u in enumerate(self.users)}
        proj_map = {p: i for i, p in enumerate(self.projects)}

        for (u, p), score in interactions.items():
            if u in user_map and p in proj_map:
                matrix[user_map[u], proj_map[p]] = score

        self.user_item_matrix = matrix

    def predict_user_scores(self, target_user_id: int) -> Dict[int, float]:
        """Compute User-User collaborative similarity and predict affinity for items."""
        scores = {p_id: 0.0 for p_id in self.projects}
        if self.user_item_matrix is None or target_user_id not in self.users:
            return scores

        u_idx = self.users.index(target_user_id)
        target_vector = self.user_item_matrix[u_idx].reshape(1, -1)

        # If user has no interactions yet, return zero scores
        if np.sum(target_vector) == 0:
            return scores

        if SKLEARN_AVAILABLE:
            user_sims = cosine_similarity(target_vector, self.user_item_matrix).flatten()
        else:
            # Fallback dot-product similarity
            norms = np.linalg.norm(self.user_item_matrix, axis=1) * np.linalg.norm(target_vector)
            norms[norms == 0] = 1.0
            user_sims = np.dot(self.user_item_matrix, target_vector.T).flatten() / norms

        # Predict ratings: weighted sum of other users' ratings
        sim_weights = np.copy(user_sims)
        sim_weights[u_idx] = 0.0 # Exclude self
        sum_sims = np.sum(np.abs(sim_weights))

        if sum_sims > 0:
            predicted_vector = np.dot(sim_weights, self.user_item_matrix) / sum_sims
        else:
            predicted_vector = np.zeros(len(self.projects))

        for j, p_id in enumerate(self.projects):
            scores[p_id] = float(predicted_vector[j])

        # Normalize
        max_val = max(scores.values()) if scores and max(scores.values()) > 0 else 1.0
        for p_id in scores:
            scores[p_id] = scores[p_id] / max_val

        return scores


class HybridRecommender:
    """
    Hybrid Recommendation Engine combining Content-Based and Collaborative Filtering:
    Score = (alpha * Score_CB) + (beta * Score_CF)
    Default: alpha = 0.6, beta = 0.4
    """

    def __init__(self, alpha: float = 0.6, beta: float = 0.4):
        self.alpha = alpha
        self.beta = beta
        self.cb_engine = ContentBasedRecommender()
        self.cf_engine = CollaborativeFilteringRecommender()
        self.projects = []

    def fit(self, projects: List[Dict[str, Any]], user_logs: List[Dict[str, Any]], all_user_ids: List[int]):
        """Train both models on dataset."""
        self.projects = projects
        project_ids = [p['project_id'] for p in projects]

        self.cb_engine.fit(projects)
        self.cf_engine.fit(user_logs, project_ids, all_user_ids)

    def recommend_for_user(self, user_id: int, interacted_project_ids: List[int], top_n: int = 5) -> List[Dict[str, Any]]:
        """Compute hybrid recommendation scores for a user."""
        cb_scores = self.cb_engine.get_user_profile_scores(interacted_project_ids)
        cf_scores = self.cf_engine.predict_user_scores(user_id)

        combined_scores = []
        for p in self.projects:
            pid = p['project_id']
            # Exclude projects already interacted with if needed, or keep for comprehensive ranking
            score_cb = cb_scores.get(pid, 0.0)
            score_cf = cf_scores.get(pid, 0.0)
            final_score = (self.alpha * score_cb) + (self.beta * score_cf)

            combined_scores.append({
                'project_id': pid,
                'title_th': p.get('title_th'),
                'title_en': p.get('title_en'),
                'abstract_text': p.get('abstract_text'),
                'keywords': p.get('keywords'),
                'authors': p.get('authors'),
                'advisor_name': p.get('advisor_name'),
                'faculty_id': p.get('faculty_id'),
                'department_id': p.get('department_id'),
                'publish_year': p.get('publish_year'),
                'score': round(float(final_score), 4),
                'score_cb': round(float(score_cb), 4),
                'score_cf': round(float(score_cf), 4)
            })

        # Sort by final score descending
        combined_scores.sort(key=lambda x: x['score'], reverse=True)
        return combined_scores[:top_n]

    def recommend_similar_projects(self, project_id: int, top_n: int = 4) -> List[Dict[str, Any]]:
        """Content-based item-to-item similarity recommendations."""
        sim_scores = self.cb_engine.get_item_similarity_scores(project_id)
        results = []
        for p in self.projects:
            pid = p['project_id']
            if pid == project_id:
                continue
            score = sim_scores.get(pid, 0.0)
            results.append({
                'project_id': pid,
                'title_th': p.get('title_th'),
                'title_en': p.get('title_en'),
                'abstract_text': p.get('abstract_text'),
                'keywords': p.get('keywords'),
                'authors': p.get('authors'),
                'advisor_name': p.get('advisor_name'),
                'similarity_score': round(float(score), 4)
            })

        results.sort(key=lambda x: x['similarity_score'], reverse=True)
        return results[:top_n]


# CLI Execution Interface for Node.js Subprocess or Direct Execution
if __name__ == '__main__':
    if len(sys.argv) > 1:
        mode = sys.argv[1] # 'personalized' or 'similar'

        try:
            # Read input JSON payload from stdin
            input_data = json.loads(sys.stdin.read())
            projects = input_data.get('projects', [])
            logs = input_data.get('logs', [])
            user_ids = input_data.get('user_ids', [])

            recommender = HybridRecommender(alpha=0.6, beta=0.4)
            recommender.fit(projects, logs, user_ids)

            if mode == 'personalized':
                user_id = input_data.get('user_id', 4)
                interacted_ids = input_data.get('interacted_project_ids', [])
                top_n = input_data.get('top_n', 5)
                recs = recommender.recommend_for_user(user_id, interacted_ids, top_n)
                print(json.dumps({'success': True, 'recommendations': recs}, ensure_ascii=False))

            elif mode == 'similar':
                project_id = input_data.get('project_id', 1)
                top_n = input_data.get('top_n', 4)
                recs = recommender.recommend_similar_projects(project_id, top_n)
                print(json.dumps({'success': True, 'similar_projects': recs}, ensure_ascii=False))

            else:
                print(json.dumps({'success': False, 'message': f'Unknown mode {mode}'}))
        except Exception as e:
            print(json.dumps({'success': False, 'error': str(e)}))
    else:
        print("SRRU Hybrid Recommendation Engine (PyThaiNLP + TF-IDF + Collaborative Filtering)")
