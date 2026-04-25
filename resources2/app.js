// COURSE DATA CONFIGURATION
const coursesData = [
  { id: 1, title: 'Frontend Development', desc: 'Master HTML, CSS, JavaScript, React and modern web development', icon: '🎨', lessons: 45, duration: '12 weeks', gradient: 'gradient-1', badge: 'Popular', category: 'web' },
  { id: 2, title: 'Full Stack JavaScript', desc: 'Build complete web applications with Node.js, Express, MongoDB', icon: '💻', lessons: 50, duration: '14 weeks', gradient: 'gradient-2', badge: 'Trending', category: 'web' },
  { id: 3, title: 'Python Programming', desc: 'Learn Python from basics to advanced with real-world projects', icon: '🐍', lessons: 40, duration: '10 weeks', gradient: 'gradient-3', badge: 'Beginner', category: 'programming' },
  { id: 4, title: 'Mobile App Development', desc: 'Create iOS and Android apps with React Native and Flutter', icon: '📱', lessons: 48, duration: '13 weeks', gradient: 'gradient-4', badge: 'Hot', category: 'mobile' },
  { id: 5, title: 'Cloud Computing AWS', desc: 'Master AWS services, deployment, and cloud architecture', icon: '☁️', lessons: 42, duration: '11 weeks', gradient: 'gradient-5', badge: 'Pro', category: 'cloud' },
  { id: 6, title: 'Machine Learning', desc: 'Deep dive into ML algorithms, neural networks, and AI', icon: '🤖', lessons: 55, duration: '16 weeks', gradient: 'gradient-6', badge: 'Advanced', category: 'ai' },
  { id: 7, title: 'Backend Development', desc: 'Master server-side programming with Node.js, databases, APIs', icon: '⚙️', lessons: 38, duration: '10 weeks', gradient: 'gradient-1', badge: 'New', category: 'web' },
  { id: 8, title: 'DevOps Engineering', desc: 'Learn CI/CD, Docker, Kubernetes, automation and deployment', icon: '🔧', lessons: 44, duration: '12 weeks', gradient: 'gradient-2', badge: 'Popular', category: 'devops' },
  { id: 9, title: 'Cybersecurity', desc: 'Protect systems with ethical hacking and security practices', icon: '🔒', lessons: 46, duration: '13 weeks', gradient: 'gradient-3', badge: 'Hot', category: 'security' },
  { id: 10, title: 'Blockchain Development', desc: 'Build decentralized apps with Ethereum and smart contracts', icon: '⛓️', lessons: 40, duration: '11 weeks', gradient: 'gradient-4', badge: 'Trending', category: 'blockchain' },
  { id: 11, title: 'Data Science', desc: 'Analyze data with Python, pandas, visualization and statistics', icon: '📊', lessons: 52, duration: '14 weeks', gradient: 'gradient-5', badge: 'Popular', category: 'data' },
  { id: 12, title: 'UI/UX Design', desc: 'Design beautiful interfaces with Figma, user research, prototyping', icon: '🎭', lessons: 36, duration: '9 weeks', gradient: 'gradient-6', badge: 'Creative', category: 'design' },
  { id: 13, title: 'Game Development', desc: 'Create games with Unity, Unreal Engine, and game design principles', icon: '🎮', lessons: 50, duration: '15 weeks', gradient: 'gradient-1', badge: 'Hot', category: 'game' },
  { id: 14, title: 'Digital Marketing', desc: 'Master SEO, social media, content marketing, and analytics', icon: '📱', lessons: 38, duration: '10 weeks', gradient: 'gradient-2', badge: 'Trending', category: 'marketing' },
  { id: 15, title: 'IoT Development', desc: 'Build Internet of Things solutions with Arduino, Raspberry Pi', icon: '🔌', lessons: 42, duration: '11 weeks', gradient: 'gradient-3', badge: 'New', category: 'iot' },
  { id: 16, title: 'Quantum Computing', desc: 'Explore quantum algorithms, Qiskit, and quantum programming', icon: '⚛️', lessons: 48, duration: '14 weeks', gradient: 'gradient-4', badge: 'Advanced', category: 'quantum' },
  { id: 17, title: 'AR/VR Development', desc: 'Create immersive experiences with AR/VR technologies', icon: '🥽', lessons: 44, duration: '12 weeks', gradient: 'gradient-5', badge: 'Popular', category: 'arvr' },
  { id: 18, title: 'Software Testing', desc: 'Master automated testing, QA, test-driven development', icon: '🧪', lessons: 40, duration: '10 weeks', gradient: 'gradient-6', badge: 'Essential', category: 'testing' },
  { id: 19, title: 'Product Management', desc: 'Learn product strategy, roadmaps, agile, and user stories', icon: '📋', lessons: 35, duration: '9 weeks', gradient: 'gradient-1', badge: 'Business', category: 'product' },
  { id: 20, title: 'Artificial Intelligence', desc: 'Deep dive into AI, NLP, computer vision, and neural networks', icon: '🧠', lessons: 60, duration: '18 weeks', gradient: 'gradient-2', badge: 'Expert', category: 'ai' }
];

