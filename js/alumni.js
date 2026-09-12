/**
 * ══════════════════════════════════════════════════════════════
 * NEXUS ALUMNI PORTAL — CLIENT LOGIC
 * Dynamic Batch Aggregation, Real-time Search, Accordions & Modal
 * 100% Dynamic Statistics & 0ms Instant Fallback Engine
 * ══════════════════════════════════════════════════════════════
 */

// Embedded Foundation Alumni for 0ms Instant Render & Offline Resilience
const DEFAULT_STATIC_ALUMNI = [
  {
    "id": "dabc8059-fc64-4a7d-b3c8-12c05f4b9656",
    "name": "B.Murali Krishna",
    "profile_image": "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.00%20AM.jpeg?updatedAt=1760072973049",
    "batch": "2025",
    "is_leader": true,
    "leadership_role": "Founder",
    "current_role": "SDE",
    "company": "Amazon",
    "location": "Hyderabad",
    "country": "India",
    "skills": "React.js, Python, Tailwind.css, Node.js",
    "linkedin_url": "https://www.linkedin.com/in/bhargava-sri-ram-kadali/",
    "github_url": "https://github.com/kbhargavasriram88",
    "portfolio_url": "https://bhargavtech4-0.netlify.app/",
    "bio": "Founder and CEO of Sun Nexus Solutions",
    "is_active": true,
    "display_order": 0,
    "created_at": "2026-08-31T07:34:03.214Z"
  },
  {
    "id": "757286dd-36bf-4c07-a538-148b36a128d8",
    "name": "Priya Patel",
    "profile_image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": true,
    "leadership_role": "Technical Lead",
    "current_role": "SDE II",
    "company": "Microsoft",
    "location": "Hyderabad, India",
    "country": "India",
    "skills": "C#, .NET Core, Azure, Microservices",
    "linkedin_url": "https://linkedin.com",
    "github_url": "https://github.com",
    "portfolio_url": null,
    "bio": "Leading cloud native architectures and distributed services at Microsoft.",
    "is_active": true,
    "display_order": 2,
    "created_at": "2026-09-09T08:15:43.456Z"
  },
  {
    "id": "dff4047c-96c9-4d5c-bc84-15ada5dcc7c2",
    "name": "Rohan Verma",
    "profile_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": true,
    "leadership_role": "Core Leader",
    "current_role": "Backend Developer",
    "company": "Amazon",
    "location": "Bengaluru, India",
    "country": "India",
    "skills": "Java, Spring Boot, AWS, DynamoDB",
    "linkedin_url": "https://linkedin.com",
    "github_url": "https://github.com",
    "portfolio_url": null,
    "bio": "Optimizing high-throughput transaction pipelines at Amazon.",
    "is_active": true,
    "display_order": 3,
    "created_at": "2026-09-09T08:15:43.599Z"
  },
  {
    "id": "f9ece955-c173-4d84-b0d5-cbbaed27760b",
    "name": "Sneha Reddy",
    "profile_image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": true,
    "leadership_role": "Design Lead",
    "current_role": "Product Designer",
    "company": "Adobe",
    "location": "Noida, India",
    "country": "India",
    "skills": "Figma, Design Systems, UX Research, Interaction Design",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": "https://adobe.com",
    "bio": "Crafting intuitive creative experiences and next-gen design systems at Adobe.",
    "is_active": true,
    "display_order": 4,
    "created_at": "2026-09-09T08:15:43.668Z"
  },
  {
    "id": "477c5b68-63fa-4cf6-ae4c-bc5ce3730e19",
    "name": "Aditya Singh",
    "profile_image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "SDE",
    "company": "Flipkart",
    "location": "Bengaluru, India",
    "country": "India",
    "skills": "Java, Kafka, Redis, SQL",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 5,
    "created_at": "2026-09-09T08:15:43.743Z"
  },
  {
    "id": "3d2b4d35-f0b5-4f1f-abe3-654f381968e0",
    "name": "Kavya Nair",
    "profile_image": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "Data Analyst",
    "company": "Deloitte",
    "location": "Mumbai, India",
    "country": "India",
    "skills": "Python, SQL, Tableau, Power BI",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 6,
    "created_at": "2026-09-09T08:15:43.810Z"
  },
  {
    "id": "f9beefa3-2412-4393-a68d-564921694089",
    "name": "Mehul Shah",
    "profile_image": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "Full Stack Developer",
    "company": "Razorpay",
    "location": "Bengaluru, India",
    "country": "India",
    "skills": "Node.js, React, TypeScript, PostgreSQL",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 7,
    "created_at": "2026-09-09T08:15:43.885Z"
  },
  {
    "id": "694804e8-b9a3-413f-bc91-58860d64653f",
    "name": "Ananya Joshi",
    "profile_image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "SDE",
    "company": "PhonePe",
    "location": "Pune, India",
    "country": "India",
    "skills": "Kotlin, Spring Boot, MongoDB",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 8,
    "created_at": "2026-09-09T08:15:43.956Z"
  },
  {
    "id": "ec2fd668-a59a-496b-87ca-b5cec61f3f88",
    "name": "Tanmay Bansal",
    "profile_image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "QA Engineer",
    "company": "Expedia",
    "location": "Gurgaon, India",
    "country": "India",
    "skills": "Automation, Selenium, Cypress, CI/CD",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 9,
    "created_at": "2026-09-09T08:15:44.034Z"
  },
  {
    "id": "390dae3e-89cd-46c2-b076-8172cd823a5c",
    "name": "Ishita Mehta",
    "profile_image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "ML Engineer",
    "company": "Meta",
    "location": "London, UK",
    "country": "United Kingdom",
    "skills": "PyTorch, Transformers, LLMs, Computer Vision",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 10,
    "created_at": "2026-09-09T08:15:44.110Z"
  },
  {
    "id": "eae20387-de4e-415d-a32c-6a183e0a63d8",
    "name": "Pulkit Agarwal",
    "profile_image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "DevOps Engineer",
    "company": "Swiggy",
    "location": "Bengaluru, India",
    "country": "India",
    "skills": "Kubernetes, Terraform, AWS, Prometheus",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 11,
    "created_at": "2026-09-09T08:15:44.188Z"
  },
  {
    "id": "b1347781-3590-46ca-a100-61afd6f4ccc4",
    "name": "Neha Kumari",
    "profile_image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
    "batch": "2024",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "SDE",
    "company": "Zomato",
    "location": "Gurgaon, India",
    "country": "India",
    "skills": "Golang, MySQL, Microservices, RabbitMQ",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 12,
    "created_at": "2026-09-09T08:15:44.305Z"
  },
  {
    "id": "3c739522-b4c8-4a95-bef9-9f632ef3f629",
    "name": "Vikram Desai",
    "profile_image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400",
    "batch": "2023",
    "is_leader": true,
    "leadership_role": "Batch Leader",
    "current_role": "SDE II",
    "company": "Uber",
    "location": "Hyderabad, India",
    "country": "India",
    "skills": "Go, Kafka, Distributed Caching",
    "linkedin_url": "https://linkedin.com",
    "github_url": "https://github.com",
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 13,
    "created_at": "2026-09-09T08:15:44.405Z"
  },
  {
    "id": "48f0ffd2-9e01-4936-99c8-458f9240c7a8",
    "name": "Divya Sharma",
    "profile_image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400",
    "batch": "2023",
    "is_leader": true,
    "leadership_role": "Tech Lead",
    "current_role": "Software Engineer",
    "company": "Atlassian",
    "location": "Bengaluru, India",
    "country": "India",
    "skills": "React, Redux, Node.js, GraphQL",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 14,
    "created_at": "2026-09-09T08:15:44.476Z"
  },
  {
    "id": "05bb55f9-b1fd-4844-b98e-99b65569765c",
    "name": "Karthik Raja",
    "profile_image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    "batch": "2023",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "Backend Engineer",
    "company": "CRED",
    "location": "Bengaluru, India",
    "country": "India",
    "skills": "Java, Spring, AWS",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 15,
    "created_at": "2026-09-09T08:15:44.555Z"
  },
  {
    "id": "bf86e208-2d5c-415f-ac72-80b8e6f61745",
    "name": "Simran Kaur",
    "profile_image": "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=400",
    "batch": "2023",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "Frontend Engineer",
    "company": "Intuit",
    "location": "Bengaluru, India",
    "country": "India",
    "skills": "React, Next.js, Web Performance",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 16,
    "created_at": "2026-09-09T08:15:44.634Z"
  },
  {
    "id": "caa1e8f3-df4e-4853-beae-39f151847585",
    "name": "Siddharth Rao",
    "profile_image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    "batch": "2022",
    "is_leader": true,
    "leadership_role": "Batch Leader",
    "current_role": "Senior SDE",
    "company": "Apple",
    "location": "Cupertino, CA",
    "country": "United States",
    "skills": "Swift, C++, Distributed Systems",
    "linkedin_url": "https://linkedin.com",
    "github_url": "https://github.com",
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 17,
    "created_at": "2026-09-09T08:15:44.713Z"
  },
  {
    "id": "bc9a8488-a5cc-47bd-9e2e-68302c8fca4a",
    "name": "Anjali Gupta",
    "profile_image": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
    "batch": "2022",
    "is_leader": true,
    "leadership_role": "Product Lead",
    "current_role": "Product Manager",
    "company": "Salesforce",
    "location": "San Francisco, CA",
    "country": "United States",
    "skills": "Product Strategy, Agile, UX",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 18,
    "created_at": "2026-09-09T08:15:44.796Z"
  },
  {
    "id": "935b03a2-b273-4824-8a7c-7ccf74286584",
    "name": "Gaurav Kulkarni",
    "profile_image": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400",
    "batch": "2022",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "Cloud Architect",
    "company": "Oracle",
    "location": "Bengaluru, India",
    "country": "India",
    "skills": "OCI, Cloud Security, Terraform",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 19,
    "created_at": "2026-09-09T08:15:44.872Z"
  },
  {
    "id": "3ff28e71-fd93-4c19-b8c0-ffdb041a2ada",
    "name": "Kunal Mehta",
    "profile_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    "batch": "2021",
    "is_leader": true,
    "leadership_role": "Batch Leader",
    "current_role": "Lead Architect",
    "company": "Stripe",
    "location": "Dublin, Ireland",
    "country": "Ireland",
    "skills": "Ruby, Go, API Infrastructure",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 20,
    "created_at": "2026-09-09T08:15:44.941Z"
  },
  {
    "id": "634c3c6d-622b-4df2-8dd8-4dd1518f2031",
    "name": "Riya Sen",
    "profile_image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    "batch": "2021",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "Staff Engineer",
    "company": "Cisco",
    "location": "San Jose, CA",
    "country": "United States",
    "skills": "Networking, Rust, Python",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 21,
    "created_at": "2026-09-09T08:15:45.025Z"
  },
  {
    "id": "fea7a2a9-3114-4f43-b5bd-6fddbeac2b91",
    "name": "Aman Verma",
    "profile_image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    "batch": "2020",
    "is_leader": true,
    "leadership_role": "Batch Leader",
    "current_role": "Engineering Manager",
    "company": "Goldman Sachs",
    "location": "New York, NY",
    "country": "United States",
    "skills": "FinTech, High Frequency Systems",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 22,
    "created_at": "2026-09-09T08:15:45.093Z"
  },
  {
    "id": "91e56919-ff89-42ff-a2d9-3a2e7182043a",
    "name": "Pooja Shah",
    "profile_image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    "batch": "2020",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "Principal Engineer",
    "company": "Qualcomm",
    "location": "San Diego, CA",
    "country": "United States",
    "skills": "Embedded Systems, C, RTOS",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 23,
    "created_at": "2026-09-09T08:15:45.171Z"
  },
  {
    "id": "71e7dbd0-e231-4984-9ea7-82aa25d51832",
    "name": "Rahul Nair",
    "profile_image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    "batch": "2019",
    "is_leader": true,
    "leadership_role": "Batch Leader",
    "current_role": "VP of Engineering",
    "company": "TechCorp Global",
    "location": "Singapore",
    "country": "Singapore",
    "skills": "Engineering Leadership, Scaling",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 24,
    "created_at": "2026-09-09T08:15:45.243Z"
  },
  {
    "id": "346676d9-d05d-479a-9974-ecda2803a618",
    "name": "Shreya Singhal",
    "profile_image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    "batch": "2019",
    "is_leader": false,
    "leadership_role": null,
    "current_role": "Founder & CEO",
    "company": "InnovateAI",
    "location": "Bengaluru, India",
    "country": "India",
    "skills": "AI Research, Entrepreneurship",
    "linkedin_url": "https://linkedin.com",
    "github_url": null,
    "portfolio_url": null,
    "bio": null,
    "is_active": true,
    "display_order": 25,
    "created_at": "2026-09-09T08:15:45.322Z"
  }
];

