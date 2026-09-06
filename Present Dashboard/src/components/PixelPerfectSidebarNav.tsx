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
  icon: any;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'dsa', label: 'DSA', icon: Braces, badge: 'New' },
  { id: 'aptitude', label: 'Aptitude', icon: Target, badge: 'Updated' },
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
      className={`w-full max-w-[280px] bg-white dark:bg-[#0E2740] p-4 rounded-2xl font-sans select-none border border-[#CBDDE9] dark:border-[rgba(203,221,233,0.15)] ${className}`}
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
                    ? 'bg-gradient-to-r from-[#2872A1] to-[#4A90C2] dark:from-[rgba(40,114,161,0.38)] dark:to-[rgba(74,144,194,0.22)] text-white dark:text-[#F3F7FB] font-bold shadow-md'
                    : 'bg-transparent hover:bg-[#F3F7FB] dark:hover:bg-[rgba(40,114,161,0.15)] text-[#0D1B2A] dark:text-[#8EA6BC] font-semibold'
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
                        ? 'text-white dark:text-[#4A90C2]'
                        : 'text-[#0D1B2A] dark:text-[#8EA6BC] group-hover:text-[#2872A1] dark:group-hover:text-[#4A90C2]'
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
                        ? 'bg-white/25 dark:bg-[rgba(74,144,194,0.3)] text-white dark:text-[#F3F7FB] border-white/40 dark:border-[rgba(74,144,194,0.5)]'
                        : 'bg-[#EFF6FB] dark:bg-[rgba(40,114,161,0.25)] text-[#2872A1] dark:text-[#CBDDE9] border-[#CBDDE9] dark:border-[#4A90C2]'
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
