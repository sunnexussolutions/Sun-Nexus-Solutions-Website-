import React, { useState, useEffect } from 'react';
import {
  BarChart3, Palette, TrendingUp, BrainCircuit, Code2, FileText,
  Layers, Rocket, GraduationCap, Users, MessageSquare, ShieldCheck, CheckCircle2
} from 'lucide-react';
import {
  getAssessments, addAssessment, updateAssessment, deleteAssessment,
  getUsers, getResults, deleteResult, deleteUser, updateUserStatus,
  getDiscussions, addDiscussion, deleteDiscussion,
  getProjects, addProject, updateProject, deleteProject, archiveProject,
  getDomains, getProjectRequirements, deleteProjectRequirement, updateProjectRequirementStatus,
  getAlumni, addAlumnus, updateAlumnus, deleteAlumnus,
  getHomeContent, saveHomeContent,
  getStatCards, saveStatCards
} from '../store';
import AdminOverviewTab from './admin/tabs/AdminOverviewTab';
import AdminAssessmentsTab from './admin/tabs/AdminAssessmentsTab';
import AdminDSATab from './AdminDSATab';
import AdminUsersTab from './admin/tabs/AdminUsersTab';
import AdminSubmissionsTab from './admin/tabs/AdminSubmissionsTab';
import AdminProjectsTab from './admin/tabs/AdminProjectsTab';
import AdminDiscussionsTab from './admin/tabs/AdminDiscussionsTab';
import AdminInquiriesTab from './admin/tabs/AdminInquiriesTab';
import AdminAlumniTab from './admin/tabs/AdminAlumniTab';
import AdminHomePageTab from './admin/tabs/AdminHomePageTab';
import AdminStatCardsTab from './admin/tabs/AdminStatCardsTab';
import AdminDomainsTab from './admin/tabs/AdminDomainsTab';
import { prepareUserChartData, prepareCollectiveChartData } from '../utils/analytics';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import UnderProgress from '../components/UnderProgress';

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: BarChart3 },
  { id: 'assessments',   label: 'Assessments',   icon: BrainCircuit },
  { id: 'dsa',           label: 'DSA Sheet',     icon: Code2 },
  { id: 'users',         label: 'Users',         icon: Users },
  { id: 'submissions',   label: 'Submissions',   icon: FileText },
  { id: 'projects',      label: 'Projects',      icon: Rocket },
  { id: 'discussions',   label: 'Discussions',   icon: MessageSquare },
  { id: 'inquiries',     label: 'Inquiries',     icon: ShieldCheck },
  { id: 'alumni',        label: 'Alumni',        icon: GraduationCap },
  { id: 'home_content',  label: 'Home Page',     icon: Palette },
  { id: 'stat_cards',    label: 'Stat Cards',    icon: TrendingUp },
  { id: 'domains',       label: 'Domains',       icon: Layers },
];

/**
 * ── Admin (Lightweight Coordinator) ─────────────────────────────────
 * Clean orchestrator for all administrative sub-modules.
 */
