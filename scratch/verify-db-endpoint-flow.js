import { neon } from '@neondatabase/serverless';

const dbUrl = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(dbUrl);

async function testFullFlow() {
  console.log('====================================================');
  console.log('🔍 VERIFYING DATABASE TO ENDPOINT FLOW FOR STAT CARDS');
  console.log('====================================================\n');

  // STEP 1: Test Database Read
  console.log('--- Step 1: Querying site_stat_cards table in Neon Postgres ---');
  try {
    const dbRows = await sql`SELECT card_key, page, category, label, value FROM site_stat_cards ORDER BY order_index ASC`;
    console.log(`✅ Success: Retrieved ${dbRows.length} rows from Neon DB.`);
    dbRows.forEach(r => {
      console.log(`   📌 [${r.page}] ${r.card_key} -> Value: "${r.value}", Label: "${r.label}"`);
    });
  } catch (err) {
    console.error('❌ Step 1 Failed:', err.message);
  }

  // STEP 2: Test Direct Neon HTTPS Proxy (used by js/stat-cards.js when local server is offline)
  console.log('\n--- Step 2: Testing Direct Neon HTTPS Proxy (used by client script) ---');
  try {
    const res = await fetch('https://ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': dbUrl
      },
      body: JSON.stringify({
        query: 'SELECT card_key, page, category, label, value FROM site_stat_cards ORDER BY order_index ASC'
      })
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Success: Neon Direct HTTPS returned ${data.rows?.length || 0} cards.`);
      const activeStudentsCard = data.rows.find(r => r.card_key === 'home_hero_active_students');
      const expertMentorsCard = data.rows.find(r => r.card_key === 'home_hero_expert_mentors');
      console.log(`   ⭐ home_hero_active_students: "${activeStudentsCard?.value}"`);
      console.log(`   ⭐ home_hero_expert_mentors:  "${expertMentorsCard?.value}"`);
    } else {
      console.error('❌ Step 2 Failed with status:', res.status);
    }
  } catch (err) {
    console.error('❌ Step 2 Error:', err.message);
  }

  // STEP 3: Test Database Write & Update Flow
  console.log('\n--- Step 3: Testing DB Upsert Flow (Simulating Admin Save) ---');
  try {
    const testValue = "25K+";
    await sql`
      INSERT INTO site_stat_cards (card_key, page, category, label, value, order_index, updated_at)
      VALUES ('home_hero_active_students', 'Home', 'Hero Badges', 'Active Students', ${testValue}, 1, CURRENT_TIMESTAMP)
      ON CONFLICT (card_key) DO UPDATE SET value = ${testValue}, updated_at = CURRENT_TIMESTAMP
    `;
    console.log(`✅ Success: Upserted home_hero_active_students to "${testValue}"`);

    // Re-query to verify persistence
    const checkRow = await sql`SELECT card_key, value FROM site_stat_cards WHERE card_key = 'home_hero_active_students'`;
    console.log(`✅ Verification: Cloud DB now holds value: "${checkRow[0]?.value}"`);
  } catch (err) {
    console.error('❌ Step 3 Error:', err.message);
  }

  console.log('\n====================================================');
  console.log('🎉 ENDPOINT TO DATABASE FLOW VERIFICATION COMPLETE');
  console.log('====================================================');
}

testFullFlow();
