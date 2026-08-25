import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL;
console.log('Connecting to Neon DB:', dbUrl ? 'URL FOUND' : 'NO URL');

const sql = neon(dbUrl);

async function runSeed() {
  try {
    console.log('Creating projects table if missing...');
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          owner_id TEXT NOT NULL,
          owner_name TEXT,
          owner_avatar TEXT,
          created_by TEXT,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'in_progress',
          priority TEXT DEFAULT 'medium',
          domain TEXT DEFAULT 'Engineering',
          thumbnail TEXT,
          screenshots TEXT DEFAULT '[]',
          documents TEXT DEFAULT '[]',
          github TEXT,
          github_url TEXT,
          live_demo TEXT,
          live_demo_url TEXT,
          tech_stack TEXT DEFAULT '[]',
          completion INTEGER DEFAULT 0,
          completion_percentage INTEGER DEFAULT 0,
          category TEXT DEFAULT 'Advanced',
          visibility TEXT DEFAULT 'public',
          team_members TEXT DEFAULT '[]',
          role TEXT,
          start_date TEXT,
          completion_date TEXT,
          challenges TEXT,
          future_improvements TEXT,
          features TEXT DEFAULT '[]',
          architecture TEXT,
          likes INTEGER DEFAULT 0,
          views INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP WITH TIME ZONE
      )
    `;

    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_id TEXT DEFAULT 'user_admin'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_name TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_avatar TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_by TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS domain TEXT DEFAULT 'Engineering'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots TEXT DEFAULT '[]'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS documents TEXT DEFAULT '[]'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_demo TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_demo_url TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack TEXT DEFAULT '[]'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS completion INTEGER DEFAULT 0`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Advanced'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS team_members TEXT DEFAULT '[]'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS completion_date TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenges TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS future_improvements TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS features TEXT DEFAULT '[]'`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture TEXT`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE`;

    console.log('Seeding 27 projects...');
    const seedProjects = [
      // Advanced Projects
      {
          id: 'proj_sun_nexus_website',
          owner_id: 'user_admin',
          owner_name: 'B.Prasad',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514',
          title: 'Sun Nexus Solutions Website',
          description: 'A responsive website for Sun Nexus Solutions, showcasing their services and projects.',
          status: 'completed',
          category: 'Advanced',
          domain: 'Web Development',
          completion: 100,
          tech_stack: JSON.stringify(['React', 'HTML5', 'CSS3', 'JavaScript', 'Node.js']),
          team_members: JSON.stringify([
              { name: 'B.Prasad', role: 'Team Lead', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514' },
              { name: 'C.Mallikarjuna Rao', role: 'Full Stack Dev', image: 'https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572' },
              { name: 'K.Raghu', role: 'Frontend Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-08%20at%2010.27.23%20AM.jpeg?updatedAt=1760072973601' },
              { name: 'S.Poojitha', role: 'UI/UX Designer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.24.52%20AM.jpeg?updatedAt=1760072972748' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_lab_manage_system',
          owner_id: 'user_admin',
          owner_name: 'C.Mallikarjuna Rao',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572',
          title: 'Lab Manage System',
          description: 'AI-based lab management and resource optimization system.',
          status: 'completed',
          category: 'Advanced',
          domain: 'Engineering',
          completion: 100,
          tech_stack: JSON.stringify(['Python', 'Django', 'React', 'PostgreSQL']),
          team_members: JSON.stringify([
              { name: 'C.Mallikarjuna Rao', role: 'Lead Developer', image: 'https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572' },
              { name: 'N.Amrutha Varshini', role: 'ML Engineer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772639381/amrutha_varshini_mgyn9n.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_whatsapp_chatbot',
          owner_id: 'user_admin',
          owner_name: 'K.Girivardhan',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.34%20AM.jpeg?updatedAt=1760072974650',
          title: 'Whatsapp Chatbot',
          description: 'An AI-powered chatbot integrated with WhatsApp for instant customer support and automation.',
          status: 'completed',
          category: 'Advanced',
          domain: 'AI & ML',
          completion: 100,
          tech_stack: JSON.stringify(['Node.js', 'WhatsApp API', 'Python', 'NLP']),
          team_members: JSON.stringify([
              { name: 'K.Girivardhan', role: 'Backend Lead', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.34%20AM.jpeg?updatedAt=1760072974650' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_exam_invigilation',
          owner_id: 'user_admin',
          owner_name: 'B.Jaya Manideep',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669',
          title: 'Exam invigilation management system',
          description: 'An AI-based exam invigilation system to ensure academic integrity.',
          status: 'completed',
          category: 'Advanced',
          domain: 'AI & ML',
          completion: 100,
          tech_stack: JSON.stringify(['Python', 'OpenCV', 'Deep Learning', 'Flask']),
          team_members: JSON.stringify([
              { name: 'B.Jaya Manideep', role: 'ML Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669' },
              { name: 'G.Purna Reddy', role: 'Backend Dev', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772599133/purna_reddy_mszkgg.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_ai_assignment_evaluator',
          owner_id: 'user_admin',
          owner_name: 'B.Charitha Reddy',
          owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg',
          title: 'AI assignment evaluator',
          description: 'An AI-based system to evaluate student assignments automatically.',
          status: 'completed',
          category: 'Advanced',
          domain: 'AI & ML',
          completion: 100,
          tech_stack: JSON.stringify(['Python', 'NLP', 'BERT', 'FastAPI']),
          team_members: JSON.stringify([
              { name: 'B.Charitha Reddy', role: 'AI Specialist', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg' },
              { name: 'M.Swapna', role: 'Frontend Dev', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_startup_management',
          owner_id: 'user_admin',
          owner_name: 'C.Varun',
          owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772303456/varun.c.2_fod1hf.jpg',
          title: 'Startup Management System',
          description: 'A comprehensive management system for startups to track projects, tasks, and team collaboration.',
          status: 'completed',
          category: 'Advanced',
          domain: 'Engineering',
          completion: 100,
          tech_stack: JSON.stringify(['React', 'Node.js', 'Express', 'MongoDB']),
          team_members: JSON.stringify([
              { name: 'C.Varun', role: 'Full Stack Engineer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772303456/varun.c.2_fod1hf.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_meeting_summarizer',
          owner_id: 'user_admin',
          owner_name: 'B.Charitha Reddy',
          owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg',
          title: 'Meeting Summarizer',
          description: 'AI-powered meeting summarization tool that transcribes and summarizes video calls.',
          status: 'completed',
          category: 'Advanced',
          domain: 'AI & ML',
          completion: 100,
          github_url: 'https://github.com/Bareddycharitha/Meeting-summariser',
          tech_stack: JSON.stringify(['Python', 'Whisper AI', 'GPT-4', 'Streamlit']),
          team_members: JSON.stringify([
              { name: 'B.Charitha Reddy', role: 'AI Engineer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_smart_attendance',
          owner_id: 'user_admin',
          owner_name: 'Lokesh',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/unnamed.jpg?updatedAt=1760094756157',
          title: 'Smart Attendance System',
          description: 'An AI-powered attendance tracking system using facial recognition for accurate record-keeping.',
          status: 'completed',
          category: 'Advanced',
          domain: 'AI & ML',
          completion: 100,
          tech_stack: JSON.stringify(['OpenCV', 'FaceNet', 'Python', 'React']),
          team_members: JSON.stringify([
              { name: 'Lokesh', role: 'Lead Developer', image: 'https://ik.imagekit.io/kofq4cdghu/unnamed.jpg?updatedAt=1760094756157' },
              { name: 'K.Varshith Naidu', role: 'AI Developer', image: 'https://ik.imagekit.io/kofq4cdghu/IMG-20250917-WA0086(1).jpg?updatedAt=1760094980018' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_timetable_management',
          owner_id: 'user_admin',
          owner_name: 'A.Lokesh Reddy',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927',
          title: 'Automated Timetable Management System',
          description: 'A smart scheduling system that generates optimized timetables for educational institutions.',
          status: 'completed',
          category: 'Advanced',
          domain: 'Engineering',
          completion: 100,
          tech_stack: JSON.stringify(['Genetic Algorithm', 'Python', 'Django', 'React']),
          team_members: JSON.stringify([
              { name: 'A.Lokesh Reddy', role: 'Project Lead', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927' },
              { name: 'V.Gopinadh', role: 'Algorithm Spec', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.55.20%20AM.jpeg?updatedAt=1760074230579' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_crowd_shield',
          owner_id: 'user_admin',
          owner_name: 'A.Lokesh Reddy',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927',
          title: 'Crowd-Sheild',
          description: 'AI-powered crowd monitoring for public safety.',
          status: 'completed',
          category: 'Advanced',
          domain: 'Cyber Security',
          completion: 100,
          tech_stack: JSON.stringify(['YOLOv8', 'Computer Vision', 'Python', 'WebSockets']),
          team_members: JSON.stringify([
              { name: 'A.Lokesh Reddy', role: 'AI Lead', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927' },
              { name: 'V.Gopinadh', role: 'System Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.55.20%20AM.jpeg?updatedAt=1760074230579' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_resume_analyzer',
          owner_id: 'user_admin',
          owner_name: 'B.Murali Krishna',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.00%20AM.jpeg?updatedAt=1760072973049',
          title: 'AI-Powered Resume Analyzer',
          description: 'AI evaluates resumes for job fit score and provides improvement insights.',
          status: 'completed',
          category: 'Advanced',
          domain: 'AI & ML',
          completion: 100,
          tech_stack: JSON.stringify(['Python', 'NLP', 'spacy', 'Streamlit']),
          team_members: JSON.stringify([
              { name: 'B.Murali Krishna', role: 'ML Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.00%20AM.jpeg?updatedAt=1760072973049' }
          ]),
          visibility: 'public'
      },

      // Beginner Projects
      {
          id: 'proj_ai_pushup_trainer',
          owner_id: 'user_admin',
          owner_name: 'B.Jaya Manideep',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669',
          title: 'AI Push-Up Trainer',
          description: 'An AI-powered push-up trainer that provides real-time feedback and coaching.',
          status: 'completed',
          category: 'Beginner',
          domain: 'AI & ML',
          completion: 100,
          tech_stack: JSON.stringify(['OpenCV', 'MediaPipe', 'Python', 'Streamlit']),
          team_members: JSON.stringify([
              { name: 'B.Jaya Manideep', role: 'ML Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669' },
              { name: 'M.Swapna', role: 'UI Developer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_amazon_sales_dashboard',
          owner_id: 'user_admin',
          owner_name: 'M.Swapna',
          owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg',
          title: 'Amazon Sales Dashboard',
          description: 'A comprehensive sales dashboard for Amazon sellers to track performance and analyze sales data.',
          status: 'completed',
          category: 'Beginner',
          domain: 'Data Science',
          completion: 100,
          tech_stack: JSON.stringify(['PowerBI', 'Python', 'Pandas', 'SQL']),
          team_members: JSON.stringify([
              { name: 'M.Swapna', role: 'Data Analyst', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_cricket_analysis',
          owner_id: 'user_admin',
          owner_name: 'B.Jaya Manideep',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669',
          title: 'Cricket Performance Analysis(Virat Kohli)',
          description: "An AI-driven performance analysis tool focusing on Virat Kohli's career statistics.",
          status: 'completed',
          category: 'Beginner',
          domain: 'Data Science',
          completion: 100,
          tech_stack: JSON.stringify(['Python', 'Pandas', 'Matplotlib', 'Seaborn']),
          team_members: JSON.stringify([
              { name: 'B.Jaya Manideep', role: 'Data Scientist', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669' },
              { name: 'M.Swapna', role: 'Data Analyst', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_majhali_kitchen',
          owner_id: 'user_admin',
          owner_name: 'A.Lokesh Reddy',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927',
          title: 'Majhali Restaurant Kitchen',
          description: 'Restaurant kitchen management system for efficient operations and inventory control.',
          status: 'completed',
          category: 'Beginner',
          domain: 'Web Development',
          completion: 100,
          tech_stack: JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Firebase']),
          team_members: JSON.stringify([
              { name: 'A.Lokesh Reddy', role: 'Frontend Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_rooftop_restaurant',
          owner_id: 'user_admin',
          owner_name: 'B.Prasad',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514',
          title: 'Roof-Top Restaurant',
          description: 'A modern restaurant management system for rooftop dining experiences.',
          status: 'completed',
          category: 'Beginner',
          domain: 'Web Development',
          completion: 100,
          tech_stack: JSON.stringify(['React', 'Tailwind CSS', 'Node.js']),
          team_members: JSON.stringify([
              { name: 'B.Prasad', role: 'Full Stack Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514' },
              { name: 'K.Bhargava', role: 'UI Engineer', image: 'https://res.cloudinary.com/djw0g8duw/image/upload/v1763865310/link_img_rusktx.png' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_rooftop_sales_dashboard',
          owner_id: 'user_admin',
          owner_name: 'M.Swapna',
          owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg',
          title: 'Roof-Top Sales Dashboard',
          description: 'A sales dashboard for rooftop dining experiences providing revenue insights.',
          status: 'completed',
          category: 'Beginner',
          domain: 'Data Science',
          completion: 100,
          tech_stack: JSON.stringify(['Chart.js', 'JavaScript', 'SQL']),
          team_members: JSON.stringify([
              { name: 'M.Swapna', role: 'Data Analyst', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_face_expression_detector',
          owner_id: 'user_admin',
          owner_name: 'B.Jaya Manideep',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669',
          title: 'Face-Expression Detector',
          description: 'Expression detection system that identifies and analyzes facial expressions in real-time.',
          status: 'completed',
          category: 'Beginner',
          domain: 'AI & ML',
          completion: 100,
          tech_stack: JSON.stringify(['Python', 'Keras', 'OpenCV']),
          team_members: JSON.stringify([
              { name: 'B.Jaya Manideep', role: 'ML Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669' },
              { name: 'A.Vishnu Vardhan', role: 'Python Dev', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772771807/WhatsApp_Image_2026-03-06_at_9.53.49_AM_e4nkcd.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_court_data_fetcher',
          owner_id: 'user_admin',
          owner_name: 'B.Jaya Manideep',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669',
          title: 'Court Data Fetcher',
          description: 'A system that fetches and displays court data for legal professionals.',
          status: 'completed',
          category: 'Beginner',
          domain: 'Engineering',
          completion: 100,
          tech_stack: JSON.stringify(['Python', 'Web Scraping', 'FastAPI']),
          team_members: JSON.stringify([
              { name: 'B.Jaya Manideep', role: 'Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_credit_card_fraud',
          owner_id: 'user_admin',
          owner_name: 'A.Yaswanth',
          owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg',
          title: 'Credit-card Fraud Detection system',
          description: 'An AI-powered system to detect and prevent credit card fraud in real-time.',
          status: 'completed',
          category: 'Beginner',
          domain: 'AI & ML',
          completion: 100,
          tech_stack: JSON.stringify(['Python', 'Scikit-Learn', 'Random Forest']),
          team_members: JSON.stringify([
              { name: 'A.Yaswanth', role: 'ML Developer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg' },
              { name: 'B.Charitha Reddy', role: 'Data Scientist', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_wine_quality_prediction',
          owner_id: 'user_admin',
          owner_name: 'A.Yaswanth',
          owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg',
          title: 'Wine Quality Prediction System',
          description: 'A machine learning model to predict wine quality based on chemical properties.',
          status: 'completed',
          category: 'Beginner',
          domain: 'AI & ML',
          completion: 100,
          tech_stack: JSON.stringify(['Python', 'XGBoost', 'Pandas']),
          team_members: JSON.stringify([
              { name: 'A.Yaswanth', role: 'ML Developer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg' },
              { name: 'B.Charitha Reddy', role: 'Data Scientist', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_hotel_tfi_website',
          owner_id: 'user_admin',
          owner_name: 'B.Prasad',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514',
          title: 'Hotel Tfi Website',
          description: 'A website useful for booking food from Tfi Hotel in Nashik.',
          status: 'completed',
          category: 'Beginner',
          domain: 'Web Development',
          completion: 100,
          tech_stack: JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Bootstrap']),
          team_members: JSON.stringify([
              { name: 'B.Prasad', role: 'Web Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514' },
              { name: 'C.Mallikarjuna', role: 'Frontend Dev', image: 'https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572' }
          ]),
          visibility: 'public'
      },

      // Ongoing Projects
      {
          id: 'proj_swarna',
          owner_id: 'user_admin',
          owner_name: 'R.Manoj',
          owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772612644/manoj_buozjy.jpg',
          title: 'Swarna',
          description: 'A comprehensive platform for gold price tracking, investment insights, and market analysis.',
          status: 'in_progress',
          category: 'Ongoing',
          domain: 'Web Development',
          completion: 60,
          tech_stack: JSON.stringify(['React', 'Node.js', 'Chart.js', 'Financial API']),
          team_members: JSON.stringify([
              { name: 'R.Manoj', role: 'Lead Developer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772612644/manoj_buozjy.jpg' },
              { name: 'M.Deekshitha', role: 'UI/UX Designer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.49%20AM.jpeg?updatedAt=1760072973031' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_timetable_project',
          owner_id: 'user_admin',
          owner_name: 'K.Bharath Kumar',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.29.51%20AM.jpeg?updatedAt=1760072973494',
          title: 'Time Table Project',
          description: 'An AI-based time table management system for educational institutions.',
          status: 'in_progress',
          category: 'Ongoing',
          domain: 'Engineering',
          completion: 55,
          tech_stack: JSON.stringify(['Python', 'Django', 'React']),
          team_members: JSON.stringify([
              { name: 'K.Bharath Kumar', role: 'Lead Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.29.51%20AM.jpeg?updatedAt=1760072973494' },
              { name: 'M.Madhusudhan', role: 'Backend Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2011.09.30%20AM.jpeg?updatedAt=1760074790613' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_backlog_assistance',
          owner_id: 'user_admin',
          owner_name: 'T.Vanaja',
          owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/vanaja_izfe76.jpg',
          title: 'Smart backlog assistance & cover guidance system.',
          description: 'An AI-based system to assist students with backlog subjects and provide study guidance.',
          status: 'in_progress',
          category: 'Ongoing',
          domain: 'AI & ML',
          completion: 45,
          tech_stack: JSON.stringify(['Python', 'NLP', 'React']),
          team_members: JSON.stringify([
              { name: 'T.Vanaja', role: 'Lead Developer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/vanaja_izfe76.jpg' },
              { name: 'Vaishnavi', role: 'UI Dev', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772639378/vaishnavi_iwaurb.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_emergency_alert',
          owner_id: 'user_admin',
          owner_name: 'P.Geetanjali',
          owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/geetanjali_ffvarc.jpg',
          title: 'Emergancy Alert System for elderly living alone.',
          description: 'An AI-powered emergency alert system for elderly individuals living alone.',
          status: 'in_progress',
          category: 'Ongoing',
          domain: 'IoT',
          completion: 50,
          tech_stack: JSON.stringify(['IoT', 'Python', 'Twilio API', 'Flutter']),
          team_members: JSON.stringify([
              { name: 'P.Geetanjali', role: 'IoT Engineer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/geetanjali_ffvarc.jpg' },
              { name: 'T.Rishitha', role: 'Mobile Dev', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772518152/rishitha_zgdfij.jpg' }
          ]),
          visibility: 'public'
      },
      {
          id: 'proj_healthsetu',
          owner_id: 'user_admin',
          owner_name: 'A.Lokesh',
          owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927',
          title: 'Healthsetu',
          description: 'An AI-powered health management system for students.',
          status: 'in_progress',
          category: 'Ongoing',
          domain: 'HealthTech',
          completion: 40,
          tech_stack: JSON.stringify(['React Native', 'Node.js', 'TensorFlow']),
          team_members: JSON.stringify([
              { name: 'A.Lokesh', role: 'Lead Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927' }
          ]),
          visibility: 'public'
      }
    ];

    let inserted = 0;
    for (const sp of seedProjects) {
        const res = await sql`
            INSERT INTO projects (
                id, owner_id, owner_name, owner_avatar, title, description, status,
                category, domain, completion, tech_stack, team_members, visibility
            ) VALUES (
                ${sp.id}, ${sp.owner_id}, ${sp.owner_name}, ${sp.owner_avatar},
                ${sp.title}, ${sp.description}, ${sp.status}, ${sp.category},
                ${sp.domain}, ${sp.completion}, ${sp.tech_stack}, ${sp.team_members}, ${sp.visibility}
            ) ON CONFLICT (id) DO NOTHING
        `;
        inserted++;
    }
    console.log(`Success! Attempted seeding of ${inserted} projects into Neon DB.`);

    const countRes = await sql`SELECT COUNT(*) as count FROM projects`;
    console.log('Current total projects in Neon DB:', countRes[0]?.count);

  } catch (err) {
    console.error('Error running seed script:', err);
  }
}

runSeed();
