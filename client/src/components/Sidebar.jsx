import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  GitFork, 
  Mic, 
  TrendingUp, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  LogOut 
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/resume', label: 'Resume Analyzer', icon: FileText },
    { to: '/dashboard/skills', label: 'Skill Gap Analysis', icon: Sparkles },
    { to: '/dashboard/roadmap', label: 'Learning Roadmap', icon: GitFork },
    { to: '/dashboard/interview', label: 'AI Mock Interview', icon: Mic },
    { to: '/dashboard/progress', label: 'Progress Tracking', icon: TrendingUp },
    { to: '/dashboard/profile', label: 'Profile Settings', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-30 bg-slate-950/70 border-r border-slate-800/40 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Header Logo */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-900/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-lg tracking-tight text-white font-outfit">
                SkillPrep<span className="text-indigo-400">.AI</span>
              </span>
            )}
          </div>
        </div>

        {/* User Card */}
        {!isCollapsed && (
          <div className="p-4 mx-4 my-5 rounded-2xl bg-indigo-950/25 border border-indigo-500/10 flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white uppercase text-sm border border-indigo-400/20 shadow-md shadow-indigo-500/10">
              {user?.name?.slice(0, 2) || 'US'}
            </div>
            <div className="overflow-hidden">
              <h5 className="text-sm font-semibold text-white truncate leading-tight">{user?.name}</h5>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.targetRole || 'Placement Candidate'}</p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-3 border-t border-slate-900/60 space-y-2">
        {/* Toggle Collapse */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 p-3 text-slate-500 hover:text-slate-200 rounded-xl hover:bg-slate-900/40 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Collapse Menu</span>
            </>
          )}
        </button>

        {/* Log Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
