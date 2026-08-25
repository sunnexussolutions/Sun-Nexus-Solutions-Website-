import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getProjects, addProject, updateProject, deleteProject, archiveProject, getDeletedIds, addDeletedId } from '../store/dataStore';
import { MASTER_PROJECTS, isUserInProjectTeam, normalizeMemberName, isUserAdmin, safeJsonParseArray, parseTeamMembers } from '../utils/projectsData';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Fetch projects from dataStore (Cloud SQL + LocalStorage cache)
  // We pass `user` so the fetch includes proper auth headers for role-based filtering.
  const refreshProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjects(user);
      if (data && Array.isArray(data)) {
        setDbProjects(data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshProjects();
    const handleUpdate = () => refreshProjects();
    window.addEventListener('nexus-projects-updated', handleUpdate);
    window.addEventListener('nexus-data-updated', handleUpdate);
    return () => {
      window.removeEventListener('nexus-projects-updated', handleUpdate);
      window.removeEventListener('nexus-data-updated', handleUpdate);
    };
  }, [refreshProjects]);

  // Combine seeded MASTER_PROJECTS with dynamic DB projects seamlessly with strict deduplication
  const allProjects = useMemo(() => {
    const combined = [...dbProjects];
    const seenIds = new Set();
    const seenTitles = new Set();

    const normalizeTitle = (t) => {
      if (!t) return '';
      return String(t)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();
    };

    dbProjects.forEach(p => {
      if (p.id) seenIds.add(String(p.id).toLowerCase());
      if (p.title) seenTitles.add(normalizeTitle(p.title));
    });

    // Admin Panel projects depend strictly on Neon DB (Single Source of Truth)

    // Final strict array deduplication & field normalization (excluding deleted IDs)
    const finalProjects = [];
    const finalSeenIds = new Set();
    const finalSeenTitles = new Set();
    const deletedSet = getDeletedIds();

    combined.forEach(p => {
      const pId = String(p.id || '').toLowerCase().trim();
      const pTitleNorm = normalizeTitle(p.title);

      if (pId && deletedSet.has(pId)) return;
      if (pId && finalSeenIds.has(pId)) return;
      if (pTitleNorm && finalSeenTitles.has(pTitleNorm)) return;

      if (pId) finalSeenIds.add(pId);
      if (pTitleNorm) finalSeenTitles.add(pTitleNorm);

      const parsedTech = safeJsonParseArray(p.tech_stack || p.techStack || p.tech);
      const parsedFeatures = safeJsonParseArray(p.features);
      const parsedScreenshots = safeJsonParseArray(p.screenshots);
      const parsedDocuments = safeJsonParseArray(p.documents);
      const parsedTeam = parseTeamMembers(p.team_members || p.teamMembers || p.team);

      const normalizedProj = {
        ...p,
        title: p.title || 'Untitled Project',
        description: p.description || p.desc || p.details || p.summary || '',
        desc: p.description || p.desc || p.summary || '',
        completion: Number(p.completion || p.completion_percentage || 0),
        status: p.status || 'in_progress',
        category: p.category || 'Advanced',
        domain: p.domain || 'Engineering',
        ownerId: p.owner_id || p.ownerId || 'user_anon',
        ownerName: p.owner_name || p.ownerName || 'Member',
        github: p.github_url || p.github || p.githubUrl || '',
        githubUrl: p.github_url || p.github || p.githubUrl || '',
        liveDemo: p.live_demo_url || p.live_demo || p.liveDemo || p.live || '',
        liveDemoUrl: p.live_demo_url || p.live_demo || p.liveDemo || p.live || '',
        live: p.live_demo_url || p.live_demo || p.liveDemo || p.live || '',
        techStack: parsedTech,
        tech: parsedTech,
        teamMembers: parsedTeam,
        team: parsedTeam,
        features: parsedFeatures,
        screenshots: parsedScreenshots,
        documents: parsedDocuments
      };

      finalProjects.push(normalizedProj);
    });

    return finalProjects;
  }, [dbProjects]);

  // Projects belonging to or attributed to current logged-in user
  const myProjects = useMemo(() => {
    if (!user) return [];
    const uId = String(user.id || user.email || '').toLowerCase().trim();

    return allProjects.filter(p => {
      const pOwnerId = String(p.ownerId || p.owner_id || '').toLowerCase().trim();
      const pOwnerName = String(p.ownerName || p.owner_name || '').toLowerCase().trim();
      const uName = String(user.name || user.firstName || user.username || '').toLowerCase().trim();

      if (pOwnerId && (pOwnerId === uId || pOwnerId === String(user.email || '').toLowerCase().trim())) return true;
      if (uName && pOwnerName && (pOwnerName.includes(uName) || uName.includes(pOwnerName))) return true;

      // Check if user is in assigned team members array
      if (isUserInProjectTeam(user, p)) return true;

      return false;
    });
  }, [user, allProjects]);

  // Projects visible to the currently logged in user based on ROLE
  const visibleProjects = useMemo(() => {
    if (!user) return [];
    if (isUserAdmin(user)) {
      // ADMIN: Sees ALL system projects
      return allProjects;
    }
    // MEMBER: Sees ONLY owned or assigned team projects
    return myProjects;
  }, [user, allProjects, myProjects]);

  // Real-time project statistics counters (Role-Scoped)
  const projectStats = useMemo(() => {
    const targetSet = isUserAdmin(user) ? allProjects : myProjects;
    let total = targetSet.length;
    let completed = 0;
    let inProgress = 0;
    let planning = 0;
    let archived = 0;

    targetSet.forEach(p => {
      const s = (p.status || '').toLowerCase().trim();
      if (s === 'completed') completed++;
      else if (s === 'in_progress' || s === 'ongoing') inProgress++;
      else if (s === 'planning') planning++;
      else if (s === 'archived') archived++;
      else inProgress++;
    });

    return { total, completed, inProgress, planning, archived };
  }, [user, allProjects, myProjects]);

  // My Project Statistics (Member specific)
  const myProjectStats = useMemo(() => {
    let total = myProjects.length;
    let completed = 0;
    let inProgress = 0;
    let planning = 0;
    let archived = 0;

    myProjects.forEach(p => {
      const s = (p.status || '').toLowerCase().trim();
      if (s === 'completed') completed++;
      else if (s === 'in_progress' || s === 'ongoing') inProgress++;
      else if (s === 'planning') planning++;
      else if (s === 'archived') archived++;
      else inProgress++;
    });

    return { total, completed, inProgress, planning, archived };
  }, [myProjects]);

  // Action: Create Project with Zero-Trust Owner Attribution
  const createNewProject = useCallback(async (projectData) => {
    const ownerId = user?.id || user?.email || 'user_anon';
    const ownerName = user?.name || user?.firstName || 'Member';
    const ownerAvatar = user?.avatar || '';

    const fullProject = {
      ...projectData,
      ownerId,
      ownerName,
      ownerAvatar,
      createdBy: ownerId,
      status: projectData.status || 'in_progress',
      completion: Number(projectData.completion) || (projectData.status === 'completed' ? 100 : 50),
      teamMembers: projectData.teamMembers || [{ name: ownerName }],
      team: projectData.teamMembers || [{ name: ownerName }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDbProjects(prev => [fullProject, ...prev]);

    try {
      const saved = await addProject(fullProject);
      refreshProjects();
      return saved;
    } catch (err) {
      console.error('Create project error:', err);
    }
  }, [user, refreshProjects]);

  // Action: Edit / Update Project (Permission Guarded)
  const updateExistingProject = useCallback(async (id, updates) => {
    const target = allProjects.find(p => String(p.id) === String(id));
    
    // Member permission guard: Cannot edit another member's project unless Admin
    if (!isUserAdmin(user) && target && target.ownerId) {
      const uId = String(user?.id || user?.email || '').toLowerCase().trim();
      const oId = String(target.ownerId || '').toLowerCase().trim();
      const oName = String(target.ownerName || '').toLowerCase().trim();
      const uName = String(user?.name || user?.username || '').toLowerCase().trim();
      if (uId !== oId && (!uName || !oName.includes(uName))) {
        alert('Permission Denied: You cannot edit another member\'s project.');
        return;
      }
    }

    const updatedData = { ...updates, id, updatedAt: new Date().toISOString() };

    setDbProjects(prev => {
      const exists = prev.some(p => String(p.id) === String(id));
      if (exists) {
        return prev.map(p => String(p.id) === String(id) ? { ...p, ...updatedData } : p);
      }
      return [{ ...(target || {}), ...updatedData }, ...prev];
    });

    if (activeProjectModal && String(activeProjectModal.id) === String(id)) {
      setActiveProjectModal(prev => ({ ...prev, ...updatedData }));
    }

    try {
      await updateProject(updatedData);
      refreshProjects();
    } catch (err) {
      console.error('Update project error:', err);
    }
  }, [user, allProjects, activeProjectModal, refreshProjects]);

  // Action: Delete Project (Permission Guarded)
  const deleteProjectById = useCallback(async (id, isHardDelete = false) => {
    const target = allProjects.find(p => String(p.id) === String(id));

    // Member permission guard: Cannot delete another member's project unless Admin
    if (!isUserAdmin(user) && target && target.ownerId) {
      const uId = String(user?.id || user?.email || '').toLowerCase().trim();
      const oId = String(target.ownerId || '').toLowerCase().trim();
      const oName = String(target.ownerName || '').toLowerCase().trim();
      const uName = String(user?.name || user?.username || '').toLowerCase().trim();
      if (uId !== oId && (!uName || !oName.includes(uName))) {
        alert('Permission Denied: You cannot delete another member\'s project.');
        return;
      }
    }

    addDeletedId(id, target?.title);
    setDbProjects(prev => prev.filter(p => String(p.id) !== String(id)));
    if (activeProjectModal && String(activeProjectModal.id) === String(id)) {
      setActiveProjectModal(null);
    }

    try {
      await deleteProject(id, isHardDelete, target?.title);
      refreshProjects();
    } catch (err) {
      console.error('Delete project error:', err);
    }
  }, [user, allProjects, activeProjectModal, refreshProjects]);

  // Action: Admin Ownership Transfer
  const transferOwnership = useCallback(async (projectId, newOwnerId, newOwnerName) => {
    if (!isUserAdmin(user)) {
      alert('Permission Denied: Only administrators can transfer project ownership.');
      return;
    }

    await updateExistingProject(projectId, {
      ownerId: newOwnerId,
      ownerName: newOwnerName
    });
  }, [user, updateExistingProject]);

  // Action: Admin / Owner Assign Team Members
  const assignTeamMembers = useCallback(async (projectId, newTeamMembers) => {
    const isAdmin = isUserAdmin(user);
    const target = allProjects.find(p => String(p.id) === String(projectId));
    const isOwner = target && (
      target.ownerId === user?.id ||
      target.ownerId === user?.email ||
      target.ownerName === user?.name
    );

    if (!isAdmin && !isOwner) {
      alert('Permission Denied: Only administrators or project owners can assign team members.');
      return;
    }

    await updateExistingProject(projectId, {
      teamMembers: newTeamMembers,
      team: newTeamMembers
    });
  }, [user, allProjects, updateExistingProject]);

  // Action: Archive Project
  const archiveProjectById = useCallback(async (id, archiveState = true) => {
    const newStatus = archiveState ? 'archived' : 'in_progress';
    setDbProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));

    try {
      await archiveProject(id, archiveState);
      refreshProjects();
    } catch (err) {
      console.error('Archive project error:', err);
    }
  }, [refreshProjects]);

  // Action: Like Project
  const likeProjectById = useCallback(async (id) => {
    setDbProjects(prev => prev.map(p => {
      if (p.id === id) {
        const newLikes = (p.likes || 0) + 1;
        if (activeProjectModal?.id === id) {
          setActiveProjectModal(curr => ({ ...curr, likes: newLikes }));
        }
        updateProject({ ...p, likes: newLikes });
        return { ...p, likes: newLikes };
      }
      return p;
    }));
  }, [activeProjectModal]);

  // Action: Add Comment to Project
  const addCommentToProject = useCallback(async (id, commentText) => {
    if (!commentText || !commentText.trim()) return;
    const authorName = user?.name || user?.firstName || 'Anonymous';

    const newComment = {
      id: `cmt_${Date.now()}`,
      author: authorName,
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    setDbProjects(prev => prev.map(p => {
      if (p.id === id) {
        const comments = [newComment, ...(p.comments || [])];
        if (activeProjectModal?.id === id) {
          setActiveProjectModal(curr => ({ ...curr, comments }));
        }
        updateProject({ ...p, comments });
        return { ...p, comments };
      }
      return p;
    }));
  }, [user, activeProjectModal]);

  // Helper to check if current user can modify project
  const canModifyProject = useCallback((project) => {
    if (!user || !project) return false;
    if (isUserAdmin(user)) return true;
    const uId = String(user.id || user.email || '').toLowerCase().trim();
    const ownerId = String(project.ownerId || project.user_id || '').toLowerCase().trim();
    if (uId && ownerId && uId === ownerId) return true;

    const uName = (user.name || user.firstName || '').toLowerCase().trim();
    if (uName && project.ownerName && project.ownerName.toLowerCase().trim() === uName) return true;

    return false;
  }, [user]);

  const value = {
    projects: visibleProjects,
    allProjects,
    myProjects,
    projectStats,
    myProjectStats,
    loading,
    refreshProjects,
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
    setActiveProjectModal,
    isEditModalOpen,
    setIsEditModalOpen,
    editingProject,
    setEditingProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

