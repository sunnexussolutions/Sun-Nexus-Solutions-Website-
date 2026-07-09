import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

async function migrate() {
    try {
        console.log("Starting database migrations...");

        // 1. Create discussions table
        console.log("1. Creating discussions table...");
        await sql`
            CREATE TABLE IF NOT EXISTS discussions (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                body TEXT,
                tag TEXT,
                author TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log("✅ Discussions table verified.");

        // 2. Alter results table
        console.log("2. Altering results table...");
        await sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS user_name TEXT`;
        await sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS user_email TEXT`;
        console.log("✅ Results table columns verified.");

        // 3. Alter projects table types from UUID to TEXT
        console.log("3. Altering projects table column types...");
        // Check current column types first or just execute safely
        await sql`ALTER TABLE projects ALTER COLUMN id TYPE TEXT USING id::text`;
        await sql`ALTER TABLE projects ALTER COLUMN user_id TYPE TEXT USING user_id::text`;
        console.log("✅ Projects table column types verified.");

        console.log("🚀 Database migrations completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    }
}

migrate();
