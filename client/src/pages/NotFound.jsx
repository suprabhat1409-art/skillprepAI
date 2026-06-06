import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { HelpCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 bg-gradient-glow flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center animate-scale-in">
        <GlassCard className="border-slate-800 p-8 shadow-2xl flex flex-col items-center">
          <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6">
            <HelpCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-extrabold font-outfit text-white tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-300 mt-2 font-outfit">Page Not Found</h2>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed">
            The page you are looking for does not exist or has been relocated by the AI orchestration agents.
          </p>
          <Link
            to="/"
            className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Safety
          </Link>
        </GlassCard>
      </div>
    </div>
  );
};

export default NotFound;
