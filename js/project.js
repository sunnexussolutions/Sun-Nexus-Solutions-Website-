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

  const beginnerProjectData = {
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

  const advancedProjectData = {
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

  const ongoingProjectData = {
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

  // ------------------ Populate BEGINNER PROJECTS ------------------
  const beginnerContainer = document.getElementById("beginnerProjectsContainer");
  if (beginnerContainer) {
    Object.keys(beginnerProjectData).forEach((projectName, index) => {
      const project = beginnerProjectData[projectName];
      const card = document.createElement("div");
      card.className = "card";
      card.style.animationDelay = `${0.2 * (index + 1)}s`;
      card.innerHTML = `
        <h3>${projectName}</h3>
        <p>${project.summary}</p>
        <a href="#" class="view-details-btn" data-project="${projectName}" data-type="beginner">View Details</a>
      `;
      beginnerContainer.appendChild(card);
    });
  }

  // ------------------ Populate ADVANCED PROJECTS ------------------
  const advancedContainer = document.getElementById("advancedProjectsContainer");
  if (advancedContainer) {
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

    Object.keys(advancedProjectData).forEach((projectName, index) => {
      const project = advancedProjectData[projectName];
      const iconInfo = projectIcons[projectName] || { color: "box-cyan", svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>' };
      const displayTitle = projectName === "Crowd-Sheild" ? "Crowd-Shield" : projectName;
      
      const card = document.createElement("div");
      card.className = "card advanced-project-card";
      card.style.animationDelay = `${0.1 * (index + 1)}s`;
      card.innerHTML = `
        <div class="project-ribbon"><span>ADVANCED</span></div>
        <div class="advanced-card-header">
          <div class="project-icon-box ${iconInfo.color}">
            ${iconInfo.svg}
          </div>
          <h3>${displayTitle}</h3>
        </div>
        <p class="project-summary">${project.summary}</p>
        <div class="card-btn-wrap">
          <a href="#" class="view-details-btn" data-project="${projectName}" data-type="advanced">VIEW DETAILS →</a>
        </div>
      `;
      advancedContainer.appendChild(card);
    });
  }

  // ------------------ Populate ONGOING PROJECTS ------------------
  const ongoingContainer = document.getElementById("ongoingProjectsContainer");
  if (ongoingContainer) {
    Object.keys(ongoingProjectData).forEach((projectName, index) => {
      const project = ongoingProjectData[projectName];
      const card = document.createElement("div");
      card.className = "card";
      card.style.animationDelay = `${0.2 * (index + 1)}s`;
      card.innerHTML = `
        <h3>${projectName}</h3>
        <p>${project.summary}</p>
        <a href="#" class="view-details-btn" data-project="${projectName}">View Details</a>
      `;
      ongoingContainer.appendChild(card);
    });
  }

  const modal       = document.getElementById("projectModal");
  const modalTitle  = document.getElementById("modalTitle");
  const modalDetails = document.getElementById("modalDetails");
  const teamList    = document.getElementById("teamList");
  const closeBtn    = document.getElementById("closeModal");
  const closeSpan   = document.querySelector(".modal .close");

  function showProjectModal(projectName) {
      let data = beginnerProjectData[projectName] || advancedProjectData[projectName] || ongoingProjectData[projectName];

      if (!data) return;

      modalTitle.textContent = projectName;
      modalDetails.innerHTML = `
          <p>${data.details}</p>
          ${data.visit ? `<p style="margin-top: 12px;"><strong>Visit:</strong> <a href="${data.visit}" target="_blank" style="color: #0066ff;">${data.visit}</a></p>` : ''}
      `;

      teamList.innerHTML = "";
      data.team.forEach(member => {
          const div = document.createElement("div");
          div.className = "team-member";
          div.innerHTML = `
              <img src="${member.image}" alt="${member.name}" 
                   onerror="this.src='https://via.placeholder.com/80x80/cccccc/ffffff?text=No+Image'">
              <h5>${member.name}</h5>
          `;
          teamList.appendChild(div);
      });

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