import React, { useState, useEffect, FormEvent } from 'react';
import { AdmissionSubmission } from './types';
import { MOCK_SUBMISSIONS } from './mockData';
import { AdmissionForm } from './components/AdmissionForm';
import { AdminDashboard } from './components/AdminDashboard';
import { BookOpen, ShieldAlert, KeyRound, Check, School, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'student' | 'admin'>('student');
  const [submissions, setSubmissions] = useState<AdmissionSubmission[]>([]);
  const [newSubmissionId, setNewSubmissionId] = useState<string | undefined>(undefined);
  
  // Security lock for admin dashboard
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // 1. Initialize Submissions database
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aiit_admissions_db');
      if (stored) {
        setSubmissions(JSON.parse(stored));
      } else {
        // First load: seed with high-fidelity mock data
        setSubmissions(MOCK_SUBMISSIONS);
        localStorage.setItem('aiit_admissions_db', JSON.stringify(MOCK_SUBMISSIONS));
      }
    } catch (e) {
      console.error('Error loading submissions from LocalStorage:', e);
      setSubmissions(MOCK_SUBMISSIONS);
    }
  }, []);

  // 2. Persist database updates
  const handleUpdateSubmissions = (newSubs: AdmissionSubmission[]) => {
    setSubmissions(newSubs);
    try {
      localStorage.setItem('aiit_admissions_db', JSON.stringify(newSubs));
    } catch (e) {
      console.error('Error saving submissions to LocalStorage:', e);
    }
  };

  // 3. Handle a newly submitted student form
  const handleFormSubmitted = (newSubmission: AdmissionSubmission) => {
    // Check if submission already exists
    const exists = submissions.some(s => s.id === newSubmission.id);
    if (!exists) {
      const updated = [newSubmission, ...submissions];
      handleUpdateSubmissions(updated);
    }
    setNewSubmissionId(newSubmission.id);
  };

  // 4. PIN Authorization challenge
  const handleAuthorizeAdmin = (e: FormEvent) => {
    e.preventDefault();
    if (pinInput === '7665') {
      setIsAdminAuthorized(true);
      setShowPinModal(false);
      setPinError('');
      setPinInput('');
      setCurrentTab('admin');
    } else {
      setPinError('Incorrect security code.');
    }
  };

  const handleAdminTabClick = () => {
    if (isAdminAuthorized) {
      setCurrentTab('admin');
    } else {
      setShowPinModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      
      {/* PROFESSIONAL TOP NAV (No Print) */}
      <header className="no-print bg-brand-blue-800 border-b border-brand-blue-700 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Institute details */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500 flex items-center justify-center font-display font-black text-brand-blue-900 text-base sm:text-lg shadow-inner border border-amber-300 shrink-0 select-none">
              AIIT
            </div>
            <div className="flex flex-col">
              <h1 className="font-display font-black text-xs sm:text-sm text-white tracking-tight flex items-center gap-1.5 leading-none">
                AIIT Academy Admission Portal
              </h1>
              <p className="text-[8px] sm:text-[10px] text-brand-blue-100 mt-1 uppercase font-bold tracking-wider font-display leading-none">
                Advanced Institute of Information Technology
              </p>
            </div>
          </div>

          {/* Toggle Tab Navigation */}
          <div className="flex bg-brand-blue-900 p-1 rounded-xl border border-brand-blue-700 shrink-0">
            <button
              onClick={() => setCurrentTab('student')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer
                ${currentTab === 'student'
                  ? 'bg-amber-500 text-brand-blue-900 shadow-sm font-black'
                  : 'text-slate-200 hover:text-white'
                }
              `}
            >
              Student Portal
            </button>
            <button
              onClick={handleAdminTabClick}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer
                ${currentTab === 'admin'
                  ? 'bg-amber-500 text-brand-blue-900 shadow-sm font-black'
                  : 'text-slate-200 hover:text-white'
                }
              `}
            >
              Registrar Dashboard
              {!isAdminAuthorized && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Security PIN protected" />}
            </button>
          </div>

        </div>
      </header>

      {/* PORTAL MAIN STAGE */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentTab === 'student' ? (
            <motion.div
              key="student-portal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdmissionForm 
                onSubmitSuccess={handleFormSubmitted} 
                onNavigateToAdmin={() => {
                  // Keep PIN protection secure; open PIN modal if they try to switch
                  setShowPinModal(true);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="admin-portal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminDashboard 
                submissions={submissions} 
                onUpdateSubmissions={handleUpdateSubmissions}
                selectedIdFromForm={newSubmissionId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER ACCENTS (No Print) */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-500">
            © 2026 AIIT – Advanced Institute of Information Technology. All rights reserved.
          </p>
          <div className="flex justify-center items-center gap-3.5 text-[10px]">
            <span>ISO 9001:2015 Registered Institute</span>
            <span className="text-slate-300">•</span>
            <span>Security & Data Encryption Standard v2.1</span>
            <span className="text-slate-300">•</span>
            <span>Contact Helpline: +91 98765 43210</span>
          </div>
        </div>
      </footer>

      {/* SECURITY PIN POPUP MODAL (No Print) */}
      <AnimatePresence>
        {showPinModal && (
          <div className="no-print fixed inset-0 z-50 bg-brand-blue-900/65 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full overflow-hidden"
            >
              {/* Header Accent */}
              <div className="bg-brand-blue-800 p-6 text-white text-center relative">
                <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 mb-3 border border-amber-500/20">
                  <KeyRound size={22} />
                </div>
                <h3 className="font-display font-extrabold text-base tracking-tight">
                  Security Gateway Authorization
                </h3>
                <p className="text-[10px] text-brand-blue-200 mt-1">
                  Registrar access is restricted to verified AIIT staff members
                </p>
                <button
                  onClick={() => setShowPinModal(false)}
                  className="absolute right-4 top-4 p-1 rounded-lg text-brand-blue-200 hover:bg-brand-blue-700/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleAuthorizeAdmin} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                    Enter Registrar passcode PIN:
                  </label>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError('');
                    }}
                    placeholder="Enter security code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-center text-sm tracking-widest text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-blue-100 focus:border-brand-blue-800 transition-all font-mono font-bold"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-red-500 text-xs mt-2 font-medium text-center">
                      {pinError}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="w-1/2 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 text-xs font-bold rounded-lg bg-brand-blue-800 hover:bg-brand-blue-900 text-white shadow-md shadow-brand-blue-900/10 cursor-pointer"
                  >
                    Authorize Pass
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
