import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import AIChatWidget from '../components/AIChatWidget';
import { Sun, Moon } from 'lucide-react';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-pink-500 animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-400 font-medium tracking-wide animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#030014] light:bg-slate-50 text-slate-105 light:text-slate-900 flex relative overflow-hidden bg-gradient-glow">
      {/* Background radial glows */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-indigo-500/10 light:bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 rounded-full bg-pink-500/5 light:bg-pink-500/3 blur-[120px] pointer-events-none"></div>

      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Pane */}
      <main 
        className={`flex-1 transition-all duration-300 min-h-screen flex flex-col ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Navbar */}
        <header className="h-20 border-b border-slate-900/60 light:border-slate-200 flex items-center justify-between px-8 bg-slate-950/20 light:bg-slate-100/10 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-white light:text-slate-900 tracking-wide font-outfit">
              Coaching Dashboard
            </h1>
            <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">Prepare with custom AI pipelines</p>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900 light:bg-slate-200 border border-slate-800 light:border-slate-300 text-slate-400 light:text-slate-600 hover:text-white light:hover:text-indigo-650 transition-colors shadow"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-250 light:text-slate-800">{user.name}</p>
              <p className="text-[10px] text-slate-450 light:text-slate-500">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-905 light:bg-slate-200 border border-slate-800 light:border-slate-300 flex items-center justify-center font-bold text-indigo-400 light:text-indigo-650 shadow-md">
              {user.name?.slice(0, 1).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Viewport page container */}
        <div className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Interactive AI advisor */}
      <AIChatWidget />
    </div>
  );
};

export default DashboardLayout;
