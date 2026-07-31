import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Plus, Trash2, Save, Edit3, Brain } from "lucide-react";
import {
  addDSATopic, updateDSATopic, deleteDSATopic,
  addDSAProblem, updateDSAProblem, deleteDSAProblem,
} from "../store/dataStore";

const DSA_DIFFICULTIES = ["Easy", "Medium", "Hard"];
const DSA_ICONS = ["Layers","Code","Link","Database","Target","Shield","RotateCcw","FolderTree","Network","Cpu","Brain","BookOpen"];
const diffColor = (d) => d === "Easy" ? "#10b981" : d === "Medium" ? "#f59e0b" : "#ef4444";

const Card = ({ children, style = {} }) => (
  <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "1.25rem", padding: "1.5rem", ...style }}>
    {children}
  </div>
);

const iS = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border-strong)", fontSize: "13px", fontWeight: 600, background: "var(--bg-primary)", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" };
const lS = { display: "block", fontSize: "11px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" };
const tS = { ...iS, minHeight: "80px", resize: "vertical", fontFamily: "monospace", fontSize: "12px" };

const parseExamples = (raw) => {
  if (!raw || !raw.trim()) return [];
  return raw.split("---").map(block => {
    const lines = block.trim().split("\n");
    const get = (prefix) => { const l = lines.find(x => x.startsWith(prefix)); return l ? l.slice(prefix.length).trim() : ""; };
    return { input: get("Input:"), output: get("Output:"), explanation: get("Explanation:") };
  }).filter(e => e.input || e.output);
};

const serializeExamples = (examples) => {
  if (!Array.isArray(examples)) return "";
  return examples.map(e =>
    "Input: " + (e.input || "") + "\nOutput: " + (e.output || "") + (e.explanation ? "\nExplanation: " + e.explanation : "")
  ).join("\n---\n");
};

const EMPTY_TOPIC = { name: "", color: "#7b5cff", icon: "Layers", roadmapUrl: "", roadmapContent: "" };
const EMPTY_PROBLEM = { topicId: "", title: "", number: "", difficulty: "Easy", tags: "", description: "", examples: "", constraints: "", hints: "", timeComplexity: "", spaceComplexity: "", tutorial: "", videoUrl: "" };

