import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { progressAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Spinner } from '../components/Loaders';
import { 
  Flame, 
  Award, 
  CheckSquare, 
  Plus, 
  Trash2, 
  TrendingUp, 
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

const BadgeOrbit = ({ count = 1 }) => (
  <div className="w-full flex justify-center py-2 animate-float-node">
    <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
      {/* Orbital Ring 1 */}
      <circle cx="50" cy="50" r="40" stroke="rgba(99, 102, 241, 0.08)" strokeWidth="1" />
      {/* Orbital Ring 2 */}
      <circle cx="50" cy="50" r="30" stroke="rgba(236, 72, 153, 0.08)" strokeWidth="1" strokeDasharray="3 3" />
      
      {/* Rotating orbital node */}
      <circle 
        cx="50" cy="50" r="30" 
        stroke="url(#orbitSweep)" 
        strokeWidth="1.5" 
        strokeDasharray="10 50" 
        className="animate-radar-spin origin-[50px_50px]" 
      />

      {/* Central Badge Emblem */}
      <circle cx="50" cy="50" r="16" fill="url(#badgeGlow)" className="animate-pulse" />
      <text x="50" y="56" textAnchor="middle" className="text-xl select-none">🏆</text>

      <defs>
        <radialGradient id="badgeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#6366f1" />
        </radialGradient>
        <linearGradient id="orbitSweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const ProgressTracking = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [customTasks, setCustomTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await progressAPI.getByUser(user.id);
      setProgress(res.data.progress);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          const initRes = await progressAPI.update({
            userId: user.id,
            updates: {
              completedTasks: [],
              progressPercentage: 0,
              streakCount: 1,
              badges: ['Welcome Cadet']
            }
          });
          setProgress(initRes.data.progress);
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error(error);
        showNotification('Failed to sync progress metrics', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProgress();
      const savedTasks = localStorage.getItem(`tasks_${user.id}`);
      if (savedTasks) {
        try {
          setCustomTasks(JSON.parse(savedTasks));
        } catch (e) {
          setCustomTasks([]);
        }
      }
    }
  }, [user]);

  const saveTasksLocal = (tasks) => {
    setCustomTasks(tasks);
    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const cleanText = taskInput.trim();
    if (!cleanText) return;

    const newTask = {
      id: Date.now().toString(),
      text: cleanText,
      completed: false,
    };

    saveTasksLocal([...customTasks, newTask]);
    setTaskInput('');
    showNotification('Manual prep task added!', 'success');
  };

  const handleToggleTask = (taskId) => {
    const updated = customTasks.map((t) => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveTasksLocal(updated);
    showNotification('Task state updated', 'success');
  };

  const handleDeleteTask = (taskId) => {
    saveTasksLocal(customTasks.filter((t) => t.id !== taskId));
    showNotification('Task removed', 'info');
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const badgeDefinitions = [
    { name: "Welcome Cadet", desc: "Successfully registered on SkillPrep.", icon: "🎖️", color: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-300 light:text-blue-750" },
    { name: "Parser Initiate", desc: "Uploaded your first placement resume.", icon: "📄", color: "from-pink-500/10 to-purple-500/10 border-pink-500/30 text-pink-300 light:text-pink-700" },
    { name: "Curriculum Scout", desc: "Analyzed your core skill gaps.", icon: "🔍", color: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-300 light:text-amber-700" },
    { name: "Roadmap Pioneer", desc: "Generated study roadmap modules.", icon: "🗺️", color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-300 light:text-emerald-700" },
    { name: "Mock Champion", desc: "Completed an AI mock interview loop.", icon: "🎙️", color: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-300 light:text-purple-700" },
    { name: "Streak Fire", desc: "Maintained active daily preparations.", icon: "🔥", color: "from-red-500/10 to-orange-500/10 border-red-500/30 text-red-300 light:text-red-700" }
  ];

  const unlockedBadges = progress?.badges || ['Welcome Cadet'];
  
  const chartData = [
    { Day: 'Mon', Progress: 10 },
    { Day: 'Tue', Progress: 18 },
    { Day: 'Wed', Progress: 25 },
    { Day: 'Thu', Progress: 40 },
    { Day: 'Fri', Progress: progress?.progressPercentage || 45 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold font-outfit text-white light:text-slate-900 tracking-wide">Progress Tracking</h2>
        <p className="text-slate-400 light:text-slate-505 mt-1 text-sm">Monitor streak counts, preparation tasks, and earned credentials</p>
      </div>

      {/* Stats top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Streak card */}
        <GlassCard className="border-slate-800/40 light:border-indigo-150 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-widest">Active Streak</span>
            <h4 className="text-4xl font-extrabold text-white light:text-slate-900 font-outfit mt-1">
              {progress?.streakCount || 1} Day{ (progress?.streakCount || 1) > 1 ? 's' : '' }
            </h4>
            <p className="text-xs text-slate-505 light:text-slate-500">Keep preparing daily to maintain fire!</p>
          </div>
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 animate-pulse">
            <Flame className="w-10 h-10 fill-orange-500" />
          </div>
        </GlassCard>

        {/* Total completed objectives */}
        <GlassCard className="border-slate-800/40 light:border-indigo-150 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-widest">Completed Actions</span>
            <h4 className="text-4xl font-extrabold text-white light:text-slate-900 font-outfit mt-1">
              {progress?.completedTasks?.length || 0} Task{ (progress?.completedTasks?.length || 0) !== 1 ? 's' : '' }
            </h4>
            <p className="text-xs text-slate-550 light:text-slate-500">Weekly goals Checked off</p>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </GlassCard>

        {/* Credentials Unlocked */}
        <GlassCard className="border-slate-800/40 light:border-indigo-150 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-widest">Earned Credentials</span>
            <h4 className="text-4xl font-extrabold text-white light:text-slate-900 font-outfit mt-1">
              {unlockedBadges.length} / 6
            </h4>
            <p className="text-xs text-slate-550 light:text-slate-500">Profile milestone badges</p>
          </div>
          <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <Award className="w-10 h-10" />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Tasks checklist manager & Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Chart */}
          <GlassCard className="border-slate-800/40 light:border-indigo-150">
            <h3 className="text-lg font-bold text-white light:text-slate-800 mb-6 font-outfit flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Preparation Statistics
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="Day" stroke="#64748b" />
                  <YAxis stroke="#64748b" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-glass)' }} />
                  <Line 
                    type="monotone" 
                    dataKey="Progress" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Manual task creator */}
          <GlassCard className="border-slate-800/40 light:border-indigo-150">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-bold text-white light:text-slate-800 font-outfit">Personal Preparation Checklist</h3>
            </div>

            {/* Input form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="e.g. Read dynamic programming chapter, review SQL indexes..."
                className="flex-1 bg-slate-950/60 light:bg-slate-205 border border-slate-800 light:border-slate-300 focus:border-indigo-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-100 light:text-slate-800 placeholder-slate-650 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-550 border border-indigo-500/30 text-white font-bold text-sm transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </form>

            {/* Tasks list */}
            {customTasks.length > 0 ? (
              <div className="divide-y divide-slate-900 light:divide-slate-200">
                {customTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 animate-scroll-up">
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="w-4.5 h-4.5 rounded border-slate-850 light:border-slate-300 text-indigo-600 focus:ring-indigo-500/35 bg-slate-950 light:bg-slate-100"
                      />
                      <span className={`text-sm select-none truncate ${
                        task.completed ? 'text-slate-500 light:text-slate-400 line-through' : 'text-slate-202 light:text-slate-700'
                      }`}>
                        {task.text}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-500 hover:text-rose-455 transition-colors p-1"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-550 text-center py-6">No manual tasks logged. Create objectives above to supplement your AI Roadmap.</p>
            )}
          </GlassCard>

        </div>

        {/* Right Side: Badges grid */}
        <div className="space-y-6">
          <GlassCard className="border-slate-800/40 light:border-indigo-150">
            <h3 className="text-lg font-bold text-white light:text-slate-800 mb-2 font-outfit flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Achievements Board
            </h3>

            {/* Dynamic Badge Orbit motion graphic */}
            <BadgeOrbit count={unlockedBadges.length} />

            <div className="grid grid-cols-1 gap-4 mt-2">
              {badgeDefinitions.map((badge, idx) => {
                const isUnlocked = unlockedBadges.includes(badge.name) || 
                                   (badge.name === "Parser Initiate" && progress?.completedTasks?.length > 0) || 
                                   (badge.name === "Curriculum Scout" && progress?.progressPercentage > 0);
                
                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                      isUnlocked 
                        ? `bg-gradient-to-br ${badge.color}` 
                        : 'bg-slate-950/30 light:bg-slate-200/20 border-slate-900 light:border-slate-200/50 text-slate-600 opacity-45'
                    }`}
                  >
                    <span className="text-2xl shrink-0 select-none">{badge.icon}</span>
                    <div className="overflow-hidden">
                      <h5 className={`text-sm font-bold font-outfit ${isUnlocked ? 'text-slate-105 light:text-slate-800' : 'text-slate-600'}`}>
                        {badge.name}
                      </h5>
                      <p className="text-[10px] leading-relaxed mt-0.5 max-w-[180px] break-words text-slate-450 light:text-slate-500">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default ProgressTracking;
