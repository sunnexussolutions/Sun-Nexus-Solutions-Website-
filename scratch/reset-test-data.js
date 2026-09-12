import { neon } from '@neondatabase/serverless';

const dbUrl = 'process.env.DATABASE_URL';
const sql = neon(dbUrl);

async function resetTestData() {
  await sql`
    INSERT INTO site_stat_cards (card_key, page, category, label, value, order_index, updated_at)
    VALUES ('home_hero_active_students', 'Home', 'Hero Badges', 'Active Students', '10K+', 1, CURRENT_TIMESTAMP)
    ON CONFLICT (card_key) DO UPDATE SET value = '10K+', updated_at = CURRENT_TIMESTAMP
  `;
  console.log('Reset home_hero_active_students back to 10K+');
}

resetTestData();
