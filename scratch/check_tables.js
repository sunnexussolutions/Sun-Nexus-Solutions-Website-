import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

async function check() {
    try {
        console.log("Checking tables in database (public schema only)...");
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        console.log("Existing tables:", tables.map(t => t.table_name));
        
        for (const t of tables) {
            const cols = await sql`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = ${t.table_name} AND table_schema = 'public'
            `;
            console.log(`Columns for public.${t.table_name}:`, cols.map(c => `${c.column_name} (${c.data_type})`));
        }
    } catch (error) {
        console.error("Error checking database:", error);
    }
}

check();