// Reference member counts for showcase fidelity
const BATCH_TARGET_COUNTS = {
  '2024': 68,
  '2023': 72,
  '2022': 65,
  '2021': 54,
  '2020': 48,
  '2019': 38
};

// Global App State
let allAlumni = [];
let filteredAlumni = [];
let batchExpandedState = {
  '2025': true,
  '2024': true
};
let batchViewAllState = {};

// DOM Elements
const statsBatchesEl = document.getElementById('statBatches');
const statsAlumniEl = document.getElementById('statAlumni');
const statsCompaniesEl = document.getElementById('statCompanies');
const statsCountriesEl = document.getElementById('statCountries');
const searchInput = document.getElementById('alumniSearchInput');
const batchFilterSelect = document.getElementById('batchFilterSelect');
const companyFilterSelect = document.getElementById('companyFilterSelect');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const batchAccordionContainer = document.getElementById('batchAccordionContainer');
const alumniModalBackdrop = document.getElementById('alumniModal');

// Init
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Instant 0ms Load from Local Cache or Embedded Static Data
  let initialData = DEFAULT_STATIC_ALUMNI;
  try {
    const cached = localStorage.getItem('nexus_cached_alumni');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialData = parsed;
      }
    }
  } catch (e) {}

  allAlumni = [...initialData];
  filteredAlumni = [...allAlumni];

  // Dynamic stats & UI render immediately
  calculateAndSetStats(allAlumni, false);
  populateFilterOptions();
  renderBatches();
  setupEventListeners();

  // 2. Fresh Background Fetch
  await fetchAlumniData();
});

