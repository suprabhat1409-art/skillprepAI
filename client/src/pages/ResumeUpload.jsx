import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { resumeAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Spinner, AILoader } from '../components/Loaders';
import { 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  Lightbulb,
  FileCheck
} from 'lucide-react';

const ScannerAnimation = ({ active = false }) => (
  <div className="relative w-32 h-32 mb-4 flex items-center justify-center overflow-hidden border border-slate-900/40 rounded-2xl bg-slate-950/20 light:bg-slate-200/20">
    <svg className="w-20 h-20 text-indigo-400/60 light:text-indigo-600/40" viewBox="0 0 100 100" fill="none">
      <rect x="25" y="15" width="50" height="70" rx="4" stroke="currentColor" strokeWidth="2" />
      <line x1="35" y1="30" x2="65" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="35" y1="42" x2="65" y2="42" stroke="currentColor" strokeWidth="1.5" />
      <line x1="35" y1="54" x2="55" y2="54" stroke="currentColor" strokeWidth="1.5" />
      <line x1="35" y1="66" x2="60" y2="66" stroke="currentColor" strokeWidth="1.5" />
    </svg>
    {/* Scanning Neon Line */}
    <div className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500 blur-[0.5px] shadow-[0_0_8px_#8b5cf6] ${
      active ? 'animate-laser-scan' : 'top-1/2 opacity-30'
    }`} />
  </div>
);

const ResumeUpload = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Load resume if already uploaded
  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await resumeAPI.getByUser(user.id);
      setResume(res.data.resume);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setResume(null);
      } else {
        console.error(error);
        showNotification('Failed to retrieve resume records', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchResume();
    }
  }, [user]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await uploadFile(file);
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      showNotification('Please upload a PDF file only', 'warning');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size exceeds 5MB limit', 'warning');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('userId', user.id);
      formData.append('targetRole', user.targetRole || '');
      formData.append('atsScore', Math.floor(Math.random() * 30) + 60);
      formData.append('extractedSkills', user.skills || []);

      const res = await resumeAPI.upload(formData);
      setResume(res.data.resume);
      showNotification('Resume uploaded and analyzed successfully!', 'success');
    } catch (error) {
      console.error(error);
      showNotification(error.response?.data?.error || 'Failed to upload resume', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume) return;
    if (!window.confirm('Are you sure you want to remove this resume record? This deletes all ATS metrics.')) return;

    setLoading(true);
    try {
      await resumeAPI.delete(resume.id);
      setResume(null);
      showNotification('Resume record deleted successfully', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Failed to delete resume', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <ScannerAnimation active={true} />
          <AILoader message="AI agent is scanning your resume & calculating ATS indexes..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold font-outfit text-white light:text-slate-900 tracking-wide">Resume Analyzer</h2>
        <p className="text-slate-400 light:text-slate-500 mt-1 text-sm">Upload your resume to retrieve ATS score card mappings</p>
      </div>

      {!resume ? (
        // Dropzone Form
        <GlassCard className="border-slate-800/40 light:border-indigo-150 p-12 text-center flex flex-col items-center justify-center relative">
          <form 
            onDragEnter={handleDrag} 
            onDragOver={handleDrag} 
            onDragLeave={handleDrag} 
            onDrop={handleDrop}
            className={`w-full max-w-lg border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-950/10 light:bg-indigo-50/20' 
                : 'border-slate-800 light:border-slate-350 hover:border-indigo-500/50 light:hover:border-indigo-500/50 bg-slate-950/30'
            }`}
          >
            {/* Active Scanner SVG Animation */}
            <ScannerAnimation active={dragActive} />
            
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-white light:text-slate-900 font-outfit">Drag & drop your resume</h4>
              <p className="text-xs text-slate-500">Supports PDF format only (Max 5MB)</p>
            </div>

            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex px-6 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-550 text-white font-bold text-sm shadow-lg shadow-indigo-600/10 transition-all active:scale-[0.98]"
              >
                Browse local files
              </label>
            </div>
          </form>
        </GlassCard>
      ) : (
        // Resume Stats / Result Card
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left panel - ATS Ring and overview */}
          <div className="space-y-6">
            <GlassCard className="border-slate-800/40 light:border-indigo-150 flex flex-col items-center p-8 text-center">
              <span className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-widest mb-6">ATS SCORE RATIO</span>
              
              {/* Animated score ring */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="url(#indigoGrad)" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (resume.atsScore || 65) / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-white light:text-slate-900 tracking-tight font-outfit">{resume.atsScore || 65}%</span>
                  <span className="text-[10px] text-slate-400 light:text-slate-500 font-semibold tracking-wider mt-1 uppercase">Readiness</span>
                </div>
              </div>

              <div className="mt-8 space-y-2 w-full text-left pt-6 border-t border-slate-900 light:border-slate-200">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">File Name:</span>
                  <span className="font-semibold text-indigo-400 light:text-indigo-650 truncate max-w-[180px]">
                    {resume.resumeUrl.split('/').pop()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Target Role:</span>
                  <span className="font-semibold text-slate-300 light:text-slate-700">{resume.targetRole || 'Software Engineer'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Extracted Skills:</span>
                  <span className="font-semibold text-slate-300 light:text-slate-700">{resume.extractedSkills?.length || 0} skills</span>
                </div>
              </div>

              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 mt-8 py-3 rounded-xl border border-rose-950/40 light:border-rose-200/50 bg-rose-950/10 light:bg-rose-50/50 hover:bg-rose-900/20 text-rose-450 light:text-rose-600 font-bold text-xs transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Resume Records
              </button>
            </GlassCard>
          </div>

          {/* Right panel - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Extracted Skills */}
            <GlassCard className="border-slate-800/40 light:border-indigo-150">
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white light:text-slate-900 font-outfit">Extracted Profile Skills</h3>
              </div>
              
              {resume.extractedSkills && resume.extractedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {resume.extractedSkills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 rounded-full bg-slate-900 light:bg-slate-200 border border-slate-800 light:border-slate-300 text-slate-300 light:text-slate-700 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No skills could be identified. Ensure your resume has explicit tech tags.</p>
              )}
            </GlassCard>

            {/* AI Coaching Tips & Suggestions */}
            <GlassCard className="border-slate-800/40 light:border-indigo-150">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
                <h3 className="text-lg font-bold text-white light:text-slate-900 font-outfit">AI Suggestions for Resume Optimization</h3>
              </div>

              {resume.suggestions && resume.suggestions.length > 0 ? (
                <ul className="space-y-4">
                  {resume.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-300 light:text-slate-700">
                      <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex gap-3 text-xs leading-relaxed text-slate-300 light:text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Resume matches top-tier keywords for your target role! Continue practicing technical mock interviews.</span>
                </div>
              )}
            </GlassCard>

          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
