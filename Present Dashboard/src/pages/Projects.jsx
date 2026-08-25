import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Users, ExternalLink, Github, Layers, Rocket, ShieldCheck, X, Sparkles, 
  User, LayoutGrid, ListFilter, Plus, Edit3, Trash2, Archive, Eye, Heart, MessageSquare, 
  Calendar, CheckCircle2, Clock, Code2, ArrowRight, Image as ImageIcon, Flame, ChevronRight,
  Download, FileText, Check, AlertCircle, Shield, Share2, UserPlus, RefreshCw, Filter, RotateCcw,
  UserCheck, QrCode, Copy, Mail, Link
} from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { normalizeMemberName, parseTeamMembers, isUserAdmin, isNexusAdmin } from '../utils/projectsData';
import { logProjectAction } from '../store/dataStore';

// Tech Stack Badge helper component
const KNOWN_TEAM_MEMBERS = [
  { name: "K.Bhargava Sriram", image: "https://res.cloudinary.com/djw0g8duw/image/upload/v1763865310/link_img_rusktx.png" },
  { name: "B.Prasad", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514" },
  { name: "C.Mallikarjuna Rao", image: "https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572" },
  { name: "K.Raghu", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-08%20at%2010.27.23%20AM.jpeg?updatedAt=1760072973601" },
  { name: "S.Poojitha", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.24.52%20AM.jpeg?updatedAt=1760072972748" },
  { name: "A.Sirisha", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-08%20at%2011.25.48%20AM.jpeg?updatedAt=1760072973509" },
  { name: "N.Amrutha Varshini", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772639381/amrutha_varshini_mgyn9n.jpg" },
  { name: "K.Girivardhan", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.34%20AM.jpeg?updatedAt=1760072974650" },
  { name: "B.Jaya Manideep", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669" },
  { name: "G.Purna Reddy", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772599133/purna_reddy_mszkgg.jpg" },
  { name: "B.Charitha Reddy", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg" },
  { name: "M.Swapna", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg" },
  { name: "C.Varun", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772303456/varun.c.2_fod1hf.jpg" },
  { name: "A.Lokesh Reddy", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927" },
  { name: "K.Varshith Naidu", image: "https://ik.imagekit.io/kofq4cdghu/IMG-20250917-WA0086(1).jpg?updatedAt=1760094980018" },
  { name: "V.Gopinadh", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.55.20%20AM.jpeg?updatedAt=1760074230579" },
  { name: "B.Murali Krishna", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.00%20AM.jpeg?updatedAt=1760072973049" },
  { name: "A.Vishnu Vardhan", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772771807/WhatsApp_Image_2026-03-06_at_9.53.49_AM_e4nkcd.jpg" },
  { name: "A.Yaswanth", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg" },
  { name: "R.Manoj", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772612644/manoj_buozjy.jpg" },
  { name: "M.Deekshitha", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.49%20AM.jpeg?updatedAt=1760072973031" },
  { name: "K.Bharath Kumar", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.29.51%20AM.jpeg?updatedAt=1760072973494" },
  { name: "M.Madhusudhan", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2011.09.30%20AM.jpeg?updatedAt=1760074790613" },
  { name: "T.Vanaja", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/vanaja_izfe76.jpg" },
  { name: "Vaishnavi", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772639378/vaishnavi_iwaurb.jpg" },
  { name: "P.Geetanjali", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/geetanjali_ffvarc.jpg" },
  { name: "T.Rishitha", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772518152/rishitha_zgdfij.jpg" }
];

const STANDARD_PROJECT_ROLES = [
  "Lead Developer",
  "Project Lead",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "UI/UX Designer",
  "AI / ML Engineer",
  "Data Scientist",
  "Data Analyst",
  "DevOps Engineer",
  "Cloud Architect",
  "Cyber Security Lead",
  "Mobile App Developer",
  "QA & Test Engineer",
  "Core Contributor",
  "Contributor"
];

const TechBadge = ({ name, isDark }) => {
  const n = (name || '').trim();
  return (
    <span style={{
      fontSize: '11px',
      fontWeight: 700,
      padding: '3px 9px',
      borderRadius: '8px',
      backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
      color: isDark ? '#a5b4fc' : '#4f46e5',
      border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.3)' : '#c7d2fe'}`,
      whiteSpace: 'nowrap'
    }}>
      {n}
    </span>
  );
};

const Projects = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const {
    projects,
    allProjects,
    myProjects,
    projectStats,
    createNewProject,
    updateExistingProject,
    deleteProjectById,
    archiveProjectById,
    likeProjectById,
    addCommentToProject,
    transferOwnership,
    assignTeamMembers,
    canModifyProject,
    activeProjectModal,
    setActiveProjectModal
  } = useProjects();

  // Search & Multi-Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedCompletionRange, setSelectedCompletionRange] = useState('ALL');
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState('ALL');
  const [selectedMemberFilters, setSelectedMemberFilters] = useState([]); // Multi-select member names
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'completion' | 'title' | 'created'
  const [viewMode, setViewMode] = useState('all-grid'); // 'all-grid' | 'member-grouped'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProjectData, setEditingProjectData] = useState(null);
  const [activeTabDetail, setActiveTabDetail] = useState('overview'); // 'overview' | 'features' | 'architecture' | 'gallery' | 'documents' | 'comments'
  const [activeGalleryImage, setActiveGalleryImage] = useState(null);
  const [newCommentInput, setNewCommentInput] = useState('');

  // Admin Transfer / Assign Modals State
  const [transferModalProject, setTransferModalProject] = useState(null);
  const [newOwnerInput, setNewOwnerInput] = useState('');

  // Dynamic Registered System Users from Neon DB & Local Storage
  const [dbUsers, setDbUsers] = useState([]);

  const fetchRegisteredUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const users = await res.json();
        if (Array.isArray(users)) {
          setDbUsers(users);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not fetch registered members from Neon DB:', e);
    }

    try {
      const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
      if (Array.isArray(localUsers) && localUsers.length > 0) {
        setDbUsers(localUsers);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchRegisteredUsers();
  }, []);

  // Rich Team Editing & Action Modals State
  const [assignModalProject, setAssignModalProject] = useState(null);
  const [assignTeamList, setAssignTeamList] = useState([{ name: '', image: '', role: 'Contributor' }]);
  const [newTeamMembersInput, setNewTeamMembersInput] = useState('');

  // Re-fetch registered users whenever Create/Edit modal or Assign modal opens
  useEffect(() => {
    if (isFormModalOpen || assignModalProject) {
      fetchRegisteredUsers();
    }
  }, [isFormModalOpen, assignModalProject]);

  // 6 Action Buttons Modal States & Toast System
  const [shareModalProject, setShareModalProject] = useState(null);
  const [deleteModalProject, setDeleteModalProject] = useState(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  // Keyboard Navigation: ESC key closes open modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (shareModalProject) setShareModalProject(null);
        else if (deleteModalProject) setDeleteModalProject(null);
        else if (assignModalProject) setAssignModalProject(null);
        else if (transferModalProject) setTransferModalProject(null);
        else if (isFormModalOpen) setIsFormModalOpen(false);
        else if (activeProjectModal) setActiveProjectModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shareModalProject, deleteModalProject, assignModalProject, transferModalProject, isFormModalOpen, activeProjectModal]);

  // Action Button Handlers (1. View Details, 2. Open Project, 3. Share, 4. Assign Team, 5. Edit, 6. Delete)
  const handleOpenViewDetails = (project, e) => {
    if (e) e.stopPropagation();
    setActiveProjectModal(project);
    logProjectAction('VIEW_DETAILS', project.id, `Viewed details for ${project.title}`);
  };

  const handleOpenProject = (project, e) => {
    if (e) e.stopPropagation();
    const canAccess = user?.isAdmin || canModifyProject(project) || isUserInProjectTeam(user, project) || project.visibility !== 'private';
    if (!canAccess) {
      showToast('Access Denied: You do not have permission to open this project.', 'error');
      logProjectAction('OPEN_DENIED', project.id, `Access denied for user ${user?.id}`);
      return;
    }

    const ghUrl = project.github || project.githubUrl || project.github_url;
    const demoUrl = project.liveDemo || project.live || project.liveDemoUrl || project.live_demo_url;

    if (ghUrl) {
      window.open(ghUrl.startsWith('http') ? ghUrl : `https://${ghUrl}`, '_blank');
      showToast(`Opening GitHub repository for "${project.title}"...`, 'info');
      logProjectAction('OPEN_GITHUB', project.id, `Opened GitHub repository ${ghUrl}`);
    } else if (demoUrl) {
      window.open(demoUrl.startsWith('http') ? demoUrl : `https://${demoUrl}`, '_blank');
      showToast(`Opening Live Demo for "${project.title}"...`, 'info');
      logProjectAction('OPEN_LIVE_DEMO', project.id, `Opened Live Demo ${demoUrl}`);
    } else {
      setActiveProjectModal(project);
      showToast(`Opening project overview for "${project.title}"...`, 'info');
      logProjectAction('OPEN_INTERNAL', project.id, `Opened internal details view`);
    }
  };

  const handleOpenShareModal = (project, e) => {
    if (e) e.stopPropagation();
    setShareModalProject(project);
    logProjectAction('SHARE_MODAL_OPEN', project.id, `Opened share modal for ${project.title}`);
  };

  const handleOpenAssignModal = (project, e) => {
    if (e) e.stopPropagation();
    if (!canModifyProject(project)) {
      showToast('Permission Required: Only Administrators or Project Owners can assign team members.', 'error');
      logProjectAction('ASSIGN_DENIED', project.id, `Permission denied to assign team`);
      return;
    }
    handleOpenAssignTeamModal(project);
    logProjectAction('ASSIGN_MODAL_OPEN', project.id, `Opened assign team modal for ${project.title}`);
  };

  const handleOpenEditProject = (project, e) => {
    if (e) e.stopPropagation();
    if (!canModifyProject(project)) {
      showToast('Permission Required: You can edit only your own projects.', 'error');
      logProjectAction('EDIT_DENIED', project.id, `Permission denied to edit project`);
      return;
    }
    handleOpenEditModal(project, e);
    logProjectAction('EDIT_MODAL_OPEN', project.id, `Opened edit modal for ${project.title}`);
  };

  const handleOpenDeleteModal = (project, e) => {
    if (e) e.stopPropagation();
    if (!canModifyProject(project)) {
      showToast('Permission Required: You can delete only your own projects.', 'error');
      logProjectAction('DELETE_DENIED', project.id, `Permission denied to delete project`);
      return;
    }
    setDeleteModalProject(project);
    logProjectAction('DELETE_MODAL_OPEN', project.id, `Opened delete modal for ${project.title}`);
  };

  const handleConfirmDelete = async (isHardDelete = false) => {
    if (!deleteModalProject) return;
    const proj = deleteModalProject;
    const isAdmin = isUserAdmin(user);
    const shouldHardDelete = isHardDelete || isAdmin;
    await deleteProjectById(proj.id, shouldHardDelete);
    showToast(shouldHardDelete ? `Project "${proj.title}" permanently deleted.` : `Project "${proj.title}" soft-deleted successfully.`);
    setDeleteModalProject(null);
  };

  // Form State with Interactive Team Members List
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Advanced',
    domain: 'Engineering',
    priority: 'Medium',
    status: 'in_progress',
    completion: 50,
    thumbnail: '',
    screenshotsText: '',
    documentsText: '',
    github: '',
    liveDemo: '',
    techStackText: '',
    role: 'Lead Developer',
    startDate: '',
    completionDate: '',
    teamMembersList: [{ name: user?.name || user?.firstName || 'K.Bhargava Sriram', image: '', role: 'Lead Developer' }],
    visibility: 'public',
    challenges: '',
    futureImprovements: '',
    featuresText: '',
    architecture: ''
  });

  // Theme colors
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const cardBorder = isDark ? '#1e293b' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';

  // Filter Categories & Lists
  const categories = ['ALL', 'Advanced', 'Beginner', 'Ongoing', 'Web', 'Mobile', 'AI/ML', 'Cloud'];
  const domains = ['ALL', 'Web Development', 'AI & ML', 'Cyber Security', 'Cloud Computing', 'Data Science', 'UI/UX', 'App Development', 'DSA', 'Engineering'];
  const roles = ['ALL', 'Team Leader', 'Developer', 'Designer', 'Tester', 'ML Engineer', 'Frontend Developer', 'Backend Developer', 'Core Member'];
  const academicYears = ['ALL', '1st Year', '2nd Year', '3rd Year', '4th Year'];
  const academicBranches = ['ALL', 'CSE', 'ECE', 'IT', 'AI&DS', 'Mech', 'Civil'];
  const priorities = ['ALL', 'Low', 'Medium', 'High', 'Critical'];
  const completionRanges = ['ALL', '0–25%', '26–50%', '51–75%', '76–99%', '100%'];

  // Member profiles list with project counts & fuzzy deduplication
  const memberListWithDetails = useMemo(() => {
    const map = new Map();

    const findMemberKey = (rawName) => {
      if (!rawName) return '';
      const norm = normalizeMemberName(rawName);
      if (!norm) return '';

      for (let existingKey of map.keys()) {
        const existingEntry = map.get(existingKey);
        const exNorm = normalizeMemberName(existingEntry.name);

        if (existingKey === norm || exNorm === norm) return existingKey;

        // Substring / prefix match for member names (e.g. "alokesh" vs "alokeshreddy")
        if (norm.length >= 5 && exNorm.length >= 5) {
          if (norm.startsWith(exNorm) || exNorm.startsWith(norm) || norm.includes(exNorm) || exNorm.includes(norm)) {
            return existingKey;
          }
        }
      }
      return norm;
    };

    projects.forEach(p => {
      const teamList = Array.isArray(p.teamMembers || p.team) ? (p.teamMembers || p.team) : [];
      
      // Include Owner
      if (p.ownerName) {
        const key = findMemberKey(p.ownerName);
        if (!map.has(key)) {
          map.set(key, { name: p.ownerName, image: p.ownerAvatar || null, count: 1, projects: [p] });
        } else {
          const entry = map.get(key);
          if (!entry.projects.some(ex => (ex.id || ex.title) === (p.id || p.title))) {
            entry.projects.push(p);
            entry.count = entry.projects.length;
          }
          if (p.ownerName.length > entry.name.length) entry.name = p.ownerName;
          if (!entry.image && p.ownerAvatar) entry.image = p.ownerAvatar;
        }
      }

      // Include Team Members
      teamList.forEach(m => {
        const rawName = typeof m === 'string' ? m : m.name;
        const img = typeof m === 'object' ? (m.image || m.avatar) : null;
        if (!rawName) return;

        const key = findMemberKey(rawName);
        if (!map.has(key)) {
          map.set(key, { name: rawName, image: img, count: 1, projects: [p] });
        } else {
          const entry = map.get(key);
          if (!entry.projects.some(ex => (ex.id || ex.title) === (p.id || p.title))) {
            entry.projects.push(p);
            entry.count = entry.projects.length;
          }
          if (!entry.image && img) entry.image = img;
          if (rawName.length > entry.name.length) entry.name = rawName;
        }
      });
    });

    // Also include registered signed-up users from Neon DB profiles
    dbUsers.forEach(u => {
      const rawName = (u.name || (u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : u.username) || '').trim();
      if (rawName && rawName.toLowerCase() !== 'nexus admin' && rawName.toLowerCase() !== 'system admin') {
        const key = findMemberKey(rawName);
        if (!map.has(key)) {
          map.set(key, { name: rawName, image: u.avatar || u.banner || null, count: 0, projects: [] });
        } else {
          const entry = map.get(key);
          if (!entry.image && u.avatar) entry.image = u.avatar;
          if (rawName.length > entry.name.length) entry.name = rawName;
        }
      }
    });

    let list = Array.from(map.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    // If logged-in user is a MEMBER (not Admin), show ONLY logged-in member's profile chip (and assigned team members)
    if (user && !user.isAdmin) {
      const uName = (user.name || user.firstName || user.username || '').toLowerCase().trim();
      const uEmail = (user.email || '').toLowerCase().trim();

      list = list.filter(m => {
        const mNorm = normalizeMemberName(m.name);
        if (uName && mNorm.includes(normalizeMemberName(uName))) return true;
        if (uEmail && mNorm.includes(normalizeMemberName(uEmail))) return true;

        return m.projects.some(p => {
          const pOwner = String(p.ownerId || p.owner_id || '').toLowerCase().trim();
          const pOwnerName = String(p.ownerName || p.owner_name || '').toLowerCase().trim();
          return pOwner === uEmail || pOwner === String(user.id).toLowerCase() || (uName && pOwnerName.includes(uName));
        });
      });
    }

    return list;
  }, [projects, dbUsers, user]);

  // Dynamic system-wide members list for Team Member & Roles dropdowns
  const availableMembersList = useMemo(() => {
    const memberMap = new Map();

    const addMember = (rawName, avatarUrl) => {
      if (!rawName) return;
      const cleanName = String(rawName).trim();
      const lower = cleanName.toLowerCase();
      if (!cleanName || lower === 'nexus admin' || lower === 'system admin' || lower === 'admin') return;

      if (!memberMap.has(lower)) {
        memberMap.set(lower, {
          name: cleanName,
          fullName: cleanName,
          image: avatarUrl || ''
        });
      } else {
        const existing = memberMap.get(lower);
        if (!existing.image && avatarUrl) {
          existing.image = avatarUrl;
        }
      }
    };

    // 1. Add registered signed-up members from Neon DB profiles (dbUsers)
    dbUsers.forEach(u => {
      const name = (u.name || (u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : u.username) || '').trim();
      addMember(name, u.avatar || u.banner);
    });

    // 2. Add local storage registered users
    try {
      const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
      if (Array.isArray(localUsers)) {
        localUsers.forEach(u => {
          const name = (u.name || (u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : u.username) || '').trim();
          addMember(name, u.avatar || u.image);
        });
      }
    } catch (e) {}

    // 3. Add members from project details roster
    memberListWithDetails.forEach(m => {
      addMember(m.name, m.image);
    });

    // 4. Fallback static team members roster
    KNOWN_TEAM_MEMBERS.forEach(km => {
      addMember(km.name, km.image);
    });

    return Array.from(memberMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [dbUsers, memberListWithDetails]);

  // Owners list for Filter by Owner dropdown
  const ownerOptionsList = useMemo(() => {
    const set = new Set();
    projects.forEach(p => {
      if (p.ownerName) set.add(p.ownerName);
    });
    return Array.from(set).sort();
  }, [projects]);

  // Multi-Select Member Toggle Handler
  const toggleMemberFilter = (memberName) => {
    setSelectedMemberFilters(prev => {
      const exists = prev.some(m => normalizeMemberName(m) === normalizeMemberName(memberName));
      if (exists) {
        return prev.filter(m => normalizeMemberName(m) !== normalizeMemberName(memberName));
      } else {
        return [...prev, memberName];
      }
    });
  };

  // Reset / Clear All Filters Handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedDomain('ALL');
    setSelectedRole('ALL');
    setSelectedYear('ALL');
    setSelectedBranch('ALL');
    setSelectedPriority('ALL');
    setSelectedCompletionRange('ALL');
    setSelectedOwnerFilter('ALL');
    setSelectedMemberFilters([]);
    setSortBy('updated');
  };

  // Check if any filter is actively applied
  const isAnyFilterActive = useMemo(() => {
    return (
      Boolean(searchQuery) ||
      selectedCategory !== 'ALL' ||
      selectedStatus !== 'ALL' ||
      selectedDomain !== 'ALL' ||
      selectedRole !== 'ALL' ||
      selectedYear !== 'ALL' ||
      selectedBranch !== 'ALL' ||
      selectedPriority !== 'ALL' ||
      selectedCompletionRange !== 'ALL' ||
      selectedOwnerFilter !== 'ALL' ||
      selectedMemberFilters.length > 0
    );
  }, [
    searchQuery, selectedCategory, selectedStatus, selectedDomain, selectedRole,
    selectedYear, selectedBranch, selectedPriority, selectedCompletionRange,
    selectedOwnerFilter, selectedMemberFilters
  ]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const cat = selectedCategory;
      const status = selectedStatus;
      const dom = selectedDomain;
      const roleQ = selectedRole;
      const yearQ = selectedYear;
      const branchQ = selectedBranch;
      const prioQ = selectedPriority;
      const compRange = selectedCompletionRange;
      const ownerQ = selectedOwnerFilter;
      const memberFilters = selectedMemberFilters;

      // 1. Search Query Match
      if (q) {
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const descMatch = (p.description || p.desc || '').toLowerCase().includes(q);
        const ownerMatch = (p.ownerName || '').toLowerCase().includes(q);
        const idMatch = (p.id || '').toLowerCase().includes(q);
        const categoryMatch = (p.category || '').toLowerCase().includes(q);
        const domainMatch = (p.domain || '').toLowerCase().includes(q);
        const techMatch = Array.isArray(p.techStack || p.tech) && (p.techStack || p.tech).some(t => String(t).toLowerCase().includes(q));
        const teamMatch = Array.isArray(p.teamMembers || p.team) && (p.teamMembers || p.team).some(m => (typeof m === 'string' ? m : m.name || '').toLowerCase().includes(q));
        
        if (!titleMatch && !descMatch && !ownerMatch && !idMatch && !categoryMatch && !domainMatch && !techMatch && !teamMatch) {
          return false;
        }
      }

      // 2. Category Match
      if (cat !== 'ALL' && (p.category || '').toLowerCase() !== cat.toLowerCase()) return false;

      // 3. Domain Match
      if (dom !== 'ALL' && (p.domain || '').toLowerCase() !== dom.toLowerCase() && (p.category || '').toLowerCase() !== dom.toLowerCase()) return false;

      // 4. Status Match
      const pStatus = (p.status || '').toLowerCase();
      if (status !== 'ALL') {
        const st = status.toLowerCase();
        if (st === 'completed' && pStatus !== 'completed') return false;
        if (st === 'in_progress' && (pStatus !== 'in_progress' && pStatus !== 'ongoing')) return false;
        if (st === 'planning' && pStatus !== 'planning') return false;
        if (st === 'archived' && pStatus !== 'archived') return false;
        if (st === 'pending_approval' && pStatus !== 'pending_approval') return false;
      }

      // 5. Priority Match
      if (prioQ !== 'ALL' && (p.priority || 'medium').toLowerCase() !== prioQ.toLowerCase()) return false;

      // 6. Role Match
      if (roleQ !== 'ALL') {
        const rLow = roleQ.toLowerCase();
        const pRole = (p.role || '').toLowerCase();
        const teamHasRole = Array.isArray(p.teamMembers || p.team) && (p.teamMembers || p.team).some(m => typeof m === 'object' && (m.role || '').toLowerCase().includes(rLow));
        if (!pRole.includes(rLow) && !teamHasRole) return false;
      }

      // 7. Academic Year Match
      if (yearQ !== 'ALL') {
        const yLow = yearQ.toLowerCase();
        const pYear = (p.year || '').toLowerCase();
        const teamHasYear = Array.isArray(p.teamMembers || p.team) && (p.teamMembers || p.team).some(m => typeof m === 'object' && (m.year || '').toLowerCase().includes(yLow));
        if (!pYear.includes(yLow) && !teamHasYear) return false;
      }

      // 8. Academic Branch Match
      if (branchQ !== 'ALL') {
        const bLow = branchQ.toLowerCase();
        const pBranch = (p.branch || '').toLowerCase();
        const teamHasBranch = Array.isArray(p.teamMembers || p.team) && (p.teamMembers || p.team).some(m => typeof m === 'object' && (m.branch || '').toLowerCase().includes(bLow));
        if (!pBranch.includes(bLow) && !teamHasBranch) return false;
      }

      // 9. Completion Range Match
      if (compRange !== 'ALL') {
        const c = p.completion || 0;
        if (compRange === '0–25%' && (c < 0 || c > 25)) return false;
        if (compRange === '26–50%' && (c < 26 || c > 50)) return false;
        if (compRange === '51–75%' && (c < 51 || c > 75)) return false;
        if (compRange === '76–99%' && (c < 76 || c > 99)) return false;
        if (compRange === '100%' && c !== 100) return false;
      }

      // 10. Owner Filter Match
      if (ownerQ !== 'ALL') {
        const ownerNorm = normalizeMemberName(ownerQ);
        const pOwnerNorm = normalizeMemberName(p.ownerName || '');
        if (ownerNorm !== pOwnerNorm) return false;
      }

      // 11. Multi-Select Member Filter (OR Condition across selected members)
      if (memberFilters.length > 0) {
        const pOwnerNorm = normalizeMemberName(p.ownerName || '');
        const teamMembersArr = Array.isArray(p.teamMembers || p.team) ? (p.teamMembers || p.team) : [];
        const teamNorms = teamMembersArr.map(m => normalizeMemberName(typeof m === 'string' ? m : m.name));

        const matchesAnyMember = memberFilters.some(selMem => {
          const selNorm = normalizeMemberName(selMem);
          return pOwnerNorm.includes(selNorm) || teamNorms.some(tn => tn.includes(selNorm));
        });

        if (!matchesAnyMember) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'completion') return (b.completion || 0) - (a.completion || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'created') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      // Default: Last Updated
      return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
    });
  }, [
    projects, searchQuery, selectedCategory, selectedStatus, selectedDomain,
    selectedRole, selectedYear, selectedBranch, selectedPriority,
    selectedCompletionRange, selectedOwnerFilter, selectedMemberFilters, sortBy
  ]);

  // Export Projects Handler
  const handleExportProjects = () => {
    const dataToExport = filteredProjects.map(p => ({
      id: p.id,
      title: p.title,
      ownerId: p.ownerId,
      ownerName: p.ownerName,
      category: p.category,
      domain: p.domain || 'Engineering',
      priority: p.priority || 'Medium',
      status: p.status,
      completion: p.completion,
      githubUrl: p.github || p.githubUrl,
      liveDemoUrl: p.liveDemo || p.live,
      techStack: Array.isArray(p.techStack) ? p.techStack.join('; ') : '',
      teamMembers: Array.isArray(p.teamMembers) ? p.teamMembers.map(t => typeof t === 'string' ? t : `${t.name} (${t.role || 'Contributor'})`).join('; ') : '',
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${user?.isAdmin ? 'all_nexus_projects' : 'my_nexus_projects'}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Open Form Modal for Creating
  const handleOpenCreateModal = () => {
    setEditingProjectData(null);
    setFormData({
      title: '',
      summary: '',
      description: '',
      category: 'Advanced',
      displayOrder: 1,
      icon: 'monitor',
      domain: 'Engineering',
      priority: 'Medium',
      status: 'in_progress',
      completion: 50,
      thumbnail: '',
      screenshotsText: '',
      documentsText: '',
      github: '',
      liveDemo: '',
      apkUrl: '',
      techStackText: 'React, Node.js, Tailwind CSS',
      role: 'Lead Developer',
      startDate: new Date().toISOString().split('T')[0],
      completionDate: '',
      teamMembersList: (user?.name && !isNexusAdmin(user.name)) ? [{ name: user.name, image: '', role: 'Lead Developer' }] : [],
      visibility: 'public',
      challenges: 'Ensuring seamless real-time state synchronization.',
      futureImprovements: 'Integrating AI automated insights.',
      featuresText: 'Realtime Data Sync\nResponsive Design\nDark & Light Mode',
      architecture: 'Modular React Context + Node.js API with Neon Database'
    });
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Editing
  const handleOpenEditModal = (project, e) => {
    if (e) e.stopPropagation();
    setEditingProjectData(project);

    const techArr = Array.isArray(project.techStack || project.tech) ? (project.techStack || project.tech) : [];
    const featArr = Array.isArray(project.features) ? project.features : [];
    const scrArr = Array.isArray(project.screenshots) ? project.screenshots : [];
    const docArr = Array.isArray(project.documents) ? project.documents : [];

    const parsedTeam = parseTeamMembers(project.teamMembers || project.team || project.team_members);
    const finalTeam = parsedTeam.length > 0
      ? parsedTeam
      : [{ name: project.ownerName || 'Member', image: '', role: 'Lead Developer' }];

    setFormData({
      title: project.title || '',
      summary: project.summary || project.cardSummary || project.cardDescription || project.card_summary || '',
      description: project.description || project.desc || project.details || '',
      category: project.category || 'Advanced',
      displayOrder: project.displayOrder || project.display_order || project.order || 1,
      icon: project.icon || project.project_icon || project.iconType || 'monitor',
      domain: project.domain || 'Engineering',
      priority: project.priority || 'Medium',
      status: project.status || 'in_progress',
      completion: project.completion || 0,
      thumbnail: project.thumbnail || '',
      screenshotsText: scrArr.join('\n'),
      documentsText: docArr.map(d => typeof d === 'string' ? d : `${d.name} | ${d.url}`).join('\n'),
      github: project.github || project.githubUrl || '',
      liveDemo: project.liveDemo || project.live || project.liveDemoUrl || '',
      apkUrl: project.apkUrl || project.apk_url || project.apk || '',
      techStackText: techArr.map(t => typeof t === 'string' ? t : t.name).join(', '),
      role: project.role || 'Lead Developer',
      startDate: project.startDate || '',
      completionDate: project.completionDate || '',
      teamMembersList: finalTeam,
      visibility: project.visibility || 'public',
      challenges: project.challenges || '',
      futureImprovements: project.futureImprovements || '',
      featuresText: featArr.join('\n'),
      architecture: project.architecture || ''
    });
    setIsFormModalOpen(true);
  };

  // Submit Create or Update
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const techStack = formData.techStackText.split(',').map(s => s.trim()).filter(Boolean);
    const teamMembers = formData.teamMembersList.filter(m => m && (m.name || m.fullName) && (m.name || m.fullName).trim() && !isNexusAdmin(m.name || m.fullName)).map(m => {
      const nameVal = (m.name || m.fullName || '').trim();
      const uId = m.userId || m.id || m.email || nameVal;
      return {
        userId: uId,
        id: uId,
        fullName: nameVal,
        name: nameVal,
        email: m.email || '',
        avatar: m.avatar || m.image || '',
        image: m.image || m.avatar || '',
        role: m.role ? m.role.trim() : 'Contributor',
        branch: m.branch || '',
        year: m.year || '',
        domain: m.domain || ''
      };
    });
    const features = formData.featuresText.split('\n').map(s => s.trim()).filter(Boolean);
    const screenshots = formData.screenshotsText.split('\n').map(s => s.trim()).filter(Boolean);
    const documents = formData.documentsText.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
      const parts = line.split('|');
      if (parts.length > 1) return { name: parts[0].trim(), url: parts[1].trim() };
      return { name: 'Document', url: line.trim() };
    });

    const projectPayload = {
      title: formData.title,
      summary: formData.summary || formData.description,
      cardSummary: formData.summary || formData.description,
      card_summary: formData.summary || formData.description,
      description: formData.description,
      desc: formData.description,
      details: formData.description,
      category: formData.category,
      displayOrder: Number(formData.displayOrder) || 1,
      display_order: Number(formData.displayOrder) || 1,
      order: Number(formData.displayOrder) || 1,
      icon: formData.icon || 'monitor',
      project_icon: formData.icon || 'monitor',
      domain: formData.domain,
      priority: formData.priority,
      status: formData.status,
      completion: Number(formData.completion) || (formData.status === 'completed' ? 100 : 50),
      completionPercentage: Number(formData.completion) || (formData.status === 'completed' ? 100 : 50),
      thumbnail: formData.thumbnail,
      screenshots,
      documents,
      github: formData.github,
      githubUrl: formData.github,
      liveDemo: formData.liveDemo,
      liveDemoUrl: formData.liveDemo,
      live: formData.liveDemo,
      apkUrl: formData.apkUrl,
      apk_url: formData.apkUrl,
      apk: formData.apkUrl,
      techStack,
      tech: techStack,
      role: formData.role,
      startDate: formData.startDate,
      completionDate: formData.completionDate,
      teamMembers,
      team: teamMembers,
      visibility: formData.visibility,
      challenges: formData.challenges,
      futureImprovements: formData.futureImprovements,
      features,
      architecture: formData.architecture
    };

    if (editingProjectData) {
      await updateExistingProject(editingProjectData.id, projectPayload);
      showToast('Project updated successfully.');
    } else {
      await createNewProject(projectPayload);
      showToast('Project created successfully.');
    }

    setIsFormModalOpen(false);
  };

  // Handle Delete
  const handleDelete = async (id, title, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
      await deleteProjectById(id);
    }
  };

  // Admin Approve / Reject Handler
  const handleAdminApproveReject = async (project, approveState = true, e) => {
    if (e) e.stopPropagation();
    const newStatus = approveState ? 'in_progress' : 'rejected';
    await updateExistingProject(project.id, { status: newStatus });
  };

  // Admin Ownership Transfer Submit
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferModalProject || !newOwnerInput.trim()) return;
    await transferOwnership(transferModalProject.id, newOwnerInput.trim(), newOwnerInput.trim());
    setTransferModalProject(null);
    setNewOwnerInput('');
  };

  // Open Admin Assign Team Modal
  const handleOpenAssignTeamModal = (proj) => {
    setAssignModalProject(proj);
    const parsedTeam = parseTeamMembers(proj.teamMembers || proj.team || proj.team_members);
    const finalTeam = parsedTeam.length > 0
      ? parsedTeam
      : [{ userId: '', id: '', fullName: '', name: '', email: '', avatar: '', image: '', role: 'Contributor', branch: '', year: '', domain: '' }];

    setAssignTeamList(finalTeam);
    setNewTeamMembersInput(finalTeam.map(m => m.name || m.fullName).join(', '));
  };

  // Admin / Owner Assign Team Members Submit
  const handleAssignTeamSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!assignModalProject) return;

    let validTeam = assignTeamList.filter(m => m && (m.name || m.fullName) && (m.name || m.fullName).trim()).map(m => {
      const nameVal = (m.name || m.fullName || '').trim();
      const uId = m.userId || m.id || m.email || nameVal;
      return {
        userId: uId,
        id: uId,
        fullName: nameVal,
        name: nameVal,
        email: m.email || '',
        avatar: m.avatar || m.image || '',
        image: m.image || m.avatar || '',
        role: m.role ? m.role.trim() : 'Contributor',
        branch: m.branch || '',
        year: m.year || '',
        domain: m.domain || ''
      };
    });

    // Fallback if user edited single text box
    if (validTeam.length === 0 && newTeamMembersInput.trim()) {
      validTeam = newTeamMembersInput.split(',').map(s => s.trim()).filter(Boolean).map(name => ({
        userId: name,
        id: name,
        fullName: name,
        name,
        email: '',
        avatar: '',
        image: '',
        role: 'Contributor',
        branch: '',
        year: '',
        domain: ''
      }));
    }

    if (validTeam.length === 0) {
      alert("Please enter at least one team member name.");
      return;
    }

    await assignTeamMembers(assignModalProject.id, validTeam);
    alert(`Team members for project "${assignModalProject.title}" updated successfully!`);
    setAssignModalProject(null);
    setAssignTeamList([{ userId: '', id: '', fullName: '', name: '', email: '', avatar: '', image: '', role: 'Contributor', branch: '', year: '', domain: '' }]);
    setNewTeamMembersInput('');
  };

  // Helper for Status Badge Styling
  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') {
      return { label: 'Completed', bg: 'rgba(34,197,94,0.15)', color: '#22c55e', border: 'rgba(34,197,94,0.3)' };
    }
    if (s === 'in_progress' || s === 'ongoing') {
      return { label: 'In Progress', bg: 'rgba(99,102,241,0.15)', color: '#6366f1', border: 'rgba(99,102,241,0.3)' };
    }
    if (s === 'planning') {
      return { label: 'Planning', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' };
    }
    if (s === 'archived') {
      return { label: 'Archived', bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', border: 'rgba(148,163,184,0.3)' };
    }
    if (s === 'pending_approval') {
      return { label: 'Pending Approval', bg: 'rgba(234,179,8,0.15)', color: '#eab308', border: 'rgba(234,179,8,0.3)' };
    }
    return { label: 'Active', bg: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: 'rgba(6,182,212,0.3)' };
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', paddingBottom: '64px', color: textPrimary, boxSizing: 'border-box' }}>
      
      {/* ── HEADER BANNER ── */}
      <div style={{
        padding: '32px 24px',
        borderRadius: '28px',
        background: isDark
          ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
        border: `1px solid ${isDark ? '#3730a3' : '#c7d2fe'}`,
        boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.4)' : '0 6px 24px rgba(99,102,241,0.1)',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 12px', borderRadius: '12px', backgroundColor: user?.isAdmin ? '#a855f7' : '#6366f1', color: '#ffffff' }}>
              {user?.isAdmin ? 'Admin Master Control' : 'Member Workspace'}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#c7d2fe' : '#4338ca' }}>
              {user?.isAdmin ? 'Full System Projects Access' : 'Scoped to My Projects & Team Attributions'} 🛡️
            </span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: isDark ? '#ffffff' : '#1e1b4b' }}>
            {user?.isAdmin ? 'ALL PROJECTS MANAGEMENT' : 'MY PROJECTS HUB'}
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#cbd5e1' : '#4338ca', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
            {user?.isAdmin
              ? 'Admin control center for system-wide project oversight, ownership transfers, interactive team member editing, and multi-dimensional filter management.'
              : 'Personal project dashboard for tracking your owned projects, team assignments, progress, and screenshot uploads.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleExportProjects}
            style={{
              padding: '14px 20px',
              borderRadius: '16px',
              backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
              color: textPrimary,
              border: `1px solid ${cardBorder}`,
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Download size={17} />
            <span>Export ({filteredProjects.length})</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            style={{
              padding: '14px 26px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '14px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              transition: 'transform 0.2s'
            }}
          >
            <Plus size={18} />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* ── REALTIME STATS COUNTERS BAR (ROLE SCOPED) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: user?.isAdmin ? 'SYSTEM PROJECTS' : 'MY TOTAL PROJECTS', val: projectStats.total, color: '#6366f1', icon: Layers, sub: user?.isAdmin ? 'All system projects' : 'Owned & assigned' },
          { label: 'COMPLETED', val: projectStats.completed, color: '#22c55e', icon: CheckCircle2, sub: 'Finished & deployed' },
          { label: 'IN PROGRESS', val: projectStats.inProgress, color: '#06b6d4', icon: Flame, sub: 'Active development' },
          { label: 'PLANNING', val: projectStats.planning, color: '#f59e0b', icon: Clock, sub: 'Architecture & scope' },
          { label: 'ATTRIBUTED WORK', val: myProjects.length, color: '#a855f7', icon: User, sub: 'Directly assigned' },
        ].map((st, idx) => {
          const IconComp = st.icon;
          return (
            <div key={idx} style={{
              padding: '18px 20px',
              borderRadius: '20px',
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.3)' : '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: textSecondary, display: 'block', marginBottom: '4px' }}>
                  {st.label}
                </span>
                <span style={{ fontSize: '26px', fontWeight: 900, color: st.color, display: 'block', lineHeight: 1 }}>
                  {st.val}
                </span>
                <span style={{ fontSize: '11px', color: textSecondary, fontWeight: 500, marginTop: '4px', display: 'block' }}>
                  {st.sub}
                </span>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: `${st.color}15`,
                color: st.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <IconComp size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MULTI-DIMENSIONAL FILTER TOOLBAR ── */}
      <div style={{
        padding: '24px',
        borderRadius: '24px',
        backgroundColor: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 6px 24px rgba(0,0,0,0.05)',
        marginBottom: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Row 1: Search Box + Toggle Filters + Reset + View Mode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Live Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, member name, owner, tech stack, or project ID..."
              style={{
                width: '100%',
                padding: '12px 40px 12px 46px',
                borderRadius: '14px',
                backgroundColor: isDark ? '#020617' : '#f8fafc',
                border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
                color: textPrimary,
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Advanced Filters Toggle & Reset Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: showAdvancedFilters ? '#6366f1' : (isDark ? '#020617' : '#f8fafc'),
                color: showAdvancedFilters ? '#ffffff' : textPrimary,
                border: `1px solid ${cardBorder}`,
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Filter size={15} />
              <span>More Filters</span>
            </button>

            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={15} />
                <span>Reset Filters</span>
              </button>
            )}

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#020617' : '#f8fafc',
                border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
                color: textPrimary,
                fontSize: '13px',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="updated">Last Updated</option>
              <option value="completion">Completion %</option>
              <option value="title">Project Title</option>
              <option value="created">Created Date</option>
            </select>
          </div>

          {/* View Mode Toggle Buttons */}
          <div style={{ display: 'flex', gap: '6px', padding: '4px', borderRadius: '14px', backgroundColor: isDark ? '#020617' : '#f1f5f9', border: `1px solid ${cardBorder}` }}>
            <button
              onClick={() => setViewMode('all-grid')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'all-grid' ? '#6366f1' : 'transparent',
                color: viewMode === 'all-grid' ? '#ffffff' : textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutGrid size={14} />
              <span>Grid View</span>
            </button>

            <button
              onClick={() => setViewMode('member-grouped')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'member-grouped' ? '#a855f7' : 'transparent',
                color: viewMode === 'member-grouped' ? '#ffffff' : textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ListFilter size={14} />
              <span>By Team Member</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category & Status Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', paddingTop: '16px', borderTop: `1px solid ${cardBorder}` }}>
          
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: textSecondary, whiteSpace: 'nowrap' }}>Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: `1px solid ${selectedCategory === cat ? '#6366f1' : cardBorder}`,
                  backgroundColor: selectedCategory === cat ? '#6366f1' : (isDark ? '#020617' : '#f8fafc'),
                  color: selectedCategory === cat ? '#ffffff' : textPrimary
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: textSecondary }}>Status:</span>
            {['ALL', 'completed', 'in_progress', 'planning', 'archived', 'pending_approval'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  border: `1px solid ${selectedStatus === st ? '#a855f7' : cardBorder}`,
                  backgroundColor: selectedStatus === st ? '#a855f7' : (isDark ? '#020617' : '#f8fafc'),
                  color: selectedStatus === st ? '#ffffff' : textPrimary
                }}
              >
                {st === 'in_progress' ? 'In Progress' : (st === 'pending_approval' ? 'Pending' : st)}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Multi-Select Team Member Profile Chips Bar */}
        <div style={{ paddingTop: '12px', borderTop: `1px solid ${cardBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} /> Multi-Select Team Member Profiles (OR Condition):
            </span>
            {selectedMemberFilters.length > 0 && (
              <button
                onClick={() => setSelectedMemberFilters([])}
                style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear Selected Members ({selectedMemberFilters.length})
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {memberListWithDetails.map(m => {
              const isSelected = selectedMemberFilters.some(sm => normalizeMemberName(sm) === normalizeMemberName(m.name));
              return (
                <button
                  key={m.name}
                  onClick={() => toggleMemberFilter(m.name)}
                  style={{
                    padding: '5px 12px 5px 6px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: `1px solid ${isSelected ? '#6366f1' : cardBorder}`,
                    backgroundColor: isSelected ? '#6366f1' : (isDark ? '#020617' : '#f8fafc'),
                    color: isSelected ? '#ffffff' : textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0
                  }}
                >
                  {m.image ? (
                    <img src={m.image} alt="" aria-hidden="true" style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#6366f1', color: '#ffffff', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <span>{m.name}</span>
                  <span style={{ padding: '1px 6px', borderRadius: '8px', backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : (isDark ? '#1e293b' : '#e2e8f0'), fontSize: '10px' }}>
                    {m.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 4: Extended Multi-Faceted Filters Panel */}
        {showAdvancedFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', paddingTop: '16px', borderTop: `1px solid ${cardBorder}` }}>
            
            {/* Filter by Owner */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: textSecondary, display: 'block', marginBottom: '6px' }}>Project Owner</label>
              <select
                value={selectedOwnerFilter}
                onChange={e => setSelectedOwnerFilter(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none' }}
              >
                <option value="ALL">All Owners</option>
                {ownerOptionsList.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Filter by Domain */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: textSecondary, display: 'block', marginBottom: '6px' }}>Domain</label>
              <select
                value={selectedDomain}
                onChange={e => setSelectedDomain(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none' }}
              >
                {domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Filter by Member Role */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: textSecondary, display: 'block', marginBottom: '6px' }}>Role</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none' }}
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Filter by Priority */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: textSecondary, display: 'block', marginBottom: '6px' }}>Priority</label>
              <select
                value={selectedPriority}
                onChange={e => setSelectedPriority(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none' }}
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Filter by Completion Range */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: textSecondary, display: 'block', marginBottom: '6px' }}>Completion %</label>
              <select
                value={selectedCompletionRange}
                onChange={e => setSelectedCompletionRange(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none' }}
              >
                {completionRanges.map(cr => (
                  <option key={cr} value={cr}>{cr}</option>
                ))}
              </select>
            </div>

            {/* Filter by Academic Year */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: textSecondary, display: 'block', marginBottom: '6px' }}>Academic Year</label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none' }}
              >
                {academicYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Filter by Academic Branch */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: textSecondary, display: 'block', marginBottom: '6px' }}>Branch</label>
              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none' }}
              >
                {academicBranches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

          </div>
        )}

      </div>

      {/* ── VIEW MODE 1: ALL PROJECTS GRID ── */}
      {viewMode === 'all-grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredProjects.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '56px 24px', textAlign: 'center', backgroundColor: cardBg, borderRadius: '24px', border: `1px solid ${cardBorder}` }}>
              <Rocket size={48} style={{ color: textSecondary, margin: '0 auto 16px auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 8px 0', color: textPrimary }}>
                No projects found matching the selected filters.
              </h3>
              <p style={{ fontSize: '13.5px', color: textSecondary, margin: '0 0 20px 0', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
                Try adjusting or clearing your active search query and filter criteria to view more projects.
              </p>
              <button
                onClick={handleResetFilters}
                style={{
                  padding: '12px 24px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(99,102,241,0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RotateCcw size={16} />
                <span>Clear Filters</span>
              </button>
            </div>
          ) : (
            filteredProjects.map(proj => {
              const badge = getStatusBadge(proj.status);
              const isOwnerOrAdmin = canModifyProject(proj);
              const techList = Array.isArray(proj.techStack || proj.tech) ? (proj.techStack || proj.tech) : [];
              const teamList = Array.isArray(proj.teamMembers || proj.team) ? (proj.teamMembers || proj.team) : [];

              return (
                <div
                  key={proj.id}
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  <div>
                    {/* Project Card Header Image / Gradient Banner */}
                    <div style={{ position: 'relative', height: '160px', backgroundColor: isDark ? '#1e1b4b' : '#e0e7ff', overflow: 'hidden' }}>
                      {proj.thumbnail ? (
                        <img src={proj.thumbnail} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}>
                          <Rocket size={48} style={{ opacity: 0.8 }} />
                        </div>
                      )}

                      {/* Status Badge Overlay */}
                      <span style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        fontSize: '11px',
                        fontWeight: 900,
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        {badge.label}
                      </span>

                      {/* Category / Domain Tag Overlay */}
                      <span style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        fontSize: '10.5px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        color: '#ffffff',
                        backdropFilter: 'blur(8px)'
                      }}>
                        {proj.domain || proj.category || 'Advanced'}
                      </span>
                    </div>

                    {/* Card Content Body */}
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 4px 0', color: textPrimary, lineHeight: 1.3 }}>
                        {proj.title}
                      </h3>

                      {/* Owner Attribution Line */}
                      <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#6366f1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={13} />
                        <span>Owner: {proj.ownerName || 'Member'}</span>
                      </div>

                      <p style={{ fontSize: '13px', color: textSecondary, margin: '0 0 16px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {proj.description || proj.desc}
                      </p>

                      {/* Completion Progress Bar */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: textSecondary }}>Completion Progress</span>
                          <span style={{ fontSize: '12px', fontWeight: 900, color: proj.completion >= 100 ? '#22c55e' : '#6366f1' }}>
                            {proj.completion || 0}%
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '7px', borderRadius: '10px', backgroundColor: isDark ? '#1e293b' : '#e2e8f0', overflow: 'hidden' }}>
                          <div style={{
                            width: `${Math.min(100, Math.max(0, proj.completion || 0))}%`,
                            height: '100%',
                            background: proj.completion >= 100
                              ? 'linear-gradient(90deg, #22c55e 0%, #10b981 100%)'
                              : 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                            borderRadius: '10px',
                            transition: 'width 0.4s ease'
                          }} />
                        </div>
                      </div>

                      {/* Tech Stack Badges */}
                      {techList.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                          {techList.slice(0, 4).map((t, idx) => (
                            <TechBadge key={idx} name={typeof t === 'string' ? t : t.name} isDark={isDark} />
                          ))}
                          {techList.length > 4 && (
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', color: textSecondary }}>
                              +{techList.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Team Member Avatars Row */}
                      {teamList.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: `1px solid ${cardBorder}` }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: textSecondary }}>Team ({teamList.length}):</span>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {teamList.slice(0, 3).map((m, idx) => {
                              const name = typeof m === 'string' ? m : m.name;
                              const img = typeof m === 'object' ? m.image : null;
                              return (
                                <div key={idx} title={`${name} (${(typeof m === 'object' && m.role) || 'Contributor'})`} style={{ width: '24px', height: '24px', borderRadius: '50%', marginLeft: idx > 0 ? '-6px' : 0, border: `2px solid ${cardBg}`, overflow: 'hidden', backgroundColor: '#6366f1', color: '#fff', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {img ? <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name?.charAt(0)}
                                </div>
                              );
                            })}
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: textPrimary, marginLeft: '4px' }}>
                            {teamList[0]?.name || teamList[0]} {teamList.length > 1 ? `+${teamList.length - 1}` : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer — 6 ACTION BUTTONS */}
                  <div style={{ padding: '16px 20px', borderTop: `1px solid ${cardBorder}`, backgroundColor: isDark ? '#020617' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    
                    {/* Row of Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      
                      {/* 2. OPEN PROJECT (ExternalLink) */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenProject(proj, e)}
                        title="Open Project (GitHub / Live Demo / Internal)"
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
                          color: (proj.github || proj.liveDemo || proj.live) ? '#6366f1' : textSecondary,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ExternalLink size={15} />
                      </button>

                      {/* 3. SHARE (Share2) */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenShareModal(proj, e)}
                        title="Share Project"
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(168,85,247,0.15)',
                          color: '#a855f7',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Share2 size={15} />
                      </button>

                      {/* 4. ASSIGN TEAM (UserPlus) */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenAssignModal(proj, e)}
                        title="Assign & Edit Team Members"
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(6,182,212,0.15)',
                          color: '#06b6d4',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: (user?.isAdmin || isOwnerOrAdmin) ? 1 : 0.6
                        }}
                      >
                        <UserPlus size={15} />
                      </button>

                      {/* 5. EDIT PROJECT (Edit3) */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditProject(proj, e)}
                        title="Edit Project Details"
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(99,102,241,0.15)',
                          color: '#6366f1',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: isOwnerOrAdmin ? 1 : 0.6
                        }}
                      >
                        <Edit3 size={15} />
                      </button>

                      {/* 6. DELETE PROJECT (Trash2) */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenDeleteModal(proj, e)}
                        title="Delete Project"
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(239,68,68,0.15)',
                          color: '#ef4444',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: isOwnerOrAdmin ? 1 : 0.6
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* 1. VIEW DETAILS BUTTON */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenViewDetails(proj, e)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ── VIEW MODE 2: GROUPED BY TEAM MEMBER PROFILES ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {memberListWithDetails.map(member => (
            <div key={member.name} style={{
              padding: '24px',
              borderRadius: '24px',
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 18px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: `1px solid ${cardBorder}`, marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {member.image ? (
                    <img src={member.image} alt={member.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }} />
                  ) : (
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#6366f1', color: '#fff', fontSize: '18px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: textPrimary }}>{member.name}</h3>
                    <span style={{ fontSize: '12px', color: textSecondary }}>{member.projects.length} Attributed Projects</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
                {member.projects.map(proj => (
                  <div key={proj.id || proj.title} style={{ padding: '18px', borderRadius: '18px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        {proj.category || 'Advanced'} Project
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: textPrimary, margin: '0 0 6px 0' }}>{proj.title}</h4>
                      <p style={{ fontSize: '12px', color: textSecondary, margin: '0 0 12px 0', lineHeight: 1.4 }}>{proj.description || proj.desc}</p>
                    </div>

                    <button
                      onClick={() => setActiveProjectModal(proj)}
                      style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #6366f1', backgroundColor: 'transparent', color: '#6366f1', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 1. ADMIN OWNERSHIP TRANSFER MODAL                                        */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {transferModalProject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 8px 0', color: textPrimary }}>Transfer Project Ownership</h3>
            <p style={{ fontSize: '13px', color: textSecondary, margin: '0 0 20px 0' }}>Assign a new primary owner to project "{transferModalProject.title}".</p>
            <form onSubmit={handleTransferSubmit}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>New Owner Name / ID</label>
              <input
                type="text"
                required
                value={newOwnerInput}
                onChange={e => setNewOwnerInput(e.target.value)}
                placeholder="e.g. Bhargava, Rahul, Sai..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '14px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setTransferModalProject(null)} style={{ padding: '10px 18px', borderRadius: '12px', border: `1px solid ${cardBorder}`, background: 'none', color: textSecondary, fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 22px', borderRadius: '12px', background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}>Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 2. ADMIN INTERACTIVE TEAM MEMBER ASSIGNMENT & EDITING MODAL              */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {assignModalProject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '24px', maxWidth: '620px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 6px 0', color: textPrimary }}>Edit Team Members</h3>
            <p style={{ fontSize: '13px', color: textSecondary, margin: '0 0 20px 0' }}>Assign, add, or update team member names, designations, and avatars for project "{assignModalProject.title}".</p>
            
            <form onSubmit={handleAssignTeamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Dynamic Interactive Team Member List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={15} /> Assigned Team Members ({assignTeamList.length})
                </label>

                {assignTeamList.map((m, idx) => {
                  const currentName = m.name || m.fullName || '';
                  const currentRole = m.role || 'Contributor';
                  const isKnownMember = availableMembersList.some(km => km.name === currentName);
                  const isStandardRole = STANDARD_PROJECT_ROLES.includes(currentRole);

                  return (
                    <div key={idx} style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                        
                        {/* Member Name Dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 800, color: textSecondary }}>Member Name</label>
                          <select
                            value={isKnownMember ? currentName : (currentName ? '__custom__' : '')}
                            onChange={e => {
                              const val = e.target.value;
                              const updated = [...assignTeamList];
                              if (val === '__custom__') {
                                updated[idx].name = '';
                                updated[idx].fullName = '';
                                updated[idx].isCustomName = true;
                              } else {
                                const found = availableMembersList.find(km => km.name === val);
                                updated[idx].name = val;
                                updated[idx].fullName = val;
                                updated[idx].isCustomName = false;
                                if (found && found.image) {
                                  updated[idx].image = found.image;
                                  updated[idx].avatar = found.image;
                                }
                              }
                              setAssignTeamList(updated);
                            }}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                          >
                            <option value="" disabled>Select Member...</option>
                            {availableMembersList.map((km, kIdx) => (
                              <option key={kIdx} value={km.name}>{km.name}</option>
                            ))}
                            <option value="__custom__">✏️ Custom Member Name...</option>
                          </select>

                          {(!isKnownMember || m.isCustomName) && (
                            <input
                              type="text"
                              placeholder="Type Member Full Name *"
                              value={m.name || m.fullName || ''}
                              onChange={e => {
                                const val = e.target.value;
                                const updated = [...assignTeamList];
                                updated[idx].name = val;
                                updated[idx].fullName = val;
                                setAssignTeamList(updated);
                              }}
                              style={{ marginTop: '4px', padding: '8px 12px', borderRadius: '8px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '12.5px', outline: 'none' }}
                            />
                          )}
                        </div>

                        {/* Role Dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 800, color: textSecondary }}>Project Role</label>
                          <select
                            value={isStandardRole ? currentRole : (currentRole ? '__custom__' : 'Contributor')}
                            onChange={e => {
                              const val = e.target.value;
                              const updated = [...assignTeamList];
                              if (val === '__custom__') {
                                updated[idx].role = '';
                                updated[idx].isCustomRole = true;
                              } else {
                                updated[idx].role = val;
                                updated[idx].isCustomRole = false;
                              }
                              setAssignTeamList(updated);
                            }}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                          >
                            <option value="" disabled>Select Role...</option>
                            {STANDARD_PROJECT_ROLES.map((r, rIdx) => (
                              <option key={rIdx} value={r}>{r}</option>
                            ))}
                            <option value="__custom__">✏️ Custom Role...</option>
                          </select>

                          {(!isStandardRole || m.isCustomRole) && (
                            <input
                              type="text"
                              placeholder="Type Custom Role"
                              value={m.role || ''}
                              onChange={e => {
                                const val = e.target.value;
                                const updated = [...assignTeamList];
                                updated[idx].role = val;
                                setAssignTeamList(updated);
                              }}
                              style={{ marginTop: '4px', padding: '8px 12px', borderRadius: '8px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '12.5px', outline: 'none' }}
                            />
                          )}
                        </div>

                        {assignTeamList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setAssignTeamList(assignTeamList.filter((_, i) => i !== idx))}
                            style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', cursor: 'pointer', alignSelf: 'center', marginTop: '16px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Avatar Image URL (Auto-populates when member selected)"
                        value={m.image || m.avatar || ''}
                        onChange={e => {
                          const val = e.target.value;
                          const updated = [...assignTeamList];
                          updated[idx].image = val;
                          updated[idx].avatar = val;
                          setAssignTeamList(updated);
                        }}
                        style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '12.5px', outline: 'none' }}
                      />
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setAssignTeamList([...assignTeamList, { name: '', image: '', role: 'Contributor' }])}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    border: '1px dashed #6366f1',
                    color: '#6366f1',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={15} />
                  <span>+ Add Team Member</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setAssignModalProject(null)} style={{ padding: '10px 18px', borderRadius: '12px', border: `1px solid ${cardBorder}`, background: 'none', color: textSecondary, fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" onClick={(e) => handleAssignTeamSubmit(e)} style={{ padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', boxShadow: '0 6px 18px rgba(6,182,212,0.3)' }}>Save Team Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 3. PROJECT CREATION / EDIT MODAL                                        */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {isFormModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '28px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsFormModalOpen(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 6px 0', color: textPrimary }}>
              {editingProjectData ? 'Edit Project Details' : 'Create New Project'}
            </h2>
            <p style={{ fontSize: '13px', color: textSecondary, margin: '0 0 24px 0' }}>
              Fill in the project details below. Changes sync in real-time.
            </p>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Row 1: Title, Category, Display Order & Card Icon */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>Project Title *</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Weather AI Forecast Hub"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13.5px', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <option value="Advanced">Advanced</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Web">Web App</option>
                    <option value="Mobile">Mobile App</option>
                    <option value="AI/ML">AI / ML</option>
                    <option value="Cloud">Cloud</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#6366f1', display: 'block', marginBottom: '6px' }}>Display Order #</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={e => setFormData({ ...formData, displayOrder: e.target.value })}
                    placeholder="e.g. 1"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid rgba(99,102,241,0.4)`, color: textPrimary, fontSize: '14px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#06b6d4', display: 'block', marginBottom: '6px' }}>Card Icon</label>
                  <select
                    value={formData.icon || 'monitor'}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid rgba(6,182,212,0.4)`, color: textPrimary, fontSize: '13.5px', fontWeight: 700, outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <option value="monitor">🖥️ Monitor (Cyan)</option>
                    <option value="database">🗄️ Database (Green)</option>
                    <option value="chat">💬 Chatbot (Purple)</option>
                    <option value="file">📄 Document (Purple)</option>
                    <option value="ai">🤖 AI / Brain (Cyan)</option>
                    <option value="rocket">🚀 Rocket (Orange)</option>
                    <option value="users">👥 Users (Cyan)</option>
                    <option value="calendar">📅 Calendar (Purple)</option>
                    <option value="shield">🛡️ Shield (Cyan)</option>
                    <option value="resume">📋 Resume (Orange)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Status & Completion % */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13.5px', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="planning">Planning</option>
                    <option value="archived">Archived</option>
                    <option value="pending_approval">Pending Approval</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>Completion ({formData.completion}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.completion}
                    onChange={e => setFormData({ ...formData, completion: Number(e.target.value) })}
                    style={{ width: '100%', marginTop: '8px' }}
                  />
                </div>
              </div>

              {/* Row 3: Separate Card Short Summary & Modal Detailed Description */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#06b6d4', display: 'block', marginBottom: '6px' }}>Card Short Summary (Appears on Card Face) *</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.summary}
                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief 1-2 sentence overview displayed on the project card face..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid rgba(6,182,212,0.4)`, color: textPrimary, fontSize: '13.5px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#6366f1', display: 'block', marginBottom: '6px' }}>Modal Detailed Description (Appears in Detail Modal) *</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive detailed description displayed inside the project detail modal..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid rgba(99,102,241,0.4)`, color: textPrimary, fontSize: '13.5px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Row 4: Interactive Team Members & Roles Dropdown Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', borderRadius: '16px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={15} /> Team Members & Roles ({formData.teamMembersList.length})
                </label>

                {formData.teamMembersList.map((m, idx) => {
                  const currentName = m.name || m.fullName || '';
                  const currentRole = m.role || 'Contributor';
                  const isKnownMember = availableMembersList.some(km => km.name === currentName);
                  const isStandardRole = STANDARD_PROJECT_ROLES.includes(currentRole);

                  return (
                    <div key={idx} style={{ padding: '12px', borderRadius: '14px', backgroundColor: isDark ? '#090d16' : '#ffffff', border: `1px solid ${cardBorder}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      
                      {/* Dropdown Selectors Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                        
                        {/* Member Name Dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 800, color: textSecondary }}>Member Name</label>
                          <select
                            value={isKnownMember ? currentName : (currentName ? '__custom__' : '')}
                            onChange={e => {
                              const val = e.target.value;
                              const updated = [...formData.teamMembersList];
                              if (val === '__custom__') {
                                updated[idx].name = '';
                                updated[idx].fullName = '';
                                updated[idx].isCustomName = true;
                              } else {
                                const found = availableMembersList.find(km => km.name === val);
                                updated[idx].name = val;
                                updated[idx].fullName = val;
                                updated[idx].isCustomName = false;
                                if (found && found.image) {
                                  updated[idx].image = found.image;
                                  updated[idx].avatar = found.image;
                                }
                              }
                              setFormData({ ...formData, teamMembersList: updated });
                            }}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                          >
                            <option value="" disabled>Select Member...</option>
                            {availableMembersList.map((km, kIdx) => (
                              <option key={kIdx} value={km.name}>{km.name}</option>
                            ))}
                            <option value="__custom__">✏️ Custom Member Name...</option>
                          </select>

                          {(!isKnownMember || m.isCustomName) && (
                            <input
                              type="text"
                              placeholder="Type Member Full Name *"
                              value={m.name || m.fullName || ''}
                              onChange={e => {
                                const val = e.target.value;
                                const updated = [...formData.teamMembersList];
                                updated[idx].name = val;
                                updated[idx].fullName = val;
                                setFormData({ ...formData, teamMembersList: updated });
                              }}
                              style={{ marginTop: '4px', padding: '8px 12px', borderRadius: '8px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '12.5px', outline: 'none' }}
                            />
                          )}
                        </div>

                        {/* Role Dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 800, color: textSecondary }}>Project Role</label>
                          <select
                            value={isStandardRole ? currentRole : (currentRole ? '__custom__' : 'Contributor')}
                            onChange={e => {
                              const val = e.target.value;
                              const updated = [...formData.teamMembersList];
                              if (val === '__custom__') {
                                updated[idx].role = '';
                                updated[idx].isCustomRole = true;
                              } else {
                                updated[idx].role = val;
                                updated[idx].isCustomRole = false;
                              }
                              setFormData({ ...formData, teamMembersList: updated });
                            }}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                          >
                            <option value="" disabled>Select Role...</option>
                            {STANDARD_PROJECT_ROLES.map((r, rIdx) => (
                              <option key={rIdx} value={r}>{r}</option>
                            ))}
                            <option value="__custom__">✏️ Custom Role...</option>
                          </select>

                          {(!isStandardRole || m.isCustomRole) && (
                            <input
                              type="text"
                              placeholder="Type Custom Role"
                              value={m.role || ''}
                              onChange={e => {
                                const val = e.target.value;
                                const updated = [...formData.teamMembersList];
                                updated[idx].role = val;
                                setFormData({ ...formData, teamMembersList: updated });
                              }}
                              style={{ marginTop: '4px', padding: '8px 12px', borderRadius: '8px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '12.5px', outline: 'none' }}
                            />
                          )}
                        </div>

                        {/* Delete Row Button */}
                        {formData.teamMembersList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.teamMembersList.filter((_, i) => i !== idx);
                              setFormData({ ...formData, teamMembersList: updated });
                            }}
                            style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', cursor: 'pointer', alignSelf: 'center', marginTop: '16px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                      </div>

                      {/* Avatar Image Input */}
                      <input
                        type="text"
                        placeholder="Avatar Image URL (Auto-populates when member selected)"
                        value={m.image || m.avatar || ''}
                        onChange={e => {
                          const val = e.target.value;
                          const updated = [...formData.teamMembersList];
                          updated[idx].image = val;
                          updated[idx].avatar = val;
                          setFormData({ ...formData, teamMembersList: updated });
                        }}
                        style={{ padding: '7px 12px', borderRadius: '8px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '12px', outline: 'none' }}
                      />
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, teamMembersList: [...formData.teamMembersList, { name: '', image: '', role: 'Contributor' }] })}
                  style={{ padding: '9px 16px', borderRadius: '12px', backgroundColor: 'transparent', border: '1px dashed #6366f1', color: '#6366f1', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Plus size={15} />
                  <span>+ Add Team Member</span>
                </button>
              </div>

              {/* Row 5: Links (GitHub, Live Demo & APK File Download) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>GitHub URL</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={e => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.liveDemo}
                    onChange={e => setFormData({ ...formData, liveDemo: e.target.value })}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', display: 'block', marginBottom: '6px' }}>📱 APK File / Download URL</label>
                  <input
                    type="url"
                    value={formData.apkUrl}
                    onChange={e => setFormData({ ...formData, apkUrl: e.target.value })}
                    placeholder="https://.../app-release.apk"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid rgba(16,185,129,0.4)`, color: textPrimary, fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Row 6: Thumbnail & Tech Stack */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>Tech Stack (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.techStackText}
                    onChange={e => setFormData({ ...formData, techStackText: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Row 7: Screenshots Gallery */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>Gallery Screenshots (One URL per line)</label>
                <textarea
                  rows="2"
                  value={formData.screenshotsText}
                  onChange={e => setFormData({ ...formData, screenshotsText: e.target.value })}
                  placeholder="https://image1.jpg&#10;https://image2.jpg"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Row 8: Documents Upload Links */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: textSecondary, display: 'block', marginBottom: '6px' }}>Project Documents (Format: Title | URL per line)</label>
                <textarea
                  rows="2"
                  value={formData.documentsText}
                  onChange={e => setFormData({ ...formData, documentsText: e.target.value })}
                  placeholder="Architecture Spec | https://docs.google.com/spec&#10;User Guide | https://pdf.org/guide.pdf"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  style={{ padding: '12px 20px', borderRadius: '12px', border: `1px solid ${cardBorder}`, background: 'none', color: textSecondary, fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#ffffff', border: 'none', fontWeight: 900, fontSize: '13.5px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(99,102,241,0.3)' }}
                >
                  {editingProjectData ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 4. COMPREHENSIVE PROJECT DETAIL MODAL                                    */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {activeProjectModal && (() => {
        const p = activeProjectModal;
        const badge = getStatusBadge(p.status);
        const techList = Array.isArray(p.techStack || p.tech) ? (p.techStack || p.tech) : [];
        const teamList = Array.isArray(p.teamMembers || p.team) ? (p.teamMembers || p.team) : [];
        const screenshotList = Array.isArray(p.screenshots) ? p.screenshots : [];
        const documentList = Array.isArray(p.documents) ? p.documents : [];
        const featureList = Array.isArray(p.features) ? p.features : [];

        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: '28px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              position: 'relative',
              color: textPrimary
            }}>
              
              {/* Close Button */}
              <button
                onClick={() => setActiveProjectModal(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: 'rgba(15,23,42,0.6)', border: 'none', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)' }}
              >
                <X size={20} />
              </button>

              {/* Hero Banner Section */}
              <div style={{ position: 'relative', height: '260px', backgroundColor: '#1e1b4b', overflow: 'hidden' }}>
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                    <Rocket size={72} style={{ opacity: 0.7 }} />
                  </div>
                )}
                
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)' }} />

                <div style={{ position: 'absolute', bottom: '24px', left: '28px', right: '28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 900, padding: '3px 10px', borderRadius: '10px', backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                        {badge.label}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                        {p.domain || p.category || 'Advanced'}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '10px', backgroundColor: 'rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                        Owner: {p.ownerName || 'Member'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                      {p.title}
                    </h2>
                  </div>

                  {/* Likes & Views Counters */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => likeProjectById(p.id)}
                      style={{ padding: '8px 14px', borderRadius: '14px', backgroundColor: 'rgba(239,68,68,0.25)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Heart size={16} fill="#f87171" />
                      <span>{p.likes || 0} Likes</span>
                    </button>
                    <span style={{ padding: '8px 14px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Eye size={16} />
                      <span>{p.views || 1} Views</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-Tab Navigation Bar */}
              <div style={{ display: 'flex', gap: '8px', padding: '16px 28px 0 28px', borderBottom: `1px solid ${cardBorder}` }}>
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'features', label: `Features (${featureList.length})` },
                  { id: 'gallery', label: `Gallery (${screenshotList.length})` },
                  { id: 'documents', label: `Docs (${documentList.length})` },
                  { id: 'architecture', label: 'Architecture' },
                  { id: 'comments', label: `Discussion (${(p.comments || []).length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabDetail(tab.id)}
                    style={{
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: 'none',
                      borderBottom: activeTabDetail === tab.id ? '3px solid #6366f1' : '3px solid transparent',
                      color: activeTabDetail === tab.id ? '#6366f1' : textSecondary
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content Body */}
              <div style={{ padding: '28px' }}>
                
                {/* TAB 1: OVERVIEW */}
                {activeTabDetail === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Admin Approval Control Row */}
                    {user?.isAdmin && p.status === 'pending_approval' && (
                      <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <AlertCircle size={20} color="#eab308" />
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#eab308' }}>Project Pending Admin Approval</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={(e) => handleAdminApproveReject(p, true, e)} style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#22c55e', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Approve</button>
                          <button onClick={(e) => handleAdminApproveReject(p, false, e)} style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Reject</button>
                        </div>
                      </div>
                    )}

                    {/* Completion Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: textSecondary }}>Project Completion Rate</span>
                        <span style={{ fontSize: '13px', fontWeight: 900, color: '#6366f1' }}>{p.completion || 0}%</span>
                      </div>
                      <div style={{ width: '100%', height: '10px', borderRadius: '10px', backgroundColor: isDark ? '#1e293b' : '#e2e8f0', overflow: 'hidden' }}>
                        <div style={{ width: `${p.completion || 0}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', borderRadius: '10px' }} />
                      </div>
                    </div>

                    {/* Detailed Description */}
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366f1', margin: '0 0 8px 0' }}>
                        Description
                      </h4>
                      <p style={{ fontSize: '14px', color: textPrimary, lineHeight: 1.7, margin: 0 }}>
                        {p.description || p.desc}
                      </p>
                    </div>

                    {/* Tech Stack Pills */}
                    {techList.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366f1', margin: '0 0 10px 0' }}>
                          Technology Stack
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {techList.map((t, idx) => (
                            <TechBadge key={idx} name={typeof t === 'string' ? t : t.name} isDark={isDark} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Team Members List */}
                    {teamList.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366f1', margin: '0 0 12px 0' }}>
                          Team Members & Roles ({teamList.length})
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                          {teamList.map((m, idx) => {
                            const name = typeof m === 'string' ? m : m.name;
                            const img = typeof m === 'object' ? m.image : null;
                            const memberRole = (typeof m === 'object' && m.role) || p.role || 'Contributor';
                            return (
                              <div key={idx} style={{ padding: '10px 14px', borderRadius: '14px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {img ? (
                                  <img src={img} alt={name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#6366f1', color: '#ffffff', fontSize: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {name?.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <span style={{ fontSize: '13px', fontWeight: 800, display: 'block', color: textPrimary }}>{name}</span>
                                  <span style={{ fontSize: '11px', color: textSecondary }}>{memberRole}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* External Buttons Row */}
                    <div style={{ display: 'flex', gap: '14px', paddingTop: '16px', borderTop: `1px solid ${cardBorder}` }}>
                      {p.github && (
                        <a
                          href={p.github.startsWith('http') ? p.github : `https://${p.github}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ padding: '12px 22px', borderRadius: '14px', backgroundColor: isDark ? '#1e293b' : '#e2e8f0', color: textPrimary, border: 'none', fontWeight: 800, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <Github size={16} />
                          <span>View GitHub Code</span>
                        </a>
                      )}

                      {(p.liveDemo || p.live) && (
                        <a
                          href={(p.liveDemo || p.live).startsWith('http') ? (p.liveDemo || p.live) : `https://${p.liveDemo || p.live}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ padding: '12px 24px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 18px rgba(99,102,241,0.3)' }}
                        >
                          <ExternalLink size={16} />
                          <span>Open Live Demo</span>
                        </a>
                      )}
                    </div>

                  </div>
                )}

                {/* TAB 2: FEATURES */}
                {activeTabDetail === 'features' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 900, margin: '0 0 12px 0' }}>Key System Features</h4>
                    {featureList.length > 0 ? (
                      featureList.map((ft, idx) => (
                        <div key={idx} style={{ padding: '14px 18px', borderRadius: '14px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: textPrimary }}>{ft}</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: textSecondary, fontStyle: 'italic' }}>No custom features explicitly listed for this project.</p>
                    )}
                  </div>
                )}

                {/* TAB 3: GALLERY */}
                {activeTabDetail === 'gallery' && (
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 900, margin: '0 0 14px 0' }}>Project Screenshots & Gallery</h4>
                    {screenshotList.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                        {screenshotList.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveGalleryImage(img)}
                            style={{ borderRadius: '16px', overflow: 'hidden', height: '140px', border: `1px solid ${cardBorder}`, cursor: 'pointer' }}
                          >
                            <img src={img} alt={`Screenshot ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '40px', textAlign: 'center', color: textSecondary, backgroundColor: isDark ? '#020617' : '#f8fafc', borderRadius: '16px', border: `1px solid ${cardBorder}` }}>
                        <ImageIcon size={36} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                        <p style={{ margin: 0, fontSize: '13px' }}>No screenshot gallery uploaded yet for this project.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: DOCUMENTS */}
                {activeTabDetail === 'documents' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 900, margin: '0 0 12px 0' }}>Uploaded Documents & Attachments</h4>
                    {documentList.length > 0 ? (
                      documentList.map((doc, idx) => {
                        const name = typeof doc === 'string' ? `Document ${idx+1}` : doc.name;
                        const url = typeof doc === 'string' ? doc : doc.url;
                        return (
                          <div key={idx} style={{ padding: '14px 18px', borderRadius: '14px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <FileText size={20} style={{ color: '#6366f1' }} />
                              <span style={{ fontSize: '13.5px', fontWeight: 800, color: textPrimary }}>{name}</span>
                            </div>
                            <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noreferrer" style={{ padding: '6px 14px', borderRadius: '10px', backgroundColor: '#6366f1', color: '#fff', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}>
                              Open Document
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: textSecondary, fontStyle: 'italic' }}>No project documentation files attached.</p>
                    )}
                  </div>
                )}

                {/* TAB 5: ARCHITECTURE */}
                {activeTabDetail === 'architecture' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', color: '#6366f1', margin: '0 0 8px 0' }}>System Architecture</h4>
                      <p style={{ fontSize: '13.5px', color: textPrimary, lineHeight: 1.6 }}>{p.architecture || 'Modular full-stack application built using React, Vite, Express REST API, and Neon Cloud Serverless PostgreSQL.'}</p>
                    </div>

                    {p.challenges && (
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', color: '#f59e0b', margin: '0 0 8px 0' }}>Challenges Faced</h4>
                        <p style={{ fontSize: '13.5px', color: textPrimary, lineHeight: 1.6 }}>{p.challenges}</p>
                      </div>
                    )}

                    {p.futureImprovements && (
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', color: '#06b6d4', margin: '0 0 8px 0' }}>Future Roadmap</h4>
                        <p style={{ fontSize: '13.5px', color: textPrimary, lineHeight: 1.6 }}>{p.futureImprovements}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 6: COMMENTS / DISCUSSION */}
                {activeTabDetail === 'comments' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Add Comment Input */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        value={newCommentInput}
                        onChange={e => setNewCommentInput(e.target.value)}
                        placeholder="Leave feedback or comment..."
                        style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary, fontSize: '13.5px', outline: 'none' }}
                      />
                      <button
                        onClick={() => {
                          addCommentToProject(p.id, newCommentInput);
                          setNewCommentInput('');
                        }}
                        style={{ padding: '12px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
                      >
                        Post
                      </button>
                    </div>

                    {/* Comments Feed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(p.comments || []).length > 0 ? (
                        p.comments.map(cmt => (
                          <div key={cmt.id} style={{ padding: '14px 16px', borderRadius: '14px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: '#6366f1' }}>{cmt.author}</span>
                              <span style={{ fontSize: '11px', color: textSecondary }}>{new Date(cmt.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p style={{ fontSize: '13px', color: textPrimary, margin: 0, lineHeight: 1.5 }}>{cmt.text}</p>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: textSecondary, fontStyle: 'italic', margin: 0 }}>No comments yet. Be the first to leave feedback!</p>
                      )}
                    </div>

                  </div>
                )}

              </div>

              {/* View Details Drawer Bottom Action Bar */}
              <div style={{ padding: '18px 28px', borderTop: `1px solid ${cardBorder}`, backgroundColor: isDark ? '#020617' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(user?.isAdmin || p.ownerId === (user?.id || user?.email) || p.ownerName === user?.name) && (
                    <>
                      <button
                        onClick={(e) => handleOpenEditProject(p, e)}
                        style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: 'rgba(99,102,241,0.15)', color: '#6366f1', border: 'none', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={(e) => handleOpenAssignModal(p, e)}
                        style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: 'none', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <UserPlus size={14} /> Assign Team
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const isArchiving = p.status !== 'archived';
                          await archiveProjectById(p.id, isArchiving);
                          showToast(isArchiving ? `Project "${p.title}" archived.` : `Project "${p.title}" restored.`);
                        }}
                        style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: 'rgba(234,179,8,0.15)', color: '#eab308', border: 'none', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Archive size={14} /> {p.status === 'archived' ? 'Restore' : 'Archive'}
                      </button>
                      <button
                        onClick={(e) => handleOpenDeleteModal(p, e)}
                        style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => handleOpenShareModal(p, e)}
                    style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: 'rgba(168,85,247,0.15)', color: '#a855f7', border: 'none', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Share2 size={14} /> Share
                  </button>
                </div>
                <button
                  onClick={() => setActiveProjectModal(null)}
                  style={{ padding: '8px 18px', borderRadius: '10px', border: `1px solid ${cardBorder}`, background: 'none', color: textSecondary, fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}
                >
                  Close Drawer
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 5. SHARE PROJECT MODAL (BUTTON 3)                                       */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {shareModalProject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '24px', maxWidth: '480px', width: '100%', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}>
            <button
              onClick={() => setShareModalProject(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ padding: '10px', borderRadius: '14px', backgroundColor: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
                <Share2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: textPrimary }}>Share Project</h3>
                <span style={{ fontSize: '12px', color: textSecondary }}>"{shareModalProject.title}"</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => {
                  const link = `${window.location.origin}/projects/${shareModalProject.id}`;
                  navigator.clipboard.writeText(link);
                  showToast('Project link copied to clipboard!');
                  logProjectAction('SHARE_COPY_LINK', shareModalProject.id);
                }}
                style={{ padding: '12px 16px', borderRadius: '14px', border: `1px solid ${cardBorder}`, backgroundColor: isDark ? '#020617' : '#f8fafc', color: textPrimary, fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link size={16} style={{ color: '#6366f1' }} />
                  <span>Copy Internal Link</span>
                </div>
                <Copy size={15} style={{ color: textSecondary }} />
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareModalProject.id);
                  showToast(`Project ID (${shareModalProject.id}) copied!`);
                  logProjectAction('SHARE_COPY_ID', shareModalProject.id);
                }}
                style={{ padding: '12px 16px', borderRadius: '14px', border: `1px solid ${cardBorder}`, backgroundColor: isDark ? '#020617' : '#f8fafc', color: textPrimary, fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Code2 size={16} style={{ color: '#06b6d4' }} />
                  <span>Copy Project ID ({shareModalProject.id})</span>
                </div>
                <Copy size={15} style={{ color: textSecondary }} />
              </button>

              {(shareModalProject.github || shareModalProject.githubUrl) && (
                <button
                  onClick={() => {
                    const url = shareModalProject.github || shareModalProject.githubUrl;
                    navigator.clipboard.writeText(url.startsWith('http') ? url : `https://${url}`);
                    showToast('GitHub URL copied to clipboard!');
                    logProjectAction('SHARE_COPY_GITHUB', shareModalProject.id);
                  }}
                  style={{ padding: '12px 16px', borderRadius: '14px', border: `1px solid ${cardBorder}`, backgroundColor: isDark ? '#020617' : '#f8fafc', color: textPrimary, fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Github size={16} />
                    <span>Copy GitHub Repository Link</span>
                  </div>
                  <Copy size={15} style={{ color: textSecondary }} />
                </button>
              )}

              {(shareModalProject.liveDemo || shareModalProject.live) && (
                <button
                  onClick={() => {
                    const url = shareModalProject.liveDemo || shareModalProject.live;
                    navigator.clipboard.writeText(url.startsWith('http') ? url : `https://${url}`);
                    showToast('Live Demo link copied to clipboard!');
                    logProjectAction('SHARE_COPY_DEMO', shareModalProject.id);
                  }}
                  style={{ padding: '12px 16px', borderRadius: '14px', border: `1px solid ${cardBorder}`, backgroundColor: isDark ? '#020617' : '#f8fafc', color: textPrimary, fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ExternalLink size={16} style={{ color: '#22c55e' }} />
                    <span>Copy Live Demo Link</span>
                  </div>
                  <Copy size={15} style={{ color: textSecondary }} />
                </button>
              )}

              <a
                href={`mailto:?subject=${encodeURIComponent(`Project: ${shareModalProject.title}`)}&body=${encodeURIComponent(`Check out ${shareModalProject.title}:\n\n${shareModalProject.description || ''}`)}`}
                style={{ padding: '12px 16px', borderRadius: '14px', border: `1px solid ${cardBorder}`, backgroundColor: isDark ? '#020617' : '#f8fafc', color: textPrimary, fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} style={{ color: '#eab308' }} />
                  <span>Share via Email</span>
                </div>
                <ExternalLink size={14} style={{ color: textSecondary }} />
              </a>

              {user?.isAdmin && (
                <button
                  onClick={() => {
                    const pubUrl = `${window.location.origin}/project.html?id=${shareModalProject.id}`;
                    navigator.clipboard.writeText(pubUrl);
                    showToast('Public Project Link generated & copied!');
                    logProjectAction('SHARE_PUBLIC_LINK', shareModalProject.id);
                  }}
                  style={{ padding: '12px 16px', borderRadius: '14px', border: `1px solid rgba(168,85,247,0.3)`, backgroundColor: 'rgba(168,85,247,0.1)', color: '#a855f7', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={16} />
                    <span>Generate Public Link (Admin)</span>
                  </div>
                  <Copy size={15} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShareModalProject(null)} style={{ padding: '10px 20px', borderRadius: '12px', border: `1px solid ${cardBorder}`, background: 'none', color: textSecondary, fontWeight: 800, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 6. DELETE CONFIRMATION DIALOG (BUTTON 6)                                */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {deleteModalProject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '24px', maxWidth: '460px', width: '100%', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}>
            <button
              onClick={() => setDeleteModalProject(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                <Trash2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: textPrimary }}>Delete Project</h3>
                <span style={{ fontSize: '12px', color: textSecondary }}>"{deleteModalProject.title}"</span>
              </div>
            </div>

            <div style={{ padding: '14px 16px', borderRadius: '14px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 700, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} /> Warning: This action cannot be undone.
              </p>
              <p style={{ fontSize: '12px', color: textSecondary, margin: 0 }}>
                Owner: <strong>{deleteModalProject.ownerName || 'Member'}</strong> • Created: {new Date(deleteModalProject.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={() => setDeleteModalProject(null)}
                style={{ padding: '10px 18px', borderRadius: '12px', border: `1px solid ${cardBorder}`, background: 'none', color: textSecondary, fontWeight: 800, cursor: 'pointer' }}
              >
                Cancel
              </button>

              <button
                onClick={() => handleConfirmDelete(false)}
                style={{ padding: '10px 18px', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 800, cursor: 'pointer' }}
              >
                Soft Delete (Archive)
              </button>

              <button
                onClick={() => handleConfirmDelete(true)}
                style={{ padding: '10px 22px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#ffffff', border: 'none', fontWeight: 900, cursor: 'pointer', boxShadow: '0 6px 18px rgba(239,68,68,0.3)' }}
              >
                {isUserAdmin(user) ? 'Permanent Delete (Admin)' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* FLOATING TOAST NOTIFICATIONS                                             */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 9999,
          padding: '14px 22px',
          borderRadius: '16px',
          backgroundColor: toast.type === 'error' ? '#ef4444' : (toast.type === 'info' ? '#6366f1' : '#10b981'),
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '13.5px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={18} />
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
};

export default Projects;