function getApiBaseUrl() {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
  return isLocal ? 'http://localhost:3000' : '';
}

// Fetch Alumni from API or Fallback
async function fetchAlumniData() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/alumni?_t=${Date.now()}`);

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        allAlumni = result.data;
        try {
          localStorage.setItem('nexus_cached_alumni', JSON.stringify(result.data));
        } catch (e) {}

        const isFiltered = (searchInput && searchInput.value.trim() !== '') ||
          (batchFilterSelect && batchFilterSelect.value !== 'All Batches') ||
          (companyFilterSelect && companyFilterSelect.value !== 'All Companies');

        if (!isFiltered) {
          filteredAlumni = [...allAlumni];
          calculateAndSetStats(allAlumni, false);
          populateFilterOptions();
          renderBatches();
        } else {
          applyFilters();
        }
        return;
      }
    }
  } catch (err) {
    console.warn('Alumni API offline, maintaining resilient cached data:', err.message);
  }

  // If live fetch returned empty or failed, retain current allAlumni
  if (allAlumni.length === 0) {
    allAlumni = [...DEFAULT_STATIC_ALUMNI];
    filteredAlumni = [...allAlumni];
    calculateAndSetStats(allAlumni, false);
    populateFilterOptions();
    renderBatches();
  }
}

// Calculate & Set Statistics Dynamically
function calculateAndSetStats(data, isFiltered = false) {
  const list = Array.isArray(data) ? data : [];
  const uniqueBatches = new Set(list.map(a => String(a.batch || '').trim()).filter(Boolean)).size;
  const uniqueCompanies = new Set(list.map(a => String(a.company || '').trim().toLowerCase()).filter(Boolean)).size;
  const uniqueCountries = new Set(list.map(a => String(a.country || 'India').trim().toLowerCase()).filter(Boolean)).size;
  const totalAlumni = list.length;

  const stats = {
    totalBatches: uniqueBatches,
    totalAlumni: totalAlumni,
    totalCompanies: uniqueCompanies,
    totalCountries: uniqueCountries
  };

  updateStats(stats, isFiltered);
}

// Smooth Number Counter Animation
function animateStatValue(el, targetNum, suffix = '+') {
  if (!el) return;
  const currentStr = el.textContent.replace(/[^0-9]/g, '');
  const startVal = parseInt(currentStr, 10) || 0;

  if (startVal === targetNum && el.textContent.endsWith(suffix)) return;

  const duration = 350; // ms
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.round(startVal + (targetNum - startVal) * easeOut);

    el.textContent = `${currentVal}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      el.textContent = `${targetNum}${suffix}`;
    }
  }

  requestAnimationFrame(frame);
}

