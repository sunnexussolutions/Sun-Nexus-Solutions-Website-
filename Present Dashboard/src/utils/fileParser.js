import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// Initialize the PDF worker with a reliable CDN fallback if local fails
const PDF_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

/**
 * Extracts raw text from a PDF file.
 */
export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      let lastY = -1;
      let pageText = '';
      for (const item of content.items) {
        if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 2) {
          pageText += '\n';
        }
        pageText += item.str + ' ';
        lastY = item.transform[5];
      }
      fullText += pageText + '\n\n';
    }
    return fullText;
  } catch (error) {
    console.error('PDF Extraction Error:', error);
    throw new Error('Failed to extract text from PDF.');
  }
};

/**
 * Extracts raw text from a Word (.docx) file while preserving structure.
 */
export const extractTextFromWord = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Convert to HTML first to preserve paragraph breaks and list structure
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    // Clean HTML to get structured text with reliable newlines
    const text = result.value
      .replace(/<\/p>/g, '\n\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<li>/g, '\n• ')
      .replace(/<\/li>/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    return text;
  } catch (error) {
    console.error('Word Extraction Error:', error);
    throw new Error('Failed to extract text from Word document.');
  }
};

/**
 * Shared parser logic for MCQs.
 */
export const parseMCQsFromText = (text) => {
  if (!text || typeof text !== 'string') return [];

  const cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\u00A0/g, ' ');

  // 1. Universal Question Splitting
  // Added support for "1.Question:" and "1. Question:"
  // Optimized for Mammoth text (which might not have double spaces)
  const questionPattern = /(?=\n\s*\d+[\.\-\):](?:Question:)?\s*)|(?=^\s*\d+[\.\-\):](?:Question:)?\s*)|(?=\s\d+[\.\-\):](?:Question:)?\s*)|(?=\n\s*(?:Question\s+)?\d+[\.\-\):]\s*)/gi;
  
  let chunks = cleanText.split(questionPattern);
  
  if (chunks.length <= 1) {
    chunks = cleanText.split(/(?=\s\d+[\.\-\):](?:Question:)?\s*)/g);
  }

  const questions = [];
  const optMarkers = ['A', 'B', 'C', 'D', 'E', 'F'];
  const trashKeywords = /(?:\s+|^)(?:Ans(?:wer)?|Correct(?: Option| choice)?|Key|Solution|Exp(?:lanation)?|Rationale|Reason|Note)\s*[:\-].*$/gis;

  chunks.forEach(chunk => {
    const trimmed = chunk.trim();
    if (!trimmed || trimmed.length < 10) return;

    // A. Boundary Detection: Find where options start
    // We look for Letter markers (A, B, C...) which are the most common
    // More inclusive: allows single space as a separator for Word docs
    let firstOptMatch = trimmed.match(/(?:\s|\n|^)[\(\[]?[A-F][\)\.\:]\s+/i);
    let usingNumericOptions = false;

    // Fallback to numeric options (1, 2, 3, 4) if no letter markers found
    if (!firstOptMatch) {
      firstOptMatch = trimmed.match(/(?:\s|\n)[\(\[]?1[\)\.\:]\s+/i);
      if (firstOptMatch) usingNumericOptions = true;
    }

    if (!firstOptMatch) return;

    const firstOptIndex = firstOptMatch.index;
    
    // Scrub the header: handles "1.Question:", "Question 1:", "1.", etc.
    let questionText = trimmed.substring(0, firstOptIndex)
      .replace(/^(?:Question\s+)?\d+[\.\-\):](?:Question:)?\s*/i, '')
      .replace(trashKeywords, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!questionText || questionText.length < 2) return;

    const remaining = trimmed.substring(firstOptIndex);
    const options = [];
    const rawOptions = [];
    
    const optRegex = usingNumericOptions
      ? /[\(\[]?([1-6])[\)\.\:]\s+(.*?)(?=\s?[\(\[]?[1-6][\)\.\:]\s*|Ans(?:wer)?\s*[:\-]|Correct(?: Option)?\s*[:\-]|Key\s*[:\-]|Exp(?:lanation)?\s*[:\-]|Rationale\s*[:\-]|Reason\s*[:\-]|Solution\s*[:\-]|Note\s*[:\-]| \d+[\.\-\):]|$)/gis
      : /[\(\[]?([A-F])[\)\.\:]\s+(.*?)(?=\s?[\(\[]?[A-F][\)\.\:]\s*|Ans(?:wer)?\s*[:\-]|Correct(?: Option)?\s*[:\-]|Key\s*[:\-]|Exp(?:lanation)?\s*[:\-]|Rationale\s*[:\-]|Reason\s*[:\-]|Solution\s*[:\-]|Note\s*[:\-]| \d+[\.\-\):]|$)/gis;
    
    let optMatch;
    while ((optMatch = optRegex.exec(remaining)) !== null) {
      rawOptions.push(optMatch[2]);
      let optText = optMatch[2].replace(trashKeywords, '').replace(/\s+/g, ' ').trim();
      if (optText) options.push(optText);
    }

    if (options.length < 2) {
      remaining.split('\n').forEach(line => {
        const lineMatch = usingNumericOptions 
          ? line.match(/^\s*[\(\[]?([1-6])[\)\.\:]\s*(.*)/i)
          : line.match(/^\s*[\(\[]?([A-F])[\)\.\:]\s*(.*)/i);
        if (lineMatch) {
          rawOptions.push(lineMatch[2]);
          let optText = lineMatch[2].replace(trashKeywords, '').trim();
          if (optText) options.push(optText);
        }
      });
    }

    if (options.length < 2) return;

    // C. Detect Answer
    // Priority 1: Explicit Answer marker
    const ansMatch = trimmed.match(/(?:Ans(?:wer)?|Correct(?: Option| choice)?|Key)\s*[:\-]\s*[\(\[]?([A-F1-6])[\)\.]?/i);
    let answerIndex = 0;

    if (ansMatch) {
      const val = ansMatch[1].toUpperCase();
      if (/[A-F]/.test(val)) {
        answerIndex = optMarkers.indexOf(val);
      } else {
        answerIndex = parseInt(val) - 1;
      }
    } else {
      // Priority 2: Look for embedded markers in raw options
      rawOptions.forEach((rawOpt, idx) => {
        const embeddedMatch = rawOpt.match(/(?:Correct Option|Ans):\s*([A-F1-6])/i);
        if (embeddedMatch) {
          const val = embeddedMatch[1].toUpperCase();
          answerIndex = /[A-F]/.test(val) ? optMarkers.indexOf(val) : parseInt(val) - 1;
        } else if (rawOpt.includes('*') || rawOpt.toLowerCase().includes('(correct)') || rawOpt.toLowerCase().includes('✓')) {
          answerIndex = idx;
        }
      });
    }

    // D. Extract Explanation
    // Capture EVERYTHING after "Solution:" or "Exp:"
    const expMatch = trimmed.match(/(?:Exp(?:lanation)?|Rationale|Reason|Solution|Note)\s*[:\-]\s*(.*)/is);
    let explanation = expMatch 
      ? expMatch[1].replace(/\s+/g, ' ').trim() 
      : 'Auto-extracted from content.';

    // E. Final Cleanup: Ensure no Answer/Solution text remains in the last option
    const finalOptions = options.slice(0, 4).map(opt => 
      opt.replace(/(?:Ans(?:wer)?|Correct(?: Option| choice)?|Key|Solution|Exp(?:lanation)?|Rationale|Reason|Note)\s*[:\-].*$/gis, '').trim()
    );

    if (questionText && finalOptions.length >= 2) {
      while (finalOptions.length < 4) finalOptions.push('');

      questions.push({
        text: questionText,
        options: finalOptions,
        answer: (answerIndex >= 0 && answerIndex < 4) ? answerIndex : 0,
        explanation: explanation.substring(0, 1000)
      });
    }
  });

  return questions;
};

/**
 * Extracts MCQs from Excel (.xlsx, .xls) or CSV files.
 */
export const extractQuestionsFromExcel = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (!rows || rows.length === 0) throw new Error('Spreadsheet is empty.');

    const findCol = (row, markers) => {
      const keys = Object.keys(row);
      return keys.find(k => markers.some(m => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(m.toLowerCase().replace(/[^a-z0-9]/g, ''))));
    };

    return rows.filter(r => Object.values(r).some(v => v)).map(row => {
      const qCol   = findCol(row, ['question', 'text', 'desc', 'body', 'statement', 'q']) || Object.keys(row)[0];
      const optA   = findCol(row, ['option a', 'opt a', 'a', '1', 'choice 1']) || Object.keys(row)[1];
      const optB   = findCol(row, ['option b', 'opt b', 'b', '2', 'choice 2']) || Object.keys(row)[2];
      const optC   = findCol(row, ['option c', 'opt c', 'c', '3', 'choice 3']) || Object.keys(row)[3];
      const optD   = findCol(row, ['option d', 'opt d', 'd', '4', 'choice 4']) || Object.keys(row)[4];
      const ansCol = findCol(row, ['answer', 'ans', 'correct', 'key', 'solution']) || Object.keys(row)[5];
      const expCol = findCol(row, ['explanation', 'exp', 'rationale', 'reason', 'note']);

      const options = [
        String(row[optA] || ''),
        String(row[optB] || ''),
        String(row[optC] || ''),
        String(row[optD] || '')
      ];

      const ansVal = String(row[ansCol] || 'A').toUpperCase();
      let ansIndex = ['A', 'B', 'C', 'D'].indexOf(ansVal);
      if (ansIndex === -1) {
        ansIndex = parseInt(ansVal) - 1;
        if (isNaN(ansIndex) || ansIndex < 0 || ansIndex > 3) ansIndex = 0;
      }

      return {
        text: String(row[qCol] || 'Untitled Question'),
        options,
        answer: ansIndex,
        explanation: row[expCol] || 'Auto-extracted from spreadsheet.'
      };
    });
  } catch (error) {
    console.error('Excel Extraction Error:', error);
    throw new Error('Excel parsing failed: ' + error.message);
  }
};
