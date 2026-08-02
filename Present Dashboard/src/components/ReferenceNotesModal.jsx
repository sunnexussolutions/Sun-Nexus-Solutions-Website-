import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, FileText, Zap, PlayCircle, ArrowRight, Lightbulb } from 'lucide-react';

export const REFERENCE_NOTES_DATA = {
  'Ages': {
    notes: [
      'Present Age Ratio Rule: If current ages of A and B are in ratio a:b, assume their ages as ax and bx.',
      'Age Difference Invariance: The difference between the ages of two persons remains constant at any point in time.',
      'Years Ago / Hence: n years ago = (age - n) | n years hence/later = (age + n).'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=problems+on+ages+aptitude+tricks',
    cheatsheet: 'Age difference (A - B) remains constant regardless of past or future years.'
  },
  'Fractions and Decimals': {
    notes: [
      'Convert fraction to decimal by dividing numerator by denominator (e.g., 3/4 = 0.75).',
      'Cross-multiplication rule: To compare A/B and C/D, compare A×D and B×C.',
      'Recurring decimals: 0.333... = 1/3, 0.666... = 2/3, 0.111... = 1/9.',
      'Addition & Subtraction: Always find the Least Common Multiple (LCM) of denominators first.'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=tnc9ojITRg4',
    cheatsheet: 'A/B + C/D = (A×D + B×C) / (B×D)'
  },
  'Simplification': {
    notes: [
      'BODMAS Order: Brackets () [] {}, Orders/Exponents x², Division ÷, Multiplication ×, Addition +, Subtraction -.',
      'Key Algebraic Identities:',
      '  - (a + b)² = a² + 2ab + b²',
      '  - (a - b)² = a² - 2ab + b²',
      '  - a² - b² = (a - b)(a + b)',
      '  - (a + b)³ = a³ + b³ + 3ab(a + b)'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=ZuMJFleXmiw',
    cheatsheet: 'Follow BODMAS strictly left-to-right for operators with same priority.'
  },
  'Surds and Indices': {
    notes: [
      'Product Rule: aᵐ × aⁿ = aᵐ⁺ⁿ',
      'Quotient Rule: aᵐ ÷ aⁿ = aᵐ⁻ⁿ',
      'Power of Power Rule: (aᵐ)ⁿ = aᵐⁿ',
      'Zero Index: a⁰ = 1 (where a ≠ 0)',
      'Negative Exponent: a⁻ⁿ = 1 / aⁿ',
      'Radical Product: √(a × b) = √a × √b'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=jAbpPTpz2bQ',
    cheatsheet: 'If aᵐ = aⁿ, then m = n (for base a > 0 and a ≠ 1)'
  },
  'Permutation & Combination': {
    notes: [
      'Permutation (Order Matters): P(n, r) = n! / (n - r)!',
      'Combination (Selection Only): C(n, r) = n! / [r! (n - r)!]',
      'Circular Permutation: (n - 1)! for n distinct items in a circle.',
      'Handshakes/Matches Formula: C(n, 2) = n(n - 1) / 2'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=ETiRE7N7pEI',
    cheatsheet: 'P(n, r) = C(n, r) × r!'
  },
  'Syllogisms': {
    notes: [
      'All A are B: Set A is completely inside Set B.',
      'No A is B: Sets A and B have 0 intersection.',
      'Some A are B: Sets A and B overlap (at least 1 element in common).',
      'Some A are not B: At least 1 element of A is outside B.',
      'Either/Or Condition: Both individual conclusions must be uncertain, one positive and one negative.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=syllogisms+logical+reasoning',
    cheatsheet: 'Draw minimum overlapping Venn diagrams for quick verification.'
  },
  'Blood Relations': {
    notes: [
      'Male (+), Female (-), Married couple (=), Siblings (-).',
      'Father/Mother = 1 generation above (+1).',
      'Grandfather/Grandmother = 2 generations above (+2).',
      'Brother/Sister/Cousin = Same generation (0).',
      'Son/Daughter = 1 generation below (-1).'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=blood+relations+logical+reasoning',
    cheatsheet: 'Replace names with family tree relations from self perspective.'
  },
  'Seating Arrangement': {
    notes: [
      'Facing Inside (Center): Clockwise = LEFT, Anti-clockwise = RIGHT.',
      'Facing Outside: Clockwise = RIGHT, Anti-clockwise = LEFT.',
      'Linear Row (Facing North): Left = West, Right = East.',
      'Tip: Always start with fixed, definite positions before relative clues.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=seating+arrangement+reasoning',
    cheatsheet: 'Circle Center: Clockwise = Left | Circle Outside: Clockwise = Right'
  },
  'Coding-Decoding': {
    notes: [
      'Forward Letter Positions: A=1, B=2, C=3 ... Z=26',
      'EJOTY Shortcut: E=5, J=10, O=15, T=20, Y=25',
      'Reverse Position Formula: Reverse Rank = 27 - Forward Rank',
      'Opposite Pairs: A-Z, B-Y, C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=coding+decoding+reasoning',
    cheatsheet: 'Sum of forward rank and reverse rank of any letter = 27'
  },
  'Direction Sense': {
    notes: [
      'Cardinal Directions: North (Up), South (Down), East (Right), West (Left).',
      'Turns: Right Turn = 90° Clockwise | Left Turn = 90° Anti-clockwise.',
      'Shortest Distance: Use Pythagoras Theorem: Hypotenuse = √(Base² + Height²).',
      'Sun Shadow: Morning shadow is to the West; Evening shadow is to the East.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=direction+sense+reasoning',
    cheatsheet: 'Right = 90° CW | Left = 90° CCW | Shortest Path = √(x² + y²)'
  },
  'Synonyms & Antonyms': {
    notes: [
      'Context Clues: Identify whether sentence tone is positive (+), negative (-), or neutral.',
      'Prefix Meanings: Un-, Dis-, In-, Im-, Non- mean NOT.',
      'Root Words: Bene- (Good), Mal- (Bad), Chrono- (Time), Tele- (Far), Dict- (Speak).'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=synonyms+antonyms+verbal+ability',
    cheatsheet: 'Eliminate options that have opposite connotation to the target word.'
  },
  'Sentence Correction': {
    notes: [
      'Subject-Verb Agreement: Singular subjects take singular verbs.',
      'Parallelism: Items in a series must share grammatical form (e.g. running, swimming, and biking).',
      'Pronoun Agreement: Pronouns must match their antecedents in number and gender.',
      'Modifiers: Place descriptive phrases next to the noun they modify.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=sentence+correction+verbal+ability',
    cheatsheet: 'Identify subject & main verb first to test agreement.'
  },
  'Reading Comprehension': {
    notes: [
      'Skimming Strategy: Read first and last paragraphs + first sentence of middle paragraphs.',
      'Question Types: Main Idea, Author Tone, Fact-based, Inference, Vocabulary in Context.',
      'Elimination Tip: Beware of extreme words (Always, Never, Only, Must).'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=reading+comprehension+verbal+ability',
    cheatsheet: 'Passage Evidence > Personal Knowledge. Never assume outside facts.'
  },
  'Cloze Test': {
    notes: [
      'Read full passage once before filling blanks to grasp overall context.',
      'Check Grammar: Preposition collocations (e.g., Interested IN, Accused OF).',
      'Tense Continuity: Ensure verb tenses match surrounding sentences.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=cloze+test+verbal+ability',
    cheatsheet: 'Identify required part of speech (noun/verb/adj) before choosing option.'
  }
};

const ReferenceNotesModal = ({ topicItem, onClose, onStartAssessment }) => {
  if (!topicItem) return null;

  const topicName = topicItem.topic || topicItem.title || 'Aptitude Module';
  const categoryName = topicItem.category || 'Quantitative';

  const refData = REFERENCE_NOTES_DATA[topicName] || {
    notes: [
      `Review key fundamentals, rules, and formulas for ${topicName}.`,
      'Pay close attention to problem statements and eliminate incorrect choices systematically.',
      'Double-check calculation steps before submitting final answer.'
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(topicName + ' aptitude reasoning tutorial'),
    cheatsheet: `Key Formulas & Rules Cheatsheet for ${topicName}`
  };

  const customNotes = (topicItem.notes || topicItem.referenceNotes || '').trim();

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="refNotesBackdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
        }}
      />
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}>
        <motion.div
          key="refNotesModal"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '88vh',
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35)',
            color: '#0f172a',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header Bar matching Reference UI */}
          <div style={{ padding: '22px 24px', background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={22} style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, letterSpacing: '-0.01em', color: '#ffffff' }}>Reference Notes</h3>
                <span style={{ fontSize: '12px', opacity: 0.92, fontWeight: 700, color: '#f3e8ff' }}>
                  {categoryName} · {topicName}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.22)', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
            
            {/* Custom Admin Notes if present */}
            {customNotes && (
              <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  <Lightbulb size={14} /> Topic Specific Reference
                </div>
                <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#166534', margin: 0, lineHeight: 1.5 }}>
                  {customNotes}
                </p>
              </div>
            )}

            {/* Core Concepts Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FileText size={18} style={{ color: '#6d28d9' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Core Concepts & Solving Rules</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {refData.notes.map((noteItem, idx) => (
                  <div key={idx} style={{ padding: '14px 16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', fontSize: '13px', fontWeight: 600, color: '#334155', lineHeight: 1.5 }}>
                    {noteItem}
                  </div>
                ))}
              </div>
            </div>

            {/* Cheatsheet Banner */}
            {refData.cheatsheet && (
              <div style={{ padding: '16px 18px', borderRadius: '18px', background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '1.5px solid #c7d2fe', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Zap size={22} style={{ color: '#4f46e5', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '10.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338ca' }}>QUICK FORMULA CHEATSHEET</span>
                  <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e1b4b', margin: '3px 0 0 0' }}>
                    {refData.cheatsheet}
                  </p>
                </div>
              </div>
            )}

            {/* Video Tutorial Card */}
            {refData.videoUrl && (
              <a
                href={refData.videoUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '14px 18px',
                  borderRadius: '16px',
                  backgroundColor: '#fff5f5',
                  border: '1.5px solid #fecaca',
                  color: '#dc2626',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <PlayCircle size={22} style={{ color: '#dc2626' }} />
                  <span>Watch Video Explanation & Examples</span>
                </div>
                <ArrowRight size={18} />
              </a>
            )}
          </div>

          {/* Footer Action Buttons (Close & Start Assessment) */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '11px 22px',
                borderRadius: '14px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onStartAssessment) onStartAssessment();
              }}
              style={{
                padding: '11px 24px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: '#5b46e0',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(91, 70, 224, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              Start Assessment
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ReferenceNotesModal;
