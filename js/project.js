document.addEventListener("DOMContentLoaded", () => {
  
  // Mobile navigation is handled globally by js/nav-active.js

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("projects") || entry.target.classList.contains("domains")) {
          entry.target.classList.add("animate__animated", "animate__fadeInLeft");
        } else if (entry.target.classList.contains("how-it-works")) {
          entry.target.classList.add("animate__animated", "animate__fadeInRight");
        } else {
          entry.target.classList.add("animate__animated", "animate__fadeInUp");
        }
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  document.querySelectorAll(".projects, .domains, .how-it-works, .domains .header-section, .how-it-works h2").forEach(element => {
    observer.observe(element);
  });

  // Base Static Projects (Fallback Data)
  const defaultBeginnerProjects = {
    "AI Push-Up Trainer": {
      summary: "An AI-powered push-up trainer that provides real-time feedback and coaching.",
      details: "This project uses AI to analyze user form and provide instant feedback on push-up technique. It includes a webcam-based tracking system and a mobile app interface for personalized coaching.",
      visit: "",
      github: "",
      team: [
          { name: "B.Jaya Manideep", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669" },
          { name: "M.Swapna", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg" }
      ] 
    },
    "Amazon Sales Dashboard": {
      summary: "A comprehensive sales dashboard for Amazon sellers to track performance and analyze sales data.",
      details: "This dashboard provides Amazon sellers with real-time insights into their sales performance, including key metrics like revenue, conversion rates, and product performance. It features customizable reports and interactive visualizations for better decision-making.",
      visit: "",
      github: "",
      team: [
          { name: "M.Swapna", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg" }     ] 
    },
    "Cricket Performance Analysis(Virat Kohli)": {
      summary: "An AI-driven performance analysis tool for cricket players, with a focus on Virat Kohli's career statistics.",
      details: "This project analyzes the performance of cricket players using AI algorithms, with a special focus on Virat Kohli's career statistics. It provides insights into his batting and bowling performance, trends over time, and comparisons with other players.",
      team: [
          { name: "B.Jaya Manideep", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669" },
          { name: "M.Swapna", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg" },
      ] 
    },
    "Majhali Restaurant Kitchen": {
      summary: "Restaurant kitchen management system for efficient operations and inventory control.",
      details: "This system streamlines kitchen operations by automating inventory tracking, managing orders, and providing real-time updates on kitchen performance. It helps reduce waste and improve efficiency in restaurant kitchens.",
      team: [
          { name: "A.Lokesh Reddy", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927" },
          { name: "Sathwik", image: "" }      ] 
    },
    "Roof-Top Restaurant": {
      summary: "A modern restaurant management system for rooftop dining experiences.",
      details: "This system manages all aspects of rooftop dining, from reservation booking to inventory tracking. It features a user-friendly interface for customers and staff, with integrated payment processing and real-time availability updates.",
      team: [
          { name: "B.Prasad", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514" },
          { name: "K.Bhargava", image: "https://res.cloudinary.com/djw0g8duw/image/upload/v1763865310/link_img_rusktx.png" }      ] 
    },
    "Roof-Top Sales Dashboard": {
      summary: "A sales dashboard for rooftop dining experiences.",
      details: "This dashboard provides insights into sales performance for rooftop restaurants, including revenue tracking, customer analytics, and inventory management.",
      team: [
          { name: "M.Swapna", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg" },
      ] 
    },
    "Face-Expression Detector": {
      summary: "Expression detection system that identifies and analyzes facial expressions in real-time.",
      details: "This system uses computer vision and machine learning to detect and analyze facial expressions in real-time. It can identify emotions like happiness, sadness, anger, surprise, and neutral expressions.",
      team: [
          { name: "B.Jaya Manideep", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669" },
          { name: "A.Vishnu Vardhan", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772771807/WhatsApp_Image_2026-03-06_at_9.53.49_AM_e4nkcd.jpg" },
      ] 
    },
    "Court Data Fetcher": {
      summary: "A system that fetches and displays court data for legal professionals.",
      details: "This project provides a user-friendly interface for legal professionals to access and analyze court data. It includes features like data filtering, sorting, and visualization to support efficient legal research and case management.",
      visit: "",
      github: "",
      team: [
          { name: "B.Jaya Manideep", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669" },
      ] 
    },
    "Credit-card Fraud Detection system": {
      summary: "An AI-powered system to detect and prevent credit card fraud in real-time.",
      details: "This system uses machine learning algorithms to analyze transaction patterns and identify suspicious activities. It provides real-time alerts and automated fraud prevention measures to protect users' financial data.",
      team: [
          { name: "A.Yaswanth ", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg" },
          { name: "B.Charitha Reddy", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg" },
      ] 
    },
    "Wine Quality Prediction System": {
      summary: "A machine learning model to predict wine quality based on chemical properties.",
      details: "This system uses machine learning algorithms to predict wine quality based on chemical properties like acidity, alcohol content, and sugar levels. It helps winemakers improve their production process and ensures consistent quality.",
      team: [
          { name: "A.Yaswanth ", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg" },
          { name: "B.Charitha Reddy", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg" }
      ] 
    },
    "Hotel Tfi Website": {
      summary: "A website which is useful for booking food in Nashik.",
      details: "A user-friendly web platform for booking food from Tfi Hotel in Nashik. It features real-time menus and reviews to enhance the dining experience for users.",
      visit: "",
      github: "",
      team: [
        { name: "B.Prasad",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514" },
        { name: "C.Mallikarjuna",  image: "https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572" },
        { name: "K.Raghu",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-08%20at%2010.27.23%20AM.jpeg?updatedAt=1760072973601" },
        { name: "S.Poojitha Reddy",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.24.52%20AM.jpeg?updatedAt=1760072972748" },
        { name: "S.Shirisha",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-08%20at%2011.25.48%20AM.jpeg?updatedAt=1760072973509" }
      ]
    }
  };

  const defaultAdvancedProjects = {
    "Sun Nexus Solutions Website": {
      summary: "A responsive website for Sun Nexus Solutions, showcasing their services and projects.",
      details: "This website provides a comprehensive overview of Sun Nexus Solutions' offerings, including their projects, services, and team members. It features a modern design with responsive layouts to ensure optimal viewing on all devices.",
      team: [
          { name: "B.Prasad", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514" },
          { name: "C.Mallikarjuna Rao", image: "https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572" },
          { name: "k.Raghu", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-08%20at%2010.27.23%20AM.jpeg?updatedAt=1760072973601" },
          { name: "S.Poojitha", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.24.52%20AM.jpeg?updatedAt=1760072972748" },
          { name: "A.Sirisha", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-08%20at%2011.25.48%20AM.jpeg?updatedAt=1760072973509" },
          { name: "B.Yuvaraja", image: "" },
      ] 
    },
    "Lab Manage System": {
        summary: "AI-based lab management and resource optimization.",
        details: "An AI-driven system to manage lab resources, schedule experiments, and optimize usage of equipment and materials.",
        visit: "",
        github: "",
        team: [
            { name: "C.Mallikarjuna Rao", image: "https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572" },
            { name: "N.Amrutha Varshini", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772639381/amrutha_varshini_mgyn9n.jpg" }
        ]
    },
    "Whatsapp Chatbot": {
        summary: "An AI-powered chatbot integrated with WhatsApp for instant customer support and automation.",
        details: "An AI-powered chatbot integrated with WhatsApp to provide instant customer support, answer queries, and automate interactions for businesses.",
        visit: "",
        github: "",
        team: [
            { name: "K.Girivardhan", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.34%20AM.jpeg?updatedAt=1760072974650" }
        ]
    },
    "Exam invigilation management system": {
        summary: "An AI-based exam invigilation system to ensure academic integrity.",
        details: "An AI-powered system that monitors and ensures academic integrity during exams by analyzing student behavior and flagging suspicious activities.",
        visit: "",
        github: "",
        team: [
            { name: "B.Jaya Manideep", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669" },
            { name: "G.Purna Reddy", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772599133/purna_reddy_mszkgg.jpg" }
        ]
    },
    "AI assignment evaluator": {
        summary: "An AI-based system to evaluate student assignments automatically.",
        details: "An AI-powered system that automatically evaluates student assignments, providing instant feedback and grading.",
        visit: "",
        github: "",
        team: [
            { name: "B.Charitha Reddy", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg" },
            { name: "M.Swapna", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg" }
        ]
    },
    "Startup Management System": {
      summary: "A comprehensive management system for startups to track projects, tasks, and team collaboration.",
      details: "This system provides startups with tools to manage projects, track tasks, and facilitate team collaboration. It includes features like project timelines, task assignments, and communication channels to enhance productivity and organization.",
      team: [
          { name: "C.Varun", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772303456/varun.c.2_fod1hf.jpg" }
      ]
    },
    "Meeting Summarizer": {
      summary: "AI-powered meeting summarization tool.",
      details: "An AI-powered tool that automatically transcribes and summarizes meetings, extracting key points, action items, and decisions to improve productivity and documentation.",
      visit: "",
      github: "https://github.com/Bareddycharitha/Meeting-summariser",
      team: [
        { name: "B.Charitha Reddy", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg" }
      ]
    },
    "Smart Attendance System": {
      summary: "An AI-powered attendance tracking system using facial recognition for accurate and automated record-keeping.",
      details: "This system leverages advanced facial recognition technology powered by AI to automate attendance tracking. It ensures high accuracy, reduces manual errors, and integrates seamlessly with existing databases for real-time updates and reporting.",
      visit: "",
      github: "",
      team: [
        { name: "Lokesh",  image: "https://ik.imagekit.io/kofq4cdghu/unnamed.jpg?updatedAt=1760094756157" },
        { name: "K.Varshith Naidu",  image: "https://ik.imagekit.io/kofq4cdghu/IMG-20250917-WA0086(1).jpg?updatedAt=1760094980018" }
      ]
    },
    "Automated Timetable Management System": {
      summary: "A smart scheduling system that generates optimized timetables for educational institutions based on faculty and student availability.",
      details: "An intelligent scheduling tool designed for educational institutions. It uses optimization algorithms to create conflict-free timetables based on faculty availability, student preferences, and resource constraints, saving hours of manual planning.",
      visit: "",
      github: "",
      team: [
        { name: "A.Lokesh Reddy",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927" },
        { name: "V.Gopinadh",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.55.20%20AM.jpeg?updatedAt=1760074230579" },
        { name: "K.Hari",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.29.49%20AM.jpeg?updatedAt=1760072973038" },
        { name: "K.Girivardhan",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.34%20AM.jpeg?updatedAt=1760072974650" },
        { name: "M.Deekshitha",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.49%20AM.jpeg?updatedAt=1760072973031" },
        { name: "B.Jaya manideep",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669" },
        { name: "A.VishnuVardhan",  image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772771807/WhatsApp_Image_2026-03-06_at_9.53.49_AM_e4nkcd.jpg" },
        { name: "M.Madhusudhan",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2011.09.30%20AM.jpeg?updatedAt=1760074790613" },
        { name: "K.Bharath Kumar",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.29.51%20AM.jpeg?updatedAt=1760072973494" },
      ]
    },
    "Crowd-Sheild": {
      summary: "AI-powered crowd monitoring for public safety.",
      details: "An AI-driven solution for monitoring crowds in public spaces to enhance safety. It detects unusual patterns, estimates crowd density, and alerts authorities in real-time to prevent incidents like stampedes or security breaches.",
      visit: "",
      github: "",
      team: [
        { name: "A.Lokesh Reddy",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927" },
        { name: "V.Gopinadh",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.55.20%20AM.jpeg?updatedAt=1760074230579" },
        { name: "K.Hari",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.29.49%20AM.jpeg?updatedAt=1760072973038" },
        { name: "K.Girivardhan",  image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.34%20AM.jpeg?updatedAt=1760072974650" }
      ]
    },
    "AI-Powered Resume Analyzer": {
      summary: "AI evaluates resumes for job fit.",
      details: "An AI tool that scans and evaluates resumes against job descriptions, highlighting strengths, gaps, and fit scores. It uses NLP to provide actionable insights for recruiters and applicants.",
      visit: "",
      github: "",
      team: [
        { name: "B.Murali Krishna", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.00%20AM.jpeg?updatedAt=1760072973049" }
      ]
    }
  };

  const defaultOngoingProjects = {
    "Swarna": {
        summary: "A comprehensive platform for gold price tracking, investment insights, and market analysis.",
        details: "Swarna is a user-friendly website that provides real-time gold price updates, historical data, and expert analysis to help users make informed investment decisions in the gold market.",
        visit: "",
        github: "",
        team: [
            { name: "R.Manoj", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772612644/manoj_buozjy.jpg" },
            { name: "M.Deekshitha", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.49%20AM.jpeg?updatedAt=1760072973031" }
        ]
    },
    "Time Table Project": {
        summary: "An AI-based time table management system for educational institutions.",
        details: "An AI-powered time table management system that automates the creation and optimization of academic schedules, ensuring efficient allocation of resources and minimizing conflicts.",
        visit: "",
        github: "",
        team: [
            { name: "K.Bharath Kumar", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.29.51%20AM.jpeg?updatedAt=1760072973494" },
            { name: "M.Madhusudhan", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2011.09.30%20AM.jpeg?updatedAt=1760074790613" },
            { name: "A.Vishnu Vardhan", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772771807/WhatsApp_Image_2026-03-06_at_9.53.49_AM_e4nkcd.jpg" }
        ]
    },
    "Smart backlog assistance & cover guidance system.": {
        summary: "An AI-based system to assist students with backlog subjects and provide cover guidance.",
        details: "An AI-powered system that helps students manage backlog subjects by providing personalized guidance, study materials, and cover suggestions.",
        visit: "",
        github: "",
        team: [
            { name: "T.Vanaja", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/vanaja_izfe76.jpg" },
            { name: "Vaishnavi", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772639378/vaishnavi_iwaurb.jpg" }
        ]
    },
    "Emergancy Alert System for elderly living alone.": {
        summary: "An AI-powered emergency alert system for elderly individuals living alone.",
        details: "An AI-driven emergency alert system designed to provide safety and peace of mind for elderly individuals living alone. It detects emergencies and sends alerts to caregivers or family members.",
        visit: "",
        github: "",
        team: [
            { name: "P.Geetanjali", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/geetanjali_ffvarc.jpg" },
            { name: "T.Rishitha", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772518152/rishitha_zgdfij.jpg" }
        ]
    },
    "Healthsetu": {
        summary: "An AI-powered health management system for students.",
        details: "An AI-driven health management system that provides personalized health recommendations and tracks student wellness.",
        visit: "",
        github: "",
        team: [
            { name: "A.Lokesh", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927" }
        ]
    }
  };

  const projectIcons = {
    "Sun Nexus Solutions Website": { color: "box-cyan", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>' },
    "Lab Manage System": { color: "box-green", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>' },
    "Whatsapp Chatbot": { color: "box-purple", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' },
    "Exam invigilation management system": { color: "box-purple", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>' },
    "AI assignment evaluator": { color: "box-cyan", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line></svg>' },
    "Startup Management System": { color: "box-orange", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>' },
    "Meeting Summarizer": { color: "box-cyan", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
    "Smart Attendance System": { color: "box-cyan", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="m9 16 2 2 4-4"></path></svg>' },
    "Automated Timetable Management System": { color: "box-purple", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' },
    "Crowd-Sheild": { color: "box-cyan", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' },
    "AI-Powered Resume Analyzer": { color: "box-orange", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>' }
  };

  // Global lookup dictionary for modal details
  const masterProjectsMap = {
    ...defaultBeginnerProjects,
    ...defaultAdvancedProjects,
    ...defaultOngoingProjects
  };

  const getApiBaseUrl = () => {
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
    return isLocal ? 'http://localhost:3000' : '';
  };

  const safeJsonParseArray = (val, fallback = []) => {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return fallback;
      if (trimmed.startsWith('[')) {
        try {
          let parsed = JSON.parse(trimmed);
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
    return fallback;
  };

  const isNexusAdmin = (name) => {
    if (!name) return false;
    const n = String(name).toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    return n === 'nexusadmin' || n === 'admin' || n === 'sunnexus' || n === 'adminmaster' || n === 'useradmin' || n === 'nexus' || n === 'systemadmin' || n.includes('admin');
  };

  const parseTeamMembers = (raw) => {
    if (!raw) return [];
    let list = [];
    if (Array.isArray(raw)) {
      list = raw;
    } else if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed;
      } catch (e) {
        list = raw.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return list.map(item => {
      if (typeof item === 'string') {
        return { name: item, fullName: item, image: '', avatar: '', role: 'Contributor' };
      }
      const nameVal = item.name || item.fullName || 'Member';
      return {
        name: nameVal,
        fullName: nameVal,
        image: item.image || item.avatar || '',
        avatar: item.avatar || item.image || '',
        role: item.role || 'Contributor'
      };
    }).filter(m => m && m.name && !isNexusAdmin(m.name));
  };

  const getTeamAvatarsHtml = (team) => {
    if (!Array.isArray(team) || team.length === 0) return '';
    const avatars = team.map((m, i) => {
      if (i > 4) return ''; // Max 5 avatars on card
      const imgUrl = m.image || m.avatar || '';
      const name = m.name || m.fullName || 'Member';
      const initial = name[0] || 'M';
      if (imgUrl) {
        return `<img src="${imgUrl}" title="${name}" alt="${name}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 2px solid #1e293b; margin-left: ${i === 0 ? '0' : '-8px'}; background: #334155;" onerror="this.onerror=null; this.src='https://via.placeholder.com/40x40/6366f1/ffffff?text=${initial}'">`;
      }
      return `<div title="${name}" style="width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid #1e293b; margin-left: ${i === 0 ? '0' : '-8px'};">${initial}</div>`;
    }).join('');

    const overflowCount = team.length > 5 ? team.length - 5 : 0;
    return `
      <div style="display: flex; align-items: center; margin-top: 10px; margin-bottom: 10px;">
        ${avatars}
        ${overflowCount > 0 ? `<div style="width: 26px; height: 26px; border-radius: 50%; background: #334155; color: #cbd5e1; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid #1e293b; margin-left: -8px;">+${overflowCount}</div>` : ''}
        <span style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-left: 8px;">${team.length} Team ${team.length > 1 ? 'Members' : 'Member'}</span>
      </div>
    `;
  };

  const getTechBadgesHtml = (techStack) => {
    if (!Array.isArray(techStack) || techStack.length === 0) return '';
    return `
      <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; margin-bottom: 8px;">
        ${techStack.slice(0, 4).map(t => {
          const name = typeof t === 'string' ? t : (t.name || t.label || '');
          if (!name) return '';
          return `<span style="font-size: 10.5px; font-weight: 700; background: rgba(0, 242, 254, 0.1); color: #00f2fe; border: 1px solid rgba(0, 242, 254, 0.25); padding: 2px 8px; border-radius: 6px;">${name}</span>`;
        }).join('')}
      </div>
    `;
  };

  // Render Functions
  const renderProjects = (beginnerMap, advancedMap, ongoingMap) => {
    const beginnerContainer = document.getElementById("beginnerProjectsContainer");
    const advancedContainer = document.getElementById("advancedProjectsContainer");
    const ongoingContainer  = document.getElementById("ongoingProjectsContainer");

    const ICON_PRESETS = {
      monitor: { color: "box-cyan", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>' },
      database: { color: "box-green", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>' },
      chat: { color: "box-purple", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' },
      file: { color: "box-purple", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>' },
      ai: { color: "box-cyan", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line></svg>' },
      rocket: { color: "box-orange", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>' },
      users: { color: "box-cyan", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
      calendar: { color: "box-purple", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' },
      shield: { color: "box-cyan", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' },
      resume: { color: "box-orange", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>' }
    };

    const inferIconFromTitle = (title) => {
      const t = String(title || '').toLowerCase();
      if (t.includes('chat') || t.includes('bot') || t.includes('whatsapp') || t.includes('message')) return 'chat';
      if (t.includes('ai') || t.includes('detector') || t.includes('expression') || t.includes('trainer') || t.includes('evaluator')) return 'ai';
      if (t.includes('sales') || t.includes('lab') || t.includes('database') || t.includes('amazon') || t.includes('data')) return 'database';
      if (t.includes('invigilation') || t.includes('exam') || t.includes('document') || t.includes('pdf')) return 'file';
      if (t.includes('shield') || t.includes('sheild') || t.includes('safety') || t.includes('security') || t.includes('guard')) return 'shield';
      if (t.includes('calendar') || t.includes('timetable') || t.includes('schedule') || t.includes('attendance') || t.includes('omr')) return 'calendar';
      if (t.includes('resume') || t.includes('cv') || t.includes('job') || t.includes('analyzer')) return 'resume';
      if (t.includes('startup') || t.includes('kitchen') || t.includes('restaurant') || t.includes('hotel') || t.includes('rocket')) return 'rocket';
      if (t.includes('meeting') || t.includes('user') || t.includes('team') || t.includes('summarizer')) return 'users';
      return '';
    };

    const PRESET_KEYS = ['monitor', 'database', 'chat', 'file', 'ai', 'rocket', 'users', 'calendar', 'shield', 'resume'];

    const getIconInfo = (iconKey, projectName, idx) => {
      const k = String(iconKey || '').toLowerCase().trim();
      
      if (k && k !== 'monitor' && ICON_PRESETS[k]) {
        return ICON_PRESETS[k];
      }

      const inferredKey = inferIconFromTitle(projectName);
      if (inferredKey && ICON_PRESETS[inferredKey]) {
        return ICON_PRESETS[inferredKey];
      }

      if (k === 'monitor') {
        const rotatedKey = PRESET_KEYS[idx % PRESET_KEYS.length];
        return ICON_PRESETS[rotatedKey] || ICON_PRESETS.monitor;
      }

      const rotatedKey = PRESET_KEYS[idx % PRESET_KEYS.length];
      return ICON_PRESETS[rotatedKey] || ICON_PRESETS.monitor;
    };

    const createProjectCard = (projectName, project, index, categoryType) => {
      const iconInfo = getIconInfo(project.icon || project.project_icon || project.iconType, projectName, index);
      const displayTitle = projectName === "Crowd-Sheild" ? "Crowd-Shield" : projectName;
      const ribbonTag = String(categoryType || project.category || "ADVANCED").toUpperCase();
      const hasThumbnail = Boolean(project.thumbnail && String(project.thumbnail).trim());
      const thumbHtml = hasThumbnail 
        ? `<div style="margin-bottom: 16px; border-radius: 14px; overflow: hidden; height: 165px; border: 1px solid rgba(2, 132, 199, 0.25); width: 100%; background: rgba(10, 18, 38, 0.85); display: flex; align-items: center; justify-content: center; padding: 4px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);"><img src="${project.thumbnail}" alt="${projectName}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 10px; display: block;"></div>` 
        : '';

      const iconBoxHtml = hasThumbnail ? '' : `
        <div class="project-icon-box ${iconInfo.color}">
          ${iconInfo.svg}
        </div>
      `;

      let rawSummary = (project.summary || project.details || '').trim();
      const halfLen = Math.floor(rawSummary.length / 2);
      if (halfLen > 20) {
        const s1 = rawSummary.substring(0, halfLen).trim();
        const s2 = rawSummary.substring(halfLen).trim();
        if (s1 === s2) rawSummary = s1;
      }

      const card = document.createElement("div");
      card.className = "card advanced-project-card";
      card.style.animationDelay = `${0.1 * (index + 1)}s`;
      card.innerHTML = `
        <div class="project-ribbon"><span>${ribbonTag}</span></div>
        ${thumbHtml}
        <div class="advanced-card-header" style="${hasThumbnail ? 'justify-content: center;' : ''}">
          ${iconBoxHtml}
          <h3>${displayTitle}</h3>
        </div>
        <p class="project-summary">${rawSummary}</p>
        <div class="card-btn-wrap">
          <a href="#" class="view-details-btn" data-project="${projectName}" data-type="${categoryType.toLowerCase()}">VIEW DETAILS →</a>
        </div>
      `;
      return card;
    };

    const renderEmptyStateHtml = (categoryName, titleText, subText) => {
      return `
        <div class="empty-project-card-wrapper" style="grid-column: 1 / -1; width: 100%; display: flex; justify-content: center; padding: 10px 0;">
          <div class="empty-project-card" style="
            width: 100%;
            max-width: 620px;
            padding: 40px 28px;
            text-align: center;
            border-radius: 26px;
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
          ">
            <!-- Ambient Glow Background -->
            <div style="position: absolute; top: -50px; left: 50%; transform: translateX(-50%); width: 280px; height: 280px; background: radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%); pointer-events: none;"></div>

            <!-- Icon Badge Box -->
            <div style="
              width: 58px;
              height: 58px;
              margin: 0 auto 18px;
              border-radius: 18px;
              background: linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%);
              border: 1px solid rgba(2, 132, 199, 0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0284c7;
              box-shadow: 0 8px 20px rgba(2, 132, 199, 0.12);
            ">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
            </div>

            <!-- Title -->
            <h4 class="empty-card-title" style="
              font-size: 18px;
              font-weight: 800;
              margin: 0 0 8px 0;
              letter-spacing: -0.02em;
            ">
              ${titleText}
            </h4>

            <!-- Description -->
            <p class="empty-card-sub" style="
              font-size: 13.5px;
              line-height: 1.6;
              margin: 0 0 20px 0;
              max-width: 440px;
              margin-left: auto;
              margin-right: auto;
              font-weight: 500;
            ">
              ${subText}
            </p>

            <!-- Status Indicator Pill -->
            <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 999px; background: rgba(2, 132, 199, 0.08); border: 1px solid rgba(2, 132, 199, 0.25); color: #0284c7; font-size: 11.5px; font-weight: 800; letter-spacing: 0.05em;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #0284c7; box-shadow: 0 0 8px #0284c7;"></span>
              REALTIME SYNCHRONIZATION ACTIVE
            </div>
          </div>
        </div>
      `;
    };

    // Populate Beginner
    if (beginnerContainer) {
      beginnerContainer.innerHTML = "";
      const bKeys = Object.keys(beginnerMap);
      if (bKeys.length === 0) {
        beginnerContainer.innerHTML = renderEmptyStateHtml("Beginner", "No Beginner Projects Currently Listed", "New beginner-level projects created or updated in the Admin Dashboard will render here automatically in real-time.");
      } else {
        bKeys.forEach((projectName, index) => {
          const project = beginnerMap[projectName];
          beginnerContainer.appendChild(createProjectCard(projectName, project, index, "BEGINNER"));
        });
      }
    }

    // Populate Advanced
    if (advancedContainer) {
      advancedContainer.innerHTML = "";
      const aKeys = Object.keys(advancedMap);
      if (aKeys.length === 0) {
        advancedContainer.innerHTML = renderEmptyStateHtml("Advanced", "No Advanced Projects Currently Listed", "High-impact advanced engineering projects published in the Admin Dashboard will render here automatically.");
      } else {
        aKeys.forEach((projectName, index) => {
          const project = advancedMap[projectName];
          advancedContainer.appendChild(createProjectCard(projectName, project, index, "ADVANCED"));
        });
      }
    }

    // Populate Ongoing
    if (ongoingContainer) {
      ongoingContainer.innerHTML = "";
      const oKeys = Object.keys(ongoingMap);
      if (oKeys.length === 0) {
        ongoingContainer.innerHTML = renderEmptyStateHtml("Ongoing", "No Ongoing Projects Currently Active", "Active ongoing projects will display here automatically once updated or assigned in the Admin Dashboard.");
      } else {
        oKeys.forEach((projectName, index) => {
          const project = ongoingMap[projectName];
          ongoingContainer.appendChild(createProjectCard(projectName, project, index, "ONGOING"));
        });
      }
    }
  };

  // Outer scope signature cache to prevent repeated DOM flickering
  let lastRenderedSignature = '';

  const getProjectsSignature = (bMap, aMap, oMap) => {
    try {
      const summarize = (map) => Object.keys(map).map(k => {
        const p = map[k] || {};
        return `${k}_${p.title}_${p.completion}_${p.status}_${p.summary}_${p.details}_${(p.techStack || []).join(',')}`;
      }).join('|');
      return `${summarize(bMap)}#${summarize(aMap)}#${summarize(oMap)}`;
    } catch {
      return String(Date.now());
    }
  };

  // Helper to normalize strings for comparison
  const normalizeTitleStr = (t) => {
    if (!t) return '';
    return String(t).toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  };

  // Fetch Projects from Neon DB API Managed by Admin Panel (Single Source of Truth)
  const loadDynamicProjects = async () => {
    let beginnerMap = {};
    let advancedMap = {};
    let ongoingMap  = {};

    const deletedSet = (function() {
      try {
        return new Set(JSON.parse(localStorage.getItem('nexus_deleted_project_ids') || '[]'));
      } catch {
        return new Set();
      }
    })();

    const isProjectDeleted = (pId, pTitle) => {
      const idStr = String(pId || '').toLowerCase().trim();
      const rawTitle = String(pTitle || '').toLowerCase().trim();
      const normTitle = normalizeTitleStr(pTitle);

      if (idStr && deletedSet.has(idStr)) return true;
      if (rawTitle && deletedSet.has(rawTitle)) return true;
      if (normTitle && deletedSet.has(normTitle)) return true;
      return false;
    };

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/projects/public?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
      if (response.ok) {
        const result = await response.json();
        const apiProjects = result?.projects || result?.data;

        if (Array.isArray(apiProjects)) {
          const dbBeginner = {};
          const dbAdvanced = {};
          const dbOngoing  = {};

          // Clear old master map entries so deleted projects do not persist
          for (let k in masterProjectsMap) {
            delete masterProjectsMap[k];
          }

          apiProjects.forEach(p => {
            if (p.deleted_at || p.deletedAt) return;
            if (isProjectDeleted(p.id, p.title)) return;

            const vis = (p.visibility || 'public').toLowerCase().trim();
            const status = (p.status || '').toLowerCase().trim();

            // Strict Filter: Hide private, draft, pending_review, and rejected projects
            if (vis === 'private' || vis === 'hidden') return;
            if (['draft', 'pending_review', 'rejected'].includes(status)) return;

            const name = p.title || 'Untitled Project';
            const cat = (p.category || '').toLowerCase().trim();
            const parsedTeam = parseTeamMembers(p.team_members || p.teamMembers || p.team);

            if (p.owner_name || p.ownerName) {
              const oName = p.owner_name || p.ownerName;
              if (!isNexusAdmin(oName) && !parsedTeam.some(t => t.name.toLowerCase() === oName.toLowerCase())) {
                parsedTeam.unshift({ 
                  name: oName, 
                  image: p.owner_avatar || p.ownerAvatar || '',
                  role: 'Project Owner'
                });
              }
            }

            const item = {
              id: p.id,
              title: name,
              summary: p.summary || p.card_summary || p.cardSummary || p.description || p.desc || '',
              details: p.description || p.desc || p.details || p.summary || '',
              challenges: p.challenges || '',
              futureImprovements: p.future_improvements || p.futureImprovements || '',
              architecture: p.architecture || '',
              features: safeJsonParseArray(p.features),
              techStack: safeJsonParseArray(p.tech_stack || p.techStack || p.tech),
              completion: Number(p.completion || p.completion_percentage || 0),
              visit: p.live_demo_url || p.live_demo || p.live || '',
              github: p.github_url || p.github || '',
              apk: p.apk_url || p.apk || p.apkUrl || '',
              team: parsedTeam,
              category: p.category || 'Advanced',
              status: p.status || 'in_progress',
              domain: p.domain || 'Engineering',
              thumbnail: p.thumbnail || '',
              views: p.views || 0,
              likes: p.likes || 0
            };

            masterProjectsMap[name] = item;
            if (p.id) masterProjectsMap[p.id] = item;

            if (status === 'in_progress' || status === 'ongoing' || status === 'planning' || cat === 'ongoing') {
              dbOngoing[name] = item;
            } else if (cat === 'beginner') {
              dbBeginner[name] = item;
            } else {
              dbAdvanced[name] = item;
            }
          });

          // Single Source of Truth from Admin Panel (Neon DB)
          beginnerMap = dbBeginner;
          advancedMap = dbAdvanced;
          ongoingMap  = dbOngoing;
        }
      }
    } catch (err) {
      console.warn("Error loading projects from Admin API:", err.message);
      beginnerMap = {};
      advancedMap = {};
      ongoingMap  = {};
    }

  // Filter out ANY deleted projects from static fallback or DB maps before render
  Object.keys(beginnerMap).forEach(k => {
    if (isProjectDeleted(beginnerMap[k]?.id || k, k)) delete beginnerMap[k];
  });
  Object.keys(advancedMap).forEach(k => {
    if (isProjectDeleted(advancedMap[k]?.id || k, k)) delete advancedMap[k];
  });
  Object.keys(ongoingMap).forEach(k => {
    if (isProjectDeleted(ongoingMap[k]?.id || k, k)) delete ongoingMap[k];
  });

  const newSignature = getProjectsSignature(beginnerMap, advancedMap, ongoingMap);
  if (newSignature !== lastRenderedSignature) {
    lastRenderedSignature = newSignature;
    renderProjects(beginnerMap, advancedMap, ongoingMap);
  }
};

// Initial load & real-time sync listeners
loadDynamicProjects();
setInterval(loadDynamicProjects, 8000);
window.addEventListener('focus', loadDynamicProjects);
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') loadDynamicProjects();
});
window.addEventListener('pageshow', loadDynamicProjects);
window.addEventListener('storage', (e) => {
  if (['nexus_projects_updated', 'nexus_system_projects', 'nexus_data_updated', 'nexus_deleted_project_ids'].includes(e.key)) {
    loadDynamicProjects();
  }
});
window.addEventListener('nexus-projects-updated', loadDynamicProjects);
window.addEventListener('nexus-data-updated', loadDynamicProjects);

  // Modal Functionality
  const modal        = document.getElementById("projectModal");
  const modalTitle   = document.getElementById("modalTitle");
  const modalDetails = document.getElementById("modalDetails");
  const teamList     = document.getElementById("teamList");
  const closeBtn     = document.getElementById("closeModal");
  const closeSpan    = document.querySelector(".modal .close");

  function showProjectModal(projectName) {
      let data = masterProjectsMap[projectName];
      if (!data) return;

      // Log View Analytics to Backend API
      if (data.id) {
        fetch(`${getApiBaseUrl()}/api/projects/${data.id}/view`, { method: 'POST' }).catch(() => {});
      }

      modalTitle.textContent = data.title || projectName;
      
      let detailsHtml = '';

      if (data.thumbnail) {
        detailsHtml += `<div style="margin-bottom: 24px; border-radius: 20px; overflow: hidden; border: 1.5px solid rgba(2, 132, 199, 0.3); background: rgba(0, 0, 0, 0.35); display: flex; justify-content: center; align-items: center; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35); padding: 8px;"><img src="${data.thumbnail}" alt="${data.title}" style="width: 100%; max-height: 480px; height: auto; object-fit: contain; border-radius: 14px; display: block;"></div>`;
      }

      // Category, Status & Progress Bar Header
      const st = (data.status || 'in_progress').toLowerCase();
      const statusLabel = st === 'completed' ? 'COMPLETED' : (st === 'planning' ? 'PLANNING' : 'IN PROGRESS');
      const compVal = Number(data.completion || (st === 'completed' ? 100 : 50));

      detailsHtml += `
        <div class="modal-badge-row" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 22px;">
          <span class="modal-cat-badge">${(data.category || 'ADVANCED').toUpperCase()}</span>
          <span class="modal-status-badge status-${st.replace(/_/g, '-')}">
            <span class="status-dot"></span>
            STATUS: ${statusLabel}
          </span>
          <div class="modal-progress-bar-wrap" style="display: inline-flex; align-items: center; gap: 10px; margin-left: auto; background: rgba(148,163,184,0.08); padding: 6px 16px; border-radius: 999px; border: 1px solid var(--border-color, rgba(255,255,255,0.12));">
            <span style="font-size: 11.5px; font-weight: 800; color: var(--text-muted, #94a3b8); letter-spacing: 0.05em;">PROGRESS</span>
            <div style="width: 75px; height: 6px; background: rgba(148, 163, 184, 0.2); border-radius: 999px; overflow: hidden;">
              <div style="width: ${compVal}%; height: 100%; background: linear-gradient(90deg, #0284c7 0%, #10b981 100%); border-radius: 999px;"></div>
            </div>
            <span style="font-size: 12px; font-weight: 900; color: var(--text-primary);">${compVal}%</span>
          </div>
        </div>
      `;

      // Project Description
      detailsHtml += `
        <div class="modal-description-box" style="margin-bottom: 24px;">
          <p style="font-size: 15px; line-height: 1.7; color: var(--text-secondary); margin: 0; font-weight: 500;">
            ${data.details || data.description || data.summary || ''}
          </p>
        </div>
      `;
      
      // Key Challenges & Technical Solutions
      if (data.challenges) {
        detailsHtml += `
          <div class="modal-challenges-box" style="margin-bottom: 24px; padding: 18px 22px; border-radius: 18px; border: 1px solid rgba(2, 132, 199, 0.25); background: rgba(2, 132, 199, 0.04);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 16px;">⚡</span>
              <strong style="color: var(--color-primary-light, #0284c7); font-size: 13.5px; font-weight: 800; letter-spacing: 0.03em; text-transform: uppercase;">Key Challenges & Solutions</strong>
            </div>
            <p style="margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--text-secondary);">${data.challenges}</p>
          </div>
        `;
      }

      // Tech Stack
      if (Array.isArray(data.techStack) && data.techStack.length > 0) {
        detailsHtml += `
          <div class="modal-tech-section" style="margin-bottom: 26px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
              <span style="font-size: 14px;">🛠️</span>
              <strong style="color: var(--text-primary); font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 800;">TECHNOLOGY STACK</strong>
            </div>
            <div class="modal-tech-pills" style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${data.techStack.map(t => {
                const name = typeof t === 'string' ? t : (t.name || t);
                return `<span class="modal-tech-tag">${name}</span>`;
              }).join('')}
            </div>
          </div>
        `;
      }

      // Action Buttons
      const apkLink = data.apk || data.apk_url || data.apkUrl || '';
      if (data.visit || data.github || apkLink) {
        detailsHtml += `<div class="modal-action-buttons" style="margin-top: 24px; margin-bottom: 28px; display: flex; gap: 14px; flex-wrap: wrap;">`;
        if (data.visit) {
          detailsHtml += `<a href="${data.visit}" target="_blank" class="modal-btn-live">🌐 Live Demo ↗</a>`;
        }
        if (apkLink) {
          detailsHtml += `<a href="${apkLink}" target="_blank" class="modal-btn-apk">📱 Download APK ↗</a>`;
        }
        if (data.github) {
          detailsHtml += `<a href="${data.github}" target="_blank" class="modal-btn-github">💻 GitHub Repository ↗</a>`;
        }
        detailsHtml += `</div>`;
      }

      modalDetails.innerHTML = detailsHtml;

      // Project Team Roster
      teamList.innerHTML = "";
      if (Array.isArray(data.team) && data.team.length > 0) {
        data.team.forEach(member => {
            const mName = member.name || member.fullName || 'Member';
            const mImage = member.image || member.avatar || '';
            const mRole = member.role || 'Contributor';
            const initial = mName[0] || 'M';

            const div = document.createElement("div");
            div.className = "team-member";
            
            const imgHtml = mImage 
              ? `<img src="${mImage}" alt="${mName}" onerror="this.onerror=null; this.outerHTML='<div class=\\'member-avatar-fallback\\'>${initial}</div>';">` 
              : `<div class="member-avatar-fallback">${initial}</div>`;

            div.innerHTML = `
              ${imgHtml}
              <h5>${mName}</h5>
              <span class="member-role-badge">${mRole}</span>
            `;
            teamList.appendChild(div);
        });
      }

      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
  }

  document.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-details-btn");
      if (btn) {
          e.preventDefault();
          const projectName = btn.getAttribute("data-project");
          showProjectModal(projectName);
      }
  });

  function closeModalFunc() {
      if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
  }

  if (closeBtn)   closeBtn.addEventListener("click", closeModalFunc);
  if (closeSpan)  closeSpan.addEventListener("click", closeModalFunc);
  window.addEventListener("click", (e) => { if (e.target === modal) closeModalFunc(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModalFunc(); });
});

function toggleAccordion(type) {
    const accordion = document.getElementById(`accordion-${type}`);
    if (!accordion) return;
    accordion.classList.toggle('open');
}