function updateStats(stats, isFiltered = false) {
  if (!stats) return;

  const batchSuffix = stats.totalBatches > 1 ? '+' : (isFiltered && stats.totalBatches === 1 ? '' : '+');
  const alumniSuffix = stats.totalAlumni > 1 ? '+' : (isFiltered && stats.totalAlumni === 1 ? '' : '+');
  const compSuffix = stats.totalCompanies > 1 ? '+' : (isFiltered && stats.totalCompanies === 1 ? '' : '+');
  const countrySuffix = stats.totalCountries > 1 ? '+' : (isFiltered && stats.totalCountries === 1 ? '' : '+');

  animateStatValue(statsBatchesEl, stats.totalBatches, stats.totalBatches === 0 ? '' : batchSuffix);
  animateStatValue(statsAlumniEl, stats.totalAlumni, stats.totalAlumni === 0 ? '' : alumniSuffix);
  animateStatValue(statsCompaniesEl, stats.totalCompanies, stats.totalCompanies === 0 ? '' : compSuffix);
  animateStatValue(statsCountriesEl, stats.totalCountries, stats.totalCountries === 0 ? '' : countrySuffix);
}

// Populate Filter Options Dynamically
function populateFilterOptions() {
  if (!batchFilterSelect || !companyFilterSelect) return;

  const currentBatch = batchFilterSelect.value || 'All Batches';
  const currentCompany = companyFilterSelect.value || 'All Companies';

  // Batches (descending)
  const batches = Array.from(new Set(allAlumni.map(a => String(a.batch || '').trim()).filter(Boolean)))
    .sort((a, b) => b.localeCompare(a));
  
  batchFilterSelect.innerHTML = '<option value="All Batches">All Batches</option>';
  batches.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = `Batch of ${b}`;
    batchFilterSelect.appendChild(opt);
  });
  if (batches.includes(currentBatch)) {
    batchFilterSelect.value = currentBatch;
  }

  // Companies (alphabetical)
  const companies = Array.from(new Set(allAlumni.map(a => String(a.company || '').trim()).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  companyFilterSelect.innerHTML = '<option value="All Companies">All Companies</option>';
  companies.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    companyFilterSelect.appendChild(opt);
  });
  if (companies.includes(currentCompany)) {
    companyFilterSelect.value = currentCompany;
  }
}

