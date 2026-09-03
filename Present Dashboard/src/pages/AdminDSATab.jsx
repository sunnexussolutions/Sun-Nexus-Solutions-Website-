import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Plus, Trash2, Save, Edit3, Brain, Layers, FolderTree,
  ExternalLink, Video, BookOpen, CheckCircle2, Clock, Eye, Copy,
  ArrowUp, ArrowDown, Sparkles, Building2, Tag, HelpCircle,
  FileText, ShieldCheck, BarChart3, Globe, Star, Search, X, Check
} from "lucide-react";
import {
  getAdminDsaStats,
  getAdminDsaTopics,
  createAdminDsaTopic,
  updateAdminDsaTopic,
  deleteAdminDsaTopic,
  reorderAdminDsaTopics,
  getAdminDsaSections,
  createAdminDsaSection,
  updateAdminDsaSection,
  deleteAdminDsaSection,
  getAdminDsaProblems,
  createAdminDsaProblem,
  updateAdminDsaProblem,
  deleteAdminDsaProblem,
  duplicateAdminDsaProblem,
  toggleAdminDsaProblemStatus
} from "../services/dsaService";
import { useTheme } from "../contexts/ThemeContext";
import AdminDsaProblemModal from "../components/dsa/AdminDsaProblemModal";

const DSA_DIFFICULTIES = ["Easy", "Medium", "Hard"];
const DSA_ICONS = ["Layers", "Code", "Link", "Database", "Target", "RotateCcw", "FolderTree", "Network", "Cpu", "Brain", "Sparkles", "Zap"];

const diffColor = (d) => {
  const normalized = (d || '').toLowerCase();
  if (normalized === 'easy') return '#10B981';
  if (normalized === 'medium') return '#F59E0B';
  return '#EF4444';
};

const EMPTY_PROBLEM = {
  id: "",
  topicId: "",
  sectionId: "",
  title: "",
  number: 1,
  difficulty: "Easy",
  description: "",
  constraints: "",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  practiceUrl: "",
  videoUrl: "",
  articleUrl: "",
  solutionUrl: "",
  editorialUrl: "",
  githubUrl: "",
  expectedConcepts: "",
  tags: "",
  companies: "",
  isVisible: true,
  examples: [{ input: "", output: "", explanation: "" }],
  hints: [""]
};

