import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Initialize the PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

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
      const strings = content.items.map(item => item.str);
      fullText += strings.join(' ') + '\n';
    }
    return fullText;
  } catch (error) {
    console.error('PDF Extraction Error:', error);
    throw new Error('Failed to extract text from PDF.');
  }
};

/**
 * Extracts raw text from a Word (.docx) file.
 */
export const extractTextFromWord = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Word Extraction Error:', error);
    throw new Error('Failed to extract text from Word document. Please ensure it is a .docx file.');
  }
};

/**
 * Shared parser logic for MCQs.
 * Works for both PDF and Word as it operates on raw text.
 */
export const parseMCQsFromText = (text) => {
  // Normalize text: remove multiple spaces and non-standard characters
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  
  const chunks = normalizedText.split(/(?=\d+[\.\)]\s+)/);
  const questions = [];

  chunks.forEach(chunk => {
    if (!chunk.trim()) return;

    // 1. Extract Question Text
    const qMatch = chunk.match(/^\d+[\.\)]\s+(.*?)(?=\s?[\(\[]?[A-D][\)\.]\s+)/i);
    if (!qMatch) return;
    
    const questionText = qMatch[1].trim();

    // 2. Extract Options
    const options = [];
    const optRegex = /[\(\[]?([A-D])[\)\.]\s+(.*?)(?=\s?[\(\[]?[A-D][\)\.]\s+|Ans:|Answer:|$)/gi;
    let match;
    while ((match = optRegex.exec(chunk)) !== null) {
      options.push(match[2].trim());
    }

    // 3. Extract Answer
    const ansMatch = chunk.match(/(?:Ans(?:wer)?:\s?([A-D]))/i);
    const answerChar = ansMatch ? ansMatch[1].toUpperCase() : 'A';
    const answerIndex = ['A', 'B', 'C', 'D'].indexOf(answerChar);

    if (questionText && options.length >= 2) {
      const paddedOptions = options.slice(0, 4);
      while (paddedOptions.length < 4) paddedOptions.push('');

      questions.push({
        text: questionText,
        options: paddedOptions,
        answer: answerIndex !== -1 ? answerIndex : 0,
        explanation: 'Auto-extracted from bulk data.'
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
    const rows = XLSX.utils.sheet_to_json(worksheet);

    if (!rows || rows.length === 0) {
      throw new Error('The spreadsheet is empty.');
    }

    // Helper to find column name regardless of case/spacing
    const findCol = (row, markers) => {
      const keys = Object.keys(row);
      return keys.find(k => markers.some(m => k.toLowerCase().includes(m.toLowerCase())));
    };

    return rows.map(row => {
      const qCol = findCol(row, ['question', 'text', 'desc', 'body']) || Object.keys(row)[0];
      const optA = findCol(row, ['option a', 'opt a', 'A', '1']) || Object.keys(row)[1];
      const optB = findCol(row, ['option b', 'opt b', 'B', '2']) || Object.keys(row)[2];
      const optC = findCol(row, ['option c', 'opt c', 'C', '3']) || Object.keys(row)[3];
      const optD = findCol(row, ['option d', 'opt d', 'D', '4']) || Object.keys(row)[4];
      const ansCol = findCol(row, ['answer', 'ans', 'correct']) || Object.keys(row)[5];

      const options = [
        String(row[optA] || ''),
        String(row[optB] || ''),
        String(row[optC] || ''),
        String(row[optD] || '')
      ];

      const ansVal = String(row[ansCol] || 'A').toUpperCase();
      let ansIndex = ['A', 'B', 'C', 'D'].indexOf(ansVal);
      if (ansIndex === -1) {
        // Try numeric index if not A-D
        ansIndex = parseInt(ansVal) - 1;
        if (isNaN(ansIndex) || ansIndex < 0 || ansIndex > 3) ansIndex = 0;
      }

      return {
        text: String(row[qCol] || 'Untitled Question'),
        options,
        answer: ansIndex,
        explanation: row['Explanation'] || 'Auto-extracted from spreadsheet.'
      };
    });
  } catch (error) {
    console.error('Excel Extraction Error:', error);
    throw new Error('Failed to parse Excel file: ' + error.message);
  }
};
