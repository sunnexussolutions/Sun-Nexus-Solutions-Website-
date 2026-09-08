import { query } from '../lib/neon';
import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';

export const DEFAULT_ASSESSMENTS = [
  {
    id: 'qa-1',
    category: 'Quantitative',
    topic: 'Fractions and Decimals',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/watch?v=tnc9ojITRg4',
    questions: [
      { id: 1, question: 'What is 3/4 converted to a decimal?', options: ['0.5', '0.75', '0.8', '0.65'], answer: 1 },
      { id: 2, question: 'Which fraction is equivalent to 0.4?', options: ['2/5', '1/4', '3/8', '4/9'], answer: 0 },
      { id: 3, question: 'What is 0.125 as a simplified fraction?', options: ['1/6', '1/8', '1/4', '3/8'], answer: 1 },
      { id: 4, question: 'Calculate: 1.25 + 2.75', options: ['3.8', '4.0', '4.25', '3.95'], answer: 1 }
    ]
  },
  {
    id: 'qa-2',
    category: 'Quantitative',
    topic: 'Simplification',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/watch?v=ZuMJFleXmiw',
    questions: [
      { id: 1, question: 'Evaluate: (12 + 18) ÷ 6 × 2', options: ['5', '10', '15', '20'], answer: 1 },
      { id: 2, question: 'What is 25% of 160?', options: ['30', '40', '50', '60'], answer: 1 },
      { id: 3, question: 'Simplify: 15 × 8 - 40 ÷ 5', options: ['112', '120', '116', '108'], answer: 0 }
    ]
  },
  {
    id: 'qa-3',
    category: 'Quantitative',
    topic: 'Surds and Indices',
    week: 'Week 2',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/watch?v=jAbpPTpz2bQ',
    questions: [
      { id: 1, question: 'What is 2^5 equal to?', options: ['16', '32', '64', '25'], answer: 1 },
      { id: 2, question: 'Simplify: √50', options: ['5√2', '2√5', '10√5', '5√10'], answer: 0 }
    ]
  },
  {
    id: 'qa-4',
    category: 'Quantitative',
    topic: 'Permutation & Combination',
    week: 'Week 2',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/watch?v=ETiRE7N7pEI',
    questions: [
      { id: 1, question: 'In how many ways can 4 people sit around a circular table?', options: ['24', '6', '12', '18'], answer: 1 },
      { id: 2, question: 'What is 5P2 (Permutations of 5 items taken 2 at a time)?', options: ['10', '20', '60', '120'], answer: 1 }
    ]
  },
  {
    id: 'lr-1',
    category: 'Logical Reasoning',
    topic: 'Puzzles (Mixed Logic)',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/results?search_query=seating+arrangement+reasoning',
    questions: [
      { id: 1, question: 'Five people A, B, C, D, and E are sitting in a row facing North. A is to the immediate right of B, and E is to the immediate left of B. C is sitting at the right end. Who is sitting in the middle?', options: ['Person A', 'Person B', 'Person C', 'Person D'], answer: 1 },
      { id: 2, question: 'If RED is coded as 18-5-4, how is GREEN coded?', options: ['7-18-5-5-14', '7-17-4-4-13', '8-19-6-6-15', '7-18-6-6-14'], answer: 0 }
    ]
  },
  {
    id: 'lr-2',
    category: 'Logical Reasoning',
    topic: 'Syllogisms',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/results?search_query=syllogisms+logical+reasoning',
    questions: [
      { id: 1, question: 'Statements: All cats are animals. All animals are mammals. Conclusion: All cats are mammals.', options: ['True', 'False', 'Cannot be determined', 'None of these'], answer: 0 },
      { id: 2, question: 'Statements: Some apples are red. All red things are sweet. Conclusion: Some apples are sweet.', options: ['Follows', 'Does not follow', 'Either follows or not', 'None of these'], answer: 0 }
    ]
  },
  {
    id: 'lr-3',
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    week: 'Week 2',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/results?search_query=blood+relations+logical+reasoning',
    questions: [
      { id: 1, question: 'Pointing to a man, a woman said, "His mother is the only daughter of my mother." How is the woman related to the man?', options: ['Sister', 'Mother', 'Aunt', 'Daughter'], answer: 1 }
    ]
  },
  {
    id: 'va-1',
    category: 'Verbal Ability',
    topic: 'Synonyms & Antonyms',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/results?search_query=synonyms+antonyms+verbal+ability',
    questions: [
      { id: 1, question: 'Choose the synonym for "CANDID":', options: ['Frank', 'Secretive', 'Dishonest', 'Shy'], answer: 0 },
      { id: 2, question: 'Choose the antonym for "BENEVOLENT":', options: ['Kind', 'Malevolent', 'Generous', 'Friendly'], answer: 1 }
    ]
  },
  {
    id: 'va-2',
    category: 'Verbal Ability',
    topic: 'Sentence Correction',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/results?search_query=sentence+correction+verbal+ability',
    questions: [
      { id: 1, question: 'Identify the error: "Neither of the options were suitable."', options: ['Neither of', 'the options', 'were suitable', 'No error'], answer: 2 }
    ]
  }
];