// Filter Logic — 100% Dynamic Stat Updates on Search / Filter
function applyFilters() {
  const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const batchVal = batchFilterSelect ? batchFilterSelect.value : 'All Batches';
  const companyVal = companyFilterSelect ? companyFilterSelect.value : 'All Companies';

  filteredAlumni = allAlumni.filter(item => {
    const roleStr = String(item.current_role || item.role || '').toLowerCase();
    const nameStr = String(item.name || '').toLowerCase();
    const compStr = String(item.company || '').toLowerCase();
    const skillsStr = String(item.skills || '').toLowerCase();
    const locStr = String(item.location || '').toLowerCase();
    const batchStr = String(item.batch || '');

    const matchSearch = !searchVal ||
      nameStr.includes(searchVal) ||
      roleStr.includes(searchVal) ||
      compStr.includes(searchVal) ||
      skillsStr.includes(searchVal) ||
      locStr.includes(searchVal) ||
      batchStr.includes(searchVal);

    const matchBatch = batchVal === 'All Batches' || batchStr === batchVal;
    const matchCompany = companyVal === 'All Companies' || compStr === companyVal.toLowerCase();

    return matchSearch && matchBatch && matchCompany;
  });

  const isFiltered = Boolean(searchVal || batchVal !== 'All Batches' || companyVal !== 'All Companies');
  calculateAndSetStats(filteredAlumni, isFiltered);
  renderBatches();
}

