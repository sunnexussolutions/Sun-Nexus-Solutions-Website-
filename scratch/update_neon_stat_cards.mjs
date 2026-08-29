import { neon } from '@neondatabase/serverless';

const DB_URL = "postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DB_URL);

async function main() {
  try {
    console.log("Checking and updating site_stat_cards in Neon DB...");
    await sql`
      CREATE TABLE IF NOT EXISTS site_stat_cards (
          card_key TEXT PRIMARY KEY,
          page TEXT NOT NULL,
          category TEXT,
          label TEXT NOT NULL,
          value TEXT NOT NULL,
          subtext TEXT,
          icon TEXT,
          order_index INT DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      INSERT INTO site_stat_cards (card_key, page, category, label, value, order_index, updated_at)
      VALUES ('home_row_possibilities', 'Home', 'Hero Stats Row', 'Community Members', '5K+', 6, NOW())
      ON CONFLICT (card_key) DO UPDATE
      SET label = 'Community Members', value = '5K+', updated_at = NOW()
    `;

    const rows = await sql`SELECT card_key, value, label FROM site_stat_cards WHERE page = 'Home' ORDER BY order_index`;
    console.log("Updated Home Stat Cards in Neon DB:", rows);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