export const getAssessments = async () => {
  const local = storage.get(STORAGE_KEYS.ASSESSMENTS, DEFAULT_ASSESSMENTS);
  try {
    const cloud = await query('SELECT * FROM assessments ORDER BY created_at DESC');
    if (cloud && cloud.length > 0) {
      const mapped = cloud.map(a => ({
        ...a,
        questions: typeof a.questions === 'string' ? JSON.parse(a.questions) : (a.questions || []),
        timeLimit: a.time_limit || a.timeLimit || 20,
        videoUrl: a.video_url || a.videoUrl || '',
        unlockTime: a.unlock_time || a.unlockTime || '',
        createdAt: a.created_at || a.createdAt
      }));
      storage.set(STORAGE_KEYS.ASSESSMENTS, mapped, true);
      return mapped;
    }
  } catch (err) {
    console.warn('[AssessmentStore] Cloud fetch fallback:', err.message);
  }
  return local || DEFAULT_ASSESSMENTS;
};

export const addAssessment = async (a) => {
  const id = a.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ass_${Date.now()}`);
  const newAss = {
    ...a,
    id,
    timeLimit: a.timeLimit || a.time_limit || 20,
    videoUrl: a.videoUrl || a.video_url || '',
    unlockTime: a.unlockTime || a.unlock_time || '',
    questions: a.questions || [],
    createdAt: new Date().toISOString()
  };

  const current = await getAssessments();
  storage.set(STORAGE_KEYS.ASSESSMENTS, [newAss, ...current]);

  try {
    await query(`
      INSERT INTO assessments (id, category, topic, week, time_limit, questions, video_url, unlock_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      id,
      newAss.category,
      newAss.topic,
      newAss.week,
      newAss.timeLimit,
      JSON.stringify(newAss.questions),
      newAss.videoUrl,
      newAss.unlockTime || null
    ]);
  } catch (err) {
    console.warn('[AssessmentStore] Cloud add fallback:', err.message);
  }

  return newAss;
};

export const updateAssessment = async (a) => {
  const current = await getAssessments();
  const updated = current.map(item => item.id === a.id ? { ...item, ...a } : item);
  storage.set(STORAGE_KEYS.ASSESSMENTS, updated);

  try {
    await query(`
      UPDATE assessments
      SET category = $1, topic = $2, week = $3, time_limit = $4, questions = $5, video_url = $6, unlock_time = $7
      WHERE id = $8
    `, [
      a.category,
      a.topic,
      a.week,
      a.timeLimit || a.time_limit,
      JSON.stringify(a.questions || []),
      a.videoUrl || a.video_url || '',
      a.unlockTime || a.unlock_time || null,
      a.id
    ]);
  } catch (err) {
    console.warn('[AssessmentStore] Cloud update fallback:', err.message);
  }
};

export const deleteAssessment = async (id) => {
  const current = await getAssessments();
  const filtered = current.filter(a => a.id !== id);
  storage.set(STORAGE_KEYS.ASSESSMENTS, filtered);

  try {
    await query('DELETE FROM assessments WHERE id = $1', [id]);
  } catch (err) {
    console.warn('[AssessmentStore] Cloud delete fallback:', err.message);
  }
};
