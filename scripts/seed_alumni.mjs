import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(dbUrl);

async function withRetry(fn, maxRetries = 5, delayMs = 1500) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.warn(`Attempt ${attempt}/${maxRetries} failed: ${err.message}. Retrying in ${delayMs}ms...`);
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function seedAlumni() {
  console.log('🌱 Seeding full Alumni directory into Neon PostgreSQL...');

  await withRetry(async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS alumni (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          profile_image TEXT,
          batch TEXT NOT NULL,
          is_leader BOOLEAN DEFAULT FALSE,
          leadership_role TEXT,
          "current_role" TEXT NOT NULL,
          company TEXT NOT NULL,
          location TEXT,
          country TEXT DEFAULT 'India',
          skills TEXT,
          linkedin_url TEXT,
          github_url TEXT,
          portfolio_url TEXT,
          bio TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          display_order INT DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  });

  const alumniData = [
    // ── BATCH OF 2025 ──
    {
      name: 'B.Murali Krishna',
      profile_image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.00%20AM.jpeg?updatedAt=1760072973049',
      batch: '2025',
      is_leader: true,
      leadership_role: 'Founder & President',
      current_role: 'Software Development Engineer',
      company: 'Amazon',
      location: 'Hyderabad, India',
      country: 'India',
      skills: 'React.js, Python, Tailwind.css, Node.js, Cloud Architectures',
      linkedin_url: 'https://www.linkedin.com/in/bhargava-sri-ram-kadali/',
      github_url: 'https://github.com/kbhargavasriram88',
      portfolio_url: 'https://bhargavtech4-0.netlify.app/',
      bio: 'Founder and CEO of Sun Nexus Solutions. Passionate about empowering students through hands-on technical excellence.',
      display_order: 1
    },
    {
      name: 'Aakash Varma',
      profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
      batch: '2025',
      is_leader: true,
      leadership_role: 'Technical Lead',
      current_role: 'Cloud Engineer',
      company: 'Google Cloud',
      location: 'Bengaluru, India',
      country: 'India',
      skills: 'Kubernetes, Terraform, GCP, Go',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      bio: 'Architecting resilient cloud native solutions and infrastructure at Google Cloud.',
      display_order: 2
    },

    // ── BATCH OF 2024 LEADERS ──
    {
      name: 'Arjun Sharma',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      batch: '2024',
      is_leader: true,
      leadership_role: 'Batch Leader',
      current_role: 'Software Engineer',
      company: 'Google',
      location: 'Bengaluru, India',
      country: 'India',
      skills: 'Distributed Systems, Go, Kubernetes, GCP',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      bio: 'Passionate software engineer building large-scale distributed systems at Google.',
      display_order: 3
    },
    {
      name: 'Priya Patel',
      profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      batch: '2024',
      is_leader: true,
      leadership_role: 'Technical Lead',
      current_role: 'SDE II',
      company: 'Microsoft',
      location: 'Hyderabad, India',
      country: 'India',
      skills: 'C#, .NET Core, Azure, Microservices',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      bio: 'Leading cloud native architectures and distributed services at Microsoft.',
      display_order: 4
    },
    {
      name: 'Rohan Verma',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      batch: '2024',
      is_leader: true,
      leadership_role: 'Core Leader',
      current_role: 'Backend Developer',
      company: 'Amazon',
      location: 'Bengaluru, India',
      country: 'India',
      skills: 'Java, Spring Boot, AWS, DynamoDB',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      bio: 'Optimizing high-throughput transaction pipelines at Amazon.',
      display_order: 5
    },
    {
      name: 'Sneha Reddy',
      profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      batch: '2024',
      is_leader: true,
      leadership_role: 'Design Lead',
      current_role: 'Product Designer',
      company: 'Adobe',
      location: 'Noida, India',
      country: 'India',
      skills: 'Figma, Design Systems, UX Research, Interaction Design',
      linkedin_url: 'https://linkedin.com',
      portfolio_url: 'https://adobe.com',
      bio: 'Crafting intuitive creative experiences and next-gen design systems at Adobe.',
      display_order: 6
    },

    // ── BATCH OF 2024 MEMBERS ──
    {
      name: 'Aditya Singh',
      profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      batch: '2024',
      is_leader: false,
      leadership_role: '',
      current_role: 'SDE',
      company: 'Flipkart',
      location: 'Bengaluru, India',
      country: 'India',
      skills: 'Java, Kafka, Redis, SQL',
      linkedin_url: 'https://linkedin.com',
      display_order: 7
    },
    {
      name: 'Kavya Nair',
      profile_image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
      batch: '2024',
      is_leader: false,
      leadership_role: '',
      current_role: 'Data Analyst',
      company: 'Deloitte',
      location: 'Mumbai, India',
      country: 'India',
      skills: 'Python, SQL, Tableau, Power BI',
      linkedin_url: 'https://linkedin.com',
      display_order: 8
    },
    {
      name: 'Mehul Shah',
      profile_image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
      batch: '2024',
      is_leader: false,
      leadership_role: '',
      current_role: 'Full Stack Developer',
      company: 'Razorpay',
      location: 'Bengaluru, India',
      country: 'India',
      skills: 'Node.js, React, TypeScript, PostgreSQL',
      linkedin_url: 'https://linkedin.com',
      display_order: 9
    },
    {
      name: 'Ananya Joshi',
      profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      batch: '2024',
      is_leader: false,
      leadership_role: '',
      current_role: 'SDE',
      company: 'PhonePe',
      location: 'Pune, India',
      country: 'India',
      skills: 'Kotlin, Spring Boot, MongoDB',
      linkedin_url: 'https://linkedin.com',
      display_order: 10
    },
    {
      name: 'Tanmay Bansal',
      profile_image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      batch: '2024',
      is_leader: false,
      leadership_role: '',
      current_role: 'QA Engineer',
      company: 'Expedia',
      location: 'Gurgaon, India',
      country: 'India',
      skills: 'Automation, Selenium, Cypress, CI/CD',
      linkedin_url: 'https://linkedin.com',
      display_order: 11
    },
    {
      name: 'Ishita Mehta',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      batch: '2024',
      is_leader: false,
      leadership_role: '',
      current_role: 'ML Engineer',
      company: 'Meta',
      location: 'London, UK',
      country: 'United Kingdom',
      skills: 'PyTorch, Transformers, LLMs, Computer Vision',
      linkedin_url: 'https://linkedin.com',
      display_order: 12
    },

    // ── BATCH OF 2023 ──
    {
      name: 'Vikram Desai',
      profile_image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
      batch: '2023',
      is_leader: true,
      leadership_role: 'Batch Leader',
      current_role: 'SDE II',
      company: 'Uber',
      location: 'Hyderabad, India',
      country: 'India',
      skills: 'Go, Kafka, Distributed Caching',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      display_order: 13
    },
    {
      name: 'Divya Sharma',
      profile_image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
      batch: '2023',
      is_leader: true,
      leadership_role: 'Tech Lead',
      current_role: 'Software Engineer',
      company: 'Atlassian',
      location: 'Bengaluru, India',
      country: 'India',
      skills: 'React, Redux, Node.js, GraphQL',
      linkedin_url: 'https://linkedin.com',
      display_order: 14
    },
    {
      name: 'Karthik Raja',
      profile_image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
      batch: '2023',
      is_leader: false,
      leadership_role: '',
      current_role: 'Backend Engineer',
      company: 'CRED',
      location: 'Bengaluru, India',
      country: 'India',
      skills: 'Java, Spring, AWS',
      linkedin_url: 'https://linkedin.com',
      display_order: 15
    },
    {
      name: 'Simran Kaur',
      profile_image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=400',
      batch: '2023',
      is_leader: false,
      leadership_role: '',
      current_role: 'Frontend Engineer',
      company: 'Intuit',
      location: 'Bengaluru, India',
      country: 'India',
      skills: 'React, Next.js, Web Performance',
      linkedin_url: 'https://linkedin.com',
      display_order: 16
    },

    // ── BATCH OF 2022 ──
    {
      name: 'Siddharth Rao',
      profile_image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      batch: '2022',
      is_leader: true,
      leadership_role: 'Batch Leader',
      current_role: 'Senior SDE',
      company: 'Apple',
      location: 'Cupertino, CA',
      country: 'United States',
      skills: 'Swift, C++, Distributed Systems',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      display_order: 17
    },
    {
      name: 'Anjali Gupta',
      profile_image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
      batch: '2022',
      is_leader: true,
      leadership_role: 'Product Lead',
      current_role: 'Product Manager',
      company: 'Salesforce',
      location: 'San Francisco, CA',
      country: 'United States',
      skills: 'Product Strategy, Agile, UX',
      linkedin_url: 'https://linkedin.com',
      display_order: 18
    },
    {
      name: 'Gaurav Kulkarni',
      profile_image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400',
      batch: '2022',
      is_leader: false,
      leadership_role: '',
      current_role: 'Cloud Architect',
      company: 'Oracle',
      location: 'Bengaluru, India',
      country: 'India',
      skills: 'OCI, Cloud Security, Terraform',
      linkedin_url: 'https://linkedin.com',
      display_order: 19
    },

    // ── BATCH OF 2021 ──
    {
      name: 'Kunal Mehta',
      profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      batch: '2021',
      is_leader: true,
      leadership_role: 'Batch Leader',
      current_role: 'Lead Architect',
      company: 'Stripe',
      location: 'Dublin, Ireland',
      country: 'Ireland',
      skills: 'Ruby, Go, API Infrastructure',
      linkedin_url: 'https://linkedin.com',
      display_order: 20
    },
    {
      name: 'Riya Sen',
      profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      batch: '2021',
      is_leader: false,
      leadership_role: '',
      current_role: 'Staff Engineer',
      company: 'Cisco',
      location: 'San Jose, CA',
      country: 'United States',
      skills: 'Networking, Rust, Python',
      linkedin_url: 'https://linkedin.com',
      display_order: 21
    },

    // ── BATCH OF 2020 ──
    {
      name: 'Aman Verma',
      profile_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      batch: '2020',
      is_leader: true,
      leadership_role: 'Batch Leader',
      current_role: 'Engineering Manager',
      company: 'Goldman Sachs',
      location: 'New York, NY',
      country: 'United States',
      skills: 'FinTech, High Frequency Systems',
      linkedin_url: 'https://linkedin.com',
      display_order: 22
    },
    {
      name: 'Pooja Shah',
      profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      batch: '2020',
      is_leader: false,
      leadership_role: '',
      current_role: 'Principal Engineer',
      company: 'Qualcomm',
      location: 'San Diego, CA',
      country: 'United States',
      skills: 'Embedded Systems, C, RTOS',
      linkedin_url: 'https://linkedin.com',
      display_order: 23
    },

    // ── BATCH OF 2019 ──
    {
      name: 'Rahul Nair',
      profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      batch: '2019',
      is_leader: true,
      leadership_role: 'Batch Leader',
      current_role: 'VP of Engineering',
      company: 'TechCorp Global',
      location: 'Singapore',
      country: 'Singapore',
      skills: 'Engineering Leadership, Scaling',
      linkedin_url: 'https://linkedin.com',
      display_order: 24
    },
    {
      name: 'Shreya Singhal',
      profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      batch: '2019',
      is_leader: false,
      leadership_role: '',
      current_role: 'Founder & CEO',
      company: 'InnovateAI',
      location: 'Bengaluru, India',
      country: 'India',
      skills: 'AI Research, Entrepreneurship',
      linkedin_url: 'https://linkedin.com',
      display_order: 25
    }
  ];

  for (const item of alumniData) {
    await withRetry(async () => {
      const existing = await sql`SELECT id FROM alumni WHERE name = ${item.name} LIMIT 1`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO alumni (
            name, profile_image, batch, is_leader, leadership_role, "current_role",
            company, location, country, skills, linkedin_url, github_url,
            portfolio_url, bio, is_active, display_order
          ) VALUES (
            ${item.name}, ${item.profile_image}, ${item.batch}, ${item.is_leader},
            ${item.leadership_role || null}, ${item.current_role}, ${item.company},
            ${item.location || null}, ${item.country || 'India'}, ${item.skills || null},
            ${item.linkedin_url || null}, ${item.github_url || null}, ${item.portfolio_url || null},
            ${item.bio || null}, true, ${item.display_order}
          );
        `;
      }
    });
  }

  const finalCount = await withRetry(async () => sql`SELECT count(*)::int as total FROM alumni`);
  console.log(`✅ Alumni seeding complete! Total alumni in DB: ${finalCount[0].total}`);
}

seedAlumni().catch(console.error);