export default function AdminDSATab() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Active Admin Sub-tab: 'problems' | 'topics' | 'analytics'
  const [activeSubTab, setActiveSubTab] = useState("problems");

  // Core Data
  const [stats, setStats] = useState(null);
  const [topics, setTopics] = useState([]);
  const [sections, setSections] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState("ALL");
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  // Modal / Form States
  const [problemModalOpen, setProblemModalOpen] = useState(false);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [previewModalProblem, setPreviewModalProblem] = useState(null);

  const [problemForm, setProblemForm] = useState(EMPTY_PROBLEM);
  const [isEditingProblem, setIsEditingProblem] = useState(false);

  const [topicForm, setTopicForm] = useState({ id: "", title: "", description: "", icon: "Layers", color: "#2872A1", displayOrder: 1, isVisible: true });
  const [isEditingTopic, setIsEditingTopic] = useState(false);

  const [sectionForm, setSectionForm] = useState({ id: "", topicId: "", title: "", description: "", difficulty: "Easy", displayOrder: 1, isVisible: true });
  const [isEditingSection, setIsEditingSection] = useState(false);

  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState("");

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [s, t, sec, p] = await Promise.all([
        getAdminDsaStats(),
        getAdminDsaTopics(),
        getAdminDsaSections(),
        getAdminDsaProblems()
      ]);
      setStats(s);
      setTopics(t || []);
      setSections(sec || []);
      setProblems(p || []);
    } catch (err) {
      console.error("Admin DSA data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // ── Problem CRUD Handlers ──
  const handleOpenNewProblem = () => {
    setProblemForm({
      ...EMPTY_PROBLEM,
      id: `prob_${Date.now()}`,
      number: problems.length + 1,
      topicId: topics[0]?.id || ""
    });
    setIsEditingProblem(false);
    setProblemModalOpen(true);
  };

  const handleOpenEditProblem = (prob) => {
    setProblemForm({
      id: prob.id,
      topicId: prob.topicId || prob.topic_id || "",
      sectionId: prob.sectionId || prob.section_id || "",
      title: prob.title || "",
      number: prob.number || 1,
      difficulty: prob.difficulty || "Easy",
      description: prob.description || "",
      constraints: Array.isArray(prob.constraints) ? prob.constraints.join("\n") : (prob.constraints || ""),
      timeComplexity: prob.timeComplexity || prob.time_complexity || "",
      spaceComplexity: prob.spaceComplexity || prob.space_complexity || "",
      practiceUrl: prob.practiceUrl || prob.practice_url || "",
      videoUrl: prob.videoUrl || prob.video_url || "",
      articleUrl: prob.articleUrl || prob.article_url || "",
      solutionUrl: prob.solutionUrl || prob.solution_url || "",
      editorialUrl: prob.editorialUrl || prob.editorial_url || "",
      githubUrl: prob.githubUrl || prob.github_url || "",
      expectedConcepts: prob.expectedConcepts || prob.expected_concepts || "",
      tags: Array.isArray(prob.tags) ? prob.tags.join(", ") : (prob.tags || ""),
      companies: Array.isArray(prob.companies) ? prob.companies.join(", ") : (prob.companies || ""),
      isVisible: prob.isVisible !== false && prob.is_visible !== false,
      examples: Array.isArray(prob.examples) && prob.examples.length > 0 ? prob.examples : [{ input: "", output: "", explanation: "" }],
      hints: Array.isArray(prob.hints) && prob.hints.length > 0 ? prob.hints : [""]
    });
    setIsEditingProblem(true);
    setProblemModalOpen(true);
  };

  const handleSaveProblem = async (submittedPayload) => {
    const payload = submittedPayload || problemForm;
    if (!payload.title?.trim() || !payload.description?.trim()) {
      return alert("Title and Problem Statement are required.");
    }
    setSaving(true);
    try {
      const formattedPayload = {
        ...payload,
        tags: Array.isArray(payload.tags)
          ? payload.tags
          : (payload.tags ? payload.tags.split(",").map(s => s.trim()).filter(Boolean) : []),
        companies: Array.isArray(payload.companies)
          ? payload.companies
          : (payload.companies ? payload.companies.split(",").map(s => s.trim()).filter(Boolean) : []),
        examples: Array.isArray(payload.examples)
          ? payload.examples.filter(e => e.input || e.output)
          : [],
        hints: Array.isArray(payload.hints)
          ? payload.hints.filter(h => typeof h === 'string' && h.trim())
          : []
      };

      if (isEditingProblem) {
        await updateAdminDsaProblem(formattedPayload.id, formattedPayload);
        showToast("DSA problem updated successfully.");
      } else {
        await createAdminDsaProblem(formattedPayload);
        showToast("DSA problem created successfully.");
      }
      setProblemModalOpen(false);
      loadAdminData();
    } catch (err) {
      alert("Error saving problem: " + (err.message || "Failed to save problem."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProblem = async (id, title) => {
    if (confirm(`Are you sure you want to delete problem "${title}"?`)) {
      await deleteAdminDsaProblem(id);
      showToast("Problem deleted.");
      loadAdminData();
    }
  };

  const handleDuplicateProblem = async (id) => {
    await duplicateAdminDsaProblem(id);
    showToast("Problem duplicated successfully.");
    loadAdminData();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    await toggleAdminDsaProblemStatus(id, !currentStatus);
    showToast(`Visibility updated to ${!currentStatus ? 'Published' : 'Draft'}.`);
    loadAdminData();
  };

  // ── Topic CRUD Handlers ──
  const handleSaveTopic = async () => {
    if (!topicForm.title.trim()) return alert("Topic title is required.");
    setSaving(true);
    try {
      if (isEditingTopic) {
        await updateAdminDsaTopic(topicForm.id, topicForm);
        showToast("Topic updated successfully.");
      } else {
        await createAdminDsaTopic({ ...topicForm, id: `topic_${Date.now()}` });
        showToast("Topic created successfully.");
      }
      setTopicModalOpen(false);
      loadAdminData();
    } catch (err) {
      alert("Error saving topic: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTopic = async (id, title) => {
    if (confirm(`Delete topic "${title}" and all its subtopics? This cannot be undone.`)) {
      await deleteAdminDsaTopic(id);
      showToast("Topic deleted.");
      loadAdminData();
    }
  };

  // ── Subtopic (Section) CRUD Handlers ──
  const handleSaveSection = async () => {
    if (!sectionForm.title.trim() || !sectionForm.topicId) return alert("Title and Topic assignment are required.");
    setSaving(true);
    try {
      if (isEditingSection) {
        await updateAdminDsaSection(sectionForm.id, sectionForm);
        showToast("Subtopic updated successfully.");
      } else {
        await createAdminDsaSection({ ...sectionForm, id: `sec_${Date.now()}` });
        showToast("Subtopic created successfully.");
      }
      setSectionModalOpen(false);
      loadAdminData();
    } catch (err) {
      alert("Error saving subtopic: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (id, title) => {
    if (confirm(`Delete subtopic "${title}"?`)) {
      await deleteAdminDsaSection(id);
      showToast("Subtopic deleted.");
      loadAdminData();
    }
  };

  // Filtered problems list
  const filteredProblems = problems.filter((p) => {
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchTitle = (p.title || "").toLowerCase().includes(q);
      const matchNumber = String(p.number || "") === q;
      const matchTags = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchNumber && !matchTags) return false;
    }
    if (selectedTopicFilter !== "ALL" && (p.topicId !== selectedTopicFilter && p.topic_id !== selectedTopicFilter)) {
      return false;
    }
    if (selectedDifficultyFilter !== "ALL" && (p.difficulty || "").toUpperCase() !== selectedDifficultyFilter.toUpperCase()) {
      return false;
    }
    if (selectedStatusFilter !== "ALL") {
      const isPub = p.isVisible !== false && p.is_visible !== false;
      if (selectedStatusFilter === "PUBLISHED" && !isPub) return false;
      if (selectedStatusFilter === "DRAFT" && isPub) return false;
    }
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", fontFamily: "'Poppins', sans-serif" }}>
      {/* Toast Notification Banner */}
      {notification && (
        <div
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            backgroundColor: "#10B981",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "13.5px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)"
          }}
        >
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin DSA Suite Navigation Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "20px 24px",
          borderRadius: "18px",
          backgroundColor: isDark ? "#0E2740" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.15)" : "#CBDDE9"}`,
          boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.25)" : "0 2px 10px rgba(13, 27, 42, 0.03)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2872A1 0%, #4A90C2 100%)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Code2 size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: isDark ? "#F3F7FB" : "#0D1B2A" }}>
              DSA Learning Platform Control Suite
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: isDark ? "#8EA6BC" : "#64748B" }}>
              Full database-backed control over sheets, chapters, subtopics, problem parameters, hints, and resources.
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {[
            { id: "problems", label: "Problems", icon: Code2 },
            { id: "topics", label: "Chapters & Subtopics", icon: Layers },
            { id: "analytics", label: "Analytics Overview", icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: active ? 700 : 500,
                  backgroundColor: active ? "#2872A1" : (isDark ? "#0B1F33" : "#EFF6FB"),
                  color: active ? "#FFFFFF" : (isDark ? "#CBDDE9" : "#334155"),
                  border: `1px solid ${active ? "#2872A1" : (isDark ? "rgba(203, 221, 233, 0.15)" : "#CBDDE9")}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SUB-TAB 1: PROBLEMS MANAGER ── */}
      {activeSubTab === "problems" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Action Bar + Filters */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "16px 20px",
              borderRadius: "14px",
              backgroundColor: isDark ? "#0E2740" : "#FFFFFF",
              border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.15)" : "#CBDDE9"}`
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", flex: 1 }}>
              {/* Search */}
              <div style={{ position: "relative", minWidth: "220px", flex: 1 }}>
                <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: isDark ? "#8EA6BC" : "#64748B" }} />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 34px",
                    borderRadius: "8px",
                    border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.2)" : "#CBDDE9"}`,
                    backgroundColor: isDark ? "#0B1F33" : "#EFF6FB",
                    color: isDark ? "#F3F7FB" : "#0D1B2A",
                    fontSize: "12.5px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Topic Selector */}
              <select
                value={selectedTopicFilter}
                onChange={(e) => setSelectedTopicFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.2)" : "#CBDDE9"}`,
                  backgroundColor: isDark ? "#0B1F33" : "#EFF6FB",
                  color: isDark ? "#F3F7FB" : "#0D1B2A",
                  fontSize: "12.5px",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="ALL">All Topics</option>
                {topics.map(t => (
                  <option key={t.id} value={t.id}>{t.title || t.name}</option>
                ))}
              </select>

              {/* Difficulty Selector */}
              <select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.2)" : "#CBDDE9"}`,
                  backgroundColor: isDark ? "#0B1F33" : "#EFF6FB",
                  color: isDark ? "#F3F7FB" : "#0D1B2A",
                  fontSize: "12.5px",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>

              {/* Status Selector */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.2)" : "#CBDDE9"}`,
                  backgroundColor: isDark ? "#0B1F33" : "#EFF6FB",
                  color: isDark ? "#F3F7FB" : "#0D1B2A",
                  fontSize: "12.5px",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="ALL">All Status</option>
                <option value="PUBLISHED">Published Only</option>
                <option value="DRAFT">Draft Only</option>
              </select>
            </div>

            {/* Create Problem Button */}
            <button
              onClick={handleOpenNewProblem}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 18px",
                borderRadius: "10px",
                backgroundColor: "#2872A1",
                color: "#FFFFFF",
                border: "none",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(40, 114, 161, 0.25)"
              }}
            >
              <Plus size={16} />
              <span>Create Problem</span>
            </button>
          </div>

          {/* Problem Table */}
          <div
            style={{
              borderRadius: "14px",
              backgroundColor: isDark ? "#0E2740" : "#FFFFFF",
              border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.15)" : "#CBDDE9"}`,
              overflow: "hidden"
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: isDark ? "#0B1F33" : "#EFF6FB", borderBottom: `1px solid ${isDark ? "rgba(203, 221, 233, 0.12)" : "#CBDDE9"}` }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: isDark ? "#CBDDE9" : "#334155" }}>#</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: isDark ? "#CBDDE9" : "#334155" }}>Problem Title</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: isDark ? "#CBDDE9" : "#334155" }}>Chapter</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: isDark ? "#CBDDE9" : "#334155" }}>Difficulty</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: isDark ? "#CBDDE9" : "#334155" }}>Resources</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: isDark ? "#CBDDE9" : "#334155" }}>Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: isDark ? "#CBDDE9" : "#334155", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((prob) => {
                  const topic = topics.find(t => t.id === (prob.topicId || prob.topic_id));
                  const isPub = prob.isVisible !== false && prob.is_visible !== false;
                  return (
                    <tr
                      key={prob.id}
                      style={{ borderBottom: `1px solid ${isDark ? "rgba(203, 221, 233, 0.08)" : "#F1F5F9"}` }}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: isDark ? "#8EA6BC" : "#64748B" }}>
                        {prob.number || 0}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 600, color: isDark ? "#F3F7FB" : "#0D1B2A" }}>
                            {prob.title}
                          </span>
                          <span style={{ fontSize: "11px", color: isDark ? "#8EA6BC" : "#94A3B8" }}>
                            ID: {prob.id}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: isDark ? "#CBDDE9" : "#475569" }}>
                        {topic?.title || topic?.name || "General"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: diffColor(prob.difficulty),
                            backgroundColor: `${diffColor(prob.difficulty)}15`,
                            border: `1px solid ${diffColor(prob.difficulty)}30`
                          }}
                        >
                          {prob.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {prob.practiceUrl && <ExternalLink size={13} title="Practice URL" style={{ color: "#2872A1" }} />}
                          {prob.videoUrl && <Video size={13} title="Video Solution" style={{ color: "#EF4444" }} />}
                          {(prob.articleUrl || prob.editorialUrl) && <BookOpen size={13} title="Article/Editorial" style={{ color: "#3B82F6" }} />}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => handleToggleStatus(prob.id, isPub)}
                          style={{
                            padding: "3px 10px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 700,
                            border: "none",
                            cursor: "pointer",
                            backgroundColor: isPub
                              ? (isDark ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5")
                              : (isDark ? "rgba(245, 158, 11, 0.2)" : "#FFFBEB"),
                            color: isPub ? "#10B981" : "#D97706"
                          }}
                        >
                          {isPub ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                          <button
                            onClick={() => handleOpenEditProblem(prob)}
                            title="Edit Problem"
                            style={{
                              padding: "6px",
                              borderRadius: "6px",
                              border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.15)" : "#CBDDE9"}`,
                              background: "none",
                              color: isDark ? "#CBDDE9" : "#334155",
                              cursor: "pointer"
                            }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDuplicateProblem(prob.id)}
                            title="Duplicate Problem"
                            style={{
                              padding: "6px",
                              borderRadius: "6px",
                              border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.15)" : "#CBDDE9"}`,
                              background: "none",
                              color: isDark ? "#CBDDE9" : "#334155",
                              cursor: "pointer"
                            }}
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProblem(prob.id, prob.title)}
                            title="Delete Problem"
                            style={{
                              padding: "6px",
                              borderRadius: "6px",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              backgroundColor: isDark ? "rgba(239, 68, 68, 0.15)" : "#FEF2F2",
                              color: "#EF4444",
                              cursor: "pointer"
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: TOPICS & SUBTOPICS MANAGER ── */}
      {activeSubTab === "topics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: isDark ? "#F3F7FB" : "#0D1B2A" }}>
              Chapters & Subtopics Hierarchy
            </h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  setSectionForm({ id: `sec_${Date.now()}`, topicId: topics[0]?.id || "", title: "", description: "", difficulty: "Easy", displayOrder: 1, isVisible: true });
                  setIsEditingSection(false);
                  setSectionModalOpen(true);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  backgroundColor: isDark ? "#0B1F33" : "#EFF6FB",
                  color: isDark ? "#CBDDE9" : "#334155",
                  border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.2)" : "#CBDDE9"}`,
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <Plus size={14} /> Add Subtopic
              </button>
              <button
                onClick={() => {
                  setTopicForm({ id: `topic_${Date.now()}`, title: "", description: "", icon: "Layers", color: "#2872A1", displayOrder: topics.length + 1, isVisible: true });
                  setIsEditingTopic(false);
                  setTopicModalOpen(true);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#2872A1",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                <Plus size={14} /> Add Chapter
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px" }}>
            {topics.map((t, idx) => {
              const topSections = sections.filter(s => s.topicId === t.id || s.topic_id === t.id);
              const topProblems = problems.filter(p => p.topicId === t.id || p.topic_id === t.id);
              return (
                <div
                  key={t.id}
                  style={{
                    padding: "18px 20px",
                    borderRadius: "16px",
                    backgroundColor: isDark ? "#0E2740" : "#FFFFFF",
                    border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.15)" : "#CBDDE9"}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          backgroundColor: `${t.color || "#2872A1"}18`,
                          color: t.color || "#2872A1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "13px"
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "14.5px", fontWeight: 700, color: isDark ? "#F3F7FB" : "#0D1B2A" }}>
                          {t.title || t.name}
                        </h4>
                        <span style={{ fontSize: "11.5px", color: isDark ? "#8EA6BC" : "#64748B" }}>
                          {topProblems.length} Problems • {topSections.length} Subtopics
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={() => {
                          setTopicForm({ ...t, title: t.title || t.name });
                          setIsEditingTopic(true);
                          setTopicModalOpen(true);
                        }}
                        style={{ padding: "5px", background: "none", border: "none", color: isDark ? "#CBDDE9" : "#64748B", cursor: "pointer" }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(t.id, t.title || t.name)}
                        style={{ padding: "5px", background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Subtopics Pill List */}
                  {topSections.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: isDark ? "#8EA6BC" : "#64748B" }}>
                        Subtopics:
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {topSections.map((sec) => (
                          <div
                            key={sec.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              backgroundColor: isDark ? "#0B1F33" : "#F8FAFC",
                              fontSize: "12px"
                            }}
                          >
                            <span style={{ color: isDark ? "#CBDDE9" : "#334155" }}>{sec.title}</span>
                            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                              <span style={{ fontSize: "10.5px", color: diffColor(sec.difficulty), fontWeight: 700 }}>
                                {sec.difficulty}
                              </span>
                              <button
                                onClick={() => handleDeleteSection(sec.id, sec.title)}
                                style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "2px" }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SUB-TAB 3: ANALYTICS OVERVIEW ── */}
      {activeSubTab === "analytics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px"
            }}
          >
            {[
              { label: "Total Problems", val: stats?.totalProblems || problems.length, icon: Code2, color: "#2872A1" },
              { label: "Published Problems", val: stats?.publishedProblems || problems.filter(p => p.isVisible !== false && p.is_visible !== false).length, icon: CheckCircle2, color: "#10B981" },
              { label: "Draft Problems", val: stats?.draftProblems || problems.filter(p => p.isVisible === false || p.is_visible === false).length, icon: Clock, color: "#F59E0B" },
              { label: "Active Learners", val: stats?.activeLearners || 0, icon: Brain, color: "#8B5CF6" },
              { label: "Total Submissions", val: stats?.totalSubmissions || 0, icon: FileText, color: "#EC4899" }
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  style={{
                    padding: "18px 20px",
                    borderRadius: "16px",
                    backgroundColor: isDark ? "#0E2740" : "#FFFFFF",
                    border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.15)" : "#CBDDE9"}`
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: isDark ? "#8EA6BC" : "#64748B", fontWeight: 600 }}>{st.label}</span>
                    <Icon size={18} style={{ color: st.color }} />
                  </div>
                  <h3 style={{ margin: "8px 0 0", fontSize: "24px", fontWeight: 800, color: isDark ? "#F3F7FB" : "#0D1B2A" }}>
                    {st.val}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── REBUILT DSA PROBLEM CREATE / EDIT MODAL ── */}
      <AdminDsaProblemModal
        isOpen={problemModalOpen}
        onClose={() => setProblemModalOpen(false)}
        initialData={problemForm}
        isEditing={isEditingProblem}
        topics={topics}
        sections={sections}
        onSave={handleSaveProblem}
        saving={saving}
      />

      {/* ── TOPIC MODAL ── */}
      {topicModalOpen && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(13, 27, 42, 0.8)", backdropFilter: "blur(6px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setTopicModalOpen(false)}
        >
          <div
            style={{ width: "100%", maxWidth: "500px", backgroundColor: isDark ? "#0E2740" : "#FFFFFF", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: isDark ? "#F3F7FB" : "#0D1B2A" }}>
              {isEditingTopic ? "Edit Chapter" : "Add New Chapter"}
            </h3>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Chapter Title *</label>
              <input
                type="text"
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                placeholder="e.g. Dynamic Programming"
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.2)" : "#CBDDE9"}`, backgroundColor: isDark ? "#0B1F33" : "#F8FAFC", color: isDark ? "#F3F7FB" : "#0D1B2A", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Subtitle / Concept Summary</label>
              <input
                type="text"
                value={topicForm.description}
                onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                placeholder="e.g. Memoization, Tabulation, 1D/2D DP"
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.2)" : "#CBDDE9"}`, backgroundColor: isDark ? "#0B1F33" : "#F8FAFC", color: isDark ? "#F3F7FB" : "#0D1B2A", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
              <button onClick={() => setTopicModalOpen(false)} style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: isDark ? "#0B1F33" : "#EFF6FB", color: isDark ? "#CBDDE9" : "#334155", border: "none", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveTopic} disabled={saving} style={{ padding: "8px 20px", borderRadius: "8px", backgroundColor: "#2872A1", color: "#FFFFFF", border: "none", fontWeight: 700, cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBTOPIC (SECTION) MODAL ── */}
      {sectionModalOpen && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(13, 27, 42, 0.8)", backdropFilter: "blur(6px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setSectionModalOpen(false)}
        >
          <div
            style={{ width: "100%", maxWidth: "500px", backgroundColor: isDark ? "#0E2740" : "#FFFFFF", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: isDark ? "#F3F7FB" : "#0D1B2A" }}>
              {isEditingSection ? "Edit Subtopic" : "Add Subtopic"}
            </h3>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Parent Chapter *</label>
              <select
                value={sectionForm.topicId}
                onChange={(e) => setSectionForm({ ...sectionForm, topicId: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.2)" : "#CBDDE9"}`, backgroundColor: isDark ? "#0B1F33" : "#F8FAFC", color: isDark ? "#F3F7FB" : "#0D1B2A", boxSizing: "border-box" }}
              >
                {topics.map(t => <option key={t.id} value={t.id}>{t.title || t.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Subtopic Title *</label>
              <input
                type="text"
                value={sectionForm.title}
                onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                placeholder="e.g. Subarray Sum Equals K"
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.2)" : "#CBDDE9"}`, backgroundColor: isDark ? "#0B1F33" : "#F8FAFC", color: isDark ? "#F3F7FB" : "#0D1B2A", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Difficulty</label>
              <select
                value={sectionForm.difficulty}
                onChange={(e) => setSectionForm({ ...sectionForm, difficulty: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.2)" : "#CBDDE9"}`, backgroundColor: isDark ? "#0B1F33" : "#F8FAFC", color: isDark ? "#F3F7FB" : "#0D1B2A", boxSizing: "border-box" }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
              <button onClick={() => setSectionModalOpen(false)} style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: isDark ? "#0B1F33" : "#EFF6FB", color: isDark ? "#CBDDE9" : "#334155", border: "none", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveSection} disabled={saving} style={{ padding: "8px 20px", borderRadius: "8px", backgroundColor: "#2872A1", color: "#FFFFFF", border: "none", fontWeight: 700, cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
