import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030014]/60 light:bg-slate-50/60 backdrop-blur-xl border-b border-white/5 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white light:text-slate-900 font-outfit">
            SkillPrep<span className="text-indigo-400">.AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-350 light:text-slate-600">
          <a href="#features" className="hover:text-white light:hover:text-indigo-650 transition-colors text-sm">Features</a>
          <a href="#workflow" className="hover:text-white light:hover:text-indigo-650 transition-colors text-sm">AI Agent Engine</a>
          <a href="#testimonials" className="hover:text-white light:hover:text-indigo-650 transition-colors text-sm">Success Stories</a>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900/60 light:bg-slate-200/50 border border-slate-800/40 light:border-slate-300/60 text-slate-400 hover:text-white light:hover:text-indigo-650 transition-all shadow"
            title="Toggle color theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-800 light:border-slate-300">
              <Link
                to="/dashboard"
                className="text-sm px-5 py-2.5 rounded-xl bg-indigo-605/90 hover:bg-indigo-550 text-white font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/20"
              >
                Launch Dashboard
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-sm text-slate-400 hover:text-rose-450 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-800 light:border-slate-300">
              <Link to="/login" className="hover:text-white light:hover:text-indigo-650 transition-colors text-sm">
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburguer and Theme buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900/60 light:bg-slate-200/50 border border-slate-850/40 light:border-slate-300 text-slate-400 hover:text-white light:hover:text-indigo-650"
          >
            {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-400 hover:text-white light:hover:text-slate-900 focus:outline-none transition-colors"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-900 light:border-slate-200 bg-[#030014]/95 light:bg-slate-50/95 backdrop-blur-2xl p-6 space-y-4 animate-scale-in">
          <a href="#features" onClick={() => setIsOpen(false)} className="block text-slate-300 light:text-slate-650 hover:text-white light:hover:text-indigo-650 text-base py-2">Features</a>
          <a href="#workflow" onClick={() => setIsOpen(false)} className="block text-slate-300 light:text-slate-650 hover:text-white light:hover:text-indigo-650 text-base py-2">AI Agent Engine</a>
          <a href="#testimonials" onClick={() => setIsOpen(false)} className="block text-slate-300 light:text-slate-650 hover:text-white light:hover:text-indigo-650 text-base py-2">Success Stories</a>
          
          <div className="pt-4 border-t border-slate-900 light:border-slate-200 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); setIsOpen(false); }}
                  className="w-full text-center py-3 rounded-xl border border-slate-800 light:border-slate-300 text-slate-400 hover:text-rose-400"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-xl border border-slate-800 light:border-slate-300 text-slate-300 light:text-slate-650 hover:text-white light:hover:text-indigo-650 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
