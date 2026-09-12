

import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL || process.env.VITE_NEON_URL;
if (!dbUrl) {
  console.error('DATABASE_URL or VITE_NEON_URL is not set in .env');
  process.exit(1);
}
const neonUrl = process.env.NEON_SQL_ENDPOINT || 'https://ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';

async function testDirectInsert() {
  console.log("🔍 Testing Direct Neon HTTPS SQL insert...");
  
  const queryStr = `
    INSERT INTO freelancing (
      client_name, contact_person, email, phone, project_title, budget_range, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, 'pending'
    )
  `;

  const params = [
    'Direct Neon HTTPS Client',
    'Srinivas Kumar',
    'direct@neon.tech',
    '+91 9123456789',
    'Mobile Application & Web Suite',
    '₹1,00,000 - ₹2,50,000'
  ];

  try {
    const res = await fetch(neonUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': dbUrl
      },
      body: JSON.stringify({ query: queryStr, params })
    });

    console.log("HTTP Response Status:", res.status);
    const body = await res.json();
    console.log("HTTP Response Body:", JSON.stringify(body, null, 2));

    // Verify by reading
    const readRes = await fetch(neonUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': dbUrl
      },
      body: JSON.stringify({ query: 'SELECT id, client_name, project_title, created_at FROM freelancing ORDER BY created_at DESC LIMIT 3' })
    });
    const readBody = await readRes.json();
    console.log("📋 Latest 3 rows in freelancing table:", JSON.stringify(readBody, null, 2));

  } catch (err) {
    console.error("❌ Direct Insert Error:", err);
  }
}

testDirectInsert();
