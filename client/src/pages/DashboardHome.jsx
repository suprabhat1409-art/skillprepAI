import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { resumeAPI, skillAPI, roadmapAPI, progressAPI, interviewAPI } from '../services/api';
import AnalyticsCard from '../components/AnalyticsCard';
import GlassCard from '../components/GlassCard';
import { Spinner } from '../components/Loaders';
import { 
  FileText, 
  Sparkles, 
  GitFork, 
  Mic, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const PulseCore = ({ percentage = 45 }) => (
  <div className="w-full flex justify-center py-2 animate-float-node">
    <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="30" stroke="rgba(99, 102, 241, 0.06)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="20" stroke="rgba(236, 72, 153, 0.06)" strokeWidth="1" />
      
      {/* Pulse line connection */}
      <line x1="50" y1="50" x2="50" y2="15" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="0.75" />
      <line x1="50" y1="50" x2="80" y2="30" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="0.75" />
      <line x1="50" y1="50" x2="70" y2="75" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.75" />
      <line x1="50" y1="50" x2="30" y2="75" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.75" />
      <line x1="50" y1="50" x2="20" y2="30" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="0.75" />
      
      {/* Outer nodes */}
      <circle cx="50" cy="15" r="3.5" fill="#6366f1" />
      <circle cx="80" cy="30" r="4" fill="#ec4899" />
      <circle cx="70" cy="75" r="3" fill="#3b82f6" />
      <circle cx="30" cy="75" r="3.5" fill="#10b981" />
      <circle cx="20" cy="30" r="3" fill="#f59e0b" />

      {/* Central Core */}
      <circle cx="50" cy="50" r="10" fill="url(#coreGlow)" className="animate-pulse" />
      
      {/* Dynamic progress orbital node */}
      <circle 
        cx="50" 
        cy="50" 
        r="20" 
        stroke="#6366f1" 
        strokeWidth="1.5" 
        strokeDasharray={2 * Math.PI * 20}
        strokeDashoffset={2 * Math.PI * 20 * (1 - percentage / 100)}
        strokeLinecap="round"
        className="transition-all duration-1000"
      />
      
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#6366f1" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

const DashboardHome = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    resume: null,
    skills: null,
    roadmap: null,
    progress: null,
    interviews: [],
  });

  useEffect(() => {
    if (!user) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [resResume, resSkills, resRoadmap, resProgress, resInterviews] = await Promise.allSettled([
          resumeAPI.getByUser(user.id),
          skillAPI.getByUser(user.id),
          roadmapAPI.getByUser(user.id),
          progressAPI.getByUser(user.id),
          interviewAPI.getHistory(user.id)
        ]);

        const fetched = {};
        fetched.resume = resResume.status === 'fulfilled' ? resResume.value.data.resume : null;
        fetched.skills = resSkills.status === 'fulfilled' ? resSkills.value.data.analysis : null;
        fetched.roadmap = resRoadmap.status === 'fulfilled' ? resRoadmap.value.data.roadmap : null;
        fetched.progress = resProgress.status === 'fulfilled' ? resProgress.value.data.progress : null;
        fetched.interviews = resInterviews.status === 'fulfilled' ? resInterviews.value.data.interviews : [];

        setData(fetched);
      } catch (err) {
        console.error(err);
        showNotification('Error syncing dashboard elements', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user, showNotification]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Calculated properties
  const atsScore = data.resume ? data.resume.atsScore : 0;
  const totalSkillsCount = (data.skills?.matchedSkills?.length || 0) + (data.skills?.missingSkills?.length || 0);
  const skillMatchPercent = totalSkillsCount > 0 
    ? Math.round(((data.skills?.matchedSkills?.length || 0) / totalSkillsCount) * 100)
    : 0;

  const roadmapProgress = data.progress ? data.progress.progressPercentage : 0;
  
  // Calculate avg interview score
  const interviewCount = data.interviews.length;
  const avgInterviewScore = interviewCount > 0
    ? Math.round(data.interviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / interviewCount)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Message */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-outfit text-white light:text-slate-900 tracking-wide">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-slate-405 light:text-slate-500 mt-1 text-sm">
            Here is your current preparation status for <span className="text-indigo-400 light:text-indigo-650 font-semibold">{user?.targetRole || 'your Target Role'}</span>.
          </p>
        </div>
      </div>

      {/* Analytics Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="ATS Resume Score"
          value={data.resume ? `${atsScore}%` : 'N/A'}
          icon={<FileText className="w-6 h-6" />}
          change={data.resume ? (atsScore > 75 ? '+12% Over average' : 'Below standard') : null}
          changeType={atsScore > 75 ? 'increase' : 'decrease'}
          description={data.resume ? 'Latest parsed resume file' : 'No resume uploaded'}
          delay="0ms"
        />
        <AnalyticsCard
          title="Skill Match Rate"
          value={data.skills ? `${skillMatchPercent}%` : 'N/A'}
          icon={<Sparkles className="w-6 h-6" />}
          change={data.skills ? `${data.skills.matchedSkills.length} Matched` : null}
          changeType="increase"
          description={data.skills ? `${data.skills.missingSkills.length} skills missing` : 'Gaps not analyzed yet'}
          delay="100ms"
        />
        <AnalyticsCard
          title="Roadmap Complete"
          value={`${roadmapProgress}%`}
          icon={<GitFork className="w-6 h-6" />}
          change={data.progress?.streakCount ? `${data.progress.streakCount} Day Streak 🔥` : null}
          changeType="increase"
          description="Learning nodes verified"
          delay="200ms"
        />
        <AnalyticsCard
          title="Interview Prep"
          value={interviewCount > 0 ? `${avgInterviewScore}/100` : 'N/A'}
          icon={<Mic className="w-6 h-6" />}
          change={interviewCount > 0 ? `${interviewCount} session(s)` : null}
          changeType="increase"
          description="Average response rating"
          delay="300ms"
        />
      </div>

      {/* Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Recommendations & Quick Wizards */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="border-slate-800/40 light:border-indigo-150">
            <h3 className="text-lg font-bold text-white light:text-slate-850 mb-4 font-outfit">AI Recommended Actions</h3>
            
            <div className="divide-y divide-slate-800/40 light:divide-slate-200/60 space-y-4">
              {/* No resume wizard */}
              {!data.resume && (
                <div className="flex items-start gap-4 pt-4 first:pt-0">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                    <FileText className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h5 className="text-sm font-semibold text-slate-200 light:text-slate-800">Upload Your Resume</h5>
                    <p className="text-xs text-slate-400 light:text-slate-500">Upload your PDF resume to analyze keywords, calculate your ATS score, and find gaps against your role.</p>
                    <button 
                      onClick={() => navigate('/dashboard/resume')}
                      className="text-xs text-indigo-400 light:text-indigo-650 hover:text-indigo-300 font-bold inline-flex items-center gap-1.5 mt-2 transition-colors"
                    >
                      Upload now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* No Skill Gap Wizard */}
              {data.resume && !data.skills && (
                <div className="flex items-start gap-4 pt-4 first:pt-0">
                  <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 shrink-0">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h5 className="text-sm font-semibold text-slate-200 light:text-slate-800">Run Skill Gap Diagnostics</h5>
                    <p className="text-xs text-slate-400 light:text-slate-500">Map your resume skills against the target role: {user?.targetRole || 'Not set'}.</p>
                    <button 
                      onClick={() => navigate('/dashboard/skills')}
                      className="text-xs text-pink-400 light:text-pink-650 hover:text-pink-300 font-bold inline-flex items-center gap-1.5 mt-2 transition-colors"
                    >
                      Run Analysis <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Roadmap wizard */}
              {data.skills && !data.roadmap && (
                <div className="flex items-start gap-4 pt-4 first:pt-0">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                    <GitFork className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h5 className="text-sm font-semibold text-slate-200 light:text-slate-800">Initialize Your Learning Roadmap</h5>
                    <p className="text-xs text-slate-400 light:text-slate-500">Your skill analysis is complete! Generate a step-by-step learning roadmap to master the missing requirements.</p>
                    <button 
                      onClick={() => navigate('/dashboard/roadmap')}
                      className="text-xs text-amber-400 light:text-amber-650 hover:text-amber-300 font-bold inline-flex items-center gap-1.5 mt-2 transition-colors"
                    >
                      Generate Roadmap <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* General study hint */}
              {data.roadmap && (
                <div className="flex items-start gap-4 pt-4 first:pt-0">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                    <GitFork className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h5 className="text-sm font-semibold text-slate-200 light:text-slate-800">Continue Learning Roadmap</h5>
                    <p className="text-xs text-slate-400 light:text-slate-500">
                      Weekly objectives are live. Keep checking off objectives in your timeline to sync your progress.
                    </p>
                    <button 
                      onClick={() => navigate('/dashboard/roadmap')}
                      className="text-xs text-emerald-400 light:text-emerald-650 hover:text-emerald-300 font-bold inline-flex items-center gap-1.5 mt-2 transition-colors"
                    >
                      Open Roadmap <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Interview study hint */}
              <div className="flex items-start gap-4 pt-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <h5 className="text-sm font-semibold text-slate-200 light:text-slate-800">Ace Mock Interviews</h5>
                  <p className="text-xs text-slate-400 light:text-slate-500">Practice custom questions generated dynamically by AI based on your profile gaps and answer in real-time.</p>
                  <button 
                    onClick={() => navigate('/dashboard/interview')}
                    className="text-xs text-purple-400 light:text-purple-650 hover:text-purple-300 font-bold inline-flex items-center gap-1.5 mt-2 transition-colors"
                  >
                    Start practice test <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Quick summary & checklist */}
        <div className="space-y-6">
          <GlassCard className="border-slate-800/40 light:border-indigo-150 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white light:text-slate-850 mb-2 font-outfit">Active Status Summary</h3>
              
              {/* Pulse Core graphic */}
              <PulseCore percentage={roadmapProgress} />

              <div className="space-y-4 mt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                    <span>ATS READINESS</span>
                    <span className="text-indigo-400 light:text-indigo-650">{atsScore}%</span>
                  </div>
                  <div className="w-full bg-slate-900 light:bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-800 light:border-slate-300/50">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-1000"
                      style={{ width: `${atsScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                    <span>CURRICULUM MILESTONES</span>
                    <span className="text-pink-400 light:text-pink-600">{roadmapProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 light:bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-800 light:border-slate-300/50">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-1000"
                      style={{ width: `${roadmapProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-900 light:border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Target Role:</span>
                <span className="font-semibold text-slate-200 light:text-slate-800">{user?.targetRole || 'Not specified'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Skills logged:</span>
                <span className="font-semibold text-slate-200 light:text-slate-800">{user?.skills?.length || 0} skill tags</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Interviews recorded:</span>
                <span className="font-semibold text-slate-200 light:text-slate-800">{interviewCount} loops</span>
              </div>
            </div>
          </GlassCard>

          {/* Tips card */}
          <div className="p-6 rounded-2xl bg-indigo-950/20 light:bg-indigo-50/50 border border-indigo-500/10 light:border-indigo-200/50 flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-indigo-400 light:text-indigo-650 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-sm font-bold text-white light:text-slate-800 font-outfit">Placement Hack</h5>
              <p className="text-xs text-slate-400 light:text-slate-500 leading-relaxed mt-1">
                Autopopulate your target role settings. The AI agent analyzes job descriptions in real-time to align keyword indexes for high search hits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
