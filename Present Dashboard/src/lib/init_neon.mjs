import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

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
    console.log("✅ Additional Tables created successfully in Neon DB.");
  } catch (error) {
    console.error("❌ Failed to create tables:", error);
  }
}

initDB();
