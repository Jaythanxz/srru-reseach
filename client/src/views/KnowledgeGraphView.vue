<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-purple-100/90 via-white to-emerald-50/90 dark:from-[#1f103d] dark:via-[#140b29] dark:to-[#081f18] rounded-3xl p-6 sm:p-8 border border-purple-100 dark:border-purple-800/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-200/60 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 text-xs font-bold border border-purple-300/60 dark:border-purple-800">
          <span>🕸️ Academic Knowledge Network</span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ผังเครือข่ายความรู้งานวิจัย (Research Knowledge Graph)
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light max-w-2xl">
          แสดงความเชื่อมโยงเชิงความหมาย (Semantic Links) ระหว่าง คณะ, อาจารย์ที่ปรึกษา, คลัสเตอร์เทคโนโลยี, และโครงงานวิจัยใน มรภ.สุรินทร์
        </p>
      </div>

      <!-- Quick KPI Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white/80 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-purple-100 dark:border-purple-900/50 text-center shadow-2xs">
          <div class="text-xl font-black text-purple-700 dark:text-purple-300">{{ graphData.nodes.length }}</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">โหนดความรู้ทั้งหมด</div>
        </div>
        <div class="bg-white/80 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-purple-100 dark:border-purple-900/50 text-center shadow-2xs">
          <div class="text-xl font-black text-emerald-600 dark:text-emerald-400">{{ graphData.links.length }}</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">เส้นเชื่อมโยงวิชาการ</div>
        </div>
        <div class="bg-white/80 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-purple-100 dark:border-purple-900/50 text-center shadow-2xs">
          <div class="text-xl font-black text-indigo-600 dark:text-indigo-400">{{ projectNodesCount }}</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">งานวิจัยในเครือข่าย</div>
        </div>
        <div class="bg-white/80 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-purple-100 dark:border-purple-900/50 text-center shadow-2xs">
          <div class="text-xl font-black text-amber-600 dark:text-amber-400">{{ advisorNodesCount }}</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">อาจารย์ที่ปรึกษา</div>
        </div>
      </div>
    </div>

    <!-- Controls Toolbar -->
    <div class="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-purple-100 dark:border-purple-900/50 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <!-- Search Node -->
      <div class="flex items-center gap-2 flex-1 min-w-[240px]">
        <div class="relative w-full max-w-xs">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาโหนด เช่น AI, ข้าวหอมมะลิ, อาจารย์..."
            class="w-full text-xs px-3.5 py-2 pl-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
          />
          <span class="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
        </div>

        <!-- Filter by Category -->
        <select
          v-model="selectedCategory"
          class="text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500"
        >
          <option value="ALL">แสดงทุกประเภทโหนด</option>
          <option value="faculty">🏛️ เฉพาะคณะ (Faculty Hubs)</option>
          <option value="concept">🧠 เฉพาะกลุ่มเทคโนโลยี (Concepts)</option>
          <option value="advisor">👨‍🏫 เฉพาะอาจารย์ที่ปรึกษา (Advisors)</option>
          <option value="project">📄 เฉพาะผลงานวิจัย (Projects)</option>
        </select>
      </div>

      <!-- Zoom & Action Controls -->
      <div class="flex items-center gap-2">
        <button
          @click="zoomIn"
          class="w-8 h-8 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-purple-900 dark:text-purple-200 font-bold hover:bg-purple-100 flex items-center justify-center text-sm shadow-2xs"
          title="ซูมเข้า"
        >
          +
        </button>
        <button
          @click="zoomOut"
          class="w-8 h-8 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-purple-900 dark:text-purple-200 font-bold hover:bg-purple-100 flex items-center justify-center text-sm shadow-2xs"
          title="ซูมออก"
        >
          −
        </button>
        <button
          @click="resetZoom"
          class="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-purple-900 dark:text-purple-200 text-xs font-bold hover:bg-purple-100 shadow-2xs"
        >
          รีเซ็ตมุมมอง
        </button>
        <button
          @click="fetchGraphData"
          class="px-3 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-600 shadow-xs flex items-center gap-1"
        >
          <span>🔄 รีเฟรช</span>
        </button>
      </div>
    </div>

    <!-- Main Graph Canvas & Inspector Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 3 Cols: Interactive SVG Graph Canvas -->
      <div class="lg:col-span-3 bg-slate-950 rounded-3xl border border-purple-900/60 shadow-xl relative overflow-hidden h-[640px] flex items-center justify-center select-none">
        <!-- Legend Overlay (Top Left) -->
        <div class="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-purple-900/60 text-xs text-white space-y-2 shadow-lg max-w-[200px]">
          <div class="font-bold text-purple-300 text-[11px] uppercase tracking-wider">สัญลักษณ์โหนด (Legend)</div>
          <div class="space-y-1.5 text-[11px]">
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 rounded-full bg-purple-500 border border-white/40"></span>
              <span>คณะวิทยาศาสตร์ฯ</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white/40"></span>
              <span>คณะวิทยาการจัดการ</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white/40"></span>
              <span>เกษตร & อุตสาหกรรม</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 rounded-full bg-pink-500 border border-white/40"></span>
              <span>คลัสเตอร์เทคโนโลยี</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 rounded-full bg-orange-500 border border-white/40"></span>
              <span>อาจารย์ที่ปรึกษา</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-white border border-purple-400"></span>
              <span>งานวิจัย / วิทยานิพนธ์</span>
            </div>
          </div>
        </div>

        <!-- Help Hint (Bottom Left) -->
        <div class="absolute bottom-4 left-4 z-20 bg-slate-900/80 text-[10px] text-slate-400 px-3 py-1.5 rounded-xl border border-slate-800 pointer-events-none">
          💡 คลิกที่โหนดเพื่อดูรายละเอียด | สามารถลากโหนดเพื่อขยับตำแหน่งได้
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center space-y-3 text-purple-300">
          <div class="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-xs font-light">กำลังสร้างผังเครือข่ายความรู้ SRRU Knowledge Graph...</p>
        </div>

        <!-- SVG Interactive Graph Canvas -->
        <svg
          v-else
          ref="svgRef"
          class="w-full h-full cursor-grab active:cursor-grabbing"
          @mousedown="handleCanvasMouseDown"
          @mousemove="handleCanvasMouseMove"
          @mouseup="handleCanvasMouseUp"
          @wheel.prevent="handleWheel"
        >
          <!-- Background Grid Lines -->
          <defs>
            <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(147, 51, 234, 0.08)" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#graph-grid)" />

          <!-- Transformed Container -->
          <g :transform="`translate(${panX}, ${panY}) scale(${zoomLevel})`">
            <!-- Graph Links -->
            <g class="links">
              <line
                v-for="(link, idx) in visibleLinks"
                :key="idx"
                :x1="getNodeX(link.source)"
                :y1="getNodeY(link.source)"
                :x2="getNodeX(link.target)"
                :y2="getNodeY(link.target)"
                stroke="rgba(168, 85, 247, 0.28)"
                :stroke-width="link.weight || 1.5"
                stroke-dasharray="link.relation === 'APPLIES_AI' ? '4,4' : 'none'"
              />
            </g>

            <!-- Graph Nodes -->
            <g class="nodes">
              <g
                v-for="node in visibleNodes"
                :key="node.id"
                :transform="`translate(${node.x || 0}, ${node.y || 0})`"
                class="cursor-pointer group"
                @mousedown.stop="startDrag(node, $event)"
                @click.stop="selectNode(node)"
              >
                <!-- Outer Pulse Glow on Selected / Highlighted -->
                <circle
                  v-if="selectedNode && selectedNode.id === node.id"
                  :r="node.radius + 8"
                  fill="none"
                  stroke="#a855f7"
                  stroke-width="3"
                  class="animate-ping"
                />

                <!-- Node Main Circle -->
                <circle
                  :r="node.radius"
                  :fill="node.color || '#a855f7'"
                  :stroke="selectedNode && selectedNode.id === node.id ? '#ffffff' : 'rgba(255,255,255,0.7)'"
                  :stroke-width="selectedNode && selectedNode.id === node.id ? 3 : 1.5"
                  class="transition-transform duration-200 group-hover:scale-110 shadow-lg"
                />

                <!-- Node Icon / Initial -->
                <text
                  text-anchor="middle"
                  dy=".3em"
                  :font-size="node.type === 'faculty' ? 14 : node.type === 'concept' ? 12 : 10"
                  :fill="node.type === 'project' ? '#1e1b4b' : '#ffffff'"
                  font-weight="bold"
                  pointer-events="none"
                >
                  {{ node.type === 'faculty' ? '🏛️' : node.type === 'concept' ? '💡' : node.type === 'advisor' ? '👨‍🏫' : '📄' }}
                </text>

                <!-- Node Label -->
                <text
                  text-anchor="middle"
                  :dy="node.radius + 14"
                  font-size="9"
                  font-weight="bold"
                  fill="#e2e8f0"
                  class="pointer-events-none drop-shadow-md"
                >
                  {{ truncateText(node.name, 18) }}
                </text>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <!-- 1 Col: Node Inspector Panel -->
      <div class="space-y-6">
        <!-- Selected Node Card -->
        <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-purple-50 dark:border-purple-900/40 pb-3">
            <h3 class="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <span>🔍 รายละเอียดโหนด (Inspector)</span>
            </h3>
            <span
              v-if="selectedNode"
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
            >
              {{ selectedNode.category || selectedNode.type }}
            </span>
          </div>

          <div v-if="selectedNode" class="space-y-3 text-xs">
            <div class="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700 space-y-1">
              <div class="text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase">ชื่อโหนด / หัวข้อ:</div>
              <div class="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                {{ selectedNode.name }}
              </div>
              <div v-if="selectedNode.title_en" class="text-[11px] text-slate-500 dark:text-slate-400 italic">
                {{ selectedNode.title_en }}
              </div>
            </div>

            <!-- Project Details -->
            <div v-if="selectedNode.type === 'project'" class="space-y-2 text-[11px]">
              <div class="flex justify-between py-1 border-b border-purple-50 dark:border-slate-800">
                <span class="text-slate-500 dark:text-slate-400">คณะ:</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ selectedNode.faculty_name || '-' }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-purple-50 dark:border-slate-800">
                <span class="text-slate-500 dark:text-slate-400">ผู้จัดทำ:</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ selectedNode.authors || '-' }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-purple-50 dark:border-slate-800">
                <span class="text-slate-500 dark:text-slate-400">อาจารย์ที่ปรึกษา:</span>
                <span class="font-bold text-purple-700 dark:text-purple-300">{{ selectedNode.advisor_name || '-' }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-purple-50 dark:border-slate-800">
                <span class="text-slate-500 dark:text-slate-400">ปีที่เผยแพร่:</span>
                <span class="font-bold text-emerald-700 dark:text-emerald-300">พ.ศ. {{ selectedNode.publish_year || 2567 }}</span>
              </div>

              <router-link
                :to="`/projects/${selectedNode.project_id}`"
                class="block w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-purple-700 to-emerald-600 hover:from-purple-600 hover:to-emerald-500 text-white font-bold text-center shadow-xs transition-all"
              >
                เปิดอ่านเอกสาร & AI Chat ›
              </router-link>
            </div>

            <!-- Advisor Details -->
            <div v-else-if="selectedNode.type === 'advisor'" class="space-y-2 text-[11px]">
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                อาจารย์ที่ปรึกษาหลักในเครือข่ายงานวิจัย มรภ.สุรินทร์ มีความเชี่ยวชาญด้านระบบสารสนเทศ ปัญญาประดิษฐ์ และการพัฒนาชุมชนท้องถิ่น
              </p>
              <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[10px] text-purple-900 dark:text-purple-200 font-bold">
                ✓ เชื่อมโยงกับ {{ getConnectedCount(selectedNode.id) }} งานวิจัยที่ให้คำปรึกษา
              </div>
            </div>

            <!-- Faculty / Concept Details -->
            <div v-else class="space-y-2 text-[11px]">
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                คลัสเตอร์ศูนย์กลางองค์ความรู้หลัก เชื่อมโยงงานวิจัยข้ามศาสตร์และการประยุกต์ใช้เพื่อพัฒนาจังหวัดสุรินทร์
              </p>
              <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[10px] text-purple-900 dark:text-purple-200 font-bold">
                ✓ มีความเชื่อมโยงกับ {{ getConnectedCount(selectedNode.id) }} โหนดในเครือข่าย
              </div>
            </div>
          </div>

          <!-- Empty Inspector State -->
          <div v-else class="text-center py-8 space-y-2 text-slate-400">
            <div class="text-3xl">🎯</div>
            <p class="text-xs">คลิกเลือกโหนดใดก็ได้บนกราฟิกเพื่อตรวจสอบรายละเอียด</p>
          </div>
        </div>

        <!-- Academic Knowledge Summary Box -->
        <div class="bg-gradient-to-br from-purple-900 to-slate-900 text-white rounded-3xl p-5 border border-purple-800/60 shadow-md space-y-3">
          <div class="flex items-center gap-2 font-bold text-xs text-purple-200">
            <span>✨</span>
            <span>AI Knowledge Graph Synthesis</span>
          </div>
          <p class="text-[11px] text-purple-100/90 leading-relaxed font-light">
            ระบบจัดกลุ่มงานวิจัยด้วยโครงสร้าง Force Simulation ผสานการตัดคำภาษาไทย เพื่อตรวจจับความร่วมมือข้ามคณะและลดการทำวิจัยซ้ำซ้อนในสถาบัน
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const loading = ref(true);
const graphData = ref({ nodes: [], links: [], stats: {} });
const selectedNode = ref(null);
const searchQuery = ref('');
const selectedCategory = ref('ALL');

// Canvas Pan & Zoom
const panX = ref(400);
const panY = ref(300);
const zoomLevel = ref(1);
const isPanning = ref(false);
const startPan = ref({ x: 0, y: 0 });

// Dragging Node
const draggedNode = ref(null);

const projectNodesCount = computed(() => {
  return graphData.value.nodes.filter(n => n.type === 'project').length;
});

const advisorNodesCount = computed(() => {
  return graphData.value.nodes.filter(n => n.type === 'advisor').length;
});

const visibleNodes = computed(() => {
  let list = graphData.value.nodes;
  if (selectedCategory.value !== 'ALL') {
    list = list.filter(n => n.type === selectedCategory.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(n => (n.name || '').toLowerCase().includes(q) || (n.title_en || '').toLowerCase().includes(q));
  }
  return list;
});

const visibleLinks = computed(() => {
  const nodeIds = new Set(visibleNodes.value.map(n => n.id));
  return graphData.value.links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));
});