// VIDEO DATA CONFIGURATION
const videosData = {
  1: [
    { title: 'HTML Full Course - Beginner to Pro', duration: '11:30:00', icon: '📄', url: 'https://www.youtube-nocookie.com/embed/qz0aGYrrlhU?rel=0' },
    { title: 'CSS Tutorial - Zero to Hero', duration: '6:18:00', icon: '🎨', url: 'https://www.youtube-nocookie.com/embed/OXGznpKZ_sA?rel=0' },
    { title: 'JavaScript Modern Masterclass', duration: '7:40:00', icon: '⚡', url: 'https://www.youtube-nocookie.com/embed/PkZNo7MFNFg?rel=0' },
    { title: 'React.js Complete Course', duration: '12:00:00', icon: '⚛️', url: 'https://www.youtube-nocookie.com/embed/bMknfKXIFA8?rel=0' }
  ],
  2: [
    { title: 'Node.js Full Course', duration: '5:45:00', icon: '🟢', url: 'https://www.youtube-nocookie.com/embed/Oe421EPjeBE?rel=0' },
    { title: 'Express.js Essentials', duration: '1:15:00', icon: '🚂', url: 'https://www.youtube-nocookie.com/embed/L72fhGm1tfE?rel=0' },
    { title: 'MERN Stack Journey', duration: '8:30:00', icon: '💎', url: 'https://www.youtube-nocookie.com/embed/7CqJlxBYj-M?rel=0' },
    { title: 'Real-time Apps with Socket.io', duration: '2:10:00', icon: '📡', url: 'https://www.youtube-nocookie.com/embed/ZKEqqIO7nLS?rel=0' }
  ],
  3: [
    { title: 'Python Programming - Beginner Course', duration: '6:14:00', icon: '🐍', url: 'https://www.youtube-nocookie.com/embed/_uQrJ0TkZlc?rel=0' },
    { title: 'Advanced Python Concepts', duration: '4:20:00', icon: '🔥', url: 'https://www.youtube-nocookie.com/embed/Xq_O_YxQyYw?rel=0' },
    { title: 'Python Data Structures', duration: '3:45:00', icon: '📦', url: 'https://www.youtube-nocookie.com/embed/R-HLU9FlEuY?rel=0' },
    { title: 'Python for Automation', duration: '2:15:00', icon: '🤖', url: 'https://www.youtube-nocookie.com/embed/8ext9G7xspg?rel=0' }
  ],
  4: [
    { title: 'Flutter & Dart - Complete Guide', duration: '10:45:00', icon: '💙', url: 'https://www.youtube-nocookie.com/embed/x0uinJ5DX3Q?rel=0' },
    { title: 'React Native for Absolute Beginners', duration: '1:30:00', icon: '📱', url: 'https://www.youtube-nocookie.com/embed/0-S5a0eXPoc?rel=0' },
    { title: 'iOS Development - Swift Mastery', duration: '15:20:00', icon: '🍎', url: 'https://www.youtube-nocookie.com/embed/09TeUXjzpKs?rel=0' },
    { title: 'Android Dev with Kotlin', duration: '12:30:00', icon: '🤖', url: 'https://www.youtube-nocookie.com/embed/F9UC9DY-vIU?rel=0' }
  ],
  5: [
    { title: 'AWS Cloud Practitioner Essentials', duration: '6:00:00', icon: '☁️', url: 'https://www.youtube-nocookie.com/embed/SOTamWNgDKc?rel=0' },
    { title: 'EC2 Deep Dive', duration: '2:30:00', icon: '💻', url: 'https://www.youtube-nocookie.com/embed/iHX-jtKIVNA?rel=0' },
    { title: 'Serverless with Lambda', duration: '1:45:00', icon: '⚡', url: 'https://www.youtube-nocookie.com/embed/EBCyZzKzYCI?rel=0' },
    { title: 'AWS Solutions Architect Guide', duration: '15:00:00', icon: '🏗️', url: 'https://www.youtube-nocookie.com/embed/Ia-UEYYR44s?rel=0' }
  ],
  6: [
    { title: 'Machine Learning for Everyone', duration: '3:20:00', icon: '🤖', url: 'https://www.youtube-nocookie.com/embed/ukzFI9rgwfU?rel=0' },
    { title: 'Neural Networks Visualized', duration: '1:45:00', icon: '🧠', url: 'https://www.youtube-nocookie.com/embed/aircAruvnKk?rel=0' },
    { title: 'Deep Learning with PyTorch', duration: '12:40:00', icon: '🔬', url: 'https://www.youtube-nocookie.com/embed/GIsg-ZUy0MY?rel=0' },
    { title: 'TensorFlow 2.0 Complete', duration: '7:15:00', icon: '📊', url: 'https://www.youtube-nocookie.com/embed/tPYj3fFJGjk?rel=0' }
  ],
  7: [
    { title: 'Backend Engineering Roadmap', duration: '1:10:00', icon: '⚙️', url: 'https://www.youtube-nocookie.com/embed/Nv4KEQMH_Lc?rel=0' },
    { title: 'Database Design Fundamentals', duration: '2:45:00', icon: '🗄️', url: 'https://www.youtube-nocookie.com/embed/ztHopE5Wnpc?rel=0' },
    { title: 'Microservices Architecture', duration: '1:30:00', icon: '🔧', url: 'https://www.youtube-nocookie.com/embed/CdBtNQZH8a4?rel=0' },
    { title: 'Scalable System Design', duration: '5:20:00', icon: '🚀', url: 'https://www.youtube-nocookie.com/embed/m8Icp_Cid5o?rel=0' }
  ],
  8: [
    { title: 'DevOps - Master Path', duration: '4:20:00', icon: '🔄', url: 'https://www.youtube-nocookie.com/embed/Xrgk023l4lI?rel=0' },
    { title: 'Docker Tutorial for Beginners', duration: '2:15:00', icon: '🐳', url: 'https://www.youtube-nocookie.com/embed/3c-iBn73dDE?rel=0' },
    { title: 'Kubernetes Crash Course', duration: '3:05:00', icon: '☸️', url: 'https://www.youtube-nocookie.com/embed/X48VuDVv0do?rel=0' },
    { title: 'Jenkins CI/CD Complete', duration: '4:45:00', icon: '🏗️', url: 'https://www.youtube-nocookie.com/embed/6YZvp2GwTBU?rel=0' }
  ],
  9: [
    { title: 'Cybersecurity Masterclass', duration: '15:00:00', icon: '🛡️', url: 'https://www.youtube-nocookie.com/embed/sdpxddDzXfE?rel=0' },
    { title: 'Ethical Hacking - Full Course', duration: '10:45:00', icon: '💻', url: 'https://www.youtube-nocookie.com/embed/3Kq1MIfTWCE?rel=0' },
    { title: 'Network Security Basics', duration: '4:20:00', icon: '🌐', url: 'https://www.youtube-nocookie.com/embed/qiQR5rTSshw?rel=0' },
    { title: 'Kali Linux for Pentesting', duration: '5:30:00', icon: '🔍', url: 'https://www.youtube-nocookie.com/embed/2L7YVf_WfD8?rel=0' }
  ],
  10: [
    { title: 'Blockchain Fundamentals', duration: '2:30:00', icon: '⛓️', url: 'https://www.youtube-nocookie.com/embed/qOVAbKKSH10?rel=0' },
    { title: 'Solidity & Smart Contracts', duration: '16:00:00', icon: '📜', url: 'https://www.youtube-nocookie.com/embed/M576WGiDBdQ?rel=0' },
    { title: 'Ethereum dApp Development', duration: '5:45:00', icon: '💎', url: 'https://www.youtube-nocookie.com/embed/coQ5dg8wM2o?rel=0' },
    { title: 'Web3.js & Ethers.js Guide', duration: '3:20:00', icon: '⚡', url: 'https://www.youtube-nocookie.com/embed/yk7nVp5RTCk?rel=0' }
  ],
  11: [
    { title: 'Data Science Full Course', duration: '12:15:00', icon: '📊', url: 'https://www.youtube-nocookie.com/embed/ua-CiDNNj30?rel=0' },
    { title: 'Pandas for Data Analysis', duration: '3:40:00', icon: '🐼', url: 'https://www.youtube-nocookie.com/embed/vmEHCJofslg?rel=0' },
    { title: 'Statistics for Data Science', duration: '5:10:00', icon: '📈', url: 'https://www.youtube-nocookie.com/embed/xxpc-HPKN28?rel=0' },
    { title: 'Plotly & Visualization', duration: '2:25:00', icon: '📉', url: 'https://www.youtube-nocookie.com/embed/0P7QnIQDBJY?rel=0' }
  ],
  12: [
    { title: 'UI/UX Design Masterclass', duration: '5:30:00', icon: '🎭', url: 'https://www.youtube-nocookie.com/embed/c9Wg6Cb_YlU?rel=0' },
    { title: 'Figma Complete Tutorial', duration: '3:15:00', icon: '🎨', url: 'https://www.youtube-nocookie.com/embed/FTFaQWZBqQ8?rel=0' },
    { title: 'Typography for Designers', duration: '1:45:00', icon: '✍️', url: 'https://www.youtube-nocookie.com/embed/YnIdYIn_M-s?rel=0' },
    { title: 'Design System - Start to Finish', duration: '4:20:00', icon: '📐', url: 'https://www.youtube-nocookie.com/embed/wc5krC28ynQ?rel=0' }
  ],
  13: [
    { title: 'Unity Game Dev - Beginners', duration: '7:40:00', icon: '🎮', url: 'https://www.youtube-nocookie.com/embed/pwZpJzpE2lQ?rel=0' },
    { title: 'Unreal Engine 5 Discovery', duration: '5:15:00', icon: '🔥', url: 'https://www.youtube-nocookie.com/embed/6_S5uXG9o20?rel=0' },
    { title: 'Game AI & Pathfinding', duration: '1:30:00', icon: '🤖', url: 'https://www.youtube-nocookie.com/embed/aR4OoOvH3Xc?rel=0' },
    { title: 'C# for Game Development', duration: '4:05:00', icon: '💻', url: 'https://www.youtube-nocookie.com/embed/gfkTfcpWqAY?rel=0' }
  ],
  14: [
    { title: 'Digital Marketing Essentials', duration: '4:20:00', icon: '📱', url: 'https://www.youtube-nocookie.com/embed/ZiaSclB77Z8?rel=0' },
    { title: 'SEO Full Strategy', duration: '3:45:00', icon: '🔍', url: 'https://www.youtube-nocookie.com/embed/DvwS7cV9GmQ?rel=0' },
    { title: 'Social Media Marketing', duration: '2:15:00', icon: '📣', url: 'https://www.youtube-nocookie.com/embed/1eHDdQAZ3c8?rel=0' },
    { title: 'Google Ads Complete Guide', duration: '5:10:00', icon: '📈', url: 'https://www.youtube-nocookie.com/embed/q2Z665nO0I8?rel=0' }
  ],
  15: [
    { title: 'IoT - Internet of Things Intro', duration: '1:10:00', icon: '🔌', url: 'https://www.youtube-nocookie.com/embed/LlhmzVL5bm8?rel=0' },
    { title: 'Arduino Programming 101', duration: '4:30:00', icon: '🔧', url: 'https://www.youtube-nocookie.com/embed/nL34zDTPkcs?rel=0' },
    { title: 'Raspberry Pi - Getting Started', duration: '2:05:00', icon: '🥧', url: 'https://www.youtube-nocookie.com/embed/JRHE9aQ4OxM?rel=0' },
    { title: 'ESP32 & IoT Projects', duration: '3:40:00', icon: '📡', url: 'https://www.youtube-nocookie.com/embed/v7C0Zf-zR1o?rel=0' }
  ],
  16: [
    { title: 'Quantum Computing - Top Expert', duration: '1:05:00', icon: '⚛️', url: 'https://www.youtube-nocookie.com/embed/QuR969uMICM?rel=0' },
    { title: 'Qiskit Quantum Programming', duration: '4:20:00', icon: '💻', url: 'https://www.youtube-nocookie.com/embed/a1NZC5rqQD8?rel=0' },
    { title: 'Quantum Gates Explained', duration: '1:15:00', icon: '🚪', url: 'https://www.youtube-nocookie.com/embed/mAHC1dWKNYE?rel=0' },
    { title: 'Future of Quantum Tech', duration: '0:45:00', icon: '🚀', url: 'https://www.youtube-nocookie.com/embed/OWJCfOvochA?rel=0' }
  ],
  17: [
    { title: 'AR/VR Development Path', duration: '1:20:00', icon: '🥽', url: 'https://www.youtube-nocookie.com/embed/WzfDo2Wpxks?rel=0' },
    { title: 'Unity VR Masterclass', duration: '5:45:00', icon: '🎮', url: 'https://www.youtube-nocookie.com/embed/I5YJeVRlY7I?rel=0' },
    { title: 'ARCore & Augmented Reality', duration: '2:30:00', icon: '📱', url: 'https://www.youtube-nocookie.com/embed/FWyTf3USDCQ?rel=0' },
    { title: 'Meta Quest Development Guide', duration: '3:10:00', icon: '🕶️', url: 'https://www.youtube-nocookie.com/embed/Zni7i5mS-W4?rel=0' }
  ],
  18: [
    { title: 'Software Testing Fundamentals', duration: '4:40:00', icon: '🧪', url: 'https://www.youtube-nocookie.com/embed/8Xwq35cPwYg?rel=0' },
    { title: 'Selenium Web Automation', duration: '6:15:00', icon: '🤖', url: 'https://www.youtube-nocookie.com/embed/Xjv1sY630Uc?rel=0' },
    { title: 'Jest & Unit Testing Mastery', duration: '2:30:00', icon: '✅', url: 'https://www.youtube-nocookie.com/embed/FgnxcUQ5vho?rel=0' },
    { title: 'Postman for API Testing', duration: '3:05:00', icon: '🔌', url: 'https://www.youtube-nocookie.com/embed/VywxIQ2ZXw4?rel=0' }
  ],
  19: [
    { title: 'Product Management 101', duration: '2:15:00', icon: '📋', url: 'https://www.youtube-nocookie.com/embed/2zfRBTa8c3I?rel=0' },
    { title: 'Agile & Scrum Roadmap', duration: '1:45:00', icon: '🏃', url: 'https://www.youtube-nocookie.com/embed/502ILHjX9EE?rel=0' },
    { title: 'Product Vision & Roadmap', duration: '1:10:00', icon: '🗺️', url: 'https://www.youtube-nocookie.com/embed/v38MsBWhBGk?rel=0' },
    { title: 'User Psychology for PMs', duration: '0:55:00', icon: '🧠', url: 'https://www.youtube-nocookie.com/embed/1ndPndl8_W8?rel=0' }
  ],
  20: [
    { title: 'Artificial Intelligence Explained', duration: '1:30:00', icon: '🧠', url: 'https://www.youtube-nocookie.com/embed/ad79nYk2keg?rel=0' },
    { title: 'Natural Language Processing (NLP)', duration: '4:15:00', icon: '💬', url: 'https://www.youtube-nocookie.com/embed/fNxaJsNG3-s?rel=0' },
    { title: 'Generative AI - The Future', duration: '2:40:00', icon: '✨', url: 'https://www.youtube-nocookie.com/embed/01sAkU_NvOY?rel=0' },
    { title: 'AI Ethics & Alignment', duration: '1:55:00', icon: '⚖️', url: 'https://www.youtube-nocookie.com/embed/AaAELh2xrJo?rel=0' }
  ]
};

