import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  X, FileText, Terminal, Copy, Check,
  ExternalLink, Clock, Monitor, BookOpen, Sparkles,
} from 'lucide-react';
import { api } from '../data/api';

const IS_DEV = import.meta.env.DEV;

function buildSummaryPrompt(course, notes, code) {
  const parts = [
    `I just finished studying: "${course.title}"`,
    `Platform: ${course.platform} | Duration: ${course.duration}`,
    '',
    '## My Notes',
    notes.trim() || '(no notes yet)',
  ];
  if (code.trim()) {
    parts.push('', '## Python Practice Code', '```python', code.trim(), '```');
  }
  parts.push(
    '',
    '---',
    'Please give me a concise summary of key concepts from this topic, highlight what I might have missed in my notes, and suggest 2-3 follow-up practice exercises.',
  );
  return parts.join('\n');
}

export default function CoursePanel({ course, layerId, onClose, onToggle, isCompleted, onActivity }) {
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const notesSaveTimer = useRef(null);
  const codeSaveTimer = useRef(null);
  const notesActivityTimer = useRef(null);
  const codeActivityTimer = useRef(null);

  // Load from disk on open (dev only)
  useEffect(() => {
    if (!IS_DEV) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api.getNotes(course.id, layerId),
      api.getCode(course.id, layerId),
    ]).then(([n, c]) => {
      if (cancelled) return;
      setNotes(n.content ?? '');
      setCode(c.content ?? '');
      setLoading(false);
    });
    api.logActivity('view').then(onActivity);
    return () => { cancelled = true; };
  }, [course.id, layerId]);

  // Debounced save + activity for notes
  const handleNotesChange = useCallback((val) => {
    setNotes(val);
    clearTimeout(notesSaveTimer.current);
    notesSaveTimer.current = setTimeout(() => {
      api.saveNotes(course.id, layerId, val);
    }, 600);
    clearTimeout(notesActivityTimer.current);
    notesActivityTimer.current = setTimeout(() => {
      api.logActivity('notes').then(onActivity);
    }, 3000); // log once per 3s of typing, not on every keystroke
  }, [course.id, layerId, onActivity]);

  // Debounced save + activity for code
  const handleCodeChange = useCallback((val) => {
    const v = val ?? '';
    setCode(v);
    clearTimeout(codeSaveTimer.current);
    codeSaveTimer.current = setTimeout(() => {
      api.saveCode(course.id, layerId, v);
    }, 600);
    clearTimeout(codeActivityTimer.current);
    codeActivityTimer.current = setTimeout(() => {
      api.logActivity('code').then(onActivity);
    }, 3000);
  }, [course.id, layerId, onActivity]);

  const handleCopySummary = useCallback(async () => {
    await navigator.clipboard.writeText(buildSummaryPrompt(course, notes, code));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [course, notes, code]);

  return (
    <AnimatePresence>
      <motion.div
        className="panel-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="course-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        {/* Header */}
        <div className="panel-header">
          <div className="panel-header-info">
            <div className="panel-course-title">{course.title}</div>
            <div className="panel-course-meta">
              <span><Monitor size={12} /> {course.platform}</span>
              <span><Clock size={12} /> {course.duration}</span>
              {course.videos && <span><BookOpen size={12} /> {course.videos} videos</span>}
              <span>{course.cost}</span>
            </div>
          </div>
          <div className="panel-header-actions">
            <a href={course.url} target="_blank" rel="noopener noreferrer"
              className="panel-btn panel-btn-open">
              Open course <ExternalLink size={13} />
            </a>
            <button
              className={`panel-btn ${isCompleted ? 'panel-btn-done' : 'panel-btn-mark'}`}
              onClick={() => onToggle(layerId, course.id)}
            >
              <Check size={13} />
              {isCompleted ? 'Completed' : 'Mark done'}
            </button>
            <button className="panel-btn panel-btn-close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="panel-tabs">
          <button className={`panel-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}>
            <FileText size={14} /> Notes
          </button>
          <button className={`panel-tab ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}>
            <Terminal size={14} /> Python Practice
          </button>
        </div>

        {/* Body */}
        <div className="panel-body">
          {!IS_DEV ? (
            <div className="panel-prod-notice">
              <div className="panel-prod-icon">💻</div>
              <div className="panel-prod-title">Notes available locally only</div>
              <div className="panel-prod-desc">
                Run <code>npm run dev</code> on your machine to write notes and Python practice.<br />
                After studying, run <code>npm run sync</code> to commit and push to GitHub.
              </div>
            </div>
          ) : loading ? (
            <div className="panel-loading">Loading...</div>
          ) : activeTab === 'notes' ? (
            <div className="panel-notes-area">
              <textarea
                className="panel-notes-input"
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder={`What did you learn in "${course.title}"?\n\nWrite in plain text or markdown:\n- Key concepts\n- Things that surprised you\n- Questions to follow up on\n- How it connects to Cuva AI / NuraKnect`}
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="panel-editor-area">
              <Editor
                height="100%"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  fontSize: 13,
                  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  renderWhitespace: 'selection',
                  tabSize: 4,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="panel-footer">
          <div className="panel-footer-hint">
            <Sparkles size={12} /> Auto-saved to <code>notes/</code> and <code>exercises/</code>
          </div>
          <button className="panel-btn panel-btn-summary" onClick={handleCopySummary}>
            {copied
              ? <><Check size={13} /> Copied!</>
              : <><Copy size={13} /> Copy summary prompt for Claude</>}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
