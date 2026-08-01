import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Braces, 
  Target, 
  Users, 
  FolderKanban, 
  User, 
  ShieldCheck 
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'dsa', label: 'DSA', icon: Braces, badge: 'New' },
  { id: 'aptitude', label: 'Aptitude', icon: Target },
  // { id: 'domains', label: 'Domains', icon: Users },
  // { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'profile', label: 'Profile', icon: User, badge: 'Updated' },
  { id: 'admin', label: 'Admin Panel', icon: ShieldCheck },
];

interface PixelPerfectSidebarNavProps {
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export const PixelPerfectSidebarNav: React.FC<PixelPerfectSidebarNavProps> = ({
  activeId = 'profile',
  onSelect,
  className = '',
}) => {
  const [selectedId, setSelectedId] = useState<string>(activeId);

  const handleItemClick = (id: string) => {
    setSelectedId(id);
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <div
      className={`w-full max-w-[280px] bg-white dark:bg-[#0f111a] p-4 rounded-2xl font-sans select-none ${className}`}
      style={{
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.03)',
      }}
    >
      <nav className="flex flex-col gap-2.5 w-full">
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = selectedId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                group relative flex items-center justify-between w-full h-[52px] px-4 rounded-[14px] 
                transition-all duration-200 ease-in-out cursor-pointer border-none outline-none
                ${
                  isActive
                    ? 'bg-[#f3e8ff] dark:bg-[#2b1845] text-[#6d28d9] dark:text-[#c4b5fd] font-bold shadow-sm'
                    : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-[#1e1b4b] dark:text-slate-200 font-semibold'
                }
              `}
            >
              {/* Left Side: Icon & Title */}
              <div className="flex items-center gap-3.5 min-w-0 overflow-hidden">
                <IconComponent
                  size={22}
                  strokeWidth={2.2}
                  className={`
                    flex-shrink-0 transition-colors duration-200
                    ${
                      isActive
                        ? 'text-[#6d28d9] dark:text-[#c4b5fd]'
                        : 'text-[#1e1b4b] dark:text-slate-300 group-hover:text-[#6d28d9] dark:group-hover:text-[#c4b5fd]'
                    }
                  `}
                />
                <span className="text-[15px] tracking-[-0.01em] truncate leading-none">
                  {item.label}
                </span>
              </div>

              {/* Right Side: Optional Badge (New / Updated) */}
              {item.badge && (
                <span
                  className={`
                    flex-shrink-0 ml-2 px-2.5 py-0.5 rounded-[8px] text-[11.5px] font-bold tracking-tight leading-normal
                    border transition-colors duration-200
                    ${
                      isActive
                        ? 'bg-white dark:bg-[#1a0f2e] text-[#6d28d9] dark:text-[#c4b5fd] border-[#8b5cf6]'
                        : 'bg-white dark:bg-[#1e1b4b] text-[#7c3aed] dark:text-[#a78bfa] border-[#a78bfa]'
                    }
                  `}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default PixelPerfectSidebarNav;