// QUIZ DATA CONFIGURATION
const quizzesData = {
  1: [
    { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language'], correct: 0 },
    { question: 'Which CSS property controls text size?', options: ['text-size', 'font-size', 'text-style', 'font-style'], correct: 1 },
    { question: 'What is the correct JavaScript syntax to change content?', options: ['document.getElement("p").innerHTML', 'document.getElementById("p").innerHTML', '#p.innerHTML', 'document.getElementByName("p")'], correct: 1 },
    { question: 'Which HTML tag is used for the largest heading?', options: ['<heading>', '<h6>', '<h1>', '<head>'], correct: 2 },
    { question: 'What is React?', options: ['A database', 'A JavaScript library', 'A CSS framework', 'A programming language'], correct: 1 }
  ],
  2: [
    { question: 'What is Node.js?', options: ['A browser', 'A JavaScript runtime', 'A database', 'A framework'], correct: 1 },
    { question: 'Which database is NoSQL?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'], correct: 2 },
    { question: 'What does REST stand for?', options: ['Representational State Transfer', 'Remote State Transfer', 'Real State Transfer', 'Representational System Transfer'], correct: 0 },
    { question: 'Which HTTP method is used to update data?', options: ['GET', 'POST', 'PUT', 'DELETE'], correct: 2 },
    { question: 'What is Express.js?', options: ['A database', 'A web framework', 'A testing tool', 'A CSS library'], correct: 1 }
  ],
  3: [
    { question: 'What is Python?', options: ['A snake', 'A programming language', 'A database', 'A framework'], correct: 1 },
    { question: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'func', 'define'], correct: 1 },
    { question: 'What is the correct file extension for Python files?', options: ['.python', '.py', '.pt', '.pyt'], correct: 1 },
    { question: 'Which data type is mutable in Python?', options: ['tuple', 'string', 'list', 'int'], correct: 2 },
    { question: 'What does PIP stand for?', options: ['Python Install Package', 'Pip Installs Packages', 'Python Integrated Platform', 'Package Install Python'], correct: 1 }
  ],
  4: [
    { question: 'What is React Native?', options: ['A web framework', 'A mobile framework', 'A database', 'A testing tool'], correct: 1 },
    { question: 'Which language does React Native use?', options: ['Java', 'Swift', 'JavaScript', 'Kotlin'], correct: 2 },
    { question: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'], correct: 0 },
    { question: 'Which component is used for scrolling in React Native?', options: ['ScrollView', 'ListView', 'FlatList', 'Both A and C'], correct: 3 },
    { question: 'What is Expo?', options: ['A database', 'A development platform', 'A programming language', 'A testing framework'], correct: 1 }
  ],
  5: [
    { question: 'What does AWS stand for?', options: ['Amazon Web Services', 'Advanced Web Services', 'Amazon World Services', 'Automated Web Services'], correct: 0 },
    { question: 'Which AWS service is used for storage?', options: ['EC2', 'S3', 'Lambda', 'RDS'], correct: 1 },
    { question: 'What is EC2?', options: ['Elastic Compute Cloud', 'Elastic Container Cloud', 'Easy Compute Cloud', 'Elastic Cloud Computing'], correct: 0 },
    { question: 'Which service is serverless?', options: ['EC2', 'S3', 'Lambda', 'RDS'], correct: 2 },
    { question: 'What is CloudFormation?', options: ['A database', 'Infrastructure as Code', 'A monitoring tool', 'A storage service'], correct: 1 }
  ],
  6: [
    { question: 'What is Machine Learning?', options: ['A programming language', 'AI subset that learns from data', 'A database', 'A web framework'], correct: 1 },
    { question: 'Which library is popular for ML in Python?', options: ['React', 'TensorFlow', 'Express', 'Django'], correct: 1 },
    { question: 'What is a neural network?', options: ['A database', 'A computing system inspired by brain', 'A web server', 'A programming language'], correct: 1 },
    { question: 'What does CNN stand for?', options: ['Computer Neural Network', 'Convolutional Neural Network', 'Complex Neural Network', 'Computational Network Node'], correct: 1 },
    { question: 'What is supervised learning?', options: ['Learning without labels', 'Learning with labeled data', 'Learning by trial', 'Learning by observation'], correct: 1 }
  ],
  7: [
    { question: 'What is backend development?', options: ['UI design', 'Server-side programming', 'Mobile apps', 'Database only'], correct: 1 },
    { question: 'Which is a backend language?', options: ['HTML', 'CSS', 'Node.js', 'Bootstrap'], correct: 2 },
    { question: 'What is an API?', options: ['A database', 'Application Programming Interface', 'A programming language', 'A web server'], correct: 1 },
    { question: 'Which database is relational?', options: ['MongoDB', 'Redis', 'PostgreSQL', 'Cassandra'], correct: 2 },
    { question: 'What is middleware?', options: ['A database', 'Software between OS and apps', 'A programming language', 'A testing tool'], correct: 1 }
  ],
  8: [
    { question: 'What is DevOps?', options: ['A programming language', 'Development and Operations practices', 'A database', 'A framework'], correct: 1 },
    { question: 'What is Docker?', options: ['A database', 'A containerization platform', 'A programming language', 'A web server'], correct: 1 },
    { question: 'What does CI/CD stand for?', options: ['Continuous Integration/Deployment', 'Computer Integration/Development', 'Code Integration/Deployment', 'Continuous Internet/Development'], correct: 0 },
    { question: 'What is Kubernetes?', options: ['A database', 'Container orchestration', 'A programming language', 'A testing tool'], correct: 1 },
    { question: 'What is Jenkins?', options: ['A database', 'An automation server', 'A programming language', 'A web framework'], correct: 1 }
  ],
  9: [
    { question: 'What is cybersecurity?', options: ['Web development', 'Protecting systems from threats', 'Database management', 'Mobile development'], correct: 1 },
    { question: 'What is ethical hacking?', options: ['Illegal hacking', 'Authorized security testing', 'Database hacking', 'Web scraping'], correct: 1 },
    { question: 'What does VPN stand for?', options: ['Virtual Private Network', 'Very Private Network', 'Virtual Public Network', 'Verified Private Network'], correct: 0 },
    { question: 'What is encryption?', options: ['Deleting data', 'Converting data to secure format', 'Copying data', 'Compressing data'], correct: 1 },
    { question: 'What is a firewall?', options: ['A database', 'Network security system', 'A programming language', 'A web server'], correct: 1 }
  ],
  10: [
    { question: 'What is blockchain?', options: ['A database', 'Distributed ledger technology', 'A programming language', 'A web framework'], correct: 1 },
    { question: 'What is Ethereum?', options: ['A cryptocurrency only', 'Blockchain platform', 'A database', 'A web server'], correct: 1 },
    { question: 'What is a smart contract?', options: ['A legal document', 'Self-executing code on blockchain', 'A database', 'A web API'], correct: 1 },
    { question: 'What language is used for Ethereum smart contracts?', options: ['JavaScript', 'Python', 'Solidity', 'Java'], correct: 2 },
    { question: 'What is a DApp?', options: ['A database', 'Decentralized application', 'A programming language', 'A web server'], correct: 1 }
  ],
  11: [
    { question: 'What is Data Science?', options: ['Web development', 'Extracting insights from data', 'Mobile development', 'Database only'], correct: 1 },
    { question: 'Which library is used for data manipulation?', options: ['React', 'Pandas', 'Express', 'Django'], correct: 1 },
    { question: 'What is NumPy?', options: ['A database', 'Numerical computing library', 'A web framework', 'A testing tool'], correct: 1 },
    { question: 'What is data visualization?', options: ['Deleting data', 'Graphical representation of data', 'Encrypting data', 'Compressing data'], correct: 1 },
    { question: 'What is Matplotlib?', options: ['A database', 'Plotting library', 'A programming language', 'A web server'], correct: 1 }
  ],
  12: [
    { question: 'What is UI/UX?', options: ['Programming languages', 'User Interface/Experience design', 'Databases', 'Web servers'], correct: 1 },
    { question: 'What is Figma?', options: ['A database', 'Design and prototyping tool', 'A programming language', 'A web server'], correct: 1 },
    { question: 'What is a wireframe?', options: ['A database', 'Basic visual guide of interface', 'A programming language', 'A web server'], correct: 1 },
    { question: 'What is user research?', options: ['Programming', 'Understanding user needs', 'Database design', 'Server setup'], correct: 1 },
    { question: 'What is a design system?', options: ['A database', 'Collection of reusable components', 'A programming language', 'A web server'], correct: 1 }
  ],
  13: [
    { question: 'What is Unity?', options: ['A database', 'Game development engine', 'A programming language', 'A web framework'], correct: 1 },
    { question: 'Which language does Unity primarily use?', options: ['Python', 'C#', 'Java', 'JavaScript'], correct: 1 },
    { question: 'What is a game loop?', options: ['A bug', 'Core cycle of game execution', 'A level', 'A character'], correct: 1 },
    { question: 'What is a sprite?', options: ['A drink', '2D image in games', 'A sound', 'A level'], correct: 1 },
    { question: 'What is collision detection?', options: ['A bug', 'Detecting object interactions', 'A game mode', 'A character type'], correct: 1 }
  ],
  14: [
    { question: 'What does SEO stand for?', options: ['Search Engine Optimization', 'Social Engine Optimization', 'Search Email Optimization', 'Social Email Optimization'], correct: 0 },
    { question: 'What is a conversion rate?', options: ['Currency exchange', 'Percentage of visitors who take action', 'Website speed', 'Email open rate'], correct: 1 },
    { question: 'What is content marketing?', options: ['Selling content', 'Creating valuable content to attract audience', 'Copying content', 'Deleting content'], correct: 1 },
    { question: 'What is A/B testing?', options: ['Testing two versions', 'Alphabet testing', 'Testing bugs', 'Testing servers'], correct: 0 },
    { question: 'What is a CTA?', options: ['Computer Testing Algorithm', 'Call To Action', 'Content Testing Analysis', 'Customer Testing App'], correct: 1 }
  ],
  15: [
    { question: 'What does IoT stand for?', options: ['Internet of Things', 'Internet of Technology', 'Integration of Things', 'Integration of Technology'], correct: 0 },
    { question: 'What is Arduino?', options: ['A programming language', 'Open-source electronics platform', 'A database', 'A web framework'], correct: 1 },
    { question: 'What is a sensor?', options: ['A database', 'Device that detects changes', 'A programming language', 'A web server'], correct: 1 },
    { question: 'What is MQTT?', options: ['A database', 'Messaging protocol for IoT', 'A programming language', 'A web framework'], correct: 1 },
    { question: 'What is edge computing?', options: ['Computing at network edge', 'Computing at data center', 'Cloud computing', 'Mobile computing'], correct: 0 }
  ],
  16: [
    { question: 'What is a qubit?', options: ['A database', 'Quantum bit', 'A programming language', 'A web server'], correct: 1 },
    { question: 'What is superposition?', options: ['A position', 'Quantum state of multiple states', 'A database', 'A framework'], correct: 1 },
    { question: 'What is quantum entanglement?', options: ['A bug', 'Correlation between quantum particles', 'A database', 'A server'], correct: 1 },
    { question: 'What is Qiskit?', options: ['A database', 'Quantum computing framework', 'A programming language', 'A web server'], correct: 1 },
    { question: 'What is quantum supremacy?', options: ['A game', 'Quantum computer outperforming classical', 'A database', 'A framework'], correct: 1 }
  ],
  17: [
    { question: 'What does AR stand for?', options: ['Augmented Reality', 'Artificial Reality', 'Advanced Reality', 'Automated Reality'], correct: 0 },
    { question: 'What does VR stand for?', options: ['Virtual Reality', 'Visual Reality', 'Verified Reality', 'Variable Reality'], correct: 0 },
    { question: 'What is spatial computing?', options: ['A database', 'Computing in 3D space', 'A programming language', 'A web server'], correct: 1 },
    { question: 'What is a head-mounted display?', options: ['A monitor', 'VR/AR headset', 'A projector', 'A phone'], correct: 1 },
    { question: 'What is 6DOF?', options: ['A game', 'Six Degrees of Freedom', 'A framework', 'A language'], correct: 1 }
  ],
  18: [
    { question: 'What is unit testing?', options: ['Testing units of measurement', 'Testing individual code components', 'Testing entire system', 'Testing users'], correct: 1 },
    { question: 'What is Selenium?', options: ['A chemical element', 'Web automation tool', 'A database', 'A programming language'], correct: 1 },
    { question: 'What is TDD?', options: ['Test-Driven Development', 'Technology Development Design', 'Testing Database Design', 'Technical Design Document'], correct: 0 },
    { question: 'What is regression testing?', options: ['Testing old code', 'Testing after changes', 'Testing performance', 'Testing security'], correct: 1 },
    { question: 'What is code coverage?', options: ['Code documentation', 'Percentage of code tested', 'Code comments', 'Code formatting'], correct: 1 }
  ],
  19: [
    { question: 'What is a product roadmap?', options: ['A map', 'Strategic plan for product', 'A database', 'A framework'], correct: 1 },
    { question: 'What is a user story?', options: ['A novel', 'Feature description from user perspective', 'A database', 'A test'], correct: 1 },
    { question: 'What is a sprint?', options: ['Running', 'Time-boxed development period', 'A database', 'A framework'], correct: 1 },
    { question: 'What is MVP?', options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Product', 'Minimum Value Player'], correct: 1 },
    { question: 'What is product-market fit?', options: ['A measurement', 'Product satisfying market demand', 'A database', 'A framework'], correct: 1 }
  ],
  20: [
    { question: 'What is artificial intelligence?', options: ['Fake intelligence', 'Machines simulating human intelligence', 'A database', 'A framework'], correct: 1 },
    { question: 'What is NLP?', options: ['New Language Programming', 'Natural Language Processing', 'Network Layer Protocol', 'Neural Learning Process'], correct: 1 },
    { question: 'What is computer vision?', options: ['Monitor quality', 'Machines interpreting visual data', 'Screen resolution', 'Graphics card'], correct: 1 },
    { question: 'What is reinforcement learning?', options: ['Studying harder', 'Learning through rewards/penalties', 'A database', 'A framework'], correct: 1 },
    { question: 'What is a neural network?', options: ['Internet network', 'Computing system inspired by brain', 'A database', 'A web server'], correct: 1 }
  ]
};

// LEADERBOARD DATA CONFIGURATION
const leaderboardData = [
  { name: 'Alex Johnson', points: 2850, avatar: '👨‍💻', courses: 8 },
  { name: 'Sarah Williams', points: 2720, avatar: '👩‍💼', courses: 7 },
  { name: 'Mike Chen', points: 2650, avatar: '👨‍🎓', courses: 9 },
  { name: 'Emma Davis', points: 2580, avatar: '👩‍🔬', courses: 6 },
  { name: 'John Smith', points: 2490, avatar: '👨‍🏫', courses: 7 },
  { name: 'Lisa Anderson', points: 2420, avatar: '👩‍💻', courses: 5 },
  { name: 'David Brown', points: 2350, avatar: '👨‍💼', courses: 6 },
  { name: 'Maria Garcia', points: 2280, avatar: '👩‍🎓', courses: 5 },
  { name: 'James Wilson', points: 2150, avatar: '👨‍🔧', courses: 4 },
  { name: 'You', points: 0, avatar: '🎯', courses: 0 }
];

// STATE MANAGEMENT
let currentTab = 'all';
let currentCourse = null;
let currentVideoIndex = 0;

// INITIALIZE APP
async function initApp() {
  const authorized = await checkAuthAsync();
  if (!authorized) return;
  
  await loadUserData();
  updateStats();
  renderCourses();
}

// LOAD USER DATA FROM DATABASE (formerly localStorage)
async function loadUserData() {
  // --- TEMPORARY BYPASS START ---
  if (sessionStorage.getItem('tempMode') === 'true') {
    const progress = JSON.parse(localStorage.getItem('coursesProgress') || '{}');
    coursesData.forEach(course => {
      course.progress = progress[course.id] || 0;
    });
    return;
  }
  // --- TEMPORARY BYPASS END ---

  try {
    const response = await fetch('../api/progress.php');
    const result = await response.json();
    
    if (result.success) {
      // Apply Course Progress
      const progress = result.progress || {};
      coursesData.forEach(course => {
        course.progress = progress[course.id] || 0;
      });
      
      // Store Stats for updateStats() to use
      localStorage.setItem('userStats', JSON.stringify({
        streak: parseInt(result.stats.streak) || 0,
        hours: parseInt(result.stats.hours) || 0,
        quizPoints: parseInt(result.stats.quizPoints) || 0,
        lastActive: result.stats.lastActive
      }));
    }
  } catch (err) {
    console.error('Failed to load user data:', err);
  }
}

// SAVE PROGRESS TO DATABASE
async function saveProgress() {
  const progressMap = {};
  coursesData.forEach(course => {
    progressMap[course.id] = course.progress;
  });
  
  const stats = JSON.parse(localStorage.getItem('userStats'));

  // --- TEMPORARY BYPASS START ---
  if (sessionStorage.getItem('tempMode') === 'true') {
    localStorage.setItem('coursesProgress', JSON.stringify(progressMap));
    return;
  }
  // --- TEMPORARY BYPASS END ---
  
  try {
    await fetch('../api/progress.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        progress: progressMap,
        stats: stats
      })
    });
  } catch (err) {
    console.error('Failed to save progress:', err);
  }
}

