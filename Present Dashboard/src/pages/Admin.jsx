import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Users, BrainCircuit, MessageSquare, Bell,
  Plus, Trash2, Eye, X, Save, ChevronDown, ChevronUp,
  BarChart3, FileText, Send, Star, Zap, Calendar, TrendingUp,
  User, Layers, Code2, Database, Palette, Server, Smartphone, Cloud
} from 'lucide-react';
import {
  getAssessments, addAssessment, updateAssessment, deleteAssessment,
  getUsers, getResults, deleteUser, updateUserStatus,
  getDiscussions, addDiscussion, deleteDiscussion,
  getNotifications, addNotification, deleteNotification,
  getDomains, addDomain, updateDomain, deleteDomain
} from '../store/dataStore';
import { extractTextFromPDF, extractTextFromWord, extractQuestionsFromExcel, parseMCQsFromText } from '../utils/fileParser';
import { UserPerformanceGraph, CollectivePerformanceGraph } from '../components/AnalyticsCharts';
import { prepareUserChartData, prepareCollectiveChartData } from '../utils/analytics';
import { useAuth } from '../contexts/AuthContext';
import UnderProgress from '../components/UnderProgress';

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: BarChart3 },
  { id: 'assessments',   label: 'Assessments',   icon: BrainCircuit },
  { id: 'domains',       label: 'Domains',       icon: Layers },
  { id: 'users',         label: 'Users',         icon: Users },
  { id: 'discussions',   label: 'Discussions',   icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const CATEGORIES = ['Quantitative', 'Logical Reasoning', 'Verbal Ability'];

const ICON_MAP = {
  Layers, Code2, BrainCircuit, ShieldCheck, 
  Database, Smartphone, Cloud, Palette, Server
};

// ── Reusable card ─────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '1.25rem', padding: '1.5rem', ...style }}>
    {children}
  </div>
);

// ── Stat box ──────────────────────────────────────────────────────────────────
const StatBox = ({ label, value, icon: Icon, color, onClick, active }) => (
  <motion.div
    whileHover={{ translateY: -4, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.2)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={{
      background: active ? `${color}15` : 'var(--bg-secondary)',
      border: `2px solid ${active ? color : 'transparent'}`,
      borderRadius: '1.5rem', padding: '1.75rem', cursor: 'pointer',
      transition: 'background 0.2s, border-color 0.2s',
      boxShadow: active ? `0 0 0 2px ${color}20` : '0 4px 12px rgba(0,0,0,0.05)',
      position: 'relative', overflow: 'hidden'
    }}
  >
    {active && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: color }} />}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
      <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: active ? color : 'var(--text-muted)' }}>{label}</span>
      <div style={{ padding: '10px', borderRadius: '12px', background: `${color}15`, color }}><Icon size={20} /></div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <p style={{ fontSize: '2.5rem', fontWeight: 900, color: active ? color : 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</p>
      {active && <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: '10px', fontWeight: 900, color, textTransform: 'uppercase' }}>Active View</motion.div>}
    </div>
  </motion.div>
);

// ── Question builder ──────────────────────────────────────────────────────────
const emptyQuestion = () => ({ text: '', options: ['', '', '', ''], answer: 0, explanation: '' });

