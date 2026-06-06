import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { interviewAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Spinner, AILoader } from '../components/Loaders';
import { 
  Mic, 
  Play, 
  ArrowRight, 
  Clock, 
  HelpCircle, 
  Award,
  BookOpen
} from 'lucide-react';

const EqualizerWave = () => (
  <div className="flex items-center gap-1 h-5 px-2.5 rounded-lg bg-slate-950 light:bg-slate-200 border border-slate-900/60 light:border-slate-300 text-indigo-400 light:text-indigo-650 shrink-0">
    <div className="w-0.75 h-full bg-current rounded-full animate-soundwave-1 origin-bottom"></div>
    <div className="w-0.75 h-full bg-current rounded-full animate-soundwave-2 origin-bottom"></div>
    <div className="w-0.75 h-full bg-current rounded-full animate-soundwave-3 origin-bottom"></div>
    <div className="w-0.75 h-full bg-current rounded-full animate-soundwave-4 origin-bottom"></div>
    <div className="w-0.75 h-full bg-current rounded-full animate-soundwave-5 origin-bottom"></div>
  </div>
);

const InterviewPrep = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [step, setStep] = useState('setup');
  const [loading, setLoading] = useState(false);

  const [interviewType, setInterviewType] = useState('Technical');
  const [topic, setTopic] = useState('');

  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const [result, setResult] = useState({ score: 0, feedback: [] });

  const startTimer = () => {
    setSecondsElapsed(0);
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  useEffect(() => {
    return () => stopTimer();
  }, [timerInterval]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.start({
        userId: user.id,
        interviewType,
        topic: topic || 'General software development'
      });
      setInterviewId(res.data.interviewId);
      setQuestions(res.data.generatedQuestions || []);
      setCurrentQuestionIndex(0);
      setUserAnswers(new Array(res.data.generatedQuestions?.length || 3).fill(''));
      setCurrentAnswer('');
      setStep('active');
      startTimer();
      showNotification('AI mock interview started!', 'info');
    } catch (error) {
      console.error(error);
      showNotification('Failed to generate interview questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = currentAnswer;
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer(userAnswers[currentQuestionIndex + 1] || '');
    } else {
      handleSubmitInterview(updatedAnswers);
    }
  };

  const handleSubmitInterview = async (finalAnswers) => {
    stopTimer();
    setStep('grading');
    try {
      const res = await interviewAPI.submit({
        interviewId,
        userAnswers: finalAnswers
      });
      setResult({
        score: res.data.score || 0,
        feedback: res.data.feedback || []
      });
      setStep('result');
      showNotification('Interview graded successfully!', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Failed to submit interview answers', 'error');
      setStep('setup');
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold font-outfit text-white light:text-slate-900 tracking-wide">AI Mock Interview</h2>
        <p className="text-slate-400 light:text-slate-500 mt-1 text-sm">Simulate live technical or behavioral placement interviews</p>
      </div>

      {step === 'setup' && (
        // Pre-Interview Setup screen
        <div className="max-w-2xl mx-auto">
          <GlassCard className="border-slate-800/40 light:border-indigo-150 p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 light:text-indigo-650">
                <Mic className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white light:text-slate-800 font-outfit">Configure Assessment</h3>
            </div>

            <div className="space-y-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">Assessment Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full bg-slate-950/60 light:bg-slate-205 border border-slate-800 light:border-slate-300 focus:border-indigo-500/60 rounded-xl px-4 py-3 text-sm text-slate-205 light:text-slate-700 focus:outline-none"
                >
                  <option value="Technical">Technical (Coding & Architecture)</option>
                  <option value="Behavioral">Behavioral (HR & Management)</option>
                  <option value="System Design">System Design (Distributed Systems)</option>
                </select>
              </div>

              {/* Topic */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">Interview Topic (Optional)</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. React hooks, Database indexes, System scaling"
                  className="w-full bg-slate-950/60 light:bg-slate-205 border border-slate-800 light:border-slate-300 focus:border-indigo-500/60 rounded-xl px-4 py-3 text-sm text-slate-100 light:text-slate-750 placeholder-slate-650 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              Launch Assessment
            </button>
          </GlassCard>
        </div>
      )}

      {step === 'active' && (
        // Active Question Screen
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 light:text-indigo-650 uppercase tracking-widest bg-indigo-500/10 light:bg-indigo-50 border border-indigo-500/20 px-3 py-1 rounded-full">
              QUESTION {currentQuestionIndex + 1} OF {questions.length}
            </span>
            <div className="flex items-center gap-3.5">
              {/* Equalizer Soundwave Motion Graphic */}
              <EqualizerWave />
              
              <div className="flex items-center gap-2 text-slate-400 light:text-slate-600 font-mono text-sm bg-slate-950 light:bg-slate-200 border border-slate-800 light:border-slate-300 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-pink-400 light:text-pink-600 animate-pulse" />
                <span>{formatTime(secondsElapsed)}</span>
              </div>
            </div>
          </div>

          <GlassCard className="border-slate-800/40 light:border-indigo-150 p-8 space-y-6">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 rounded-xl bg-slate-900 light:bg-slate-200 border border-slate-800 light:border-slate-300 text-indigo-400 light:text-indigo-650 shrink-0 animate-bounce">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 light:text-slate-800 leading-snug font-outfit mt-1.5">
                {questions[currentQuestionIndex]}
              </h4>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-widest">Your Answer</label>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your response here... Be detailed and structure your solution."
                rows={6}
                className="w-full bg-slate-950/60 light:bg-slate-205 border border-slate-800 light:border-slate-300 focus:border-indigo-500/60 rounded-2xl p-4 text-sm text-slate-202 light:text-slate-700 placeholder-slate-650 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-505 light:text-slate-500 italic">Answers are analyzed for terminology, semantics and accuracy.</span>
              
              <button
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-550 text-white font-bold text-xs disabled:opacity-55 disabled:cursor-not-allowed transition-all"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish & Grade' : 'Next Question'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {step === 'grading' && (
        // Grading loader
        <div className="h-[60vh] flex items-center justify-center">
          <AILoader message="AI agent is scanning your transcripts and running grading matrix tests..." />
        </div>
      )}

      {step === 'result' && (
        // Result details
        <div className="max-w-3xl mx-auto space-y-6">
          <GlassCard className="border-slate-800/40 light:border-indigo-150 text-center p-8 flex flex-col items-center">
            <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 light:text-indigo-650 mb-4 animate-scale-in">
              <Award className="w-12 h-12" />
            </div>
            
            <h3 className="text-2xl font-bold text-white light:text-slate-800 font-outfit">Assessment Complete</h3>
            
            <div className="mt-6 flex flex-col items-center">
              <span className="text-6xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-500 light:from-indigo-600 light:to-pink-650 bg-clip-text text-transparent tracking-tighter font-outfit">
                {result.score}/100
              </span>
              <span className="text-xs font-semibold text-slate-400 light:text-slate-500 tracking-wider uppercase mt-2">Overall Interview Rating</span>
            </div>

            <p className="text-xs text-slate-400 light:text-slate-500 mt-4 max-w-sm leading-relaxed">
              Review specific AI coaching inputs below to understand strengths and missing terminology in your answers.
            </p>
          </GlassCard>

          {/* Feedback Cards */}
          <GlassCard className="border-slate-800/40 light:border-indigo-150 space-y-6">
            <h4 className="text-md font-bold text-white light:text-slate-800 font-outfit flex items-center gap-2 border-b border-slate-900 light:border-slate-200 pb-4 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Evaluation Transcript & Critique
            </h4>

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={idx} className="space-y-3 p-5 rounded-2xl bg-slate-950 light:bg-slate-100 border border-slate-900/60 light:border-slate-300/60 animate-scroll-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="flex gap-2.5 items-start">
                    <span className="text-xs font-bold text-slate-400 light:text-slate-500 font-mono mt-0.5">Q{idx + 1}:</span>
                    <h5 className="text-sm font-semibold text-slate-200 light:text-slate-800 leading-snug">{q}</h5>
                  </div>
                  
                  <div className="text-xs space-y-2 pt-2 border-t border-slate-900/40 light:border-slate-200">
                    <p className="text-slate-400 light:text-slate-500 leading-relaxed">
                      <strong className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px] mb-1">Your response:</strong>
                      "{userAnswers[idx] || 'No response provided'}"
                    </p>
                    
                    <p className="text-indigo-300 light:text-indigo-650 leading-relaxed bg-indigo-950/20 light:bg-indigo-50/50 p-3 rounded-xl border border-indigo-500/10 light:border-indigo-200/50">
                      <strong className="text-indigo-400 light:text-indigo-600 font-semibold uppercase tracking-wider block text-[10px] mb-1">AI Critique:</strong>
                      {result.feedback[idx] || 'Response processed.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setStep('setup')}
                className="px-8 py-3.5 rounded-xl bg-indigo-650 hover:bg-indigo-550 text-white font-bold text-sm shadow-xl transition-all"
              >
                Practice Another Assessment
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