// UPDATE STATS WITH ANIMATION
function updateStats() {
  const stats = JSON.parse(localStorage.getItem('userStats') || '{"streak":0,"hours":0,"quizPoints":0}');
  const completed = coursesData.filter(c => c.progress >= 100).length;
  const certificates = completed;
  
  animateValue('coursesCompleted', parseInt(document.getElementById('coursesCompleted').textContent) || 0, completed, 1000);
  animateValue('learningStreak', parseInt(document.getElementById('learningStreak').textContent) || 0, stats.streak, 1000, '🔥');
  animateValue('totalHours', parseInt(document.getElementById('totalHours').textContent.replace('h','')) || 0, stats.hours, 1000, 'h');
  animateValue('certificates', parseInt(document.getElementById('certificates').textContent) || 0, certificates, 1000);
  animateValue('quizScore', parseInt(document.getElementById('quizScore').textContent) || 0, stats.quizPoints, 1000);
  
  leaderboardData[9].points = stats.quizPoints;
  leaderboardData[9].courses = completed;
  leaderboardData.sort((a, b) => b.points - a.points);
}

// ANIMATE STAT VALUES
function animateValue(id, start, end, duration, suffix = '') {
  const element = document.getElementById(id);
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + suffix;
  }, 16);
}

// UPDATE STREAK
function updateStreak() {
  const stats = JSON.parse(localStorage.getItem('userStats'));
  const today = new Date().toDateString();
  if (stats.lastActive !== today) {
    stats.streak++;
    stats.lastActive = today;
    localStorage.setItem('userStats', JSON.stringify(stats));
    updateStats();
  }
}