const getNodeX = (nodeId) => {
  const node = graphData.value.nodes.find(n => n.id === nodeId);
  return node ? node.x : 0;
};

const getNodeY = (nodeId) => {
  const node = graphData.value.nodes.find(n => n.id === nodeId);
  return node ? node.y : 0;
};

const getConnectedCount = (nodeId) => {
  return graphData.value.links.filter(l => l.source === nodeId || l.target === nodeId).length;
};

const truncateText = (text, max = 15) => {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '...' : text;
};

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.15, 2.5);
};

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.15, 0.4);
};

const resetZoom = () => {
  panX.value = 400;
  panY.value = 300;
  zoomLevel.value = 1;
};

const handleWheel = (e) => {
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
};

const handleCanvasMouseDown = (e) => {
  isPanning.value = true;
  startPan.value = { x: e.clientX - panX.value, y: e.clientY - panY.value };
};

const handleCanvasMouseMove = (e) => {
  if (draggedNode.value) {
    draggedNode.value.x = (e.clientX - panX.value) / zoomLevel.value;
    draggedNode.value.y = (e.clientY - panY.value) / zoomLevel.value;
  } else if (isPanning.value) {
    panX.value = e.clientX - startPan.value.x;
    panY.value = e.clientY - startPan.value.y;
  }
};