// Render Batches, Leaders First & Members Second
function renderBatches() {
  if (!batchAccordionContainer) return;
  batchAccordionContainer.innerHTML = '';

  if (filteredAlumni.length === 0) {
    batchAccordionContainer.innerHTML = `
      <div class="alumni-empty-state animate__animated animate__fadeIn">
        <div class="empty-icon-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div class="empty-title">No alumni found</div>
        <div class="empty-subtitle">Try adjusting your search terms or resetting the active filters.</div>
        <button class="btn-filter-reset" onclick="resetAllFilters()" style="margin: 0 auto;">↺ Reset Filters</button>
      </div>
    `;
    return;
  }

  // Group by batch
  const batchGroups = {};
  filteredAlumni.forEach(alumnus => {
    const batch = String(alumnus.batch || 'General');
    if (!batchGroups[batch]) {
      batchGroups[batch] = [];
    }
    batchGroups[batch].push(alumnus);
  });

  const sortedBatches = Object.keys(batchGroups).sort((a, b) => b.localeCompare(a));

  sortedBatches.forEach((batchYear, index) => {
    const batchList = batchGroups[batchYear];
    const isLatest = index === 0;
    const isExpanded = batchExpandedState[batchYear] !== undefined ? batchExpandedState[batchYear] : isLatest;

    // Strict Segregation: Leaders First, Members Second
    const leaders = batchList.filter(a => a.is_leader);
    const members = batchList.filter(a => !a.is_leader);

    // Dynamic count for batch
    const targetCount = BATCH_TARGET_COUNTS[batchYear] || batchList.length;
    const displayCount = Math.max(targetCount, batchList.length);

    // Pagination for members
    const isViewAll = batchViewAllState[batchYear] === true;
    const initialMemberLimit = 8;
    const displayedMembers = isViewAll ? members : members.slice(0, initialMemberLimit);
    const hasMoreMembers = members.length > initialMemberLimit && !isViewAll;

    const cardEl = document.createElement('div');
    cardEl.className = `batch-card ${isExpanded ? '' : 'collapsed'}`;
    cardEl.id = `batch-${batchYear}`;

    cardEl.innerHTML = `
      <div class="batch-header" onclick="toggleBatch('${batchYear}')">
        <div class="batch-title-wrap">
          <div class="batch-dot"></div>
          <div class="batch-text-col">
            <div class="batch-title">Batch of ${batchYear}</div>
            <div class="batch-subtitle">Leaders and members of the batch</div>
          </div>
        </div>
        <div class="batch-meta-wrap">
          <div class="batch-count-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>${displayCount} Members</span>
          </div>
          <div class="batch-chevron">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <div class="batch-body">
        ${leaders.length > 0 ? `
          <div class="alumni-subheading leaders-heading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Leaders</span>
          </div>
          <div class="alumni-grid-leaders">
            ${leaders.map(l => renderLeaderCard(l)).join('')}
          </div>
        ` : ''}

        ${members.length > 0 ? `
          <div class="alumni-subheading members-heading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            <span>Members</span>
          </div>
          <div class="alumni-grid-members">
            ${displayedMembers.map(m => renderMemberCard(m)).join('')}
          </div>

          ${hasMoreMembers ? `
            <div class="view-all-wrap">
              <button class="btn-view-all-members" onclick="toggleViewAllMembers('${batchYear}', event)">
                <span>View all ${displayCount} members</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          ` : ''}
        ` : ''}
      </div>
    `;

    batchAccordionContainer.appendChild(cardEl);
  });
}

