import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Send, RotateCcw, Code2, Copy, Check, Terminal, Sparkles
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript (ES6)', extension: 'js' },
  { id: 'python', label: 'Python 3', extension: 'py' },
  { id: 'cpp', label: 'C++ (g++ 17)', extension: 'cpp' },
  { id: 'java', label: 'Java (OpenJDK 17)', extension: 'java' }
];

export default function DsaCodeEditor({
  problem,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false
}) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Load starter code on problem or language change
  useEffect(() => {
    if (problem && problem.starterCode && problem.starterCode[language]) {
      setCode(problem.starterCode[language]);
    } else {
      setCode(getDefaultTemplate(language, problem?.title || 'solution'));
    }
  }, [problem?.id, language]);

  function getDefaultTemplate(lang, title) {
    const fnName = title.replace(/[^a-zA-Z0-9]/g, '');
    switch (lang) {
      case 'javascript':
        return `/**\n * @param {any} input\n * @return {any}\n */\nfunction ${fnName || 'solve'}(input) {\n    // Write your solution here\n    \n}`;
      case 'python':
        return `class Solution:\n    def ${fnName || 'solve'}(self, input):\n        # Write your solution here\n        pass`;
      case 'cpp':
        return `class Solution {\npublic:\n    void ${fnName || 'solve'}() {\n        // Write your solution here\n    }\n};`;
      case 'java':
        return `class Solution {\n    public void ${fnName || 'solve'}() {\n        // Write your solution here\n    }\n}`;
      default:
        return '// Write your solution here\n';
    }
  }

  const handleReset = () => {
    if (problem && problem.starterCode && problem.starterCode[language]) {
      setCode(problem.starterCode[language]);
    } else {
      setCode(getDefaultTemplate(language, problem?.title || 'solution'));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Support Tab key indentation inside textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;
      setCode(val.substring(0, start) + '    ' + val.substring(end));
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const lineCount = (code || '').split('\n').length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: isDark ? '#0B1F33' : '#FFFFFF',
        borderRadius: '18px',
        border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Editor Top Toolbar */}
      <div
        style={{
          padding: '12px 18px',
          borderBottom: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
          backgroundColor: isDark ? '#0E2740' : '#F8FAFC',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        {/* Language selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={16} style={{ color: '#2872A1' }} />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.2)' : '#CBDDE9'}`,
              backgroundColor: isDark ? '#0B1F33' : '#FFFFFF',
              color: isDark ? '#F3F7FB' : '#0D1B2A',
              fontSize: '12.5px',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action icons: Copy & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleCopy}
            title="Copy code"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB',
              color: isDark ? '#CBDDE9' : '#475569',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset code template"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB',
              color: isDark ? '#CBDDE9' : '#475569',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: '280px',
          overflow: 'hidden',
          backgroundColor: isDark ? '#081624' : '#FAFCFF',
          position: 'relative'
        }}
      >
        {/* Line Numbers Column */}
        <div
          style={{
            padding: '16px 8px 16px 12px',
            textAlign: 'right',
            userSelect: 'none',
            color: isDark ? 'rgba(203, 221, 233, 0.25)' : '#94A3B8',
            fontFamily: "'Fira Code', 'Courier New', monospace",
            fontSize: '13px',
            lineHeight: '21px',
            borderRight: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.08)' : '#EFF6FB'}`,
            minWidth: '36px',
            boxSizing: 'border-box'
          }}
        >
          {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Textarea Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          style={{
            flex: 1,
            padding: '16px 16px',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: isDark ? '#F1F5F9' : '#0F172A',
            fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
            fontSize: '13px',
            lineHeight: '21px',
            resize: 'none',
            tabSize: 4,
            whiteSpace: 'pre',
            overflowX: 'auto',
            overflowY: 'auto'
          }}
        />
      </div>

      {/* Bottom Run / Submit Action Bar */}
      <div
        style={{
          padding: '12px 18px',
          borderTop: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.12)' : '#CBDDE9'}`,
          backgroundColor: isDark ? '#0E2740' : '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px'
        }}
      >
        <button
          onClick={() => onRun(code, language)}
          disabled={isRunning || isSubmitting}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '8px',
            backgroundColor: isDark ? '#1E3A5F' : '#EFF6FB',
            color: isDark ? '#CBDDE9' : '#2872A1',
            border: `1px solid ${isDark ? '#4A90C2' : '#CBDDE9'}`,
            fontSize: '13px',
            fontWeight: 600,
            cursor: isRunning ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          <Play size={14} fill="currentColor" />
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </button>

        <button
          onClick={() => onSubmit(code, language)}
          disabled={isSubmitting || isRunning}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 22px',
            borderRadius: '8px',
            backgroundColor: '#2872A1',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 10px rgba(40, 114, 161, 0.25)',
            transition: 'all 0.2s ease',
            fontFamily: "'Poppins', sans-serif"
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.currentTarget.style.backgroundColor = '#205E86';
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) e.currentTarget.style.backgroundColor = '#2872A1';
          }}
        >
          <Send size={14} />
          <span>{isSubmitting ? 'Submitting...' : 'Submit Solution'}</span>
        </button>
      </div>
    </div>
  );
}
