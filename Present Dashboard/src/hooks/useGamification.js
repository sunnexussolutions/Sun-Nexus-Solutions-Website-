import { useState, useEffect } from 'react';

const useGamification = () => {
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('bhargav_stats');
    return savedStats ? JSON.parse(savedStats) : {
      xp: 8420,
      level: 42,
      streak: 12,
      badges: 14,
      coursesCompleted: 8,
      projectsBuilt: 5,
    };
  });

  useEffect(() => {
    localStorage.setItem('bhargav_stats', JSON.stringify(stats));
  }, [stats]);

  const addXP = (amount) => {
    setStats(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 200); // 200 XP per level
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const completeCourse = () => {
    setStats(prev => ({ ...prev, coursesCompleted: prev.coursesCompleted + 1, xp: prev.xp + 500 }));
  };

  const buildProject = () => {
    setStats(prev => ({ ...prev, projectsBuilt: prev.projectsBuilt + 1, xp: prev.xp + 1000 }));
  };

  return { stats, addXP, completeCourse, buildProject };
};

export default useGamification;