const handleCanvasMouseUp = () => {
  isPanning.value = false;
  draggedNode.value = null;
};

const startDrag = (node, e) => {
  draggedNode.value = node;
};

const selectNode = (node) => {
  selectedNode.value = node;
};

// Initialize Force-like Layout Simulation
const initializeNodePositions = () => {
  const count = graphData.value.nodes.length;

  graphData.value.nodes.forEach((node, i) => {
    if (node.type === 'faculty') {
      const angle = (i / 7) * 2 * Math.PI;
      node.x = Math.cos(angle) * 220;
      node.y = Math.sin(angle) * 220;
    } else if (node.type === 'concept') {
      const angle = ((i + 3) / 6) * 2 * Math.PI;
      node.x = Math.cos(angle) * 120;
      node.y = Math.sin(angle) * 120;
    } else if (node.type === 'advisor') {
      const angle = ((i + 5) / (count || 1)) * 2 * Math.PI;
      node.x = Math.cos(angle) * 310;
      node.y = Math.sin(angle) * 310;
    } else {
      const angle = (i / (count || 1)) * 2 * Math.PI;
      node.x = Math.cos(angle) * 380 + (Math.random() * 40 - 20);
      node.y = Math.sin(angle) * 380 + (Math.random() * 40 - 20);
    }
  });

  // Default select first project node
  const firstProj = graphData.value.nodes.find(n => n.type === 'project');
  if (firstProj) {
    selectedNode.value = firstProj;
  }
};

const fetchGraphData = async () => {
  loading.value = true;
  try {
    const res = await api.get('/projects/knowledge-graph');
    graphData.value = res;
    initializeNodePositions();
  } catch (err) {
    console.error('Fetch knowledge graph failed:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGraphData();
});
</script>