// RENDER COURSES
function renderCourses() {
  const grid = document.getElementById('courseGrid');
  let filtered = coursesData;
  
  if (currentTab === 'inprogress') {
    filtered = coursesData.filter(c => c.progress > 0 && c.progress < 100);
  } else if (currentTab === 'completed') {
    filtered = coursesData.filter(c => c.progress >= 100);
  }
  
  grid.innerHTML = filtered.map(course => `
    <div class="course-card">
      <div class="course-thumbnail ${course.gradient}">
        <span>${course.icon}</span>
        <div class="course-badge">${course.badge}</div>
      </div>
      <div class="course-content">
        <h3 class="course-title">${course.title}</h3>
        <p class="course-desc">${course.desc}</p>
        <div class="course-meta">
          <span>📚 ${course.lessons} lessons</span>
          <span>⏱️ ${course.duration}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${course.progress}%"></div>
        </div>
        <p class="progress-text">${course.progress}% Complete</p>
        <div class="course-actions">
          <button class="course-btn" onclick="openVideos(${course.id})">
            ${course.progress === 0 ? '▶️ Start' : '▶️ Continue'}
          </button>
          <button class="course-btn course-btn-secondary" onclick="openQuiz(${course.id})">📝 Quiz</button>
        </div>
      </div>
    </div>
  `).join('');
}

