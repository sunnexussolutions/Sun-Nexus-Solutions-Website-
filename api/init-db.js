import { neon } from '@neondatabase/serverless';

export default async (req, res) => {
    const sql = neon(process.env.VITE_NEON_URL || "postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");
    
    try {
        console.log("🛠️ INITIATING_SCHEMA_UPGRADE: Profiles Table...");
        
        // Ensure columns exist by adding them if they don't
        await sql`
            CREATE TABLE IF NOT EXISTS profiles (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `;

        // Add missing columns one by one to avoid errors if they already exist
        const columns = [
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' },
            { name: 'name', type: 'TEXT' },
            { name: 'username', type: 'TEXT UNIQUE' },
            { name: 'is_admin', type: 'BOOLEAN DEFAULT FALSE' },
            { name: 'status', type: 'TEXT DEFAULT \'active\'' },
            { name: 'joined_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' }
        ];

        for (const col of columns) {
            try {
                await sql.unsafe(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
                console.log(`✅ COLUMN_VERIFIED: ${col.name}`);
            } catch (e) {
                console.warn(`⚠️ COLUMN_NOTICE: ${col.name} - ${e.message}`);
            }
        }

        res.status(200).json({ 
            success: true, 
            message: '🚀 Nexus Core Infrastructure Synced! Database schema is now strikingly stable.' 
        });
    } catch (error) {
        console.error('Migration Error:', error);
        res.status(500).json({ success: false, message: 'Schema sync failed: ' + error.message });
    }
}