export default function Admin() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('overview');
  const [assessments, setAssessments] = useState([]);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [domains, setDomains] = useState([]);
  const [homeContent, setHomeContent] = useState({});
  const [statCards, setStatCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        assList, userList, resList, discList,
        projList, alumList, inqList, domList,
        hContent, sCards
      ] = await Promise.all([
        getAssessments(),
        getUsers(),
        getResults(),
        getDiscussions(),
        getProjects(),
        getAlumni(),
        getProjectRequirements(),
        getDomains(),
        getHomeContent(),
        getStatCards()
      ]);

      setAssessments(assList || []);
      setUsers(userList || []);
      setResults(resList || []);
      setDiscussions(discList || []);
      setProjects(projList || []);
      setAlumni(alumList || []);
      setInquiries(inqList || []);
      setDomains(domList || []);
      setHomeContent(hContent || {});
      setStatCards(sCards || []);
    } catch (err) {
      console.error('[Admin] Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!user?.isAdmin) {
    return <UnderProgress page="Admin System" />;
  }

  const userChartData = prepareUserChartData(results);
  const collectiveChartData = prepareCollectiveChartData(results, assessments);

  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const cardBg = isDark ? '#0E2740' : '#FFFFFF';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', fontFamily: "'Poppins', sans-serif" }}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            padding: '12px 20px',
            borderRadius: '12px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Nav & Tab Switcher */}
      <div
        style={{
          padding: '18px 22px',
          borderRadius: '18px',
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 10px rgba(13, 27, 42, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 900, color: textColor }}>
              Nexus Hub Administration Control Center
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
              Manage curriculum, problems, users, client requirements, projects, and broadcasts.
            </p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: active ? 700 : 500,
                  backgroundColor: active ? '#2872A1' : (isDark ? '#0B1F33' : '#EFF6FB'),
                  color: active ? '#FFFFFF' : (isDark ? '#CBDDE9' : '#334155'),
                  border: `1px solid ${active ? '#2872A1' : borderColor}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Sub-Tab */}
      {activeTab === 'overview' && (
        <AdminOverviewTab
          users={users}
          assessments={assessments}
          results={results}
          discussions={discussions}
          projects={projects}
          alumni={alumni}
          inquiries={inquiries}
          userChartData={userChartData}
          collectiveChartData={collectiveChartData}
          onSelectMetric={(mId) => {
            if (mId === 'assessments') setActiveTab('assessments');
            else if (mId === 'users' || mId === 'pending') setActiveTab('users');
            else if (mId === 'submissions') setActiveTab('submissions');
            else if (mId === 'projects') setActiveTab('projects');
            else if (mId === 'discussions') setActiveTab('discussions');
            else if (mId === 'alumni') setActiveTab('alumni');
            else if (mId === 'inquiries') setActiveTab('inquiries');
          }}
          isDark={isDark}
        />
      )}

      {activeTab === 'assessments' && (
        <AdminAssessmentsTab
          assessments={assessments}
          onSaveAssessment={async (payload) => {
            if (payload.id) {
              await updateAssessment(payload);
              showToast('Assessment updated successfully.');
            } else {
              await addAssessment(payload);
              showToast('Assessment created successfully.');
            }
            loadData();
          }}
          onDeleteAssessment={async (id) => {
            await deleteAssessment(id);
            showToast('Assessment deleted.');
            loadData();
          }}
          isDark={isDark}
        />
      )}

      {activeTab === 'dsa' && (
        <AdminDSATab />
      )}

      {activeTab === 'users' && (
        <AdminUsersTab
          users={users}
          onUpdateUserStatus={async (id, status) => {
            await updateUserStatus(id, status);
            showToast(`User status updated to ${status}.`);
            loadData();
          }}
          onDeleteUser={async (id) => {
            await deleteUser(id);
            showToast('User account deleted.');
            loadData();
          }}
          isDark={isDark}
        />
      )}

      {activeTab === 'submissions' && (
        <AdminSubmissionsTab
          results={results}
          onDeleteResult={async (id, aId, topic, uId, email) => {
            await deleteResult(id, aId, topic, uId, email);
            showToast('Submission deleted.');
            loadData();
          }}
          isDark={isDark}
        />
      )}

      {activeTab === 'projects' && (
        <AdminProjectsTab
          projects={projects}
          onSaveProject={async (p) => {
            if (p.id) {
              await updateProject(p);
              showToast('Project updated successfully.');
            } else {
              await addProject(p);
              showToast('Project created successfully.');
            }
            loadData();
          }}
          onDeleteProject={async (id) => {
            await deleteProject(id);
            showToast('Project deleted.');
            loadData();
          }}
          onArchiveProject={async (id, isArchived) => {
            await archiveProject(id, isArchived);
            showToast(isArchived ? 'Project archived.' : 'Project restored.');
            loadData();
          }}
          isDark={isDark}
        />
      )}

      {activeTab === 'discussions' && (
        <AdminDiscussionsTab
          discussions={discussions}
          onAddDiscussion={async (post) => {
            await addDiscussion(post);
            showToast('Discussion broadcast published.');
            loadData();
          }}
          onDeleteDiscussion={async (id) => {
            await deleteDiscussion(id);
            showToast('Discussion thread deleted.');
            loadData();
          }}
          isDark={isDark}
        />
      )}

      {activeTab === 'inquiries' && (
        <AdminInquiriesTab
          inquiries={inquiries}
          onUpdateStatus={async (id, status) => {
            await updateProjectRequirementStatus(id, status);
            showToast(`Inquiry status set to ${status}.`);
            loadData();
          }}
          onDeleteInquiry={async (id) => {
            await deleteProjectRequirement(id);
            showToast('Inquiry lead deleted.');
            loadData();
          }}
          isDark={isDark}
        />
      )}

      {activeTab === 'alumni' && (
        <AdminAlumniTab
          alumni={alumni}
          onSaveAlumnus={async (a) => {
            if (a.id) {
              await updateAlumnus(a);
              showToast('Alumnus updated.');
            } else {
              await addAlumnus(a);
              showToast('Alumnus added.');
            }
            loadData();
          }}
          onDeleteAlumnus={async (id) => {
            await deleteAlumnus(id);
            showToast('Alumnus removed.');
            loadData();
          }}
          isDark={isDark}
        />
      )}

      {activeTab === 'home_content' && (
        <AdminHomePageTab
          homeContent={homeContent}
          onSaveHomeContent={async (content) => {
            await saveHomeContent(content);
            showToast('Home page content updated.');
          }}
          isDark={isDark}
        />
      )}

      {activeTab === 'stat_cards' && (
        <AdminStatCardsTab
          statCards={statCards}
          onSaveStatCards={async (cards) => {
            await saveStatCards(cards);
            showToast('Stat cards updated.');
          }}
          isDark={isDark}
        />
      )}

      {activeTab === 'domains' && (
        <AdminDomainsTab
          domains={domains}
          isDark={isDark}
        />
      )}
    </div>
  );
}
