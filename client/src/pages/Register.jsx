import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Spinner } from '../components/Loaders';
import { Mail, Lock, User, Plus, X, ArrowLeft, Briefcase } from 'lucide-react';

const Register = () => {
  const { loginState } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    targetRole: '',
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill) {
      if (skills.includes(cleanSkill)) {
        showNotification('Skill already added', 'warning');
        return;
      }
      setSkills((prev) => [...prev, cleanSkill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      showNotification('Please fill in all required fields', 'warning');
      return;
    }
    if (formData.password.length < 8) {
      showNotification('Password must be at least 8 characters long', 'warning');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        targetRole: formData.targetRole,
        skills: skills,
      };

      const res = await authAPI.register(payload);
      loginState(res.data);
      showNotification('Registration successful!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || 'Failed to register. Please check your fields.';
      showNotification(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 bg-gradient-glow flex items-center justify-center p-4 relative overflow-hidden">
      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Decorative Glows */}
      <div className="absolute w-72 h-72 rounded-full bg-indigo-500/10 blur-[80px] -top-12 -left-12 pointer-events-none"></div>
      <div className="absolute w-72 h-72 rounded-full bg-pink-500/10 blur-[80px] -bottom-12 -right-12 pointer-events-none"></div>

      <div className="w-full max-w-xl my-10 animate-scale-in">
        <GlassCard className="border-slate-800 p-8 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-outfit text-white tracking-wide">Create Your Account</h2>
            <p className="text-xs text-slate-400 mt-2">Initialize your SkillPrep dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Target Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Job Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Engineer / Full Stack Developer"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Initial Skills Tag Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Core Skills (Press Enter to add)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(e); } }}
                  placeholder="e.g. JavaScript, React, Python, Git"
                  className="flex-1 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="p-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-550 border border-indigo-500/30 text-white transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Skills Capsule Grid */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold animate-scale-in"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-emerald-400 hover:text-emerald-200 transition-colors focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 chars"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all active:scale-[0.98]"
            >
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          {/* Bottom redirect */}
          <div className="mt-8 text-center pt-6 border-t border-slate-900 text-sm">
            <span className="text-slate-500">Already registered? </span>
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
              Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Register;
