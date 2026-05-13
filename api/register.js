import { neon } from '@neondatabase/serverless';

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { firstName, lastName, email, username, password } = req.body;
    const sql = neon(process.env.VITE_NEON_URL || "postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");
    
    try {
        // High-Fidelity Table Governance
        await sql(`
            CREATE TABLE IF NOT EXISTS profiles (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                first_name TEXT,
                last_name TEXT,
                name TEXT,
                username TEXT UNIQUE,
                password TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                status TEXT DEFAULT 'active',
                joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const id = `user_${Date.now()}`;
        const name = `${firstName} ${lastName}`;

        await sql`
            INSERT INTO profiles (id, email, first_name, last_name, name, username, password, is_admin, status, joined_at)
            VALUES (${id}, ${email}, ${firstName}, ${lastName}, ${name}, ${username}, ${password}, false, 'active', ${new Date().toISOString()})
        `;

        res.status(200).json({ success: true, message: '🏆 Welcome to the Nexus! Profile activated.' });
    } catch (error) {
        console.error('Register Error:', error);
        let msg = 'Cloud Hub Error: Could not secure account.';
        if (error.message.includes('unique constraint')) {
            msg = '❌ Identity Conflict: Email or Username already exists.';
        }
        res.status(500).json({ success: false, message: msg });
    }
}
