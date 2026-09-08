import { storage } from './storage/storageAdapter';
import { STORAGE_KEYS } from './storage/storageKeys';

export const DEFAULT_HOME_CONTENT = {
  heroTitle: "Nexus Hub",
  heroSubtitle: "Engineered for excellence in DSA, Aptitude, Projects & Career Placements.",
  ctaText: "Explore Platform",
  bannerNotice: "Live Placement Accelerator batch active. Check out DSA sheets!"
};

export const DEFAULT_STAT_CARDS = [
  { id: 'stat_1', label: 'Active Learners', value: '1,250+', color: '#2872A1' },
  { id: 'stat_2', label: 'Problems Solved', value: '45,000+', color: '#4A90C2' },
  { id: 'stat_3', label: 'Mock Assessments', value: '3,800+', color: '#10B981' },
  { id: 'stat_4', label: 'Placement Offers', value: '180+', color: '#F59E0B' }
];

export const getHomeContent = async () => {
  return storage.get(STORAGE_KEYS.HOME_CONTENT, DEFAULT_HOME_CONTENT);
};

export const saveHomeContent = async (content) => {
  storage.set(STORAGE_KEYS.HOME_CONTENT, content);
};

export const getStatCards = async () => {
  return storage.get(STORAGE_KEYS.STAT_CARDS, DEFAULT_STAT_CARDS);
};

export const saveStatCards = async (cards) => {
  storage.set(STORAGE_KEYS.STAT_CARDS, cards);
};
