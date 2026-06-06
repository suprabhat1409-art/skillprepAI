import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Spinner } from '../components/Loaders';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';

const Login = () => {
  const { loginState } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      showNotification('Please fill in all fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login(formData);
      loginState(res.data);
      showNotification('Login successful!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || 'Invalid credentials. Please try again.';
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

      <div className="w-full max-w-md animate-scale-in">
        <GlassCard className="border-slate-800 p-8 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-outfit text-white tracking-wide">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-2">Ace your placements with AI-driven training</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
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
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all active:scale-[0.98]"
            >
              {loading ? <Spinner size="sm" /> : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Bottom redirection */}
          <div className="mt-8 text-center pt-6 border-t border-slate-900 text-sm">
            <span className="text-slate-500">New to SkillPrep? </span>
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
              Create an Account
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;
