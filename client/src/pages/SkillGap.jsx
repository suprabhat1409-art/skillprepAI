import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { skillAPI, resumeAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Spinner, AILoader } from '../components/Loaders';
import { 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Code2, 
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend
} from 'recharts';

const TechRadar = () => (
  <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
    <svg className="w-full h-full text-indigo-500/20 light:text-indigo-600/10" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.75" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.75" />
      
      {/* Rotating sweep line */}
      <line 
        x1="50" y1="50" x2="50" y2="10" 
        stroke="url(#radarSweep)" 
        strokeWidth="2.5" 
        className="animate-radar-spin origin-[50px_50px]" 
      />

      {/* Detected targets representing tags */}
      <circle cx="65" cy="35" r="2.5" fill="#ec4899" className="animate-ping" />
      <circle cx="65" cy="35" r="2.5" fill="#ec4899" />
      <circle cx="35" cy="70" r="3" fill="#10b981" className="animate-pulse" />
      <circle cx="28" cy="40" r="2" fill="#3b82f6" />
      
      <defs>
        <linearGradient id="radarSweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const SkillGap = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [hasResume, setHasResume] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const resResume = await resumeAPI.getByUser(user.id);
      setHasResume(true);

      const res = await skillAPI.getByUser(user.id);
      setAnalysis(res.data.analysis);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (error.config.url.includes('/resume/')) {
          setHasResume(false);
        } else {
          setAnalysis(null);
        }
      } else {
        console.error(error);
        showNotification('Failed to fetch skill records', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalysis();
    }
  }, [user]);

  const handleRunAnalysis = async () => {
    if (!hasResume) {
      showNotification('Please upload your resume first', 'warning');
      navigate('/dashboard/resume');
      return;
    }

    setAnalyzing(true);
    try {
      const resResume = await resumeAPI.getByUser(user.id);
      const resumeText = resResume.data.resume.extractedSkills.join(', ');

      const res = await skillAPI.analyze({
        resumeText: resumeText || 'developer skills',
        userId: user.id
      });
      setAnalysis(res.data.analysis);
      showNotification('Skill analysis completed!', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Failed to analyze skills', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <TechRadar />
          <AILoader message="AI Skill agent is performing gap diagnostics and matching technologies..." />
        </div>
      </div>
    );
  }

  const matchedCount = analysis?.matchedSkills?.length || 0;
  const missingCount = analysis?.missingSkills?.length || 0;
  const totalSkills = matchedCount + missingCount;

  const pieData = [
    { name: 'Matched Skills', value: matchedCount || 1, color: '#10b981' },
    { name: 'Missing Gaps', value: missingCount || 1, color: '#f59e0b' }
  ];

  const barData = [
    { name: 'Core Match', Score: totalSkills > 0 ? Math.round((matchedCount / totalSkills) * 100) : 0 },
    { name: 'Target Bench', Score: 75 },
    { name: 'Average candidate', Score: 60 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold font-outfit text-white light:text-slate-900 tracking-wide">Skill Gap Analysis</h2>
        <p className="text-slate-400 light:text-slate-500 mt-1 text-sm">Review matched vs missing capabilities compared to {user?.targetRole || 'your Target Role'}</p>
      </div>

      {!analysis ? (
        // wizard card
        <GlassCard className="border-slate-800/40 light:border-indigo-150 p-12 text-center flex flex-col items-center justify-center">
          {/* Animated Tech Radar SVG */}
          <TechRadar />
          
          <h3 className="text-xl font-bold text-white light:text-slate-900 font-outfit">Run Gap Diagnostics</h3>
          <p className="text-slate-400 light:text-slate-500 text-xs mt-2 max-w-sm leading-relaxed">
            Our AI analysis crawls your target role requirements and compares them to your uploaded experience.
          </p>
          <button
            onClick={handleRunAnalysis}
            className="mt-6 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl transition-all hover:scale-[1.02]"
          >
            Start Diagnostics
          </button>
        </GlassCard>
      ) : (
        // Results & Graphs
        <div className="space-y-8">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="border-slate-800/40 light:border-indigo-150">
              <h4 className="text-sm font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider mb-4 font-outfit">Gap Ratio Breakdown</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-glass)' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="border-slate-800/40 light:border-indigo-150">
              <h4 className="text-sm font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider mb-4 font-outfit">Interview Score Benchmark</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-glass)' }} />
                    <Bar dataKey="Score" radius={[8, 8, 0, 0]}>
                      <Cell fill="#6366f1" />
                      <Cell fill="#ec4899" />
                      <Cell fill="#3b82f6" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Tag Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Matched skills */}
            <GlassCard className="border-slate-800/40 light:border-indigo-150">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-md font-bold text-white light:text-slate-800 font-outfit">Matched Competencies</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedSkills.map((sk) => (
                  <span key={sk} className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    {sk}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Missing Gaps */}
            <GlassCard className="border-slate-800/40 light:border-indigo-150">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-amber-500" />
                <h4 className="text-md font-bold text-white light:text-slate-800 font-outfit">Identified Missing Gaps</h4>
              </div>
              {analysis.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((sk) => (
                    <span key={sk} className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Perfect match! No gaps found.</p>
              )}
            </GlassCard>
          </div>

          {/* AI Recommended Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Courses */}
            <GlassCard className="border-slate-800/40 light:border-indigo-150">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h4 className="text-md font-bold text-white light:text-slate-800 font-outfit">Suggested Tutorials & Courses</h4>
              </div>
              <ul className="space-y-3">
                {analysis.recommendedCourses.map((c, i) => (
                  <li key={i} className="text-xs text-slate-300 light:text-slate-605 leading-relaxed flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Projects */}
            <GlassCard className="border-slate-800/40 light:border-indigo-150">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-pink-400" />
                <h4 className="text-md font-bold text-white light:text-slate-800 font-outfit">Hands-on Practice Projects</h4>
              </div>
              <ul className="space-y-3">
                {analysis.recommendedProjects.map((p, i) => (
                  <li key={i} className="text-xs text-slate-300 light:text-slate-605 leading-relaxed flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate('/dashboard/roadmap')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl transition-all"
            >
              Generate Weekly Learning Roadmap
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGap;
