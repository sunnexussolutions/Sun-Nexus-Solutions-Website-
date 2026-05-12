import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password } = req.body;
    const sql = neon(process.env.VITE_NEON_URL || "postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

    try {
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
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Connection to Cloud Hub interrupted.' });
    }
}
