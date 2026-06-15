import { neon } from '@neondatabase/serverless';

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password } = req.body;
    const sql = neon(process.env.VITE_NEON_URL || "postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

    try {
        // High-Fidelity Table Governance
        await sql`
            CREATE TABLE IF NOT EXISTS profiles (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                first_name TEXT,
                last_name TEXT,
                name TEXT,
                username TEXT UNIQUE,
                password TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                status TEXT DEFAULT 'pending',
                joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // High-Fidelity Master Bypass for Admins
        if (username === 'admin@nexus.com' && password === 'admin123') {
            return res.status(200).json({ 
                success: true, 
                user: { id: 'admin_root', name: 'System Admin', isAdmin: true, email: 'admin@nexus.com' } 
            });
        }

        const cloud = await sql`SELECT * FROM profiles WHERE email = ${username} OR username = ${username} LIMIT 1`;
        
        if (cloud && cloud.length > 0) {
            const found = cloud[0];
            if (found.password === password) {
                if (found.status === 'pending') {
                    return res.status(403).json({ success: false, message: 'Your account is pending admin approval.' });
                }
                return res.status(200).json({ 
                    success: true, 
                    user: { 
                        id: found.id, 
                        name: found.name || found.username, 
                        email: found.email, 
                        isAdmin: found.is_admin 
                    } 
                });
            }
        }
        
        res.status(401).json({ success: false, message: 'Identity check failed. Verify your password.' });
    } catch (error) {
        console.error('CRITICAL_CLOUD_ERROR:', error);
        res.status(500).json({ success: false, message: 'Cloud Hub Error: ' + error.message });
    }
}