export default function AdminDSATab({ dsaTopics, setDsaTopics, dsaProblems, setDsaProblems }) {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editingProblemId, setEditingProblemId] = useState(null);
  const [topicForm, setTopicForm] = useState(EMPTY_TOPIC);
  const [problemForm, setProblemForm] = useState(EMPTY_PROBLEM);
  const [saving, setSaving] = useState(false);

  const filteredProblems = selectedTopicId
    ? dsaProblems.filter(p => p.topicId === selectedTopicId)
    : dsaProblems;

  const openTopicForm = (topic = null) => {
    setTopicForm(topic ? {
      name: topic.name || "",
      color: topic.color || "#7b5cff",
      icon: topic.icon || "Layers",
      roadmapUrl: topic.roadmapUrl || topic.roadmap_url || "",
      roadmapContent: topic.roadmapContent || topic.roadmap_content || ""
    } : EMPTY_TOPIC);
    setEditingTopicId(topic ? topic.id : null);
    setShowProblemForm(false);
    setShowTopicForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProblemForm = (prob = null) => {
    setProblemForm(prob ? {
      topicId: prob.topicId, title: prob.title, number: String(prob.number || ""),
      difficulty: prob.difficulty || "Easy",
      tags: Array.isArray(prob.tags) ? prob.tags.join(", ") : (prob.tags || ""),
      description: prob.description || "", examples: serializeExamples(prob.examples),
      constraints: Array.isArray(prob.constraints) ? prob.constraints.join("\n") : (prob.constraints || ""),
      hints: Array.isArray(prob.hints) ? prob.hints.join("\n") : (prob.hints || ""),
      timeComplexity: prob.timeComplexity || "", spaceComplexity: prob.spaceComplexity || "",
      tutorial: prob.tutorial || "", videoUrl: prob.videoUrl || "",
    } : { ...EMPTY_PROBLEM, topicId: selectedTopicId || "" });
    setEditingProblemId(prob ? prob.id : null);
    setShowTopicForm(false);
    setShowProblemForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveTopic = async () => {
    if (!topicForm.name.trim()) return alert("Topic name is required.");
    setSaving(true);
    try {
      if (editingTopicId) {
        await updateDSATopic({ id: editingTopicId, ...topicForm });
        setDsaTopics(prev => prev.map(t => t.id === editingTopicId ? { ...t, ...topicForm } : t));
      } else {
        const newT = await addDSATopic(topicForm);
        setDsaTopics(prev => [...prev, newT]);
      }
      setShowTopicForm(false); setEditingTopicId(null);
    } catch (err) { alert("Error saving topic: " + err.message); }
    setSaving(false);
  };

  const handleSaveProblem = async () => {
    const p = problemForm;
    if (!p.title.trim()) return alert("Problem title is required.");
    if (!p.topicId) return alert("Please select a topic.");
    setSaving(true);
    try {
      const payload = {
        topicId: p.topicId, title: p.title.trim(), number: parseInt(p.number) || 0,
        difficulty: p.difficulty,
        tags: p.tags ? p.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        description: p.description.trim(), examples: parseExamples(p.examples),
        constraints: p.constraints ? p.constraints.split("\n").map(c => c.trim()).filter(Boolean) : [],
        hints: p.hints ? p.hints.split("\n").map(h => h.trim()).filter(Boolean) : [],
        timeComplexity: p.timeComplexity.trim(), spaceComplexity: p.spaceComplexity.trim(),
        tutorial: p.tutorial.trim(), videoUrl: p.videoUrl.trim(),
      };
      if (editingProblemId) {
        await updateDSAProblem({ id: editingProblemId, ...payload });
        setDsaProblems(prev => prev.map(pr => pr.id === editingProblemId ? { ...pr, ...payload } : pr));
      } else {
        const newP = await addDSAProblem(payload);
        setDsaProblems(prev => [...prev, newP]);
      }
      setShowProblemForm(false); setEditingProblemId(null);
    } catch (err) { alert("Error saving problem: " + err.message); }
    setSaving(false);
  };

  const handleDeleteTopic = async (topic) => {
    if (!confirm("Delete \"" + topic.name + "\" and ALL its problems? This cannot be undone.")) return;
    await deleteDSATopic(topic.id);
    setDsaTopics(prev => prev.filter(t => t.id !== topic.id));
    setDsaProblems(prev => prev.filter(p => p.topicId !== topic.id));
    if (selectedTopicId === topic.id) setSelectedTopicId(null);
  };

  const handleDeleteProblem = async (prob) => {
    if (!confirm("Delete \"" + prob.title + "\"?")) return;
    await deleteDSAProblem(prob.id);
    setDsaProblems(prev => prev.filter(p => p.id !== prob.id));
  };

  const btnPrimary = { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #7b5cff, #4f46e5)", color: "#fff", border: "none", fontWeight: 800, cursor: "pointer" };
  const btnSecondary = { padding: "10px 18px", borderRadius: "10px", background: "var(--bg-tertiary)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)", fontWeight: 700, cursor: "pointer" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header */}
      <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", background: "linear-gradient(135deg, rgba(123,92,255,0.12), rgba(79,70,229,0.08))", border: "1px solid rgba(123,92,255,0.25)" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
            <Code2 size={22} style={{ color: "#7b5cff" }} /> DSA Content Manager
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", marginBottom: 0 }}>
            {dsaTopics.length} Topics · {dsaProblems.length} Total Problems
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => openTopicForm()} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", border: "1px solid #7b5cff", background: "rgba(123,92,255,0.1)", color: "#7b5cff", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}>
            <Plus size={16} /> Add Topic
          </button>
          <button onClick={() => openProblemForm()} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", background: "linear-gradient(135deg, #7b5cff, #4f46e5)", border: "none", color: "#fff", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}>
            <Plus size={16} /> Add Problem
          </button>
        </div>
      </Card>

      {/* Topic Form */}
      <AnimatePresence>
        {showTopicForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              <h4 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "16px", color: "var(--text-primary)" }}>
                {editingTopicId ? "Edit Topic" : "New DSA Topic"}
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "16px" }}>
                <div>
                  <label style={lS}>Topic Name *</label>
                  <input value={topicForm.name} onChange={e => setTopicForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Binary Search" style={iS} />
                </div>
                <div>
                  <label style={lS}>Accent Color</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input type="color" value={topicForm.color} onChange={e => setTopicForm(f => ({ ...f, color: e.target.value }))} style={{ width: "44px", height: "38px", borderRadius: "8px", border: "1px solid var(--border-strong)", cursor: "pointer", padding: "2px" }} />
                    <input value={topicForm.color} onChange={e => setTopicForm(f => ({ ...f, color: e.target.value }))} placeholder="#7b5cff" style={{ ...iS, flex: 1 }} />
                  </div>
                </div>
                <div>
                  <label style={lS}>Icon</label>
                  <select value={topicForm.icon} onChange={e => setTopicForm(f => ({ ...f, icon: e.target.value }))} style={iS}>
                    {DSA_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lS}>Topic Roadmap URL (Optional)</label>
                  <input value={topicForm.roadmapUrl} onChange={e => setTopicForm(f => ({ ...f, roadmapUrl: e.target.value }))} placeholder="e.g. https://neetcode.io/roadmap or custom link" style={iS} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lS}>Topic Roadmap Guide / Notes (Optional)</label>
                  <textarea value={topicForm.roadmapContent} onChange={e => setTopicForm(f => ({ ...f, roadmapContent: e.target.value }))} placeholder="Describe the recommended learning path or study order for this topic..." style={{ ...tS, minHeight: "70px" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleSaveTopic} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
                  <Save size={15} /> {editingTopicId ? "Update" : "Save"} Topic
                </button>
                <button onClick={() => { setShowTopicForm(false); setEditingTopicId(null); }} style={btnSecondary}>Cancel</button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Problem Form */}
      <AnimatePresence>
        {showProblemForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              <h4 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "16px", color: "var(--text-primary)" }}>
                {editingProblemId ? "Edit Problem" : "New DSA Problem"}
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "14px" }}>
                <div><label style={lS}>Topic *</label>
                  <select value={problemForm.topicId} onChange={e => setProblemForm(f => ({ ...f, topicId: e.target.value }))} style={iS}>
                    <option value="">— Select Topic —</option>
                    {dsaTopics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div><label style={lS}>Problem Title *</label>
                  <input value={problemForm.title} onChange={e => setProblemForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Two Sum" style={iS} />
                </div>
                <div><label style={lS}>Problem #</label>
                  <input type="number" value={problemForm.number} onChange={e => setProblemForm(f => ({ ...f, number: e.target.value }))} placeholder="1" style={iS} />
                </div>
                <div><label style={lS}>Difficulty</label>
                  <select value={problemForm.difficulty} onChange={e => setProblemForm(f => ({ ...f, difficulty: e.target.value }))} style={iS}>
                    {DSA_DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div><label style={lS}>Tags (comma-separated)</label>
                  <input value={problemForm.tags} onChange={e => setProblemForm(f => ({ ...f, tags: e.target.value }))} placeholder="Arrays, Hashing" style={iS} />
                </div>
                <div><label style={lS}>Time Complexity</label>
                  <input value={problemForm.timeComplexity} onChange={e => setProblemForm(f => ({ ...f, timeComplexity: e.target.value }))} placeholder="O(n)" style={iS} />
                </div>
                <div><label style={lS}>Space Complexity</label>
                  <input value={problemForm.spaceComplexity} onChange={e => setProblemForm(f => ({ ...f, spaceComplexity: e.target.value }))} placeholder="O(1)" style={iS} />
                </div>
                <div><label style={lS}>Video URL (optional)</label>
                  <input value={problemForm.videoUrl} onChange={e => setProblemForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://youtube.com/..." style={iS} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                <div><label style={lS}>Problem Description *</label>
                  <textarea value={problemForm.description} onChange={e => setProblemForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the problem statement..." style={{ ...tS, minHeight: "90px" }} />
                </div>
                <div>
                  <label style={lS}>Examples (separate blocks with "---"; each block: "Input: ..." / "Output: ..." / "Explanation: ...")</label>
                  <textarea value={problemForm.examples} onChange={e => setProblemForm(f => ({ ...f, examples: e.target.value }))} placeholder={"Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0]+nums[1]==9\n---\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]"} style={{ ...tS, minHeight: "130px" }} />
                </div>
                <div><label style={lS}>Constraints (one per line)</label>
                  <textarea value={problemForm.constraints} onChange={e => setProblemForm(f => ({ ...f, constraints: e.target.value }))} placeholder={"2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9"} style={tS} />
                </div>
                <div><label style={lS}>Hints (one per line)</label>
                  <textarea value={problemForm.hints} onChange={e => setProblemForm(f => ({ ...f, hints: e.target.value }))} placeholder={"Try using a hash map to store seen values.\nFor each number x, check if target-x is in the map."} style={tS} />
                </div>
                <div><label style={lS}>Tutorial / Approach Explanation</label>
                  <textarea value={problemForm.tutorial} onChange={e => setProblemForm(f => ({ ...f, tutorial: e.target.value }))} placeholder="Explain the optimal approach..." style={{ ...tS, minHeight: "100px" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleSaveProblem} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
                  <Save size={15} /> {editingProblemId ? "Update" : "Save"} Problem
                </button>
                <button onClick={() => { setShowProblemForm(false); setEditingProblemId(null); }} style={btnSecondary}>Cancel</button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topics Grid */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <h4 style={{ fontWeight: 800, fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
            Topics ({dsaTopics.length})
          </h4>
          {selectedTopicId && (
            <button onClick={() => setSelectedTopicId(null)} style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-primary)", background: "none", border: "none", cursor: "pointer" }}>
              Clear Filter →
            </button>
          )}
        </div>
        {dsaTopics.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px dashed var(--border-strong)" }}>
            <Brain size={40} style={{ color: "var(--text-muted)", marginBottom: "12px" }} />
            <p style={{ color: "var(--text-muted)", margin: 0 }}>No topics yet. Click "Add Topic" to get started.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "12px" }}>
            {[...dsaTopics].sort((a, b) => (a.order || 0) - (b.order || 0)).map(topic => {
              const count = dsaProblems.filter(p => p.topicId === topic.id).length;
              const isSel = selectedTopicId === topic.id;
              return (
                <div key={topic.id} onClick={() => setSelectedTopicId(isSel ? null : topic.id)} style={{ padding: "16px", borderRadius: "16px", cursor: "pointer", background: isSel ? ("linear-gradient(135deg, " + topic.color + "25, " + topic.color + "10)") : "var(--bg-secondary)", border: isSel ? ("2px solid " + topic.color) : "1px solid var(--border-subtle)", transition: "all 0.2s ease", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: topic.color + "20", color: topic.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Code2 size={16} />
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button onClick={e => { e.stopPropagation(); openTopicForm(topic); }} style={{ padding: "4px 8px", borderRadius: "6px", background: "rgba(99,102,241,0.12)", color: "var(--accent-primary)", border: "none", cursor: "pointer" }}>
                        <Edit3 size={11} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleDeleteTopic(topic); }} style={{ padding: "4px 8px", borderRadius: "6px", background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "none", cursor: "pointer" }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>{topic.name}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: topic.color }}>{count} Problem{count !== 1 ? "s" : ""}</div>
                  <div style={{ height: "3px", borderRadius: "9999px", marginTop: "10px", background: topic.color + "25", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: "9999px", background: topic.color, width: Math.min(100, count * 5) + "%", transition: "width 0.4s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Problems List */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
          <h4 style={{ fontWeight: 800, fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
            {selectedTopicId
              ? ("Problems in \"" + (dsaTopics.find(t => t.id === selectedTopicId)?.name || "") + "\" (" + filteredProblems.length + ")")
              : ("All Problems (" + dsaProblems.length + ")")}
          </h4>
          {selectedTopicId && (
            <button onClick={() => openProblemForm()} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", background: "rgba(123,92,255,0.1)", border: "1px solid #7b5cff", color: "#7b5cff", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
              <Plus size={14} /> Add to this topic
            </button>
          )}
        </div>

        {filteredProblems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2.5rem", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px dashed var(--border-strong)" }}>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              {selectedTopicId ? "No problems in this topic yet." : "No problems yet. Add a topic first, then add problems."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[...filteredProblems].sort((a, b) => (a.order || 0) - (b.order || 0)).map(prob => {
              const topic = dsaTopics.find(t => t.id === prob.topicId);
              return (
                <Card key={prob.id} style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-muted)" }}>#{prob.number || "?"}</span>
                        <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>{prob.title}</span>
                        <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "9999px", background: diffColor(prob.difficulty) + "20", color: diffColor(prob.difficulty) }}>{prob.difficulty}</span>
                        {!selectedTopicId && topic && (
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", background: topic.color + "15", color: topic.color }}>{topic.name}</span>
                        )}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {(prob.tags || []).map(tag => (
                          <span key={tag} style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", background: "var(--bg-tertiary)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>{tag}</span>
                        ))}
                      </div>
                      {(prob.timeComplexity || prob.spaceComplexity) && (
                        <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                          {prob.timeComplexity && ("Time: " + prob.timeComplexity)}
                          {prob.timeComplexity && prob.spaceComplexity && "  ·  "}
                          {prob.spaceComplexity && ("Space: " + prob.spaceComplexity)}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <button onClick={() => openProblemForm(prob)} style={{ padding: "6px 10px", borderRadius: "8px", background: "rgba(99,102,241,0.1)", color: "var(--accent-primary)", border: "none", cursor: "pointer" }}>
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDeleteProblem(prob)} style={{ padding: "6px 10px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", cursor: "pointer" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