// SWITCH TAB
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  const contentArea = document.getElementById('contentArea');
  
  if (tab === 'leaderboard') {
    renderLeaderboard();
  } else if (tab === 'certificates') {
    renderCertificates();
  } else {
    contentArea.innerHTML = '<div class="course-grid" id="courseGrid"></div>';
    renderCourses();
  }
}

// RENDER LEADERBOARD
function renderLeaderboard() {
  const contentArea = document.getElementById('contentArea');
  contentArea.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <h2 style="color: #ffa500; font-size: 2rem; margin-bottom: 20px; text-align: center;">🏆 Top Learners</h2>
      ${leaderboardData.map((user, index) => `
        <div class="leaderboard-item" style="${user.name === 'You' ? 'border-color: #ffa500; background: #2a2a3e;' : ''}">
          <div class="rank">${index + 1}</div>
          <div style="font-size: 2rem;">${user.avatar}</div>
          <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-points">📚 ${user.courses} courses completed</div>
          </div>
          <div class="user-score">${user.points} pts</div>
        </div>
      `).join('')}
    </div>
  `;
}

// RENDER CERTIFICATES
function renderCertificates() {
  const completed = coursesData.filter(c => c.progress >= 100);
  const contentArea = document.getElementById('contentArea');
  
  if (completed.length === 0) {
    contentArea.innerHTML = `
      <div class="cert-container">
        <div class="cert-icon">📜</div>
        <h2 class="cert-title">No Certificates Yet</h2>
        <p class="cert-desc">Complete courses to earn certificates!</p>
      </div>
    `;
  } else {
    contentArea.innerHTML = `
      <div class="course-grid">
        ${completed.map(course => `
          <div class="cert-container">
            <div class="cert-icon">${course.icon}</div>
            <h3 class="cert-title">${course.title}</h3>
            <p class="cert-desc">Certificate of Completion</p>
            <button class="download-btn" onclick="downloadCertificate('${course.title}')">
              📥 Download Certificate
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// DOWNLOAD CERTIFICATE
function downloadCertificate(courseName) {
  alert(`🎉 Certificate for "${courseName}" downloaded!\n\nCongratulations on completing the course!`);
}

// CHECK AUTHENTICATION (Async version)
async function checkAuthAsync() {
  // --- TEMPORARY BYPASS START ---
  if (sessionStorage.getItem('tempMode') === 'true') return true;
  // --- TEMPORARY BYPASS END ---

  try {
    const response = await fetch('../api/auth.php?action=check');
    const result = await response.json();
    if (!result.loggedIn) {
      window.location.href = '../login.html';
      return false;
    }
    sessionStorage.setItem('loggedIn', 'true');
    return true;
  } catch (err) {
    window.location.href = '../login.html';
    return false;
  }
}

// CHECK AUTHENTICATION (Keep for legacy but redirect to login if session missing)
function checkAuth() {
  if (sessionStorage.getItem('loggedIn') !== 'true') {
    window.location.href = '../login.html';
    return false;
  }
  return true;
}

// OPEN VIDEOS
function openVideos(courseId) {
  if (!checkAuth()) return;
  currentCourse = coursesData.find(c => c.id === courseId);
  const videos = videosData[courseId];
  const modal = document.getElementById('videoModal');
  const title = document.getElementById('videoTitle');
  const content = document.getElementById('videoContent');
  
  title.textContent = currentCourse.title + ' - Videos';
  content.innerHTML = `
    <div class="video-list">
      ${videos.map((video, index) => `
        <div class="video-item" onclick="playVideo(${courseId}, ${index})">
          <div class="video-thumb">${video.icon}</div>
          <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-duration">⏱️ ${video.duration}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="notes-section">
      <div class="notes-title">📄 Course Notes</div>
      <p style="color: #aaa; margin-bottom: 15px;">Download or view PDF notes for this course</p>
      <div class="pdf-actions">
        <button class="pdf-btn view-pdf-btn" onclick="viewPDF('${currentCourse.title}')">
          👁️ View PDF
        </button>
        <button class="pdf-btn download-pdf-btn" onclick="downloadPDF('${currentCourse.title}')">
          📥 Download PDF
        </button>
      </div>
      <div class="pdf-info">
        💡 PDF includes all lesson summaries, code examples, and practice exercises
      </div>
    </div>
  `;
  modal.style.display = 'block';
}

// PLAY VIDEO
function playVideo(courseId, videoIndex) {
  const videos = videosData[courseId];
  if (!videos || !videos[videoIndex]) return;
  
  const video = videos[videoIndex];
  const content = document.getElementById('videoContent');
  
  content.innerHTML = `
    <button class="back-to-list" onclick="openVideos(${courseId})">← Back to Videos</button>
    <div class="video-player-container">
      <iframe 
        class="video-player" 
        src="${video.url}" 
        title="${video.title}"
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
      </iframe>
    </div>
    <h3 style="color: #ffa500; font-size: 1.5rem; margin-bottom: 10px;">${video.title}</h3>
    <p style="color: #aaa; margin-bottom: 20px;">⏱️ Duration: ${video.duration}</p>
    <button class="course-btn" onclick="markVideoComplete(${courseId}, ${videos.length})" style="width: 100%; margin-top: 20px;">
      ✅ Mark as Watched
    </button>
  `;
  
  updateStreak();
}

// MARK VIDEO COMPLETE
function markVideoComplete(courseId, totalVideos) {
  const course = coursesData.find(c => c.id === courseId);
  const increment = Math.floor(100 / totalVideos);
  course.progress = Math.min(100, course.progress + increment);
  
  saveProgress();
  
  const stats = JSON.parse(localStorage.getItem('userStats'));
  stats.hours += 1;
  localStorage.setItem('userStats', JSON.stringify(stats));
  
  updateStats();
  
  alert('✅ Video marked as complete! Keep learning!');
  closeModal('videoModal');
  renderCourses();
}

// VIEW PDF
function viewPDF(courseName) {
  window.open('about:blank', '_blank');
  alert(`📄 Opening PDF notes for "${courseName}"...\n\nIn production, this would open the actual PDF file.`);
}

// DOWNLOAD PDF
function downloadPDF(courseName) {
  const fileName = courseName.replace(/\s+/g, '_') + '_Notes.pdf';
  alert(`📥 Downloading: ${fileName}\n\nIn production, this would download the actual PDF file.`);
}

// OPEN QUIZ
function openQuiz(courseId) {
  if (!checkAuth()) return;
  currentCourse = coursesData.find(c => c.id === courseId);
  const quiz = quizzesData[courseId];
  const modal = document.getElementById('quizModal');
  const title = document.getElementById('quizTitle');
  const content = document.getElementById('quizContent');
  
  title.textContent = currentCourse.title + ' - Quiz';
  content.innerHTML = renderQuizQuestion(quiz, 0, []);
  modal.style.display = 'block';
}

// RENDER QUIZ QUESTION
function renderQuizQuestion(quiz, questionIndex, answers) {
  if (questionIndex >= quiz.length) {
    return renderQuizResult(quiz, answers);
  }
  
  const question = quiz[questionIndex];
  return `
    <div class="quiz-question">Question ${questionIndex + 1} of ${quiz.length}</div>
    <div class="quiz-question">${question.question}</div>
    <div>
      ${question.options.map((option, index) => `
        <div class="quiz-option" onclick="selectAnswer(${currentCourse.id}, ${questionIndex}, ${index})">
          ${option}
        </div>
      `).join('')}
    </div>
  `;
}

// SELECT ANSWER
function selectAnswer(courseId, questionIndex, selectedIndex) {
  const quiz = quizzesData[courseId];
  const question = quiz[questionIndex];
  const options = document.querySelectorAll('.quiz-option');
  
  options.forEach((opt, idx) => {
    opt.style.pointerEvents = 'none';
    if (idx === question.correct) {
      opt.classList.add('correct');
    } else if (idx === selectedIndex) {
      opt.classList.add('wrong');
    }
  });
  
  const answers = JSON.parse(sessionStorage.getItem('quizAnswers') || '[]');
  answers.push(selectedIndex === question.correct ? 1 : 0);
  sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
  
  setTimeout(() => {
    const content = document.getElementById('quizContent');
    content.innerHTML = renderQuizQuestion(quiz, questionIndex + 1, answers);
  }, 1500);
}

// RENDER QUIZ RESULT
function renderQuizResult(quiz, answers) {
  const score = answers.reduce((a, b) => a + b, 0);
  const percentage = Math.round((score / quiz.length) * 100);
  
  if (percentage >= 80) {
    const course = coursesData.find(c => c.id === currentCourse.id);
    course.progress = Math.min(100, course.progress + 20);
    saveProgress();
    
    const stats = JSON.parse(localStorage.getItem('userStats'));
    stats.quizPoints += score * 50;
    localStorage.setItem('userStats', JSON.stringify(stats));
    
    updateStats();
  }
  
  sessionStorage.removeItem('quizAnswers');
  
  return `
    <div class="quiz-result">
      <div class="quiz-score">${percentage}%</div>
      <h3 style="color: #ffa500; font-size: 1.8rem; margin-bottom: 15px;">
        ${percentage >= 80 ? '🎉 Excellent!' : percentage >= 60 ? '👍 Good Job!' : '📚 Keep Learning!'}
      </h3>
      <p style="color: #aaa; font-size: 1.1rem; margin-bottom: 20px;">
        You scored ${score} out of ${quiz.length}
      </p>
      ${percentage >= 80 ? '<p style="color: #43e97b; font-size: 1rem;">✅ +20% course progress & +' + (score * 50) + ' points!</p>' : ''}
      <button class="course-btn" onclick="closeModal('quizModal')" style="margin-top: 20px; padding: 15px 40px;">
        Close
      </button>
    </div>
  `;
}

// CLOSE MODAL
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  sessionStorage.removeItem('quizAnswers');
  renderCourses();
}

// CLOSE MODAL ON OUTSIDE CLICK
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    sessionStorage.removeItem('quizAnswers');
  }
}

// INITIALIZE ON LOAD
window.onload = initApp;
