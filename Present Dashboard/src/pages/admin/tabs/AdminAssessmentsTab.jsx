import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, FileUp, BrainCircuit, PlayCircle, Clock } from 'lucide-react';
import QuestionBuilder from '../components/QuestionBuilder';
import { emptyQuestion, validateAssessmentForm } from '../../../utils/questionValidation';
import {
  extractTextFromPDF,
  extractTextFromWord,
  extractQuestionsFromExcel,
  parseMCQsFromText
} from '../../../utils/fileParser';

const CATEGORIES = ['Quantitative', 'Logical Reasoning', 'Verbal Ability'];

/**
 * ── AdminAssessmentsTab ─────────────────────────────────────────────
 * Complete assessment authoring, question editing, file importing,
 * and assessment list management.
 */
export default function AdminAssessmentsTab({
  assessments = [],
  onSaveAssessment,
  onDeleteAssessment,
  saving = false,
  isDark = true
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [form, setForm] = useState({
    category: 'Quantitative',
    topic: '',
    week: 'Week 1',
    timeLimit: 20,
    unlockTime: '',
    videoUrl: ''
  });

  const [questions, setQuestions] = useState([emptyQuestion()]);

  const resetForm = () => {
    setForm({
      category: 'Quantitative',
      topic: '',
      week: 'Week 1',
      timeLimit: 20,
      unlockTime: '',
      videoUrl: ''
    });
    setQuestions([emptyQuestion()]);
    setEditingId(null);
    setAttempted(false);
    setValidationError('');
    setShowForm(false);
  };

  const handleOpenEdit = (a) => {
    setEditingId(a.id);
    setForm({
      category: a.category || 'Quantitative',
      topic: a.topic || '',
      week: a.week || 'Week 1',
      timeLimit: a.timeLimit || 20,
      unlockTime: a.unlockTime || '',
      videoUrl: a.videoUrl || ''
    });
    setQuestions(a.questions && a.questions.length > 0 ? a.questions : [emptyQuestion()]);
    setShowForm(true);
    setValidationError('');
  };

  const handleSave = () => {
    setAttempted(true);
    const { isValid, errors } = validateAssessmentForm(form, questions);
    if (!isValid) {
      const firstError = Object.values(errors)[0];
      setValidationError(firstError || 'Please fill in all required fields correctly.');
      return;
    }

    const payload = {
      ...form,
      id: editingId,
      timeLimit: Number(form.timeLimit) || 20,
      questions
    };

    onSaveAssessment(payload);
    resetForm();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      let parsed = [];
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (extension === '.pdf') {
        const text = await extractTextFromPDF(file);
        parsed = parseMCQsFromText(text);
      } else if (extension === '.docx') {
        const text = await extractTextFromWord(file);
        parsed = parseMCQsFromText(text);
      } else if (extension === '.xlsx' || extension === '.xls' || extension === '.csv') {
        parsed = await extractQuestionsFromExcel(file);
      }

      if (parsed && parsed.length > 0) {
        setQuestions(parsed);
        alert(`Successfully imported ${parsed.length} questions from ${file.name}`);
      } else {
        alert('No structured MCQ questions could be parsed from the file.');
      }
    } catch (err) {
      alert(`File parsing failed: ${err.message}`);
    } finally {
      setIsParsing(false);
      e.target.value = '';
    }
  };

  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const cardBg = isDark ? '#0E2740' : '#FFFFFF';
  const inputBg = isDark ? '#0B1F33' : '#F8FAFC';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>
            Aptitude & Assessment Management
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
            Create structured test modules, configure time limits, and import questions via PDF/Excel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '10px',
            backgroundColor: '#2872A1',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(40, 114, 161, 0.3)'
          }}
        >
          <Plus size={16} />
          <span>{showForm ? 'Close Form' : 'Create New Assessment'}</span>
        </button>
      </div>

      {/* Assessment Creation / Edit Form */}
      {showForm && (
        <div
          style={{
            padding: '24px',
            borderRadius: '18px',
            backgroundColor: cardBg,
            border: `1.5px solid ${borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: isDark ? '0 8px 30px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(13, 27, 42, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: textColor }}>
              {editingId ? 'Edit Assessment' : 'New Assessment Configuration'}
            </h4>

            {/* Bulk File Import */}
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(40, 114, 161, 0.2)' : '#EFF6FB',
                color: '#2872A1',
                border: `1px solid ${isDark ? 'rgba(40, 114, 161, 0.3)' : '#CBDDE9'}`,
                fontSize: '12px',
                fontWeight: 700,
                cursor: isParsing ? 'wait' : 'pointer'
              }}
            >
              <FileUp size={14} />
              <span>{isParsing ? 'Parsing Document...' : 'Import from PDF / Word / Excel'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={isParsing}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {validationError && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', fontSize: '13px', fontWeight: 600 }}>
              {validationError}
            </div>
          )}

          {/* Assessment Parameters Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '5px' }}>
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '5px' }}>
                Topic Name *
              </label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g. Fractions and Decimals"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '5px' }}>
                Curriculum Week *
              </label>
              <input
                type="text"
                value={form.week}
                onChange={(e) => setForm(prev => ({ ...prev, week: e.target.value }))}
                placeholder="e.g. Week 1"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '5px' }}>
                Time Limit (Minutes) *
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={form.timeLimit}
                onChange={(e) => setForm(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 20 }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '5px' }}>
                Video Lecture / Reference Solution URL (Optional)
              </label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => setForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Modular Question Builder Component */}
          <QuestionBuilder
            questions={questions}
            setQuestions={setQuestions}
            attempted={attempted}
            isDark={isDark}
          />

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: isDark ? '#0B1F33' : '#EFF6FB',
                color: textColor,
                border: `1px solid ${borderColor}`,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 24px',
                borderRadius: '8px',
                backgroundColor: '#2872A1',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: saving ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(40, 114, 161, 0.3)'
              }}
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : editingId ? 'Update Assessment' : 'Save Assessment'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Assessments Table */}
      <div
        style={{
          borderRadius: '18px',
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 800, color: textColor }}>
            Active Curriculum Assessments ({assessments.length})
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: isDark ? 'rgba(14, 39, 64, 0.5)' : '#F8FAFC', borderBottom: `1px solid ${borderColor}` }}>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Topic / Module</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Category</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Week</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Questions</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Duration</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a, idx) => (
                <tr
                  key={a.id || idx}
                  style={{
                    borderBottom: `1px solid ${borderColor}`,
                    backgroundColor: idx % 2 === 0 ? 'transparent' : (isDark ? 'rgba(203, 221, 233, 0.02)' : 'rgba(0,0,0,0.01)')
                  }}
                >
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: textColor }}>
                    {a.topic}
                  </td>
                  <td style={{ padding: '14px 18px', color: '#2872A1', fontWeight: 600 }}>
                    {a.category}
                  </td>
                  <td style={{ padding: '14px 18px', color: mutedColor }}>
                    {a.week}
                  </td>
                  <td style={{ padding: '14px 18px', color: textColor, fontWeight: 600 }}>
                    {a.questions?.length || 0} MCQs
                  </td>
                  <td style={{ padding: '14px 18px', color: mutedColor }}>
                    {a.timeLimit || 20} mins
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(a)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2872A1',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Edit Assessment"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete assessment "${a.topic}"?`)) {
                            onDeleteAssessment(a.id);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Delete Assessment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
