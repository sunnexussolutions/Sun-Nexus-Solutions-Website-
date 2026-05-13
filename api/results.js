import { neon } from '@neondatabase/serverless';

export default async (req, res) => {
    const sql = neon(process.env.VITE_NEON_URL || "postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");
    try {
        const cloud = await sql`SELECT * FROM results ORDER BY submitted_at DESC`;
        res.status(200).json(cloud);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
