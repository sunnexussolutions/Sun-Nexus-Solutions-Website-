import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Neon Database Connection
const sql = neon("postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

app.use(cors());
app.use(express.json());

// Registration Endpoint
app.post('/api/contact', async (req, res) => {
    const data = req.body;
    
    try {
        const { 
            name, email, academic_year, graduation_year, branch, other_branch,
            specialization, skills, domain, projects, github, linkedin, 
            codechef, hackerrank, languages 
        } = data;

        const final_branch = (branch === 'Other') ? other_branch : branch;

        // Ensure table exists
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

        // Insert Submission
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

        res.json({ 
            success: true, 
            message: '🏆 Technical Profile Secured! Welcome to the Nexus ecosystem.' 
        });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ 
            success: false, 
            message: '❌ Protocol Error: Could not secure data in Neon DB. ' + error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`🚀 Nexus Backend Signal Active at http://localhost:${port}`);
});
