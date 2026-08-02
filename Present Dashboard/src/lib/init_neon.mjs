import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.VITE_NEON_URL || process.env.DATABASE_URL || '');

async function initDB() {
  try {
    console.log("Creating community_posts table...");
    await sql`
      CREATE TABLE IF NOT EXISTS community_posts (
        id VARCHAR(255) PRIMARY KEY,
        user_name VARCHAR(255),
        role VARCHAR(255),
        avatar TEXT,
        content TEXT,
        media_preview TEXT,
        resource_url TEXT,
        reactions JSONB,
        user_reactions JSONB,
        verified BOOLEAN DEFAULT FALSE,
        comments JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log("Creating domains table...");
    await sql`
      CREATE TABLE IF NOT EXISTS domains (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255),
        icon VARCHAR(100),
        color VARCHAR(50),
        description TEXT,
        stats VARCHAR(100),
        trending BOOLEAN DEFAULT FALSE,
        sub_domains JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating assessments table...");
    await sql`
      CREATE TABLE IF NOT EXISTS assessments (
        id VARCHAR(255) PRIMARY KEY,
        category VARCHAR(255),
        topic VARCHAR(255),
        week VARCHAR(100),
        time_limit INTEGER,
        questions JSONB,
        video_url TEXT,
        unlock_time TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating results table...");
    await sql`
      CREATE TABLE IF NOT EXISTS results (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        assessment_id VARCHAR(255),
        topic VARCHAR(255),
        score INTEGER,
        total INTEGER,
        percentage INTEGER,
        category VARCHAR(255),
        user_name VARCHAR(255),
        user_email VARCHAR(255),
        answers JSONB,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS answers JSONB;`;
    console.log("✅ Additional Tables created successfully in Neon DB.");
  } catch (error) {
    console.error("❌ Failed to create tables:", error);
  }
}

initDB();