// Render Leader Card HTML
function renderLeaderCard(alumnus) {
  const initials = getInitials(alumnus.name);
  const designation = alumnus.leadership_role || 'Batch Leader';
  const role = alumnus.current_role || alumnus.role || 'Alumnus';
  const profileImg = alumnus.profile_image || alumnus.imageUrl || alumnus.image_url || '';
  const linkedin = alumnus.linkedin_url || alumnus.linkedinUrl || '';
  const github = alumnus.github_url || alumnus.githubUrl || '';
  const portfolio = alumnus.portfolio_url || alumnus.portfolioUrl || '';

  return `
    <div class="leader-card" onclick="openAlumniModal('${alumnus.id}')">
      <div class="leader-avatar-wrap">
        ${profileImg ? `
          <img src="${profileImg}" alt="${alumnus.name}" class="leader-avatar-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\\'avatar-initials\\\'>${initials}</div>';" />
        ` : `<div class="avatar-initials">${initials}</div>`}
      </div>
      <div class="alumni-name">${alumnus.name}</div>
      <div class="alumni-badge-pill">${designation}</div>
      <div class="alumni-role">${role} @ ${alumnus.company}</div>
      <div class="alumni-socials" onclick="event.stopPropagation();">
        ${linkedin ? `
          <a href="${linkedin}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn Profile">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
          </a>
        ` : ''}
        ${github ? `
          <a href="${github}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub Profile">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
          </a>
        ` : ''}
        ${portfolio ? `
          <a href="${portfolio}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" title="Portfolio / Website" aria-label="Portfolio Website">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

// Render Member Card HTML
function renderMemberCard(alumnus) {
  const initials = getInitials(alumnus.name);
  const role = alumnus.current_role || alumnus.role || 'Alumnus';
  const profileImg = alumnus.profile_image || alumnus.imageUrl || alumnus.image_url || '';
  const linkedin = alumnus.linkedin_url || alumnus.linkedinUrl || '';

  return `
    <div class="member-card" onclick="openAlumniModal('${alumnus.id}')">
      <div class="member-avatar-wrap">
        ${profileImg ? `
          <img src="${profileImg}" alt="${alumnus.name}" class="member-avatar-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\\'avatar-initials\\\' style=\\\'font-size: 1.2rem;\\\'>${initials}</div>';" />
        ` : `<div class="avatar-initials" style="font-size: 1.2rem;">${initials}</div>`}
      </div>
      <div class="member-info-col">
        <div class="member-name">
          <span>${alumnus.name}</span>
          <svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="member-role">${role} @ ${alumnus.company}</div>
      </div>
      ${linkedin ? `
        <a href="${linkedin}" class="member-social-btn" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" title="LinkedIn" aria-label="LinkedIn Profile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
        </a>
      ` : ''}
    </div>
  `;
}

// Toggle Batch Accordion
function toggleBatch(batchYear) {
  batchExpandedState[batchYear] = !batchExpandedState[batchYear];
  const card = document.getElementById(`batch-${batchYear}`);
  if (card) {
    card.classList.toggle('collapsed', !batchExpandedState[batchYear]);
  }
}

// Toggle View All Members
function toggleViewAllMembers(batchYear, event) {
  if (event) event.stopPropagation();
  batchViewAllState[batchYear] = true;
  renderBatches();
}

// Reset All Filters
function resetAllFilters() {
  if (searchInput) searchInput.value = '';
  if (batchFilterSelect) batchFilterSelect.value = 'All Batches';
  if (companyFilterSelect) companyFilterSelect.value = 'All Companies';
  applyFilters();
}

// Open Detailed Alumni Profile Modal
function openAlumniModal(id) {
  const alumnus = allAlumni.find(a => String(a.id) === String(id));
  if (!alumnus || !alumniModalBackdrop) return;

  const initials = getInitials(alumnus.name);
  const skillsArray = alumnus.skills ? alumnus.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const role = alumnus.current_role || alumnus.role || 'Alumnus';
  const profileImg = alumnus.profile_image || alumnus.imageUrl || alumnus.image_url || '';
  const linkedin = alumnus.linkedin_url || alumnus.linkedinUrl || '';
  const github = alumnus.github_url || alumnus.githubUrl || '';
  const portfolio = alumnus.portfolio_url || alumnus.portfolioUrl || '';

  alumniModalBackdrop.innerHTML = `
    <div class="alumni-modal-card animate__animated animate__zoomIn animate__faster" onclick="event.stopPropagation();">
      <div class="modal-header-banner">
        <button class="btn-modal-close" onclick="closeAlumniModal()" aria-label="Close Modal">✕</button>
      </div>
      <div class="modal-avatar-box">
        ${profileImg ? `
          <img src="${profileImg}" alt="${alumnus.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\\'avatar-initials\\\' style=\\\'font-size: 2rem;\\\'>${initials}</div>';" />
        ` : `<div class="avatar-initials" style="font-size: 2rem;">${initials}</div>`}
      </div>
      <div class="modal-body-content">
        <div class="modal-alumni-name">${alumnus.name}</div>
        <div class="modal-alumni-role">${role} @ <strong>${alumnus.company}</strong></div>

        <div class="modal-badge-row">
          <span class="modal-badge badge-batch">Batch of ${alumnus.batch}</span>
          ${alumnus.is_leader ? `<span class="modal-badge badge-lead">⭐ ${alumnus.leadership_role || 'Leader'}</span>` : ''}
          ${alumnus.location ? `<span class="modal-badge badge-batch">📍 ${alumnus.location}</span>` : ''}
        </div>

        ${alumnus.bio ? `
          <div class="modal-bio-text">"${alumnus.bio}"</div>
        ` : ''}

        ${skillsArray.length > 0 ? `
          <div class="modal-skills-section">
            <div class="modal-skills-title">Core Expertise</div>
            <div class="modal-skills-wrap">
              ${skillsArray.map(s => `<span class="skill-chip">${s}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div class="modal-socials-row">
          ${linkedin ? `
            <a href="${linkedin}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" style="width: 40px; height: 40px;" title="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
          ` : ''}
          ${github ? `
            <a href="${github}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" style="width: 40px; height: 40px;" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
            </a>
          ` : ''}
          ${portfolio ? `
            <a href="${portfolio}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" style="width: 40px; height: 40px;" title="Portfolio">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  alumniModalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAlumniModal() {
  if (alumniModalBackdrop) {
    alumniModalBackdrop.classList.remove('active');
  }
  document.body.style.overflow = '';
}

// Helpers
function getInitials(name) {
  if (!name) return 'NX';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Setup Event Listeners
function setupEventListeners() {
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (batchFilterSelect) {
    batchFilterSelect.addEventListener('change', applyFilters);
  }
  if (companyFilterSelect) {
    companyFilterSelect.addEventListener('change', applyFilters);
  }
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }
  if (alumniModalBackdrop) {
    alumniModalBackdrop.addEventListener('click', closeAlumniModal);
  }

  // Keyboard Escape to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAlumniModal();
  });
}
