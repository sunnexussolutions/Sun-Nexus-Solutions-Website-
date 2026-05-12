import { neon } from '@neondatabase/serverless';

const url = "postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(url);

async function check() {
    try {
        console.log("🔍 Checking Database Schema...");
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        console.log("📂 Existing Tables:", tables.map(t => t.table_name));

        const count = await sql`SELECT count(*) FROM contact_inquiries`;
        console.log("📊 Records in 'contact_inquiries':", count[0].count);

        const samples = await sql`SELECT * FROM contact_inquiries LIMIT 1`;
        console.log("📄 Sample Record:", samples[0]);

    } catch (err) {
        console.error("❌ DB Check Failed:", err.message);
    }
}

check();
