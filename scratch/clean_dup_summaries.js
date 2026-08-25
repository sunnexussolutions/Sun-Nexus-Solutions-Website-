import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL missing!");
  process.exit(1);
}

const sql = neon(connectionString);

function deduplicateText(text) {
  if (!text) return '';
  let str = text.trim();
  
  // Check if string contains duplicate repeated block
  const half = Math.floor(str.length / 2);
  for (let len = 30; len <= half; len++) {
    const part = str.substring(0, len).trim();
    if (str === part + part || str === part + ' ' + part || str === part + '.' + part) {
      str = part;
      break;
    }
  }

  // Also check if text repeats itself twice
  const mid = Math.floor(str.length / 2);
  const s1 = str.substring(0, mid).trim();
  const s2 = str.substring(mid).trim();
  if (s1 === s2) str = s1;

  return str;
}

async function cleanSummaries() {
  console.log("=== FIXING & DEDUPLICATING PROJECT SUMMARIES IN NEON DB ===");
  const projects = await sql`SELECT id, title, summary, description FROM projects WHERE deleted_at IS NULL`;

  for (const p of projects) {
    let cleanSum = deduplicateText(p.summary || '');
    let cleanDesc = deduplicateText(p.description || '');

    // Ensure summary is concise (1-2 sentences, max ~160 chars)
    if (!cleanSum || cleanSum.length > 200 || cleanSum === cleanDesc) {
      let sentences = cleanDesc.split(/(?<=[.?!])\s+/);
      cleanSum = sentences.slice(0, 2).join(' ');
      if (cleanSum.length > 160) {
        cleanSum = cleanSum.substring(0, 157).trim() + '...';
      }
    }

    console.log(`📌 ID: [${p.id}] "${p.title}"`);
    console.log(`   Clean Summary (${cleanSum.length} chars): "${cleanSum}"`);
    
    await sql`UPDATE projects SET summary = ${cleanSum}, description = ${cleanDesc} WHERE id = ${p.id}`;
  }

  console.log("\n✅ ALL DB SUMMARIES CLEANED & DEDUPLICATED SUCCESSFULLY!");
}

cleanSummaries().catch(console.error);
