import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import GlassCard from '../components/GlassCard';
import { User, Briefcase, Plus, X, ShieldCheck, Mail } from 'lucide-react';

const Profile = () => {
  const { user, updateUserLocal } = useAuth();
  const { showNotification } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill) {
      if (skills.includes(cleanSkill)) {
        showNotification('Skill already logged', 'warning');
        return;
      }
      setSkills((prev) => [...prev, cleanSkill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('Profile name cannot be empty', 'warning');
      return;
    }

    const updated = {
      ...user,
      name: name.trim(),
      targetRole: targetRole.trim(),
      skills: skills,
    };

    updateUserLocal(updated);
    showNotification('Profile settings updated successfully!', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold font-outfit text-white tracking-wide">Profile Settings</h2>
        <p className="text-slate-400 mt-1 text-sm">Manage your target role configurations and tech skills</p>
      </div>

      <GlassCard className="border-slate-800/40 p-8">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Avatar and static details */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-900">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white uppercase text-xl border border-indigo-400/20 shadow-lg shadow-indigo-500/10">
              {name.slice(0, 2) || 'US'}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h4 className="text-lg font-bold text-white font-outfit">{name || 'Your Profile'}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Target Job Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target job role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Manage Skills chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Manage Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(e); } }}
                placeholder="Type skill tag and press enter..."
                className="flex-1 bg-slate-950/60 border border-slate-800 focus:border-indigo-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="p-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-550 border border-indigo-500/30 text-white transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Chips render */}
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold animate-scale-in"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-indigo-400 hover:text-indigo-200 transition-colors focus:outline-none"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 pt-2">No skills registered. Enter technology tags to map your dashboard analytics.</p>
            )}
          </div>

          {/* Save trigger */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl transition-all"
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            Save Profile Settings
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default Profile;
