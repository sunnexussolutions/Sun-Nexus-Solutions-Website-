import React, { useState, useEffect, useRef } from "react";
import {
  X, Save, AlertCircle, Code2, Tag, Building2,
  ExternalLink, Video, FileText, CheckCircle2, Clock,
  Sparkles, Layers, FolderTree, HelpCircle, Eye
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function AdminDsaProblemModal({
  isOpen,
  onClose,
  initialData = null,
  isEditing = false,
  topics = [],
  sections = [],
  onSave,
  saving = false
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Form State
  const [formData, setFormData] = useState({
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
    displayOrder: 1,
    isVisible: true,
    examples: [{ input: "", output: "", explanation: "" }],
    hints: [""]
  });

  const [errors, setErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const modalRef = useRef(null);

  // Sync initialData when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          id: initialData.id || "",
          topicId: initialData.topicId || initialData.topic_id || (topics[0]?.id || ""),
          sectionId: initialData.sectionId || initialData.section_id || "",
          title: initialData.title || "",
          number: initialData.number || 1,
          difficulty: initialData.difficulty || "Easy",
          description: initialData.description || "",
          constraints: Array.isArray(initialData.constraints)
            ? initialData.constraints.join("\n")
            : (initialData.constraints || ""),
          timeComplexity: initialData.timeComplexity || initialData.time_complexity || "O(n)",
          spaceComplexity: initialData.spaceComplexity || initialData.space_complexity || "O(1)",
          practiceUrl: initialData.practiceUrl || initialData.practice_url || "",
          videoUrl: initialData.videoUrl || initialData.video_url || "",
          articleUrl: initialData.articleUrl || initialData.article_url || "",
          solutionUrl: initialData.solutionUrl || initialData.solution_url || "",
          editorialUrl: initialData.editorialUrl || initialData.editorial_url || "",
          githubUrl: initialData.githubUrl || initialData.github_url || "",
          expectedConcepts: initialData.expectedConcepts || initialData.expected_concepts || "",
          tags: Array.isArray(initialData.tags)
            ? initialData.tags.join(", ")
            : (initialData.tags || ""),
          companies: Array.isArray(initialData.companies)
            ? initialData.companies.join(", ")
            : (initialData.companies || ""),
          displayOrder: initialData.displayOrder || initialData.display_order || initialData.number || 1,
          isVisible: initialData.isVisible !== false && initialData.is_visible !== false,
          examples: initialData.examples?.length
            ? initialData.examples
            : [{ input: "", output: "", explanation: "" }],
          hints: initialData.hints?.length
            ? initialData.hints
            : [""]
        });
      } else {
        // Reset to clean create state
        setFormData({
          id: `prob_${Date.now()}`,
          topicId: topics[0]?.id || "",
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
          displayOrder: 1,
          isVisible: true,
          examples: [{ input: "", output: "", explanation: "" }],
          hints: [""]
        });
      }
      setErrors({});
      setAttemptedSubmit(false);
    }
  }, [isOpen, initialData, topics]);

  // Lock Background Scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // ESC Key Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !saving) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  // Filter Subtopics / Sections for the currently selected topic
  const currentTopicSections = sections.filter(
    (s) => s.topicId === formData.topicId || s.topic_id === formData.topicId
  );

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Problem title is required.";
    if (!formData.topicId) errs.topicId = "Please select a topic / chapter.";
    if (!formData.description.trim()) errs.description = "Problem statement is required.";
    if (!formData.difficulty) errs.difficulty = "Difficulty is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    setAttemptedSubmit(true);
    if (!validate()) {
      return;
    }

    // Parse array strings
    const parsedTags = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const parsedCompanies = formData.companies
      ? formData.companies.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      tags: parsedTags,
      companies: parsedCompanies,
      number: Number(formData.number) || 1,
      displayOrder: Number(formData.displayOrder) || Number(formData.number) || 1
    };

    onSave(payload);
  };

  const updateField = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Color tokens
  const borderColor = isDark ? "rgba(203, 221, 233, 0.18)" : "#CBDDE9";
  const inputBg = isDark ? "#0B1F33" : "#F8FAFC";
  const textColor = isDark ? "#F3F7FB" : "#0D1B2A";
  const mutedText = isDark ? "#8EA6BC" : "#64748B";
  const sectionBg = isDark ? "rgba(14, 39, 64, 0.45)" : "#F8FAFC";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(13, 27, 42, 0.78)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dsa-problem-modal-title"
    >
      <div
        ref={modalRef}
        style={{
          width: "100%",
          maxWidth: "960px",
          maxHeight: "min(92vh, 880px)",
          height: "auto",
          backgroundColor: isDark ? "#0E2740" : "#FFFFFF",
          borderRadius: "20px",
          border: `1px solid ${borderColor}`,
          boxShadow: isDark
            ? "0 24px 70px rgba(0, 0, 0, 0.65)"
            : "0 20px 60px rgba(13, 27, 42, 0.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          boxSizing: "border-box"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 1. FIXED NON-SCROLLING HEADER                                     */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            flexShrink: 0,
            padding: "20px 28px",
            borderBottom: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: isDark ? "#0E2740" : "#FFFFFF"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "rgba(40, 114, 161, 0.15)",
                color: "#2872A1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Code2 size={22} />
            </div>
            <div>
              <h3
                id="dsa-problem-modal-title"
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 800,
                  color: textColor,
                  letterSpacing: "-0.01em",
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {isEditing ? "Edit DSA Problem" : "Create New DSA Problem"}
              </h3>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: mutedText
                }}
              >
                {isEditing
                  ? "Update problem attributes, resources, metadata, or statement"
                  : "Add a structured problem to the live Nexus Hub DSA sheet"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            aria-label="Close dialog"
            style={{
              background: "transparent",
              border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.15)" : "transparent"}`,
              borderRadius: "10px",
              padding: "8px",
              color: mutedText,
              cursor: saving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? "rgba(203, 221, 233, 0.1)"
                : "#EFF6FB";
              e.currentTarget.style.color = textColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = mutedText;
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 2. SCROLLABLE FORM BODY (INDEPENDENT SCROLL CONTAINER)             */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            flex: "1 1 auto",
            overflowY: "auto",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            boxSizing: "border-box"
          }}
        >
          {/* ── SECTION 01: PROBLEM IDENTITY ── */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "14px",
              backgroundColor: sectionBg,
              border: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#2872A1"
                }}
              >
                Section 01 • Problem Identity
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px"
              }}
            >
              {/* Problem Title */}
              <div style={{ gridColumn: "span 2" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  Problem Title <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Next Permutation"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: `1.5px solid ${
                      errors.title ? "#EF4444" : borderColor
                    }`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13.5px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Poppins', sans-serif"
                  }}
                />
                {errors.title && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11.5px",
                      color: "#EF4444",
                      marginTop: "4px",
                      fontWeight: 600
                    }}
                  >
                    <AlertCircle size={12} /> {errors.title}
                  </span>
                )}
              </div>

              {/* Problem Number */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  Problem Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.number}
                  onChange={(e) =>
                    updateField("number", parseInt(e.target.value) || 1)
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13.5px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Poppins', sans-serif"
                  }}
                />
              </div>

              {/* Difficulty */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  Difficulty <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => updateField("difficulty", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: `1.5px solid ${
                      errors.difficulty ? "#EF4444" : borderColor
                    }`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13.5px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer"
                  }}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic / Chapter */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  Topic / Chapter <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  value={formData.topicId}
                  onChange={(e) => {
                    updateField("topicId", e.target.value);
                    // Reset subtopic if it doesn't belong to the newly selected topic
                    updateField("sectionId", "");
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: `1.5px solid ${
                      errors.topicId ? "#EF4444" : borderColor
                    }`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13.5px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer"
                  }}
                >
                  <option value="" disabled>
                    -- Select Chapter --
                  </option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title || t.name}
                    </option>
                  ))}
                </select>
                {errors.topicId && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11.5px",
                      color: "#EF4444",
                      marginTop: "4px",
                      fontWeight: 600
                    }}
                  >
                    <AlertCircle size={12} /> {errors.topicId}
                  </span>
                )}
              </div>

              {/* Subtopic / Section */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  Subtopic / Section (Optional)
                </label>
                <select
                  value={formData.sectionId}
                  onChange={(e) => updateField("sectionId", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13.5px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer"
                  }}
                >
                  <option value="">-- None / General Section --</option>
                  {currentTopicSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── SECTION 02: PROBLEM STATEMENT ── */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "14px",
              backgroundColor: sectionBg,
              border: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#2872A1"
              }}
            >
              Section 02 • Problem Statement
            </span>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "5px",
                  color: textColor
                }}
              >
                Problem Statement (Markdown / Text){" "}
                <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target..."
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: `1.5px solid ${
                    errors.description ? "#EF4444" : borderColor
                  }`,
                  backgroundColor: inputBg,
                  color: textColor,
                  fontSize: "13.5px",
                  lineHeight: "1.6",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  resize: "vertical"
                }}
              />
              {errors.description && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11.5px",
                    color: "#EF4444",
                    marginTop: "4px",
                    fontWeight: 600
                  }}
                >
                  <AlertCircle size={12} /> {errors.description}
                </span>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "5px",
                  color: textColor
                }}
              >
                Constraints (One per line, optional)
              </label>
              <textarea
                value={formData.constraints}
                onChange={(e) => updateField("constraints", e.target.value)}
                placeholder={"2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nOnly one valid answer exists."}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: `1.5px solid ${borderColor}`,
                  backgroundColor: inputBg,
                  color: textColor,
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "monospace",
                  resize: "vertical"
                }}
              />
            </div>
          </div>

          {/* ── SECTION 03: RESOURCES & EXTERNAL LINKS ── */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "14px",
              backgroundColor: sectionBg,
              border: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#2872A1"
              }}
            >
              Section 03 • Resources & External Links
            </span>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px"
              }}
            >
              {/* Practice URL */}
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  <ExternalLink size={13} style={{ color: "#2872A1" }} />
                  Practice URL (LeetCode / Codeforces)
                </label>
                <input
                  type="url"
                  value={formData.practiceUrl}
                  onChange={(e) => updateField("practiceUrl", e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Video Solution URL */}
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  <Video size={13} style={{ color: "#EF4444" }} />
                  Video Solution URL (YouTube)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => updateField("videoUrl", e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Article / Editorial Notes URL */}
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  <FileText size={13} style={{ color: "#10B981" }} />
                  Article / Editorial Notes URL
                </label>
                <input
                  type="url"
                  value={formData.articleUrl}
                  onChange={(e) => updateField("articleUrl", e.target.value)}
                  placeholder="https://takeuforward.org/data-structure/..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Solution / GitHub URL */}
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  <Code2 size={13} style={{ color: "#8B5CF6" }} />
                  Solution / GitHub Code URL
                </label>
                <input
                  type="url"
                  value={formData.solutionUrl}
                  onChange={(e) => updateField("solutionUrl", e.target.value)}
                  placeholder="https://github.com/sun-nexus/.../solution.py"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 04: TAGS & COMPANIES ── */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "14px",
              backgroundColor: sectionBg,
              border: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#2872A1"
              }}
            >
              Section 04 • Tags & Company Badges
            </span>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px"
              }}
            >
              {/* Tags */}
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  <Tag size={13} style={{ color: "#2872A1" }} />
                  Topic Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => updateField("tags", e.target.value)}
                  placeholder="Array, Two Pointers, Dynamic Programming"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Companies */}
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  <Building2 size={13} style={{ color: "#F59E0B" }} />
                  Asked Companies (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.companies}
                  onChange={(e) => updateField("companies", e.target.value)}
                  placeholder="Google, Amazon, Microsoft, Meta"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 05: COMPLEXITY & CONCEPTS ── */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "14px",
              backgroundColor: sectionBg,
              border: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#2872A1"
              }}
            >
              Section 05 • Complexity & Expected Concepts
            </span>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px"
              }}
            >
              {/* Time Complexity */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  Expected Time Complexity
                </label>
                <input
                  type="text"
                  value={formData.timeComplexity}
                  onChange={(e) => updateField("timeComplexity", e.target.value)}
                  placeholder="O(n)"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Space Complexity */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  Expected Space Complexity
                </label>
                <input
                  type="text"
                  value={formData.spaceComplexity}
                  onChange={(e) => updateField("spaceComplexity", e.target.value)}
                  placeholder="O(1)"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Concepts */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: textColor
                  }}
                >
                  Key Pattern / Concepts
                </label>
                <input
                  type="text"
                  value={formData.expectedConcepts}
                  onChange={(e) => updateField("expectedConcepts", e.target.value)}
                  placeholder="Prefix Sum, Sliding Window"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: inputBg,
                    color: textColor,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 06: PUBLISHING & ORDERING ── */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "14px",
              backgroundColor: isDark
                ? "rgba(40, 114, 161, 0.12)"
                : "rgba(40, 114, 161, 0.06)",
              border: `1px solid ${isDark ? "rgba(40, 114, 161, 0.3)" : "rgba(40, 114, 161, 0.2)"}`,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="checkbox"
                id="publish-toggle"
                checked={formData.isVisible}
                onChange={(e) => updateField("isVisible", e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#2872A1",
                  cursor: "pointer"
                }}
              />
              <label
                htmlFor="publish-toggle"
                style={{
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: textColor,
                  cursor: "pointer"
                }}
              >
                Publish Immediately to Member Sheet
                <span
                  style={{
                    display: "block",
                    fontSize: "11.5px",
                    fontWeight: 400,
                    color: mutedText
                  }}
                >
                  Unchecking will save this problem as a Draft visible only to Admins.
                </span>
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: textColor,
                  whiteSpace: "nowrap"
                }}
              >
                Display Order:
              </label>
              <input
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={(e) =>
                  updateField("displayOrder", parseInt(e.target.value) || 1)
                }
                style={{
                  width: "70px",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: inputBg,
                  color: textColor,
                  fontSize: "13px",
                  fontWeight: 700,
                  textAlign: "center",
                  outline: "none"
                }}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 3. FIXED NON-SCROLLING FOOTER                                     */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            flexShrink: 0,
            padding: "16px 28px",
            borderTop: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: isDark ? "#0E2740" : "#FFFFFF"
          }}
        >
          <span style={{ fontSize: "11.5px", color: mutedText }}>
            {formData.isVisible ? (
              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#10B981", fontWeight: 600 }}>
                <CheckCircle2 size={13} /> Ready to publish live
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#F59E0B", fontWeight: 600 }}>
                <Clock size={13} /> Saving as Draft
              </span>
            )}
          </span>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                backgroundColor: isDark ? "#0B1F33" : "#EFF6FB",
                color: isDark ? "#CBDDE9" : "#334155",
                border: `1px solid ${isDark ? "rgba(203, 221, 233, 0.15)" : "#CBDDE9"}`,
                fontSize: "13px",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "10px",
                backgroundColor: "#2872A1",
                color: "#FFFFFF",
                border: "none",
                fontSize: "13px",
                fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(40, 114, 161, 0.35)",
                transition: "all 0.15s ease",
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              <Save size={15} />
              <span>
                {saving
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Problem"
                  : "Create Problem"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
