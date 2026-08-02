import { neon } from '@neondatabase/serverless';

export default async (req, res) => {
    const sql = neon(process.env.VITE_NEON_URL || process.env.DATABASE_URL || '');
    try {
        const cloud = await sql`SELECT * FROM results ORDER BY submitted_at DESC`;
        res.status(200).json(cloud);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
