import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { roadmapAPI, progressAPI, resumeAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Spinner, AILoader } from '../components/Loaders';
import { 
  GitFork, 
  CheckCircle2, 
  BookOpen, 
  Flag,
  Sparkles
} from 'lucide-react';

const TimelinePulse = ({ currentProgress = 0 }) => (
  <div className="w-full flex justify-center py-4 bg-slate-950/20 light:bg-slate-200/20 rounded-2xl border border-slate-900/40 light:border-indigo-100/50 mb-6 animate-float-node">
    <svg className="w-full max-w-[280px] h-14" viewBox="0 0 300 60" fill="none">
      <line x1="30" y1="30" x2="270" y2="30" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="4" strokeLinecap="round" />
      <line 
        x1="30" y1="30" 
        x2={30 + (240 * currentProgress) / 100} 
        y2="30" 
        stroke="url(#timelineGrad)" 
        strokeWidth="4" 
        strokeLinecap="round" 
        className="transition-all duration-1000"
      />
      
      <circle cx="30" cy="30" r="7" fill="#6366f1" />
      <circle cx="30" cy="30" r="11" stroke="#6366f1" strokeWidth="1" className="animate-ping" />
      
      <circle cx="150" cy="30" r="7" fill={currentProgress >= 50 ? '#ec4899' : '#475569'} />
      {currentProgress >= 50 && <circle cx="150" cy="30" r="11" stroke="#ec4899" strokeWidth="1" className="animate-ping" />}

      <circle cx="270" cy="30" r="7" fill={currentProgress >= 100 ? '#10b981' : '#475569'} />
      {currentProgress >= 100 && <circle cx="270" cy="30" r="11" stroke="#10b981" strokeWidth="1" className="animate-ping" />}
      
      <defs>
        <linearGradient id="timelineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const Roadmap = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [hasResume, setHasResume] = useState(false);
  const [completedGoals, setCompletedGoals] = useState([]);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      await resumeAPI.getByUser(user.id);
      setHasResume(true);

      const res = await roadmapAPI.getByUser(user.id);
      setRoadmap(res.data.roadmap);
      
      try {
        const resProgress = await progressAPI.getByUser(user.id);
        setCompletedGoals(resProgress.data.progress.completedTasks || []);
      } catch (e) {
        setCompletedGoals([]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (error.config.url.includes('/resume/')) {
          setHasResume(false);
        } else {
          setRoadmap(null);
        }
      } else {
        console.error(error);
        showNotification('Failed to fetch learning timeline', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoadmap();
    }
  }, [user]);

  const handleGenerateRoadmap = async () => {
    if (!hasResume) {
      showNotification('Please upload your resume to generate a customized roadmap', 'warning');
      navigate('/dashboard/resume');
      return;
    }

    setGenerating(true);
    try {
      const resResume = await resumeAPI.getByUser(user.id);
      const resumeText = resResume.data.resume.extractedSkills.join(', ');

      const res = await roadmapAPI.generate({
        resumeText: resumeText || 'developer',
        userId: user.id,
        targetRole: user.targetRole || 'Software Engineer'
      });
      setRoadmap(res.data.roadmap);
      showNotification('AI Roadmap generated successfully!', 'success');
      
      await progressAPI.update({
        userId: user.id,
        updates: { completedTasks: [], progressPercentage: 0, streakCount: 1 }
      });
    } catch (error) {
      console.error(error);
      showNotification('Failed to generate roadmap', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleGoal = async (goal) => {
    let updatedCompleted = [...completedGoals];
    if (updatedCompleted.includes(goal)) {
      updatedCompleted = updatedCompleted.filter((g) => g !== goal);
    } else {
      updatedCompleted.push(goal);
    }
    setCompletedGoals(updatedCompleted);

    const totalGoals = roadmap.weeklyGoals?.length || 1;
    const progressPercent = Math.min(100, Math.round((updatedCompleted.length / totalGoals) * 100));

    try {
      await progressAPI.update({
        userId: user.id,
        updates: {
          completedTasks: updatedCompleted,
          progressPercentage: progressPercent
        }
      });

      const completionStatus = progressPercent === 100 
        ? 'Completed' 
        : progressPercent > 0 ? 'In Progress' : 'Not Started';
        
      await roadmapAPI.update({
        userId: user.id,
        updates: { completionStatus }
      });

      showNotification('Progress saved!', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Failed to sync progress to server', 'error');
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (generating) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <AILoader message="AI agent is drafting weekly study guides and compiling learning modules..." />
      </div>
    );
  }

  const currentPercent = roadmap?.weeklyGoals?.length > 0 
    ? Math.round((completedGoals.length / roadmap.weeklyGoals.length) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold font-outfit text-white light:text-slate-900 tracking-wide">Learning Roadmap</h2>
        <p className="text-slate-400 light:text-slate-500 mt-1 text-sm">Follow your customized weekly preparation curriculum</p>
      </div>

      {!roadmap ? (
        // Roadmap Generator Widget
        <GlassCard className="border-slate-800/40 light:border-indigo-150 p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
            <GitFork className="w-10 h-10 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white light:text-slate-900 font-outfit">Compile Study Timeline</h3>
          <p className="text-slate-400 light:text-slate-500 text-xs mt-2 max-w-sm leading-relaxed">
            Our AI generates weekly learning nodes pointing directly to subjects you need to review to map your missing skills.
          </p>
          <button
            onClick={handleGenerateRoadmap}
            className="mt-6 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl transition-all hover:scale-[1.02]"
          >
            Generate Roadmap
          </button>
        </GlassCard>
      ) : (
        // Roadmap Timeline Render
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Timeline View (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="border-slate-800/40 light:border-indigo-150">
              <h3 className="text-lg font-bold text-white light:text-slate-800 font-outfit mb-8 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400 animate-pulse" />
                Preparation Timeline
              </h3>

              {/* Vertical timeline component */}
              <div className="relative border-l border-slate-800 light:border-slate-200 pl-8 ml-4 space-y-12">
                {roadmap.weeklyGoals.map((goal, index) => {
                  const isFinished = completedGoals.includes(goal);
                  return (
                    <div key={index} className="relative animate-scroll-up" style={{ animationDelay: `${index * 100}ms` }}>
                      
                      {/* Timeline dot selector */}
                      <button 
                        onClick={() => handleToggleGoal(goal)}
                        className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                          isFinished 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                            : 'bg-slate-950 light:bg-slate-50 border-slate-800 light:border-slate-305 text-slate-500 hover:border-indigo-500'
                        }`}
                      >
                        {isFinished ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-800 light:bg-slate-300"></div>
                        )}
                      </button>

                      {/* Timeline Content */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-indigo-400 light:text-indigo-650 uppercase tracking-widest">
                          WEEK 0{index + 1} MODULE
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <h4 
                            onClick={() => handleToggleGoal(goal)}
                            className={`text-md font-bold font-outfit cursor-pointer select-none transition-all ${
                              isFinished ? 'text-slate-500 light:text-slate-400 line-through' : 'text-slate-100 light:text-slate-800 hover:text-indigo-400 light:hover:text-indigo-650'
                            }`}
                          >
                            {goal}
                          </h4>
                          {isFinished && (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
                          Complete lessons covering core principles, compile test sandbox files, and build mock projects.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar Info (Right 1 col) */}
          <div className="space-y-6">
            
            {/* Status overview */}
            <GlassCard className="border-slate-800/40 light:border-indigo-150">
              <h4 className="text-sm font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider mb-4 font-outfit">Curriculum Status</h4>
              
              {/* Dynamic Timeline Milestones pulser */}
              <TimelinePulse currentProgress={currentPercent} />

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Timeline phase:</span>
                  <span className="text-indigo-400 light:text-indigo-650 uppercase tracking-wide">
                    {completedGoals.length === roadmap.weeklyGoals.length 
                      ? 'Fully Prepared' 
                      : completedGoals.length > 0 ? 'Study Mode Active' : 'Pending Start'}
                  </span>
                </div>

                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Modules finished:</span>
                  <span className="text-white light:text-slate-800">{completedGoals.length} / {roadmap.weeklyGoals.length}</span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-slate-900 light:bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-800 light:border-slate-300/60">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-1000"
                      style={{ width: `${currentPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Milestones list */}
            {roadmap.milestones && roadmap.milestones.length > 0 && (
              <GlassCard className="border-slate-800/40 light:border-indigo-150">
                <h4 className="text-sm font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider mb-4 font-outfit flex items-center gap-2">
                  <Flag className="w-4 h-4 text-pink-400" />
                  Key Milestones
                </h4>
                <ul className="space-y-3">
                  {roadmap.milestones.map((mil, idx) => (
                    <li key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-300 light:text-slate-650">
                      <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{mil}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            {/* Re-generate advice */}
            <div className="p-6 rounded-2xl bg-indigo-950/20 light:bg-indigo-50/50 border border-indigo-500/10 light:border-indigo-200/50 flex items-start gap-3.5">
              <Sparkles className="w-5 h-5 text-indigo-400 light:text-indigo-650 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-white light:text-slate-800 uppercase tracking-wider">Roadmap Calibration</h5>
                <p className="text-[11px] text-slate-400 light:text-slate-550 leading-relaxed mt-1">
                  If you upload a new resume or change your target role in settings, your learning milestones can be re-calibrated.
                </p>
                <button
                  onClick={handleGenerateRoadmap}
                  className="text-[10px] font-bold text-indigo-400 light:text-indigo-650 hover:text-indigo-300 light:hover:text-indigo-750 mt-2 block"
                >
                  Force Calibration 🔄
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
