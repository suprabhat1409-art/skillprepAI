import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { 
  Upload, 
  Search, 
  Map, 
  Mic, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const HeroAnimation = () => (
  <div className="w-full flex items-center justify-center min-h-[300px]">
    <svg className="w-full max-w-[420px] h-[380px] select-none animate-float-node" viewBox="0 0 400 400" fill="none">
      <circle cx="200" cy="200" r="120" stroke="rgba(99, 102, 241, 0.12)" strokeWidth="1" strokeDasharray="5 5" />
      <circle cx="200" cy="200" r="70" stroke="rgba(236, 72, 153, 0.12)" strokeWidth="1" />
      
      {/* Connection lines */}
      <line x1="200" y1="50" x2="100" y2="150" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1.5" />
      <line x1="200" y1="50" x2="300" y2="150" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1.5" />
      <line x1="100" y1="150" x2="150" y2="300" stroke="rgba(236, 72, 153, 0.25)" strokeWidth="1.5" />
      <line x1="300" y1="150" x2="250" y2="300" stroke="rgba(236, 72, 153, 0.25)" strokeWidth="1.5" />
      <line x1="150" y1="300" x2="250" y2="300" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.5" />
      <line x1="200" y1="50" x2="200" y2="200" stroke="rgba(99, 102, 241, 0.35)" strokeWidth="2" strokeDasharray="3 3" />
      <line x1="200" y1="200" x2="150" y2="300" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1.5" />
      <line x1="200" y1="200" x2="250" y2="300" stroke="rgba(236, 72, 153, 0.25)" strokeWidth="1.5" />

      {/* Brain Nodes */}
      <circle cx="200" cy="50" r="10" fill="url(#gradIndigo)" />
      <circle cx="100" cy="150" r="8" fill="url(#gradPink)" />
      <circle cx="300" cy="150" r="8" fill="url(#gradBlue)" />
      <circle cx="150" cy="300" r="9" fill="url(#gradIndigo)" />
      <circle cx="250" cy="300" r="9" fill="url(#gradPink)" />
      <circle cx="200" cy="200" r="15" fill="url(#gradGlow)" className="animate-pulse" />

      {/* Defs for gradients */}
      <defs>
        <linearGradient id="gradIndigo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="gradPink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <radialGradient id="gradGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

const Landing = () => {
  const features = [
    {
      icon: Upload,
      title: "ATS Resume Analyzer",
      description: "Upload your resume to receive instant feedback on keywords, design formatting, and an automated ATS suitability rating.",
      color: "from-blue-500 to-indigo-500",
      delay: "100ms"
    },
    {
      icon: Search,
      title: "Skill Gap Visualizer",
      description: "Compare your current competencies against the requirements of your target industry role to find precisely what skills you lack.",
      color: "from-purple-500 to-pink-500",
      delay: "200ms"
    },
    {
      icon: Map,
      title: "Tailored Study Roadmaps",
      description: "Get detailed, weekly learning pathways that highlight tutorials, courses, and project ideas to fast-track your core learning.",
      color: "from-pink-500 to-rose-500",
      delay: "300ms"
    },
    {
      icon: Mic,
      title: "AI Interview Mock Simulator",
      description: "Conduct real-time mock interviews with immediate AI grading, score logs, and bulleted constructive feedback on answers.",
      color: "from-amber-500 to-orange-500",
      delay: "400ms"
    },
    {
      icon: TrendingUp,
      title: "Gamified Progress Hub",
      description: "Track your achievements, streak counts, and milestone points to keep your preparation routine engaging and consistent.",
      color: "from-emerald-500 to-teal-500",
      delay: "500ms"
    },
    {
      icon: ShieldCheck,
      title: "Recruiter Grade Metrics",
      description: "Align your skills and experience metrics to match actual standards vetted by top tier hiring platforms globally.",
      color: "from-indigo-500 to-purple-500",
      delay: "600ms"
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Parse Resume",
      desc: "Drag and drop your PDF resume. Our agent extracts key terms, roles, and project data instantly."
    },
    {
      step: "02",
      title: "Examine Target Role",
      desc: "Define your dream job role. We crawl required skills and run gap analyses to highlight what is missing."
    },
    {
      step: "03",
      title: "Generate Roadmap",
      desc: "Follow a dynamic weekly study timeline with curated lessons, code sandboxes, and project recommendations."
    },
    {
      step: "04",
      title: "Train & Get Vetted",
      desc: "Practice under simulated pressure in our AI Interview room, get graded, and verify your placement readiness."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030014] light:bg-slate-50 text-slate-100 light:text-slate-800 bg-gradient-glow relative overflow-hidden">
      <Navbar />

      {/* Floating decorative elements */}
      <div className="absolute top-[15%] left-[10%] w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[5%] w-[400px] h-[400px] rounded-full bg-pink-500/5 blur-[150px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-24 md:pt-44 md:pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text (left 7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/45 border border-indigo-500/20 text-indigo-300 light:bg-indigo-50/70 light:border-indigo-200/50 light:text-indigo-600 text-xs font-semibold mb-6 tracking-wide animate-scale-in">
              <Zap className="w-3.5 h-3.5 text-indigo-400 light:text-indigo-600 fill-indigo-400 light:fill-indigo-650 animate-pulse" />
              <span>Supercharging Placement Prep with Agentic AI</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-outfit leading-[1.1] text-white light:text-slate-900 animate-scroll-up">
              Land Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 light:from-indigo-600 light:to-pink-650 bg-clip-text text-transparent">
                Autonomous AI Coaching
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-slate-400 light:text-slate-600 leading-relaxed animate-scroll-up" style={{ animationDelay: '100ms' }}>
              SkillPrep parses your resume, diagnoses skill gaps, auto-generates custom learning timelines, and simulates live technical interviews with instant AI feedback.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto animate-scroll-up" style={{ animationDelay: '200ms' }}>
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all hover:scale-[1.03]"
              >
                Start Preparing For Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl border border-slate-800 light:border-slate-300 bg-slate-950/40 light:bg-slate-200/40 hover:bg-slate-900/60 light:hover:bg-slate-200/80 text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 transition-all font-semibold"
              >
                Explore Agent Features
              </a>
            </div>
          </div>

          {/* Hero animation graphic (right 5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <HeroAnimation />
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-outfit text-white light:text-slate-900">
            Everything You Need To Get Placed
          </h2>
          <p className="text-slate-400 light:text-slate-500">
            A comprehensive pipeline of AI services tailored to optimize your resume and ace technical assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <GlassCard 
                key={idx} 
                className="border-slate-800/40 light:border-indigo-100 flex flex-col items-start gap-4 text-left animate-scroll-up"
                delay={feat.delay}
              >
                <div className={`p-3.5 rounded-xl bg-gradient-to-tr ${feat.color} bg-opacity-10 text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white light:text-slate-800 font-outfit mt-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 light:text-slate-500 leading-relaxed flex-1">{feat.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Workflow Timeline */}
      <section id="workflow" className="max-w-7xl mx-auto px-6 py-20 relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-outfit text-white light:text-slate-900">
            How The AI Agent Pipeline Works
          </h2>
          <p className="text-slate-400 light:text-slate-500">
            From profile input parameters to curated prep outputs—fully automated in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="relative group text-left p-6 rounded-2xl glass-panel border-slate-900 light:border-indigo-50 flex flex-col justify-between h-64 hover:border-indigo-500/20 light:hover:border-indigo-400/50 transition-all duration-300">
              <div>
                <span className="text-5xl font-extrabold bg-gradient-to-r from-indigo-500/40 to-pink-500/30 light:from-indigo-600/30 light:to-pink-500/20 bg-clip-text text-transparent font-outfit">
                  {step.step}
                </span>
                <h4 className="text-lg font-bold text-white light:text-slate-800 font-outfit mt-4">{step.title}</h4>
              </div>
              <p className="text-xs text-slate-400 light:text-slate-500 leading-relaxed mt-2">{step.desc}</p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20 relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-outfit text-white light:text-slate-900">
            Success Stories
          </h2>
          <p className="text-slate-400 light:text-slate-500">
            Hear from engineering candidates who aced top tech interviews using our automated coaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="border-slate-800/40 light:border-indigo-100 text-left flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white font-outfit">AR</div>
              <div>
                <h5 className="font-bold text-sm text-white light:text-slate-800 font-outfit">Amit Rao</h5>
                <p className="text-[10px] text-indigo-400 light:text-indigo-650">Placed at Amazon (SDE-1)</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-650 leading-relaxed italic">
              "The AI Interview Simulator was a game changer. The grading identified my SQL scaling answers as incomplete, providing precise query optimizations which I actually ended up using in my real loop."
            </p>
          </GlassCard>

          <GlassCard className="border-slate-800/40 light:border-indigo-100 text-left flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center font-bold text-white font-outfit">SK</div>
              <div>
                <h5 className="font-bold text-sm text-white light:text-slate-800 font-outfit">Sneha Kapoor</h5>
                <p className="text-[10px] text-pink-400 light:text-pink-600 font-semibold">Placed at Microsoft (Data Scientist)</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-650 leading-relaxed italic">
              "My resume score was 48%. SkillPrep highlighted the missing machine learning keywords and created a roadmap that helped me learn PyTorch and build two projects. My score hit 88% and I got shortlisted!"
            </p>
          </GlassCard>

          <GlassCard className="border-slate-800/40 light:border-indigo-100 text-left flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-white font-outfit">JP</div>
              <div>
                <h5 className="font-bold text-sm text-white light:text-slate-800 font-outfit">Jayesh Patel</h5>
                <p className="text-[10px] text-amber-500 light:text-amber-600 font-semibold">Placed at Razorpay (Fullstack Developer)</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-650 leading-relaxed italic">
              "The checklists on the vertical roadmap kept me disciplined. Checking off tasks and seeing my progress bar tick upwards gave me the confidence to handle the system design rounds."
            </p>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="relative rounded-3xl p-8 md:p-16 text-center border border-indigo-500/20 light:border-indigo-200/50 glass-panel overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold font-outfit text-white light:text-slate-900 leading-tight">
            Ready to Ace Your Next Placement?
          </h2>
          <p className="mt-4 text-slate-400 light:text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Upload your resume, find gaps in your profile, build learning timelines, and practice mock tests under simulated conditions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl transition-all hover:scale-[1.03]"
            >
              Sign Up For Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl border border-slate-800 light:border-slate-300 bg-slate-950/40 light:bg-slate-100 hover:bg-slate-900/40 light:hover:bg-slate-200 text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 transition-all font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 light:border-slate-200 bg-slate-950/40 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-white light:text-slate-900 font-outfit">SkillPrep.AI</span>
          </div>
          <p>© 2026 SkillPrep AI Agent. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-350 light:hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-350 light:hover:text-slate-600">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
