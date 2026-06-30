import React, { useState } from 'react';
import { 
  Users, CheckCircle2, Clock, XCircle, Search, Filter, Trash2, 
  Download, RefreshCw, Printer, Check, X, FileText, Calendar, 
  MapPin, Phone, Mail, Award, BookOpen, Clock3, MessageSquare, Plus, FileSignature
} from 'lucide-react';
import { AdmissionSubmission, COURSES_MAP, STATES_LIST, SubmissionStatus } from '../types';
import { MOCK_SUBMISSIONS } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  submissions: AdmissionSubmission[];
  onUpdateSubmissions: (subs: AdmissionSubmission[]) => void;
  selectedIdFromForm?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  submissions, 
  onUpdateSubmissions,
  selectedIdFromForm
}) => {
  // Navigation & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedQualification, setSelectedQualification] = useState('');
  
  // Selection states
  const [selectedSubId, setSelectedSubId] = useState<string | null>(
    selectedIdFromForm || (submissions.length > 0 ? submissions[0].id : null)
  );

  // Remarks state
  const [adminNotes, setAdminNotes] = useState('');
  const [showPdfGuide, setShowPdfGuide] = useState(false);

  // Clear or re-seed mockup db
  const handleResetToMock = () => {
    if (confirm('Are you sure you want to reset the database and restore default mock applications?')) {
      onUpdateSubmissions(MOCK_SUBMISSIONS);
      if (MOCK_SUBMISSIONS.length > 0) {
        setSelectedSubId(MOCK_SUBMISSIONS[0].id);
      }
    }
  };

  const handleWipeDatabase = () => {
    if (confirm('Are you sure you want to completely erase all submissions? This cannot be undone.')) {
      onUpdateSubmissions([]);
      setSelectedSubId(null);
    }
  };

  // Status updates
  const handleUpdateStatus = (id: string, newStatus: SubmissionStatus) => {
    const updated = submissions.map(sub => {
      if (sub.id === id) {
        return { 
          ...sub, 
          status: newStatus,
          adminNotes: adminNotes.trim() ? adminNotes.trim() : sub.adminNotes 
        };
      }
      return sub;
    });
    onUpdateSubmissions(updated);
    alert(`Application successfully updated to status: ${newStatus.toUpperCase()}`);
    setAdminNotes('');
  };

  // Delete individual applicant
  const handleDeleteSubmission = (id: string) => {
    if (confirm('Delete this applicant permanent file?')) {
      const filtered = submissions.filter(sub => sub.id !== id);
      onUpdateSubmissions(filtered);
      if (selectedSubId === id) {
        setSelectedSubId(filtered.length > 0 ? filtered[0].id : null);
      }
    }
  };

  // Export filtered applicants as CSV
  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      alert('No records available to export.');
      return;
    }

    const headers = [
      'Registration No', 'Date Submitted', 'Status', 'Full Name', "Father's Name", 
      'DOB', 'Gender', 'Mobile', 'Email', 'Aadhaar No', 'City', 'State', 
      'Highest Qualification', 'Course', 'Duration', 'Preferred Batch'
    ];

    const rows = filteredSubmissions.map(sub => [
      sub.registrationNo,
      new Date(sub.dateSubmitted).toLocaleDateString(),
      sub.status.toUpperCase(),
      `"${sub.fullName.replace(/"/g, '""')}"`,
      `"${sub.fathersName.replace(/"/g, '""')}"`,
      sub.dob,
      sub.gender,
      sub.mobileNumber,
      sub.emailAddress || '',
      sub.aadhaarNumber || '',
      sub.villageCity || '',
      sub.state || '',
      sub.highestQualification || '',
      sub.selectCourse,
      sub.courseDuration,
      sub.preferredBatchTiming
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AIIT_Admissions_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate printable view for selected receipt
  const triggerPrint = () => {
    window.print();
  };

  // Math counts
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const verifiedCount = submissions.filter(s => s.status === 'verified').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  // Filter matrix logic
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.mobileNumber.includes(searchTerm) ||
      (sub.emailAddress && sub.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCourse = !selectedCourse || sub.selectCourse === selectedCourse;
    const matchesState = !selectedState || sub.state === selectedState;
    const matchesStatus = !selectedStatus || sub.status === selectedStatus;
    const matchesQualification = !selectedQualification || sub.highestQualification === selectedQualification;

    return matchesSearch && matchesCourse && matchesState && matchesStatus && matchesQualification;
  });

  // Highlight selected applicant
  const activeSubmission = submissions.find(s => s.id === selectedSubId) || null;

  // Render course-level counts
  const getCourseBreakdown = () => {
    const map: Record<string, number> = {};
    submissions.forEach(s => {
      map[s.selectCourse] = (map[s.selectCourse] || 0) + 1;
    });
    return Object.entries(map).map(([course, count]) => ({ course, count }));
  };

  const courseStats = getCourseBreakdown();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      
      {/* HEADER CONTROLS (No Print) */}
      <div className="no-print flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-gold-500 animate-ping" />
            <h1 className="text-2xl font-display font-extrabold text-brand-blue-900 tracking-tight">
              AIIT Academy Admission Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Secure Enrollment Administration & Document Verification Workspace
          </p>
        </div>

        {/* Database setup toggles */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center">
          <button
            onClick={handleResetToMock}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
            title="Restore default student files for testing charts and list search"
          >
            <RefreshCw size={14} />
            Reset to Mock Data
          </button>
          
          <button
            onClick={handleWipeDatabase}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer border border-red-200"
          >
            <Trash2 size={14} />
            Wipe DB
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-xs cursor-pointer"
          >
            <Download size={14} />
            Export Filtered ({filteredSubmissions.length})
          </button>
        </div>
      </div>

      {/* METRIC RIBBON (No Print) */}
      <div className="no-print grid grid-cols-2 lg:grid-cols-5 gap-4 py-6">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-lg bg-brand-blue-50 text-brand-blue-800">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
            <h3 className="text-xl font-extrabold text-brand-blue-900 font-mono mt-0.5">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Match</p>
            <h3 className="text-xl font-extrabold text-amber-700 font-mono mt-0.5">{pendingCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Profile</p>
            <h3 className="text-xl font-extrabold text-indigo-700 font-mono mt-0.5">{verifiedCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Seat</p>
            <h3 className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5">{approvedCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 col-span-2 lg:col-span-1">
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-100">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alerts/Rejected</p>
            <h3 className="text-xl font-extrabold text-rose-700 font-mono mt-0.5">{rejectedCount}</h3>
          </div>
        </div>

      </div>

      {/* DETAILED LAYOUT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: FILTERS, CHARTS & APPLICANT LIST (7 Cols) */}
        <div className="no-print lg:col-span-7 space-y-6">
          
          {/* SEARCH & FILTERS CONTROLS */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by candidate name, registration no, mobile, or email..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-brand-blue-100 focus:border-brand-blue-800 focus:outline-hidden transition-all duration-200"
              />
            </div>

            {/* GRID OF ADVANCED SELECT DROPDOWNS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">All Courses</option>
                  {Object.keys(COURSES_MAP).map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">All States</option>
                  {STATES_LIST.slice(0, 10).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Qual.</label>
                <select
                  value={selectedQualification}
                  onChange={(e) => setSelectedQualification(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">All Qualifications</option>
                  <option value="High School">High School</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Post Graduation">Post Graduation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected/Alert</option>
                </select>
              </div>
            </div>
          </div>

          {/* APPLICANT CARDS TABLE */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Registered Students List ({filteredSubmissions.length} shown)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Click card to load file details</span>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                <FileText className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-sm font-semibold">No applications found matching criteria.</p>
                <p className="text-xs mt-1">Try resetting the database or clearing the filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto no-scrollbar">
                {filteredSubmissions.map((sub) => {
                  const isSelected = sub.id === selectedSubId;
                  
                  // Status Styles
                  let statusBadge = '';
                  if (sub.status === 'approved') statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  else if (sub.status === 'verified') statusBadge = 'bg-indigo-50 text-indigo-700 border-indigo-100';
                  else if (sub.status === 'rejected') statusBadge = 'bg-rose-50 text-rose-700 border-rose-100';
                  else statusBadge = 'bg-amber-50 text-amber-700 border-amber-100';

                  return (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubId(sub.id);
                        setShowPdfGuide(false);
                      }}
                      className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'bg-brand-blue-50/40 border-l-4 border-brand-blue-800' 
                          : 'hover:bg-slate-50/50'
                        }
                      `}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800 truncate">
                            {sub.fullName}
                          </h4>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${statusBadge}`}>
                            {sub.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 mt-1 font-medium">
                          <span className="font-mono font-bold text-slate-500">
                            {sub.registrationNo}
                          </span>
                          <span>•</span>
                          <span className="text-slate-500">
                            Course: <strong>{sub.selectCourse}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(sub.dateSubmitted).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {sub.photo ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-2xs">
                            <img referrerPolicy="no-referrer" src={sub.photo} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-400 uppercase">
                            {sub.fullName.charAt(0)}
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubmission(sub.id);
                          }}
                          className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-300 transition-colors"
                          title="Delete file"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* COMPACT BENTO GRAPHICS */}
          {submissions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Custom SVG Bar Chart */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-brand-blue-800" />
                  Course Registry Distribution
                </h4>
                <div className="space-y-3.5">
                  {Object.keys(COURSES_MAP).map(code => {
                    const count = submissions.filter(s => s.selectCourse === code).length;
                    const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
                    return (
                      <div key={code}>
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                          <span>{code}</span>
                          <span className="font-mono">{count} seat{count !== 1 && 's'}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-brand-blue-800 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Batch Timing Circle Chart */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Clock3 size={14} className="text-brand-blue-800" />
                  Preferred Batch Allocation
                </h4>
                <div className="flex items-center justify-around h-full py-4">
                  {['Morning', 'Afternoon', 'Evening'].map(time => {
                    const count = submissions.filter(s => s.preferredBatchTiming === time).length;
                    const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
                    
                    let strokeColor = 'stroke-brand-blue-800';
                    if (time === 'Afternoon') strokeColor = 'stroke-brand-gold-500';
                    if (time === 'Evening') strokeColor = 'stroke-indigo-600';

                    return (
                      <div key={time} className="text-center">
                        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                          {/* Circle Pie Progress SVG */}
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" className="stroke-slate-100" strokeWidth="4" fill="transparent" />
                            <circle 
                              cx="32" 
                              cy="32" 
                              r="28" 
                              className={strokeColor} 
                              strokeWidth="4" 
                              fill="transparent" 
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-xs font-bold font-mono text-slate-700">
                            {Math.round(pct)}%
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mt-2">{time}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{count} candidate{count !== 1 && 's'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: APPLICANT FILE DOSSIER & VERIFICATION CARD (5 Cols) */}
        <div className="col-span-1 lg:col-span-5">
          
          {!activeSubmission ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 no-print">
              <Plus className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-sm font-semibold">No record selected</p>
              <p className="text-xs mt-1">Please select an applicant from the left list to inspect documents, issue receipts or manage enrollment verification.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* SUBMISSION VERIFIER PANEL (No Print) */}
              <div className="no-print bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                  <MessageSquare className="text-brand-blue-800" size={16} />
                  <h3 className="font-display font-bold text-sm text-brand-blue-900 uppercase tracking-wider">
                    Administrative Decision Panel
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Registrar Internal Remarks / Verification Feedback
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add document match details, fee collection status, batch assignment keys, or rejection reasons here..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-brand-blue-100 focus:border-brand-blue-800 focus:outline-hidden transition-all duration-200"
                    />
                    {activeSubmission.adminNotes && (
                      <div className="mt-2 bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Current Saved Note:</p>
                        <p className="text-xs text-slate-600 mt-1 leading-normal italic">{activeSubmission.adminNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* ACTION TRIGGER BUTTONS */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Update Application Status</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(activeSubmission.id, 'verified')}
                        className="inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
                      >
                        <Check size={14} />
                        Verify Documents
                      </button>
                      
                      <button
                        onClick={() => handleUpdateStatus(activeSubmission.id, 'approved')}
                        className="inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                      >
                        <Check size={14} strokeWidth={3} />
                        Approve Enrollment
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(activeSubmission.id, 'pending')}
                        className="inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
                      >
                        <Clock size={14} />
                        Hold / Reset
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(activeSubmission.id, 'rejected')}
                        className="inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                        Reject File
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Ready to print receipt?</span>
                    <button
                      onClick={triggerPrint}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-blue-800 hover:bg-brand-blue-50 border border-brand-blue-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Printer size={14} />
                      Open Print Menu
                    </button>
                  </div>

                </div>
              </div>

              {/* DOCUMENT UTILITIES (No Print) */}
              <div className="no-print bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Printer className="text-brand-blue-800 animate-pulse" size={16} />
                    <h4 className="font-display font-bold text-xs text-brand-blue-900 uppercase tracking-wider">
                      Dossier PDF & Print Utilities
                    </h4>
                  </div>
                  <span className="text-[9px] bg-brand-blue-100 text-brand-blue-800 font-extrabold uppercase px-2 py-0.5 rounded-sm">
                    A4 Optimized
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Export the active student’s complete registration summary as an official academic document. Use the professionally formatted docket below to print physical copies or archive files as a PDF.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      setShowPdfGuide(false);
                      window.print();
                    }}
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-white bg-brand-blue-800 hover:bg-brand-blue-700 active:bg-brand-blue-950 rounded-lg transition-all shadow-xs cursor-pointer select-none border-b-2 border-brand-blue-900 hover:translate-y-[1px] active:translate-y-[2px]"
                  >
                    <Printer size={14} />
                    Print Summary Receipt
                  </button>

                  <button
                    onClick={() => {
                      setShowPdfGuide(true);
                      setTimeout(() => {
                        window.print();
                      }, 400);
                    }}
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-all shadow-xs cursor-pointer select-none hover:translate-y-[1px]"
                  >
                    <Download size={14} className="text-amber-600" />
                    Save as PDF File
                  </button>
                </div>

                <AnimatePresence>
                  {showPdfGuide && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-3 text-[11px] text-amber-800 leading-relaxed space-y-1.5 mt-1">
                        <p className="font-extrabold uppercase tracking-wide flex items-center gap-1 text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                          How to Save as PDF:
                        </p>
                        <ol className="list-decimal pl-4 space-y-1 font-medium">
                          <li>In the print destination dropdown, select <strong className="font-bold">"Save as PDF"</strong> or <strong className="font-bold">"Print to PDF"</strong>.</li>
                          <li>Ensure headers/footers are unchecked for a clean, brand-compliant document.</li>
                          <li>Click <strong className="font-bold">Save</strong> and choose your local destination.</li>
                        </ol>
                        <button 
                          onClick={() => setShowPdfGuide(false)} 
                          className="text-[10px] text-brand-blue-800 font-bold hover:underline block mt-1"
                        >
                          Dismiss guide
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* DOCKET CARD: THIS CARD WILL BE HIGHLIGHTED AND REFORMATTED IN PRINT MEDIA */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-300 overflow-hidden relative print:shadow-none print:border-0 print:m-0">
                
                {/* Academic Header for print-only or elegant receipt */}
                <div className="bg-brand-blue-800 text-white p-6 relative">
                  {/* Decorative gold ribbon */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold-500" />
                  
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-[9px] font-bold tracking-widest text-amber-400 uppercase font-display">
                        OFFICIAL ADMISSION RECEIPT
                      </p>
                      <h2 className="text-xl font-display font-extrabold text-white mt-1">
                        AIIT Academy Portfolio
                      </h2>
                      <p className="text-[10px] text-brand-blue-100 mt-0.5">
                        Advanced Institute of Information Technology
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-brand-blue-200">Registration ID</p>
                      <p className="text-sm font-mono font-extrabold text-amber-300 mt-0.5">
                        {activeSubmission.registrationNo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  
                  {/* STUDENT PROFILE HIGHLIGHT AND ID PHOTO */}
                  <div className="flex flex-col md:flex-row gap-5 pb-5 border-b border-slate-100">
                    
                    <div className="w-24 h-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center relative mx-auto md:mx-0 shadow-xs">
                      {activeSubmission.photo ? (
                        <img referrerPolicy="no-referrer" src={activeSubmission.photo} alt="Passport Photo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-2 text-[10px] text-slate-300 font-bold uppercase">
                          No Photo Provided
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-brand-blue-800/80 text-white text-[8px] uppercase tracking-wider text-center py-1 font-bold">
                        AIIT Student
                      </div>
                    </div>

                    <div className="space-y-2 text-center md:text-left flex-1 min-w-0">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Student Name</p>
                        <h3 className="text-lg font-display font-extrabold text-slate-800 truncate">
                          {activeSubmission.fullName}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Father's Name</p>
                          <p className="font-semibold text-slate-700 truncate">{activeSubmission.fathersName}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Date of Birth</p>
                          <p className="font-semibold text-slate-700 font-mono">{activeSubmission.dob}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Gender</p>
                          <p className="font-semibold text-slate-700">{activeSubmission.gender}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Mobile No</p>
                          <p className="font-semibold text-slate-700 font-mono">{activeSubmission.mobileNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COURSE SELECTIONS */}
                  <div className="bg-brand-blue-50/40 border border-brand-blue-100/50 rounded-xl p-4 space-y-3.5">
                    <div className="flex items-center gap-2 pb-2 border-b border-brand-blue-100/30">
                      <BookOpen size={15} className="text-brand-blue-800" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue-900">
                        Course Enrollment Specifications
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div className="col-span-2">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Enrolled Course Name</p>
                        <p className="font-bold text-slate-800 mt-0.5">
                          {activeSubmission.selectCourse} - {COURSES_MAP[activeSubmission.selectCourse as keyof typeof COURSES_MAP]?.full || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Duration</p>
                        <p className="font-semibold text-slate-800 mt-0.5">{activeSubmission.courseDuration}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Batch Preference</p>
                        <p className="font-semibold text-slate-800 mt-0.5">{activeSubmission.preferredBatchTiming}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Dossier Status</p>
                        <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 bg-white border border-slate-200 rounded-sm">
                          {activeSubmission.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ADRESS & CONTACTS */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Address & Communication
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="col-span-2">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Full Address</p>
                        <p className="font-semibold text-slate-700 mt-0.5 leading-normal">
                          {activeSubmission.fullAddress || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">City/District</p>
                        <p className="font-semibold text-slate-700 mt-0.5">
                          {activeSubmission.villageCity || 'N/A'} / {activeSubmission.district || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">State & PIN</p>
                        <p className="font-semibold text-slate-700 mt-0.5">
                          {activeSubmission.state || 'N/A'} - {activeSubmission.pinCode || 'N/A'}
                        </p>
                      </div>
                      {activeSubmission.emailAddress && (
                        <div className="col-span-2">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Email ID</p>
                          <p className="font-semibold text-slate-700 mt-0.5 font-mono">{activeSubmission.emailAddress}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EDUCATIONAL METRICS */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Academic Background
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="col-span-2">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Institute Name</p>
                        <p className="font-semibold text-slate-700 mt-0.5">{activeSubmission.schoolCollegeName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Qualification</p>
                        <p className="font-semibold text-slate-700 mt-0.5">{activeSubmission.highestQualification || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Passing / Grade</p>
                        <p className="font-semibold text-slate-700 mt-0.5 font-mono">
                          {activeSubmission.passingYear || 'N/A'} ({activeSubmission.percentageGrade || 'N/A'})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENTS ATTACHMENTS AND SIGNATURE PREVIEWS */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Document Files & Signatures
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Signature Scan */}
                      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 flex flex-col items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase mb-2">Student Signature</span>
                        {activeSubmission.documentSignature ? (
                          <div className="w-full h-16 bg-white border border-slate-100 rounded-sm overflow-hidden flex items-center justify-center">
                            <img referrerPolicy="no-referrer" src={activeSubmission.documentSignature} alt="Signature" className="h-full max-w-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-full h-16 bg-slate-100 flex items-center justify-center text-slate-400 text-xs italic">
                            No signature uploaded
                          </div>
                        )}
                        <span className="text-[9px] text-slate-400 mt-1 font-mono">{activeSubmission.documentSignatureName || 'Signature_file.png'}</span>
                      </div>

                      {/* Aadhaar and Certificate Icons */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={16} className="text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-700 truncate">Aadhaar Card</span>
                          </div>
                          {activeSubmission.documentAadhaar ? (
                            <button
                              onClick={() => {
                                const w = window.open();
                                if (w) w.document.write(`<img src="${activeSubmission.documentAadhaar}" style="max-width:100%;" />`);
                              }}
                              className="text-[10px] font-bold text-brand-blue-800 hover:underline shrink-0"
                            >
                              Inspect
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Missing</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={16} className="text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-700 truncate">Academic Marksheet</span>
                          </div>
                          {activeSubmission.documentCertificate ? (
                            <button
                              onClick={() => {
                                const w = window.open();
                                if (w) w.document.write(`<img src="${activeSubmission.documentCertificate}" style="max-width:100%;" />`);
                              }}
                              className="text-[10px] font-bold text-brand-blue-800 hover:underline shrink-0"
                            >
                              Inspect
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Missing</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Declaration Acceptance Seal */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Verification Seal</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">
                        {activeSubmission.declarationAccepted 
                          ? "✓ Declaration verified. Applicant accepts terms." 
                          : "⚠️ Declaration pending validation."
                        }
                      </p>
                    </div>
                    {activeSubmission.status === 'approved' && (
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center font-bold text-[8px] text-emerald-700 uppercase tracking-widest text-center transform rotate-12 bg-emerald-50">
                        AIIT
                        <br />
                        SEAL
                      </div>
                    )}
                  </div>

                  {/* Signature Section for printed papers */}
                  <div className="hidden print:block pt-12">
                    <div className="flex justify-between text-xs mt-12">
                      <div className="text-center w-1/3">
                        <div className="border-b border-slate-400 mx-4 h-6"></div>
                        <p className="mt-1 font-semibold text-slate-600">Student Signature</p>
                      </div>
                      <div className="text-center w-1/3">
                        <div className="border-b border-slate-400 mx-4 h-6"></div>
                        <p className="mt-1 font-semibold text-slate-600">Registrar Stamp</p>
                      </div>
                      <div className="text-center w-1/3">
                        <div className="border-b border-slate-400 mx-4 h-6"></div>
                        <p className="mt-1 font-semibold text-slate-600">Director Signature</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