const QuestionBuilder = ({ questions, setQuestions, attempted = false }) => {
  const add = () => setQuestions(q => [...q, emptyQuestion()]);
  const remove = (i) => setQuestions(q => q.filter((_, idx) => idx !== i));
  const update = (i, field, val) => setQuestions(q => q.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const updateOption = (qi, oi, val) => setQuestions(q => q.map((item, idx) => idx === qi ? { ...item, options: item.options.map((o, oidx) => oidx === oi ? val : o) } : item));

  const qBorder = (val) => {
    if (!attempted) return 'var(--border-strong)';
    return val.trim() ? '#22c55e' : '#ef4444';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {questions.map((q, i) => (
        <div key={i} style={{ background: 'var(--bg-tertiary)', border: `1px solid ${attempted && !q.text.trim() ? '#ef4444' : 'var(--border-subtle)'}`, borderRadius: '1rem', padding: '1.25rem', position: 'relative', transition: 'border-color 0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Q{i + 1}</span>
            <button onClick={() => remove(i)} style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
              <Trash2 size={12} /> Remove
            </button>
          </div>
          <input
            value={q.text}
            onChange={e => update(i, 'text', e.target.value)}
            placeholder="Question text..."
            style={{ width: '100%', background: 'var(--bg-secondary)', border: `1px solid ${qBorder(q.text)}`, borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '12px', outline: 'none', transition: 'border-color 0.2s' }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {q.options.map((opt, oi) => (
              <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="radio" name={`correct-${i}`} checked={q.answer === oi} onChange={() => update(i, 'answer', oi)} style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
                <input
                  value={opt}
                  onChange={e => updateOption(i, oi, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                  style={{
                    flex: 1,
                    background: q.answer === oi ? 'rgba(99,102,241,0.1)' : 'var(--bg-secondary)',
                    border: `1px solid ${attempted && !opt.trim() ? '#ef4444' : q.answer === oi ? 'rgba(99,102,241,0.4)' : attempted && opt.trim() ? '#22c55e' : 'var(--border-subtle)'}`,
                    borderRadius: '8px', padding: '8px 12px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s'
                  }}
                />
              </div>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: attempted && !q.text.trim() ? '#ef4444' : 'var(--text-muted)' }}>
            {attempted && !q.text.trim() ? 'Question text is required.' : 'Select the radio button next to the correct answer.'}
          </p>
          <input
            value={q.explanation || ''}
            onChange={e => update(i, 'explanation', e.target.value)}
            placeholder="Explanation (shown to user after submission)..."
            style={{ width: '100%', marginTop: '10px', background: 'var(--bg-secondary)', border: `1px solid ${attempted && !q.explanation?.trim() ? '#ef4444' : q.explanation?.trim() ? '#22c55e' : 'var(--border-subtle)'}`, borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s' }}
          />
        </div>
      ))}
      <button onClick={add} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: '1.5px dashed var(--border-strong)', background: 'transparent', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.06)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <Plus size={16} /> Add Question
      </button>
    </div>
  );
};

// ── Sub-domain builder ────────────────────────────────────────────────────────
const SubDomainBuilder = ({ subs, setSubs, inputStyle }) => {
  const add = () => setSubs(s => [...(s || []), { id: `sub-${Date.now()}`, title: '', icon: 'Code2', color: '#6366f1', desc: '', stats: '' }]);
  const remove = (id) => setSubs(s => (s || []).filter(item => item.id !== id));
  const update = (id, field, val) => setSubs(s => (s || []).map(item => item.id === id ? { ...item, [field]: val } : item));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid var(--border-subtle)' }}>
      <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specializations (Sub-Domains)</label>
      {(subs || []).map(s => (
        <div key={s.id} style={{ display: 'flex', gap: '10px', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '12px', alignItems: 'center' }}>
          <div style={{ flex: 2 }}>
            <input value={s.title} onChange={e => update(s.id, 'title', e.target.value)} placeholder="Sub Title..." style={{ ...inputStyle, marginBottom: '5px' }} />
            <input value={s.stats} onChange={e => update(s.id, 'stats', e.target.value)} placeholder="Stats (e.g. 50+ Enrolled)" style={{ ...inputStyle, marginBottom: '5px' }} />
            <input 
              value={(s.topics || []).join(', ')} 
              onChange={e => update(s.id, 'topics', e.target.value.split(',').map(t => t.trim()))} 
              placeholder="Topics (comma separated)..." 
              style={inputStyle} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <select value={s.icon} onChange={e => update(s.id, 'icon', e.target.value)} style={inputStyle}>
              {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <button onClick={() => remove(s.id)} style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button 
        onClick={add} 
        style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, border: '1px dashed var(--accent-primary)', cursor: 'pointer', marginTop: '5px' }}
      >
        + Add Specialization
      </button>
    </div>
  );
};

// ── Main Admin Component ──────────────────────────────────────────────────────
const Admin = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  if (!user?.isAdmin) {
    return <UnderProgress page="Admin System" />;
  }

  const [assessments, setAssessments] = useState([]);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [overviewDetail, setOverviewDetail] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [editingAssessmentId, setEditingAssessmentId] = useState(null);
  const [editingDiscussionId, setEditingDiscussionId] = useState(null);
  const [editingNotificationId, setEditingNotificationId] = useState(null);
  const [editingDomainId, setEditingDomainId] = useState(null);

  // Domains state
  const [domains, setDomains] = useState([]);
  const [showDomainForm, setShowDomainForm] = useState(false);
  const [domForm, setDomForm] = useState({ 
    title: '', icon: 'Code2', color: '#6366f1', 
    desc: '', stats: '', trending: false, 
    subDomains: [] 
  });

  // Assessment form
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [aForm, setAForm] = useState({ category: 'Quantitative', topic: '', week: 'Week 1', timeLimit: 20, unlockTime: '', videoUrl: '' });
  const [aQuestions, setAQuestions] = useState([emptyQuestion()]);
  const [aAttempted, setAAttempted] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const pdfInputRef = React.useRef(null);

  // field border: neutral before attempt, red if empty, green if filled
  const fieldBorder = (val) => {
    if (!aAttempted) return 'var(--border-strong)';
    return String(val).trim() ? '#22c55e' : '#ef4444';
  };

  // Discussion form
  const [showDForm, setShowDForm] = useState(false);
  const [dForm, setDForm] = useState({ title: '', body: '', tag: 'Announcement' });

  // Notification form
  const [showNForm, setShowNForm] = useState(false);
  const [nForm, setNForm] = useState({ title: '', message: '', type: 'info' });

  const refresh = React.useCallback(() => {
    setAssessments(getAssessments());
    setUsers(getUsers());
    setResults(getResults());
    setDiscussions(getDiscussions());
    setNotifications(getNotifications());
    setDomains(getDomains());
  }, []);

  useEffect(() => { refresh(); }, [tab, refresh]);

  useEffect(() => {
    window.addEventListener('nexus-data-updated', refresh);
    return () => window.removeEventListener('nexus-data-updated', refresh);
  }, [refresh]);

  const handleAddAssessment = () => {
    setAAttempted(true);
    const questionsValid = aQuestions.every(q => q.text.trim() && q.options.every(o => o.trim()) && q.explanation?.trim());
    if (!aForm.topic.trim() || !aForm.week.trim() || !aForm.timeLimit || !questionsValid) return;

    const newAssessment = { ...aForm, questions: aQuestions.map((q, i) => ({ ...q, id: i + 1 })), unlockTime: aForm.unlockTime || new Date().toISOString() };
    
    if (editingAssessmentId) {
      newAssessment.id = editingAssessmentId;
      updateAssessment(newAssessment);
    } else {
      addAssessment(newAssessment);
    }
    
    setAForm({ category: 'Quantitative', topic: '', week: 'Week 1', timeLimit: 20, unlockTime: '', videoUrl: '' });
    setAQuestions([emptyQuestion()]);
    setAAttempted(false);
    setShowAssessmentForm(false);
    setEditingAssessmentId(null);
    refresh();
  };

  const handleDeleteAssessment = (id) => { 
    if (confirm('Permanently delete this assessment and all associated results? This action cannot be undone.')) {
      deleteAssessment(id); 
      refresh(); 
    }
  };

  const handleAddDiscussion = () => {
    if (!dForm.title.trim() || !dForm.body.trim()) return;
    if (editingDiscussionId) deleteDiscussion(editingDiscussionId);
    
    const newD = { ...dForm, author: 'Admin' };
    if (editingDiscussionId) newD.id = editingDiscussionId;
    addDiscussion(newD);
    
    setDForm({ title: '', body: '', tag: 'Announcement' });
    setEditingDiscussionId(null);
    refresh();
  };

  const handleAddNotification = () => {
    if (!nForm.title.trim() || !nForm.message.trim()) return;
    if (editingNotificationId) deleteNotification(editingNotificationId);

    const newN = { ...nForm, author: 'Admin' };
    if (editingNotificationId) newN.id = editingNotificationId;
    addNotification(newN);

    setNForm({ title: '', message: '', type: 'info' });
    setEditingNotificationId(null);
    refresh();
  };

  const handleAddDomain = () => {
    if (!domForm.title.trim() || !domForm.desc.trim()) return;
    
    const newDom = { ...domForm };
    if (editingDomainId) {
      newDom.id = editingDomainId;
      updateDomain(newDom);
    } else {
      addDomain(newDom);
    }
    
    setDomForm({ title: '', icon: 'Code2', color: '#6366f1', desc: '', stats: '', trending: false, subDomains: [] });
    setEditingDomainId(null);
    setShowDomainForm(false);
    refresh();
  };

  const handleDeleteDomain = (id) => {
    if (confirm('Delete this domain and all its specializations?')) {
      deleteDomain(id);
      refresh();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      let parsedQuestions = [];
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (extension === '.pdf') {
        const text = await extractTextFromPDF(file);
        parsedQuestions = parseMCQsFromText(text);
      } else if (extension === '.docx') {
        const text = await extractTextFromWord(file);
        parsedQuestions = parseMCQsFromText(text);
      } else if (extension === '.txt') {
        const text = await file.text();
        parsedQuestions = parseMCQsFromText(text);
      } else if (['.xlsx', '.xls', '.csv'].includes(extension)) {
        parsedQuestions = await extractQuestionsFromExcel(file);
      } else {
        throw new Error('Unsupported file format. Please upload a PDF, Word, Text, or spreadsheet file.');
      }

      if (parsedQuestions.length > 0) {
        setAQuestions(parsedQuestions);
        setShowAssessmentForm(true);
        setAAttempted(false);
        setTab('assessments'); 
        alert(`Successfully fetched ${parsedQuestions.length} questions from the ${extension.substring(1).toUpperCase()} file. Please review them below.`);
      } else {
        alert('Could not find any MCQs in the expected format within this file.');
      }
    } catch (err) {
      alert('Error parsing file: ' + err.message);
    } finally {
      setIsParsing(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  const inputStyle = { width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-strong)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', fontFamily: 'inherit' };
  const labelStyle = { fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' };

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-slide-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Admin Panel</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Manage assessments, users, discussions & notifications</p>
        </div>
      </div>

      {/* Tabs Header with Actions */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px 10px 0 0', fontWeight: 700, fontSize: '13px', cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: tab === t.id ? 'var(--bg-secondary)' : 'transparent', color: tab === t.id ? 'var(--accent-primary)' : 'var(--text-muted)', borderBottom: tab === t.id ? '2px solid var(--accent-primary)' : '2px solid transparent' }}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* Action Buttons (Top Right) */}
        {tab === 'assessments' && (
          <div style={{ display: 'flex', gap: '10px', paddingBottom: '8px' }}>
            <button 
              onClick={() => pdfInputRef.current?.click()}
              disabled={isParsing}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', 
                background: 'rgba(99,102,241,0.08)', color: 'var(--accent-primary)', border: '1.5px solid rgba(99,102,241,0.2)', 
                fontWeight: 700, fontSize: '12px', cursor: 'pointer', opacity: isParsing ? 0.6 : 1, transition: 'all 0.2s' 
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'}
            >
              <FileText size={14} /> {isParsing ? 'Processing...' : 'Bulk Fetch'}
            </button>
            <button 
              onClick={() => { setShowAssessmentForm(v => !v); setAAttempted(false); }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '10px', 
                background: 'var(--accent-gradient)', color: 'white', border: 'none', fontWeight: 800, fontSize: '12px', 
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 242, 254, 0.2)' 
              }}
            >
              <Plus size={14} /> {showAssessmentForm ? 'Cancel' : 'New Assessment'}
            </button>
          </div>
        )}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="flex flex-col gap-6">
          <div className="grid cols-1 sm-cols-2 lg-cols-5 gap-4">
            <StatBox label="Active Users"   value={users.filter(u => u.status === 'active' || !u.status).length} icon={Users} color="#6366f1" active={overviewDetail==='users'} onClick={() => setOverviewDetail(v => v==='users' ? null : 'users')} />
            <StatBox label="Pending"        value={users.filter(u => u.status === 'pending').length} icon={ShieldCheck} color="#f59e0b" active={overviewDetail==='pending'} onClick={() => setOverviewDetail(v => v==='pending' ? null : 'pending')} />
            <StatBox label="Assessments"   value={assessments.length}   icon={BrainCircuit}  color="#06b6d4" active={overviewDetail==='assessments'}   onClick={() => setOverviewDetail(v => v==='assessments' ? null : 'assessments')} />
            <StatBox label="Submissions"   value={results.length}       icon={FileText}      color="#22c55e" active={overviewDetail==='submissions'}   onClick={() => setOverviewDetail(v => v==='submissions' ? null : 'submissions')} />
            <StatBox label="Discussions"   value={discussions.length}   icon={MessageSquare} color="#f59e0b" active={overviewDetail==='discussions'}   onClick={() => setOverviewDetail(v => v==='discussions' ? null : 'discussions')} />
          </div>

          <AnimatePresence mode="wait">
            {overviewDetail && (
              <motion.div 
                key={overviewDetail}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                style={{ overflow: 'hidden' }}
              >
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--accent-primary)', background: 'rgba(99,102,241,0.02)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                      <span style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)' }}>
                        {overviewDetail} Overview
                      </span>
                    </div>
                    <button onClick={() => setOverviewDetail(null)} style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                  </div>

                  {/* Users detail */}
                  {overviewDetail === 'users' && (
                    users.filter(u => u.status === 'active' || !u.status).length === 0
                      ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No active users detected.</p>
                      : users.filter(u => u.status === 'active' || !u.status).map((u, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>{u.avatar || u.name?.[0]}</div>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</p>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                             <span style={{ fontSize: '10px', fontWeight: 800, color: '#a855f7' }}>{u.xp || 0} XP</span>
                             <span style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b' }}>{u.streak || 0}d</span>
                          </div>
                        </div>
                      ))
                  )}

                  {/* Pending detail */}
                  {overviewDetail === 'pending' && (
                    users.filter(u => u.status === 'pending').length === 0
                      ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No pending approvals.</p>
                      : users.filter(u => u.status === 'pending').map((u, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>{u.avatar || u.name?.[0]}</div>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</p>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</p>
                            </div>
                          </div>
                          <button onClick={() => { updateUserStatus(u.email, 'active'); refresh(); }} style={{ fontSize: '10px', fontWeight: 800, padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--accent-gradient)', color: 'white', cursor: 'pointer' }}>Approve</button>
                        </div>
                      ))
                  )}

                  {/* Assessments detail */}
                  {overviewDetail === 'assessments' && (
                    assessments.length === 0
                      ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No assessments yet.</p>
                      : assessments.map((a, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{a.topic}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.category} · {a.week}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}>{a.questions?.length || 0} Qs</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}>{a.timeLimit} min</span>
                          </div>
                        </div>
                      ))
                  )}

                  {/* Submissions detail */}
                  {overviewDetail === 'submissions' && (
                    results.length === 0
                      ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No submissions yet.</p>
                      : results.map((r, i) => {
                          const pct = Math.round((r.score / r.total) * 100);
                          const c = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';
                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
                              <div>
                                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{r.topic}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.userName} · {new Date(r.submittedAt).toLocaleDateString()}</p>
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: 900, color: c }}>{pct}%</span>
                            </div>
                          );
                        })
                  )}

                  {/* Discussions detail */}
                  {overviewDetail === 'discussions' && (
                    discussions.length === 0
                      ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No discussions yet.</p>
                      : discussions.map((d, i) => (
                        <div key={i} style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{d.tag}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{d.title}</p>
                        </div>
                      ))
                  )}

                  {/* Notifications detail */}
                  {overviewDetail === 'notifications' && (
                    notifications.length === 0
                      ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No notifications yet.</p>
                      : notifications.map((n, i) => {
                          const colors = { info: '#06b6d4', success: '#22c55e', warning: '#f59e0b', alert: '#ef4444' };
                          const c = colors[n.type] || '#a855f7';
                          return (
                            <div key={i} style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-tertiary)', borderLeft: `4px solid ${c}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: `${c}15`, color: c, textTransform: 'uppercase' }}>{n.type}</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</p>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{n.message}</p>
                            </div>
                          );
                        })
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '1.5rem', padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>Topic Proficiency Overview</h3>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Platform-wide average scores</p>
            </div>
            <CollectivePerformanceGraph data={prepareCollectiveChartData(results, assessments)} height={300} />
          </div>
        </div>
      )}

      {/* ASSESSMENTS */}
      {tab === 'assessments' && (
        <div className="flex flex-col gap-5">
          <div style={{ marginBottom: '4px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>Assessment Library</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Create, manage, and track all learning assessments</p>
          </div>
          <input 
            type="file" 
            ref={pdfInputRef} 
            onChange={handleFileUpload} 
            accept=".pdf,.docx,.txt,.xlsx,.xls,.csv" 
            style={{ display: 'none' }} 
          />
          {/* Buttons moved to tab header */}

          <AnimatePresence>
            {showAssessmentForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Card>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>{editingAssessmentId ? 'Edit' : 'Create New'} Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div>
                      <label style={labelStyle}>Category</label>
                      <select value={aForm.category} onChange={e => setAForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, border: `1px solid ${aAttempted ? '#22c55e' : 'var(--border-strong)'}`, transition: 'border-color 0.2s' }}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelStyle, color: aAttempted ? (aForm.topic.trim() ? '#22c55e' : '#ef4444') : 'var(--text-muted)' }}>Topic Name {aAttempted && !aForm.topic.trim() && <span style={{ fontSize: '10px' }}>— required</span>}</label>
                      <input value={aForm.topic} onChange={e => setAForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. Percentages" style={{ ...inputStyle, border: `1px solid ${fieldBorder(aForm.topic)}`, transition: 'border-color 0.2s' }} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, color: aAttempted ? (aForm.week.trim() ? '#22c55e' : '#ef4444') : 'var(--text-muted)' }}>Week {aAttempted && !aForm.week.trim() && <span style={{ fontSize: '10px' }}>— required</span>}</label>
                      <input value={aForm.week} onChange={e => setAForm(f => ({ ...f, week: e.target.value }))} placeholder="e.g. Week 3" style={{ ...inputStyle, border: `1px solid ${fieldBorder(aForm.week)}`, transition: 'border-color 0.2s' }} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, color: aAttempted ? (aForm.timeLimit ? '#22c55e' : '#ef4444') : 'var(--text-muted)' }}>Time Limit (minutes) {aAttempted && !aForm.timeLimit && <span style={{ fontSize: '10px' }}>— required</span>}</label>
                      <input type="number" value={aForm.timeLimit} onChange={e => setAForm(f => ({ ...f, timeLimit: Number(e.target.value) }))} min={5} max={120} style={{ ...inputStyle, border: `1px solid ${aAttempted ? (aForm.timeLimit ? '#22c55e' : '#ef4444') : 'var(--border-strong)'}`, transition: 'border-color 0.2s' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Schedule Unlock (Optional)</label>
                      <input type="datetime-local" value={aForm.unlockTime} onChange={e => setAForm(f => ({ ...f, unlockTime: e.target.value }))} style={{ ...inputStyle, border: `1px solid ${aForm.unlockTime ? '#22c55e' : 'var(--border-strong)'}` }} />
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Leave empty to unlock immediately.</p>
                    </div>
                    <div className="md:col-span-2">
                      <label style={labelStyle}>Lecture / Reference Video URL (Optional)</label>
                      <input 
                        value={aForm.videoUrl} 
                        onChange={e => setAForm(f => ({ ...f, videoUrl: e.target.value }))} 
                        placeholder="e.g. https://www.youtube.com/watch?v=..." 
                        style={{ ...inputStyle, border: `1px solid ${aForm.videoUrl ? '#22c55e' : 'var(--border-strong)'}` }} 
                      />
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Supports YouTube, Vimeo, or direct MP4 links.</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ ...labelStyle, marginBottom: '12px' }}>Questions</label>
                    <QuestionBuilder questions={aQuestions} setQuestions={setAQuestions} attempted={aAttempted} />
                  </div>
                  <button onClick={handleAddAssessment}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'var(--accent-gradient)', color: 'white', border: 'none', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
                    <Save size={16} /> {editingAssessmentId ? 'Update' : 'Publish'} Assessment
                  </button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {assessments.length === 0 && !showAssessmentForm && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '1.5rem', border: '1px dashed var(--border-strong)', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <BrainCircuit size={40} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>No Assessments Found</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '1.5rem' }}>Get started by creating a new assessment or bulk fetching questions to populate your learning library.</p>
              <button onClick={() => setShowAssessmentForm(true)} style={{ padding: '10px 24px', borderRadius: '12px', background: 'var(--accent-gradient)', color: 'white', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                Create Assessment
              </button>
            </div>
          )}

          {assessments.map(a => (
            <Card key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{a.topic}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {[a.category, a.week, `${a.questions?.length || 0} Qs`, `${a.timeLimit} min`].map((tag, i) => (
                    <span key={i} style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)' }}>{tag}</span>
                  ))}
                  {a.unlockTime && new Date(a.unlockTime) > new Date() && (
                    <span style={{ fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', textTransform: 'uppercase' }}>
                      Scheduled: {new Date(a.unlockTime).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { 
                  setEditingAssessmentId(a.id);
                  setAForm({ category: a.category, topic: a.topic, week: a.week, timeLimit: a.timeLimit, unlockTime: a.unlockTime || '', videoUrl: a.videoUrl || '' });
                  setAQuestions(a.questions || [emptyQuestion()]);
                  setShowAssessmentForm(true);
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(99,102,241,0.2)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  <FileText size={14} /> Edit
                </button>
                <button onClick={() => handleDeleteAssessment(a.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* DOMAINS */}
      {tab === 'domains' && (
        <div className="flex flex-col gap-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>Domain Management</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Define career paths and nested specializations</p>
            </div>
            <button 
              onClick={() => { setShowDomainForm(!showDomainForm); setEditingDomainId(null); setDomForm({ title: '', icon: 'Code2', color: '#6366f1', desc: '', stats: '', trending: false, subDomains: [] }); }}
              style={{ padding: '10px 20px', borderRadius: '12px', background: 'var(--accent-gradient)', color: 'white', fontWeight: 800, fontSize: '13px', cursor: 'pointer', border: 'none' }}
            >
              {showDomainForm ? 'Cancel' : 'New Domain'}
            </button>
          </div>

          <AnimatePresence>
            {showDomainForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Card>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>{editingDomainId ? 'Edit' : 'Create'} Domain</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="md:col-span-2">
                      <label style={labelStyle}>Title</label>
                      <input value={domForm.title} onChange={e => setDomForm({ ...domForm, title: e.target.value })} placeholder="e.g. Full Stack Development" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Icon</label>
                      <select value={domForm.icon} onChange={e => setDomForm({ ...domForm, icon: e.target.value })} style={inputStyle}>
                        {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div>
                      <label style={labelStyle}>Color (Hex)</label>
                      <input value={domForm.color} onChange={e => setDomForm({ ...domForm, color: e.target.value })} placeholder="#6366f1" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Stats Label</label>
                      <input value={domForm.stats} onChange={e => setDomForm({ ...domForm, stats: e.target.value })} placeholder="e.g. 150+ Enrolled" style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pt: '20px' }}>
                      <input type="checkbox" checked={domForm.trending} onChange={e => setDomForm({ ...domForm, trending: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                      <label style={{ ...labelStyle, marginBottom: 0 }}>Trending Domain</label>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label style={labelStyle}>Description</label>
                    <textarea value={domForm.desc} onChange={e => setDomForm({ ...domForm, desc: e.target.value })} placeholder="Domain overview..." style={{ ...inputStyle, minHeight: '80px' }} />
                  </div>
                  <div className="mb-5">
                    <label style={labelStyle}>Global "Under the Hood" Topics (Comma separated)</label>
                    <input 
                      value={(domForm.topics || []).join(', ')} 
                      onChange={e => setDomForm({ ...domForm, topics: e.target.value.split(',').map(t => t.trim()) })} 
                      placeholder="e.g. HTTP, HTTPS, Browsers, Internet" 
                      style={inputStyle} 
                    />
                  </div>

                  <SubDomainBuilder subs={domForm.subDomains} setSubs={(s) => setDomForm(f => ({ ...f, subDomains: typeof s === 'function' ? s(f.subDomains) : s }))} inputStyle={inputStyle} />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button onClick={handleAddDomain} style={{ padding: '12px 30px', borderRadius: '12px', background: 'var(--accent-gradient)', color: 'white', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                      {editingDomainId ? 'Update' : 'Launch'} Domain
                    </button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {domains.length === 0 ? (
              <Card><p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No domains defined.</p></Card>
            ) : (
              domains.map(d => {
                const Icon = ICON_MAP[d.icon] || Code2;
                return (
                  <Card key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', borderLeft: `4px solid ${d.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ p: '10px', borderRadius: '12px', background: `${d.color}15`, color: d.color }}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>{d.title}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.subDomains?.length || 0} Specializations · {d.stats}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => { 
                        setEditingDomainId(d.id);
                        setDomForm({ ...d, subDomains: d.subDomains || [] });
                        setShowDomainForm(true);
                        window.scrollTo({ top: 100, behavior: 'smooth' });
                      }}
                        style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(99,102,241,0.2)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteDomain(d.id)}
                        style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>User Management</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monitor and manage student accounts, progress, and roles</p>
          </div>
          {users.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '1.5rem', border: '1px dashed var(--border-strong)', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(168,85,247,0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Users size={40} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>No Users Registered</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px' }}>Your platform currently has no active users. Invite students to join and their accounts will appear here for management.</p>
            </div>
          )}
          {users.map((u, i) => {
            const isExpanded = expandedUser === i;
            const userResults = results.filter(r => r.userEmail === u.email);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', borderRadius: '1.25rem', overflow: 'hidden', border: `1px solid ${isExpanded ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, transition: 'border-color 0.2s' }}>
                {/* User row */}
                <div
                  onClick={() => setExpandedUser(isExpanded ? null : i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '1.5rem', background: 'var(--bg-secondary)', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '16px' }}>
                      {u.avatar || u.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>{u.name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {u.status && u.status !== 'active' && (
                      <span style={{ fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '6px', background: u.status === 'banned' ? '#ef4444' : u.status === 'pending' ? 'rgba(245,158,11,0.2)' : '#f59e0b', color: u.status === 'pending' ? '#f59e0b' : '#fff', textTransform: 'uppercase', border: u.status === 'pending' ? '1px solid #f59e0b40' : 'none' }}>
                        {u.status}
                      </span>
                    )}
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                      {userResults.length} submissions
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Joined {new Date(u.joinedAt).toLocaleDateString()}
                    </span>
                    <div style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                {/* Expanded detail panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Engagement Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                          {[
                            { label: 'Total XP',     value: `${u.xp ?? 0} pts`,      color: '#a855f7', icon: Star },
                            { label: 'Current Streak', value: `${u.streak ?? 0} days`, color: '#f59e0b', icon: Zap },
                            { label: 'Last Login',   value: u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never', color: '#6366f1', icon: Calendar },
                            { label: 'Avg Accuracy', value: userResults.length ? Math.round(userResults.reduce((a, r) => a + (r.percentage || 0), 0) / userResults.length) + '%' : 'N/A', color: '#22c55e', icon: TrendingUp },
                          ].map((stat, si) => (
                            <div key={si} style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                                 <stat.icon size={12} style={{ color: stat.color }} />
                                 <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                               </div>
                               <p style={{ fontSize: '15px', fontWeight: 900, color: 'var(--text-primary)' }}>{stat.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Performance Pulse */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                          <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '12px' }}>Student Efficiency Pulse</p>
                          <UserPerformanceGraph 
                            data={prepareUserChartData(results.filter(r => r.userEmail === u.email))} 
                            height={150} 
                            color="#a855f7"
                          />
                        </div>

                        {/* Activity Timeline */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                          <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Recent Activity Feed</p>
                          
                          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '16px', borderLeft: '2px solid var(--border-subtle)' }}>
                            {/* Joined Event */}
                            <div style={{ position: 'relative' }}>
                              <div style={{ position: 'absolute', left: '-22px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid var(--bg-tertiary)' }} />
                              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Joined Sun Nexus</p>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(u.joinedAt).toLocaleDateString()} · Initial account creation</p>
                            </div>

                            {/* Submissions in Timeline */}
                            {[...userResults].sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5).map((r, ri) => {
                              const pct = r.percentage || 0;
                              const c = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';
                              return (
                                <div key={ri} style={{ position: 'relative' }}>
                                  <div style={{ position: 'absolute', left: '-22px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1', border: '2px solid var(--bg-tertiary)' }} />
                                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Completed Assessment: {r.topic}</p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(r.submittedAt).toLocaleString()}</span>
                                    <span style={{ fontSize: '11px', fontWeight: 800, color: c }}>Scored {pct}%</span>
                                  </div>
                                </div>
                              );
                            })}

                            {userResults.length === 0 && (
                              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No recent learning activity recorded.</p>
                            )}
                          </div>
                        </div>

                        {/* Admin Actions */}
                        <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                          <p style={{ width: '100%', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '4px' }}>Administrative Actions</p>
                          
                          {u.status === 'pending' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateUserStatus(u.email, 'active'); refresh(); }}
                              style={{ padding: '8px 16px', borderRadius: '10px', background: 'var(--accent-gradient)', color: 'white', border: 'none', fontWeight: 800, fontSize: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 242, 254, 0.2)' }}
                            >
                              Approve Operator
                            </button>
                          )}
                          
                          {u.status === 'suspended' ? (
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateUserStatus(u.email, 'active'); refresh(); }}
                              style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                            >
                              Activate User
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateUserStatus(u.email, 'suspended'); refresh(); }}
                              style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                            >
                              Suspend User
                            </button>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); if(confirm(`Are you sure you want to ${u.status === 'banned' ? 'unban' : 'ban'} this user?`)) { updateUserStatus(u.email, u.status === 'banned' ? 'active' : 'banned'); refresh(); }}}
                            style={{ padding: '8px 16px', borderRadius: '10px', background: u.status === 'banned' ? 'rgba(99,102,241,0.1)' : 'rgba(239,68,68,0.1)', color: u.status === 'banned' ? '#6366f1' : '#ef4444', border: `1px solid ${u.status === 'banned' ? 'rgba(99,102,241,0.2)' : 'rgba(239,68,68,0.2)'}`, fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                          >
                            {u.status === 'banned' ? 'Unban User' : 'Ban User'}
                          </button>
                          {!u.isAdmin && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); if(confirm('PERMANENTLY DELETE user? This cannot be undone.')) { deleteUser(u.email); refresh(); }}}
                              style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 800, fontSize: '11px', cursor: 'pointer', marginLeft: 'auto', textTransform: 'uppercase' }}
                            >
                              Delete User
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

    {/* ── DISCUSSIONS ── */}
    {tab === 'discussions' && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>Discussions</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage community threads and broadcasts</p>
          </div>
          <button 
            onClick={() => { setShowDForm(!showDForm); setEditingDiscussionId(null); setDForm({ title: '', body: '', tag: 'Discussion' }); }}
            style={{ padding: '10px 20px', borderRadius: '12px', background: 'var(--accent-gradient)', color: 'white', fontWeight: 800, fontSize: '13px', cursor: 'pointer', border: 'none' }}
          >
            {showDForm ? 'Cancel' : 'New Discussion'}
          </button>
        </div>

        <AnimatePresence>
          {showDForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card>
                <h4 style={labelStyle}>New Discussion Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input value={dForm.title} onChange={e => setDForm({ ...dForm, title: e.target.value })} placeholder="Title..." style={inputStyle} />
                  <select value={dForm.tag} onChange={e => setDForm({ ...dForm, tag: e.target.value })} style={inputStyle}>
                    {['Discussion', 'Announcement', 'Resource', 'Event'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <textarea value={dForm.body} onChange={e => setDForm({ ...dForm, body: e.target.value })} placeholder="Content..." style={{ ...inputStyle, minHeight: '100px' }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button onClick={handleAddDiscussion} style={{ padding: '10px 24px', borderRadius: '10px', background: 'var(--accent-gradient)', color: 'white', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                    {editingDiscussionId ? 'Update' : 'Post'} Discussion
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {discussions.length === 0 ? (
            <Card><p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No discussions yet.</p></Card>
          ) : (
            discussions.map(d => (
              <Card key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)' }}>{d.tag}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{d.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{d.body}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setEditingDiscussionId(d.id); setDForm({ title: d.title, body: d.body, tag: d.tag }); setShowDForm(true); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
                    style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(99,102,241,0.2)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => { if(confirm('Delete thread?')) { deleteDiscussion(d.id); refresh(); } }}
                    style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    )}

    {/* ── NOTIFICATIONS ── */}
    {tab === 'notifications' && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>Broadcasts</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage global notifications and alerts</p>
          </div>
          <button 
            onClick={() => { setShowNForm(!showNForm); setEditingNotificationId(null); setNForm({ title: '', message: '', type: 'info' }); }}
            style={{ padding: '10px 20px', borderRadius: '12px', background: 'var(--accent-gradient)', color: 'white', fontWeight: 800, fontSize: '13px', cursor: 'pointer', border: 'none' }}
          >
            {showNForm ? 'Cancel' : 'New Broadcast'}
          </button>
        </div>

        <AnimatePresence>
          {showNForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card>
                <h4 style={labelStyle}>Broadcast Protocol</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-3">
                    <input value={nForm.title} onChange={e => setNForm({ ...nForm, title: e.target.value })} placeholder="Title..." style={inputStyle} />
                  </div>
                  <div>
                    <select value={nForm.type} onChange={e => setNForm({ ...nForm, type: e.target.value })} style={inputStyle}>
                      {['info', 'success', 'warning', 'alert'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>
                <textarea value={nForm.message} onChange={e => setNForm({ ...nForm, message: e.target.value })} placeholder="Message content..." style={{ ...inputStyle, minHeight: '80px' }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button onClick={handleAddNotification} style={{ padding: '10px 24px', borderRadius: '10px', background: 'var(--accent-gradient)', color: 'white', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                    {editingNotificationId ? 'Recalibrate' : 'Execute'} Broadcast
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.length === 0 ? (
            <Card><p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No broadcasts found.</p></Card>
          ) : (
            notifications.map(n => {
              const colors = { info: '#06b6d4', success: '#22c55e', warning: '#f59e0b', alert: '#ef4444' };
              const c = colors[n.type] || '#6366f1';
              return (
                <Card key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', borderLeft: `4px solid ${c}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: `${c}15`, color: c, textTransform: 'uppercase' }}>{n.type}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{n.title}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{n.message}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setEditingNotificationId(n.id); setNForm({ title: n.title, message: n.message, type: n.type }); setShowNForm(true); }}
                      style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(99,102,241,0.2)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button onClick={() => { if(confirm('Revoke notification?')) { deleteNotification(n.id); refresh(); } }}
                      style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    )}
    </div>
  );
};

export default Admin;
