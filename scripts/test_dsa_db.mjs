import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:REDACTED_SECRET@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(dbUrl);

async function testAll() {
  const [topics, problems, userProgress, tags, companies] = await Promise.all([
    sql`SELECT count(*) as count FROM dsa_topics`,
    sql`SELECT count(*) as count FROM dsa_problems`,
    sql`SELECT count(*) as count FROM dsa_user_progress`,
    sql`SELECT count(*) as count FROM dsa_tags`,
    sql`SELECT count(*) as count FROM dsa_companies`
  ]);

  console.log('--- NEON DATABASE STATUS ---');
  console.log('DSA Topics:', topics[0].count);
  console.log('DSA Problems:', problems[0].count);
  console.log('DSA Progress Records:', userProgress[0].count);
  console.log('DSA Tags:', tags[0].count);
  console.log('DSA Companies:', companies[0].count);
}

testAll().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
