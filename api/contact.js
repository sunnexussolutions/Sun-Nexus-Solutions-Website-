const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, academic_year, graduation_year, branch, other_branch, specialization, skills, domain, projects, github, linkedin, codechef, hackerrank, languages } = req.body;
    
    const sql = neon(process.env.VITE_NEON_URL || "postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

    try {
        const final_branch = (branch === 'Other') ? other_branch : branch;

        // Ensure tables exist
        await sql`
            CREATE TABLE IF NOT EXISTS contact_inquiries (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                academic_year TEXT NOT NULL,
                graduation_year TEXT NOT NULL,
                branch TEXT NOT NULL,
                specialization TEXT,
                skills TEXT,
                domain TEXT,
                projects TEXT,
                github TEXT,
                linkedin TEXT,
                codechef TEXT,
                hackerrank TEXT,
                languages TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            INSERT INTO contact_inquiries 
            (name, email, academic_year, graduation_year, branch, specialization, skills, domain, projects, github, linkedin, codechef, hackerrank, languages)
            VALUES (
                ${name}, ${email}, ${academic_year}, ${graduation_year}, ${final_branch}, 
                ${specialization || null}, ${skills || null}, ${domain || null}, 
                ${projects || null}, ${github || null}, ${linkedin || null}, 
                ${codechef || null}, ${hackerrank || null}, ${languages || null}
            )
        `;

        res.status(200).json({ 
            success: true, 
            message: '🏆 Technical Profile Secured! Welcome to the Nexus ecosystem.' 
        });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ 
            success: false, 
            message: '❌ Protocol Error: ' + error.message 
        });
    }
}
