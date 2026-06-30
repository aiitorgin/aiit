import React, { useState, useRef, useEffect } from 'react';
import { 
  User, MapPin, GraduationCap, BookOpen, FileCheck, ShieldAlert,
  Send, RotateCcw, Eye, ArrowRight, CheckCircle2, ClipboardList,
  Printer, MessageSquare, Calendar, Mail, Phone, Award, Clock3, Check, X, FileText
} from 'lucide-react';
import { AdmissionSubmission, STATES_LIST, QUALIFICATIONS_LIST, DURATIONS_LIST, BATCH_TIMINGS_LIST, COURSES_MAP } from '../types';
import { TextInput, DropdownInput, RadioInput, FileUploadInput, CheckboxInput } from './FormFields';
import { motion, AnimatePresence } from 'motion/react';

interface AdmissionFormProps {
  onSubmitSuccess: (submission: AdmissionSubmission) => void;
  onNavigateToAdmin: () => void;
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ onSubmitSuccess, onNavigateToAdmin }) => {
  // State for active card tracking
  const [activeCard, setActiveCard] = useState<string>('full-name');

  // Validation States (Hoisted)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [createdSubmission, setCreatedSubmission] = useState<AdmissionSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetailedReceipt, setShowDetailedReceipt] = useState(false);
  
  // Helper to read draft from localStorage
  const getDraftVal = (key: string, fallback: any) => {
    try {
      const draft = localStorage.getItem('aiit_admission_form_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed[key] !== undefined) return parsed[key];
      }
    } catch {}
    return fallback;
  };

  // Form State with automatic local draft recovery
  const [fullName, setFullName] = useState(() => getDraftVal('fullName', ''));
  const [fathersName, setFathersName] = useState(() => getDraftVal('fathersName', ''));
  const [mothersName, setMothersName] = useState(() => getDraftVal('mothersName', ''));
  const [dob, setDob] = useState(() => getDraftVal('dob', ''));
  const [gender, setGender] = useState(() => getDraftVal('gender', 'Male'));
  const [mobileNumber, setMobileNumber] = useState(() => getDraftVal('mobileNumber', ''));
  const [whatsAppNumber, setWhatsAppNumber] = useState(() => getDraftVal('whatsAppNumber', ''));
  const [emailAddress, setEmailAddress] = useState(() => getDraftVal('emailAddress', ''));
  const [aadhaarNumber, setAadhaarNumber] = useState(() => getDraftVal('aadhaarNumber', ''));
  const [photo, setPhoto] = useState<string | undefined>(() => getDraftVal('photo', undefined));
  const [photoName, setPhotoName] = useState<string | undefined>(() => getDraftVal('photoName', undefined));

  const [fullAddress, setFullAddress] = useState(() => getDraftVal('fullAddress', ''));
  const [villageCity, setVillageCity] = useState(() => getDraftVal('villageCity', ''));
  const [district, setDistrict] = useState(() => getDraftVal('district', ''));
  const [state, setState] = useState(() => getDraftVal('state', ''));
  const [pinCode, setPinCode] = useState(() => getDraftVal('pinCode', ''));

  const [highestQualification, setHighestQualification] = useState(() => getDraftVal('highestQualification', ''));
  const [schoolCollegeName, setSchoolCollegeName] = useState(() => getDraftVal('schoolCollegeName', ''));
  const [passingYear, setPassingYear] = useState(() => getDraftVal('passingYear', ''));
  const [percentageGrade, setPercentageGrade] = useState(() => getDraftVal('percentageGrade', ''));

  const [selectCourse, setSelectCourse] = useState(() => getDraftVal('selectCourse', ''));
  const [courseDuration, setCourseDuration] = useState(() => getDraftVal('courseDuration', ''));
  const [preferredBatchTiming, setPreferredBatchTiming] = useState(() => getDraftVal('preferredBatchTiming', 'Morning'));

  const [documentAadhaar, setDocumentAadhaar] = useState<string | undefined>(() => getDraftVal('documentAadhaar', undefined));
  const [documentAadhaarName, setDocumentAadhaarName] = useState<string | undefined>(() => getDraftVal('documentAadhaarName', undefined));
  const [documentCertificate, setDocumentCertificate] = useState<string | undefined>(() => getDraftVal('documentCertificate', undefined));
  const [documentCertificateName, setDocumentCertificateName] = useState<string | undefined>(() => getDraftVal('documentCertificateName', undefined));
  const [documentSignature, setDocumentSignature] = useState<string | undefined>(() => getDraftVal('documentSignature', undefined));
  const [documentSignatureName, setDocumentSignatureName] = useState<string | undefined>(() => getDraftVal('documentSignatureName', undefined));

  const [declarationAccepted, setDeclarationAccepted] = useState(() => getDraftVal('declarationAccepted', false));

  // Autosave Status: idle | saving | saved
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');

  // Debounced Autosave engine
  useEffect(() => {
    // Skip saving if we are in the success screen view
    if (formSubmitted) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        const draft = {
          fullName, fathersName, mothersName, dob, gender, mobileNumber, whatsAppNumber,
          emailAddress, aadhaarNumber, fullAddress, villageCity, district, state, pinCode,
          highestQualification, schoolCollegeName, passingYear, percentageGrade,
          selectCourse, courseDuration, preferredBatchTiming, declarationAccepted,
          photoName, photo, documentAadhaarName, documentAadhaar,
          documentCertificateName, documentCertificate, documentSignatureName, documentSignature
        };
        localStorage.setItem('aiit_admission_form_draft', JSON.stringify(draft));
        setSaveStatus('saved');
      } catch (e) {
        console.warn('Draft failed saving with files, retrying without files to fit quota:', e);
        try {
          const draftNoFiles = {
            fullName, fathersName, mothersName, dob, gender, mobileNumber, whatsAppNumber,
            emailAddress, aadhaarNumber, fullAddress, villageCity, district, state, pinCode,
            highestQualification, schoolCollegeName, passingYear, percentageGrade,
            selectCourse, courseDuration, preferredBatchTiming, declarationAccepted
          };
          localStorage.setItem('aiit_admission_form_draft', JSON.stringify(draftNoFiles));
          setSaveStatus('saved');
        } catch (err) {
          console.error('Autosave fully failed:', err);
          setSaveStatus('idle');
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    fullName, fathersName, mothersName, dob, gender, mobileNumber, whatsAppNumber,
    emailAddress, aadhaarNumber, fullAddress, villageCity, district, state, pinCode,
    highestQualification, schoolCollegeName, passingYear, percentageGrade,
    selectCourse, courseDuration, preferredBatchTiming, declarationAccepted,
    photo, photoName, documentAadhaar, documentAadhaarName,
    documentCertificate, documentCertificateName, documentSignature, documentSignatureName,
    formSubmitted
  ]);

  // Autofill mock demo action handler with premium graphic placeholders
  const handleAutofill = () => {
    const mockPhoto = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='100%' height='100%' fill='%231e293b'/><circle cx='75' cy='60' r='30' fill='%23f59e0b'/><path d='M35,120 C35,95 115,95 115,120' fill='%23f59e0b'/><text x='50%' y='140' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%23ffffff' font-weight='bold'>AIIT PORTRAIT</text></svg>";
    const mockAadhaar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='180' viewBox='0 0 300 180'><rect width='100%' height='100%' fill='%23f8fafc' stroke='%23cbd5e1' stroke-width='2'/><rect width='100%' height='20' fill='%230f172a'/><text x='15' y='50' font-family='sans-serif' font-size='12' font-weight='bold' fill='%230f172a'>AADHAAR CARD</text><text x='15' y='80' font-family='sans-serif' font-size='10' fill='%23475569'>Name: Rahul Sharma</text><text x='15' y='100' font-family='sans-serif' font-size='10' fill='%23475569'>Year of Birth: 1999</text><text x='15' y='120' font-family='sans-serif' font-size='10' fill='%23475569'>Gender: Male</text><text x='15' y='150' font-family='sans-serif' font-size='14' font-weight='bold' fill='%230f172a'>1234 5678 9012</text></svg>";
    const mockCert = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='180' viewBox='0 0 300 180'><rect width='100%' height='100%' fill='%23fdfbf7' stroke='%23d97706' stroke-width='3'/><text x='50%' y='40' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='16' font-weight='bold' fill='%2378350f'>DEGREE CERTIFICATE</text><text x='50%' y='80' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%23451a03'>Bangalore University</text><text x='50%' y='110' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' font-weight='bold' fill='%230f172a'>RAHUL SHARMA</text><text x='50%' y='140' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='8' fill='%2378350f'>ISO 9001:2015 CERTIFIED</text></svg>";
    const mockSign = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='80' viewBox='0 0 200 80'><rect width='100%' height='100%' fill='%23ffffff'/><path d='M20,50 Q60,10 100,50 T180,30' fill='none' stroke='%231d4ed8' stroke-width='2' stroke-linecap='round'/><text x='15' y='75' font-family='monospace' font-size='8' fill='%2394a3b8'>RAHUL SHARMA SIGNATURE</text></svg>";

    setFullName('Rahul Sharma');
    setFathersName('Vijay Sharma');
    setMothersName('Sunita Sharma');
    setDob('1999-08-15');
    setGender('Male');
    setMobileNumber('9876543210');
    setWhatsAppNumber('9876543210');
    setEmailAddress('rahul.sharma@example.com');
    setAadhaarNumber('123456789012');
    
    setPhoto(mockPhoto);
    setPhotoName('rahul_passport_photo.png');
    
    setFullAddress('104, Royal Palms Apartment, MG Road');
    setVillageCity('Bangalore');
    setDistrict('Bangalore Urban');
    setState('Karnataka');
    setPinCode('560001');
    
    setHighestQualification('Graduation');
    setSchoolCollegeName('Bangalore University');
    setPassingYear('2024');
    setPercentageGrade('82.5%');
    
    setSelectCourse('ADCA');
    setCourseDuration('12 Months');
    setPreferredBatchTiming('Morning');
    
    setDocumentAadhaar(mockAadhaar);
    setDocumentAadhaarName('rahul_aadhaar_card.png');
    setDocumentCertificate(mockCert);
    setDocumentCertificateName('rahul_bca_degree.png');
    setDocumentSignature(mockSign);
    setDocumentSignatureName('rahul_signature_scan.png');
    
    setDeclarationAccepted(true);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // References to form fields for auto-scrolling on error
  const fieldRefs = {
    fullName: useRef<HTMLDivElement>(null),
    fathersName: useRef<HTMLDivElement>(null),
    dob: useRef<HTMLDivElement>(null),
    mobileNumber: useRef<HTMLDivElement>(null),
    emailAddress: useRef<HTMLDivElement>(null),
    declarationAccepted: useRef<HTMLDivElement>(null),
  };

  // Generate Year List (e.g. 1990 to 2026)
  const yearsList = Array.from({ length: 30 }, (_, i) => String(2026 - i));

  // Auto-populate some course fields dynamically when course is selected (e.g. ADCA has 12m duration)
  useEffect(() => {
    if (selectCourse) {
      if (['ADCA', 'HDCA', 'ADFA'].includes(selectCourse)) {
        setCourseDuration('12 Months');
      } else if (['DCA', 'DIFA'].includes(selectCourse)) {
        setCourseDuration('6 Months');
      } else if (['CFA', 'COA', 'CCA'].includes(selectCourse)) {
        setCourseDuration('3 Months');
      }
    }
  }, [selectCourse]);

  // Handle live calculation of completed fields
  const getProgressStats = () => {
    const requiredFields = [
      { key: 'fullName', val: fullName },
      { key: 'fathersName', val: fathersName },
      { key: 'dob', val: dob },
      { key: 'mobileNumber', val: mobileNumber },
      { key: 'declaration', val: declarationAccepted }
    ];
    const completedRequired = requiredFields.filter(f => f.val).length;
    return {
      completedRequired,
      totalRequired: requiredFields.length,
      percentage: Math.round((completedRequired / requiredFields.length) * 100)
    };
  };

  // Run full form validations
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!fathersName.trim()) newErrors.fathersName = "Father's Name is required.";
    if (!dob) newErrors.dob = 'Date of Birth is required.';
    
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required.';
    } else if (!/^\d{10}$/.test(mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (emailAddress.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())) {
      newErrors.emailAddress = 'Please enter a valid email address.';
    }

    if (!declarationAccepted) {
      newErrors.declarationAccepted = 'You must accept the declaration to submit your application.';
    }

    setErrors(newErrors);

    // Scroll to the first error
    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      const ref = fieldRefs[firstErrorKey as keyof typeof fieldRefs];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  const handleResetForm = () => {
    try {
      localStorage.removeItem('aiit_admission_form_draft');
    } catch {}
    setSaveStatus('idle');
    setFullName('');
    setFathersName('');
    setMothersName('');
    setDob('');
    setGender('Male');
    setMobileNumber('');
    setWhatsAppNumber('');
    setEmailAddress('');
    setAadhaarNumber('');
    setPhoto(undefined);
    setPhotoName(undefined);
    setFullAddress('');
    setVillageCity('');
    setDistrict('');
    setState('');
    setPinCode('');
    setHighestQualification('');
    setSchoolCollegeName('');
    setPassingYear('');
    setPercentageGrade('');
    setSelectCourse('');
    setCourseDuration('');
    setPreferredBatchTiming('Morning');
    setDocumentAadhaar(undefined);
    setDocumentAadhaarName(undefined);
    setDocumentCertificate(undefined);
    setDocumentCertificateName(undefined);
    setDocumentSignature(undefined);
    setDocumentSignatureName(undefined);
    setDeclarationAccepted(false);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Create a new professional registration number: AIIT-2026-XXXX
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const regNo = `AIIT-2026-${randomDigits}`;

    const submission: AdmissionSubmission = {
      id: `sub-${Date.now()}`,
      registrationNo: regNo,
      dateSubmitted: new Date().toISOString(),
      status: 'pending',
      
      fullName,
      fathersName,
      mothersName: mothersName || undefined,
      dob,
      gender,
      mobileNumber,
      whatsAppNumber: whatsAppNumber || undefined,
      emailAddress: emailAddress || undefined,
      aadhaarNumber: aadhaarNumber || undefined,
      photo,
      photoName,

      fullAddress: fullAddress || undefined,
      villageCity: villageCity || undefined,
      district: district || undefined,
      state: state || undefined,
      pinCode: pinCode || undefined,

      highestQualification: highestQualification || undefined,
      schoolCollegeName: schoolCollegeName || undefined,
      passingYear: passingYear || undefined,
      percentageGrade: percentageGrade || undefined,

      selectCourse,
      courseDuration,
      preferredBatchTiming,

      documentAadhaar,
      documentAadhaarName,
      documentCertificate,
      documentCertificateName,
      documentSignature,
      documentSignatureName,

      declarationAccepted
    };

    try {
      // Integrate FormSubmit.co via AJAX (POST json)
      await fetch("https://formsubmit.co/ajax/aiit.org.in@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "_subject": `New AIIT Admission - ${fullName} (${regNo})`,
          "Registration ID": regNo,
          "Full Name": fullName,
          "Father's Name": fathersName,
          "Mother's Name": mothersName || 'N/A',
          "Date of Birth": dob,
          "Gender": gender,
          "Mobile Number": mobileNumber,
          "WhatsApp Number": whatsAppNumber || 'Same',
          "Email Address": emailAddress || 'N/A',
          "Aadhaar Number": aadhaarNumber || 'N/A',
          "Full Address": fullAddress || 'N/A',
          "City/Village": villageCity || 'N/A',
          "District": district || 'N/A',
          "State": state || 'N/A',
          "PIN Code": pinCode || 'N/A',
          "Highest Qualification": highestQualification || 'N/A',
          "School/College Name": schoolCollegeName || 'N/A',
          "Passing Year": passingYear || 'N/A',
          "Percentage/Grade": percentageGrade || 'N/A',
          "Selected Course": `${selectCourse} - ${COURSES_MAP[selectCourse as keyof typeof COURSES_MAP]?.full || ''}`,
          "Duration": courseDuration,
          "Preferred Batch": preferredBatchTiming,
          "Aadhaar Doc": documentAadhaarName || 'No Aadhaar Copy uploaded',
          "Certificate Doc": documentCertificateName || 'No Certificate uploaded',
          "Signature Doc": documentSignatureName || 'No Signature uploaded',
          "_honey": ""
        })
      });
    } catch (err) {
      console.error("Failed sending email via FormSubmit:", err);
    } finally {
      setIsSubmitting(false);
      try {
        localStorage.removeItem('aiit_admission_form_draft');
      } catch (err) {
        console.error('Failed clearing local draft:', err);
      }
      setCreatedSubmission(submission);
      setFormSubmitted(true);
      onSubmitSuccess(submission);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stats = getProgressStats();

  const buildWhatsAppUrl = (sub: AdmissionSubmission) => {
    const phone = '+918792913000';
    const text = `*AIIT ADMISSION REGISTRATION RECORD*
----------------------------------------
*Registration ID:* ${sub.registrationNo}
*Date Submitted:* ${new Date(sub.dateSubmitted).toLocaleDateString()}
*Student Name:* ${sub.fullName}
*Father's Name:* ${sub.fathersName}
*Mother's Name:* ${sub.mothersName || 'N/A'}
*DOB:* ${sub.dob}
*Gender:* ${sub.gender}
*Mobile No:* ${sub.mobileNumber}
*WhatsApp No:* ${sub.whatsAppNumber || 'Same'}
*Email Address:* ${sub.emailAddress || 'N/A'}
*Selected Course:* ${sub.selectCourse} (${COURSES_MAP[sub.selectCourse as keyof typeof COURSES_MAP]?.full || ''})
*Duration:* ${sub.courseDuration}
*Batch timing:* ${sub.preferredBatchTiming}
*Address:* ${sub.fullAddress || 'N/A'}, ${sub.villageCity || 'N/A'}, ${sub.district || 'N/A'}, ${sub.state || 'N/A'} - ${sub.pinCode || 'N/A'}
----------------------------------------
_Please process my admission form. Thank you!_`;
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
  };

  // If form is submitted, show the gorgeous success message
  if (formSubmitted && createdSubmission) {
    const whatsAppUrl = buildWhatsAppUrl(createdSubmission);

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!showDetailedReceipt ? (
            <motion.div 
              key="success-card"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-xl shadow-xl border border-brand-blue-100 overflow-hidden no-print"
            >
              {/* Accent Ribbon */}
              <div className="h-2 bg-gradient-to-r from-brand-blue-800 via-amber-400 to-brand-blue-600" />
              
              <div className="p-6 sm:p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-5 border border-green-100">
                  <CheckCircle2 size={36} className="animate-pulse" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-blue-900 tracking-tight">
                  Admission Form Submitted!
                </h1>
                
                <p className="text-slate-500 font-medium text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
                  Your records have been uploaded to our secure registrar database and sent to our team.
                </p>

                {/* Important notice: send on WhatsApp */}
                <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-[11px] sm:text-xs font-bold max-w-md mx-auto rounded-lg border border-emerald-200">
                  📢 Action Required: Please click "Send Copy to WhatsApp" to share your registration details directly with our support on +91 87929 13000!
                </div>

                <div className="my-6 max-w-md mx-auto bg-slate-50 rounded-lg border border-slate-200 p-4 text-left text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Student Profile</span>
                    <span className="text-[10px] font-mono font-bold text-brand-blue-800 bg-brand-blue-50 px-2 py-0.5 rounded-sm">
                      ACTIVE REGISTRATION
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Applicant Name</span>
                      <span className="font-bold text-slate-800">{createdSubmission.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Registration ID</span>
                      <span className="font-mono font-black text-amber-600">{createdSubmission.registrationNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Selected Course</span>
                      <span className="font-bold text-slate-800">
                        {createdSubmission.selectCourse ? `${createdSubmission.selectCourse} (${COURSES_MAP[createdSubmission.selectCourse as keyof typeof COURSES_MAP]?.full || ''})` : 'Not Selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Batch Preference</span>
                      <span className="font-bold text-slate-800">{createdSubmission.preferredBatchTiming}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    Send Copy to WhatsApp
                  </a>

                  <button
                    onClick={() => setShowDetailedReceipt(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-brand-blue-800 hover:bg-brand-blue-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    <Eye size={14} />
                    View Admission Receipt
                  </button>

                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setCreatedSubmission(null);
                      handleResetForm();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-slate-200"
                  >
                    <RotateCcw size={14} />
                    New Form
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detailed-receipt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-5"
            >
              {/* Back & utility controls (Hidden on Print) */}
              <div className="flex flex-wrap items-center justify-between gap-3 no-print bg-slate-100 p-3 rounded-md border border-slate-200">
                <button
                  onClick={() => setShowDetailedReceipt(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-md border border-slate-300 transition-colors cursor-pointer"
                >
                  ← Back to Submission
                </button>
                <div className="flex gap-2">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    WhatsApp Support
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-brand-blue-800 hover:bg-brand-blue-900 text-white rounded-md transition-colors cursor-pointer"
                  >
                    <Printer size={14} />
                    Print Receipt
                  </button>
                </div>
              </div>

              {/* DOCKET CARD: DESIGN COPIED WITH HIGH FIDELITY */}
              <div className="bg-white rounded-lg shadow-md border border-slate-300 overflow-hidden relative print:shadow-none print:border-0 print:m-0">
                {/* Academic Header */}
                <div className="bg-brand-blue-800 text-white p-5 sm:p-6 relative">
                  {/* Decorative gold ribbon */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
                  
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-[9px] font-bold tracking-widest text-amber-400 uppercase font-display">
                        OFFICIAL ADMISSION RECEIPT
                      </p>
                      <h2 className="text-lg font-display font-black text-white mt-1">
                        AIIT Academy Portfolio
                      </h2>
                      <p className="text-[10px] text-brand-blue-100 mt-0.5 font-medium">
                        Advanced Institute of Information Technology
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-brand-blue-200">Registration ID</p>
                      <p className="text-xs sm:text-sm font-mono font-black text-amber-300 mt-0.5">
                        {createdSubmission.registrationNo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  {/* STUDENT PROFILE HIGHLIGHT AND ID PHOTO */}
                  <div className="flex flex-col sm:flex-row gap-5 pb-4 border-b border-slate-100">
                    <div className="w-24 h-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center relative mx-auto sm:mx-0 shadow-xs">
                      {createdSubmission.photo ? (
                        <img referrerPolicy="no-referrer" src={createdSubmission.photo} alt="Passport Photo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-2 text-[10px] text-slate-300 font-bold uppercase">
                          No Photo
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-brand-blue-800/80 text-white text-[8px] uppercase tracking-wider text-center py-1 font-bold">
                        AIIT Student
                      </div>
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Student Name</p>
                        <h3 className="text-base sm:text-lg font-display font-black text-slate-800 truncate">
                          {createdSubmission.fullName}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Father's Name</p>
                          <p className="font-semibold text-slate-700 truncate">{createdSubmission.fathersName}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Date of Birth</p>
                          <p className="font-semibold text-slate-700 font-mono">{createdSubmission.dob}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Gender</p>
                          <p className="font-semibold text-slate-700">{createdSubmission.gender}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Mobile No</p>
                          <p className="font-semibold text-slate-700 font-mono">{createdSubmission.mobileNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COURSE SELECTIONS */}
                  <div className="bg-brand-blue-50/40 border border-brand-blue-100/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-brand-blue-100/30">
                      <BookOpen size={13} className="text-brand-blue-800" />
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-blue-900">
                        Course Enrollment Specifications
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                      <div className="col-span-2">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Enrolled Course Name</p>
                        <p className="font-bold text-slate-800 mt-0.5">
                          {createdSubmission.selectCourse} - {COURSES_MAP[createdSubmission.selectCourse as keyof typeof COURSES_MAP]?.full || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Duration</p>
                        <p className="font-semibold text-slate-800 mt-0.5">{createdSubmission.courseDuration}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Batch Preference</p>
                        <p className="font-semibold text-slate-800 mt-0.5">{createdSubmission.preferredBatchTiming}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Dossier Status</p>
                        <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-800 rounded-xs">
                          {createdSubmission.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS & CONTACTS */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Address & Communication
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Full Address</p>
                        <p className="font-semibold text-slate-700 mt-0.5 leading-normal">
                          {createdSubmission.fullAddress || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">City/District</p>
                        <p className="font-semibold text-slate-700 mt-0.5 font-medium">
                          {createdSubmission.villageCity || 'N/A'} / {createdSubmission.district || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">State & PIN</p>
                        <p className="font-semibold text-slate-700 mt-0.5 font-mono">
                          {createdSubmission.state || 'N/A'} - {createdSubmission.pinCode || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* EDUCATION CREDENTIALS */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Prior Academic Qualification
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="col-span-2">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Board/College/University</p>
                        <p className="font-semibold text-slate-700 mt-0.5">{createdSubmission.schoolCollegeName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Qualification Tier</p>
                        <p className="font-semibold text-slate-700 mt-0.5">{createdSubmission.highestQualification || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Passing / Grade</p>
                        <p className="font-semibold text-slate-700 mt-0.5">
                          {createdSubmission.passingYear || 'N/A'} ({createdSubmission.percentageGrade || 'N/A'})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* OFFICIAL VERIFICATION FOOTER */}
                  <div className="border-t-2 border-dashed border-slate-200 pt-4 mt-5 grid grid-cols-2 gap-4 text-center">
                    <div className="flex flex-col items-center justify-center p-2 bg-slate-50/50 rounded-md">
                      <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">AIIT Registrar Seal</p>
                      <div className="w-14 h-14 rounded-full border border-slate-200 mt-1 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase tracking-tight text-center p-1 border-dashed">
                        ISO 9001:2015 SEAL
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-end">
                      {createdSubmission.documentSignature ? (
                        <img referrerPolicy="no-referrer" src={createdSubmission.documentSignature} alt="Signature" className="h-8 object-contain max-w-[100px]" />
                      ) : (
                        <div className="h-8" />
                      )}
                      <p className="text-[9px] font-bold text-slate-600 border-t border-slate-300 w-28 pt-0.5">
                        Applicant Signature
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Define section-scroll arrays to handle floating side index shortcuts
  const sections = [
    { id: 'sec-student-info', label: '1. Student Info', icon: <User size={15} /> },
    { id: 'sec-address', label: '2. Address Info', icon: <MapPin size={15} /> },
    { id: 'sec-education', label: '3. Education details', icon: <GraduationCap size={15} /> },
    { id: 'sec-course', label: '4. Course Selection', icon: <BookOpen size={15} /> },
    { id: 'sec-documents', label: '5. Documents Upload', icon: <FileCheck size={15} /> },
    { id: 'sec-declaration', label: '6. Declaration Check', icon: <ShieldAlert size={15} /> },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
      
      {/* Floating Left/Right Index Shortcuts for Desktop (4 cols) */}
      <div className="hidden lg:block lg:col-span-3">
        <div className="sticky top-24 bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ClipboardList className="text-brand-blue-800" size={18} />
            <h3 className="font-display font-bold text-sm text-brand-blue-900 uppercase tracking-wider">
              Form Sections
            </h3>
          </div>
          
          <div className="space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-semibold rounded-lg text-slate-600 hover:text-brand-blue-800 hover:bg-brand-blue-50/50 transition-all cursor-pointer"
              >
                <span className="text-slate-400 shrink-0">{sec.icon}</span>
                <span className="truncate">{sec.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span>Required Status</span>
              <span className="font-mono text-brand-blue-800">{stats.completedRequired}/{stats.totalRequired}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-brand-gold-500 h-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic leading-normal">
              Please fill all required fields marked with * before submitting.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form container with high-density bento card styling */}
      <form onSubmit={handleSubmit} className="col-span-1 lg:col-span-9 space-y-5">
        
        {/* Prestige Academics Header Card */}
        <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden relative">
          {/* Royal Blue top header banner */}
          <div className="bg-brand-blue-800 text-white p-5 sm:p-6 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-4 border-brand-blue-900 gap-4">
            {/* Visual Gold Crest / Seal Placeholder */}
            <div className="absolute right-6 top-6 opacity-5 w-24 h-24 hidden md:block">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" strokeDasharray="3 3"/>
                <circle cx="50" cy="50" r="38" stroke="white" strokeWidth="1"/>
                <polygon points="50,20 60,40 80,40 65,55 70,75 50,65 30,75 35,55 20,40 40,40" fill="white"/>
              </svg>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-14 h-14 bg-brand-blue-900 rounded-lg flex items-center justify-center font-display font-black text-white text-xl border-2 border-amber-400 shadow-md">
                AIIT
              </div>
              <div className="flex flex-col items-start text-left">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none uppercase">
                  Advanced Institute of IT
                </h1>
                <p className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase font-display leading-none mt-1">
                  EXCELLENCE IN DIGITAL EDUCATION • ADMISSION FORM
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-[10px] text-brand-blue-200 italic max-w-xs">
              Welcome to AIIT. Please fill in all required details carefully. Your admission will be processed after verification.
            </div>
          </div>

          <div className="p-4 bg-slate-50/50">
            <p className="text-slate-600 font-sans text-xs leading-relaxed">
              Welcome to <strong>AIIT – Advanced Institute of Information Technology</strong>.
              Please fill in all the required details carefully. Your admission will be processed after secure document verification and fee clearance.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 pt-3">
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Required Field (*)
                </span>
                <span className="text-slate-200">|</span>
                <span>100% Secure Student Registry</span>
                <span className="text-slate-200">|</span>
                {saveStatus === 'saving' && (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    Autosaving...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Draft Autosaved
                  </span>
                )}
                {saveStatus === 'idle' && (
                  <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    No Saved Draft
                  </span>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleAutofill}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-blue-950 font-black text-[10px] uppercase tracking-wider rounded-md border-b border-amber-700 transition-all cursor-pointer shadow-xs select-none"
              >
                <Award size={11} />
                Autofill Demo Form
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1: Student Information */}
        <div id="sec-student-info" className="scroll-mt-20 overflow-hidden rounded-lg shadow-xs border border-slate-200">
          <div className="bg-brand-blue-800 text-white px-4 py-2 flex justify-between items-center font-display font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <User size={13} className="text-amber-400" />
              Section 01: Student Information
            </span>
            <span className="text-[9px] bg-amber-500 text-brand-blue-900 font-bold px-1.5 py-0.5 rounded">REQUIRED</span>
          </div>
          
          <div className="p-4 gap-3 bg-white grid grid-cols-1 md:grid-cols-2">
            <div ref={fieldRefs.fullName} className="md:col-span-2">
              <TextInput
                label="1. Full Name"
                value={fullName}
                onChange={setFullName}
                required
                placeholder="Enter your full name"
                isActive={activeCard === 'full-name'}
                onFocus={() => setActiveCard('full-name')}
                error={errors.fullName}
              />
            </div>

            <div ref={fieldRefs.fathersName}>
              <TextInput
                label="2. Father's Name"
                value={fathersName}
                onChange={setFathersName}
                required
                placeholder="Enter father's full name"
                isActive={activeCard === 'fathers-name'}
                onFocus={() => setActiveCard('fathers-name')}
                error={errors.fathersName}
              />
            </div>

            <TextInput
              label="3. Mother's Name"
              value={mothersName}
              onChange={setMothersName}
              placeholder="Enter mother's full name"
              isActive={activeCard === 'mothers-name'}
              onFocus={() => setActiveCard('mothers-name')}
            />

            <div ref={fieldRefs.dob}>
              <TextInput
                label="4. Date of Birth"
                type="date"
                value={dob}
                onChange={setDob}
                required
                isActive={activeCard === 'dob'}
                onFocus={() => setActiveCard('dob')}
                error={errors.dob}
              />
            </div>

            <RadioInput
              label="5. Gender"
              value={gender}
              options={['Male', 'Female', 'Other']}
              onChange={setGender}
              isActive={activeCard === 'gender'}
              onFocus={() => setActiveCard('gender')}
            />

            <div ref={fieldRefs.mobileNumber}>
              <TextInput
                label="6. Mobile Number"
                type="tel"
                value={mobileNumber}
                onChange={setMobileNumber}
                required
                placeholder="Enter 10-digit mobile number"
                isActive={activeCard === 'mobile-number'}
                onFocus={() => setActiveCard('mobile-number')}
                error={errors.mobileNumber}
              />
            </div>

            <TextInput
              label="7. WhatsApp Number"
              type="tel"
              value={whatsAppNumber}
              onChange={setWhatsAppNumber}
              placeholder="Enter WhatsApp number (or leave blank if same)"
              isActive={activeCard === 'whatsapp-number'}
              onFocus={() => setActiveCard('whatsapp-number')}
            />

            <div ref={fieldRefs.emailAddress} className="md:col-span-2">
              <TextInput
                label="8. Email Address"
                type="email"
                value={emailAddress}
                onChange={setEmailAddress}
                placeholder="e.g. candidate@example.com"
                helpText="Used to dispatch validation records, registration keys, and receipts."
                isActive={activeCard === 'email-address'}
                onFocus={() => setActiveCard('email-address')}
                error={errors.emailAddress}
              />
            </div>

            <div>
              <TextInput
                label="9. Aadhaar Number"
                type="number"
                value={aadhaarNumber}
                onChange={setAadhaarNumber}
                placeholder="Enter 12-digit Aadhaar number"
                isActive={activeCard === 'aadhaar-number'}
                onFocus={() => setActiveCard('aadhaar-number')}
              />
            </div>

            <div>
              <FileUploadInput
                label="10. Passport Size Photo"
                fileName={photoName}
                fileData={photo}
                onFileChange={(name, data) => {
                  setPhotoName(name);
                  setPhoto(data);
                }}
                onFileClear={() => {
                  setPhotoName(undefined);
                  setPhoto(undefined);
                }}
                allowedTypes="image/*"
                helpText="Attach passport size photo (PNG, JPG)"
                isActive={activeCard === 'photo'}
                onFocus={() => setActiveCard('photo')}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Address */}
        <div id="sec-address" className="scroll-mt-20 overflow-hidden rounded-lg shadow-xs border border-slate-200">
          <div className="bg-brand-blue-800 text-white px-4 py-2 flex justify-between items-center font-display font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <MapPin size={13} className="text-amber-400" />
              Section 02: Communication Address
            </span>
          </div>

          <div className="p-4 gap-3 bg-white grid grid-cols-1 md:grid-cols-2">
            <div className="md:col-span-2">
              <TextInput
                label="11. Full Address"
                isParagraph
                value={fullAddress}
                onChange={setFullAddress}
                placeholder="Enter your complete house address, street, landmark"
                isActive={activeCard === 'address'}
                onFocus={() => setActiveCard('address')}
              />
            </div>

            <TextInput
              label="12. Village/City"
              value={villageCity}
              onChange={setVillageCity}
              placeholder="Enter city or village name"
              isActive={activeCard === 'city'}
              onFocus={() => setActiveCard('city')}
            />

            <TextInput
              label="13. District"
              value={district}
              onChange={setDistrict}
              placeholder="Enter district name"
              isActive={activeCard === 'district'}
              onFocus={() => setActiveCard('district')}
            />

            <DropdownInput
              label="14. State"
              value={state}
              options={STATES_LIST}
              onChange={setState}
              placeholder="Select your State"
              isActive={activeCard === 'state'}
              onFocus={() => setActiveCard('state')}
            />

            <TextInput
              label="15. PIN Code"
              type="number"
              value={pinCode}
              onChange={setPinCode}
              placeholder="6-digit PIN code"
              isActive={activeCard === 'pincode'}
              onFocus={() => setActiveCard('pincode')}
            />
          </div>
        </div>

        {/* SECTION 3: Educational Qualification */}
        <div id="sec-education" className="scroll-mt-20 overflow-hidden rounded-lg shadow-xs border border-slate-200">
          <div className="bg-brand-blue-800 text-white px-4 py-2 flex justify-between items-center font-display font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <GraduationCap size={13} className="text-amber-400" />
              Section 03: Educational Qualification
            </span>
          </div>

          <div className="p-4 gap-3 bg-white grid grid-cols-1 md:grid-cols-2">
            <DropdownInput
              label="16. Highest Qualification"
              value={highestQualification}
              options={QUALIFICATIONS_LIST}
              onChange={setHighestQualification}
              placeholder="Select highest academic tier"
              isActive={activeCard === 'qualification'}
              onFocus={() => setActiveCard('qualification')}
            />

            <TextInput
              label="17. School/College Name"
              value={schoolCollegeName}
              onChange={setSchoolCollegeName}
              placeholder="Enter name of board / school / college"
              isActive={activeCard === 'college'}
              onFocus={() => setActiveCard('college')}
            />

            <DropdownInput
              label="18. Passing Year"
              value={passingYear}
              options={yearsList}
              onChange={setPassingYear}
              placeholder="Select graduation or passing year"
              isActive={activeCard === 'passing-year'}
              onFocus={() => setActiveCard('passing-year')}
            />

            <TextInput
              label="19. Percentage/Grade"
              value={percentageGrade}
              onChange={setPercentageGrade}
              placeholder="e.g. 84.6% or A+ Grade"
              isActive={activeCard === 'percentage'}
              onFocus={() => setActiveCard('percentage')}
            />
          </div>
        </div>

        {/* SECTION 4: Course Details */}
        <div id="sec-course" className="scroll-mt-20 overflow-hidden rounded-lg shadow-xs border border-slate-200">
          <div className="bg-brand-blue-800 text-white px-4 py-2 flex justify-between items-center font-display font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <BookOpen size={13} className="text-amber-400" />
              Section 04: Enrollment Details
            </span>
          </div>

          <div className="p-4 gap-3 bg-white grid grid-cols-1 md:grid-cols-2">
            <DropdownInput
              label="20. Select Course"
              value={selectCourse}
              options={Object.keys(COURSES_MAP).map(code => `${code} - ${COURSES_MAP[code as keyof typeof COURSES_MAP].full}`)}
              onChange={(val) => {
                // Extract code from e.g. "DCA - Diploma in Computer..."
                const code = val.split(' - ')[0];
                setSelectCourse(code);
              }}
              placeholder="Select desired computer course"
              helpText="Dynamic selection based on AIIT computer curriculum."
              isActive={activeCard === 'course'}
              onFocus={() => setActiveCard('course')}
            />

            <DropdownInput
              label="21. Course Duration"
              value={courseDuration}
              options={DURATIONS_LIST}
              onChange={setCourseDuration}
              placeholder="Select course duration"
              isActive={activeCard === 'duration'}
              onFocus={() => setActiveCard('duration')}
            />

            <div className="md:col-span-2">
              <RadioInput
                label="22. Preferred Batch Timing"
                value={preferredBatchTiming}
                options={BATCH_TIMINGS_LIST}
                onChange={setPreferredBatchTiming}
                isActive={activeCard === 'batch'}
                onFocus={() => setActiveCard('batch')}
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Documents Upload */}
        <div id="sec-documents" className="scroll-mt-20 overflow-hidden rounded-lg shadow-xs border border-slate-200">
          <div className="bg-brand-blue-800 text-white px-4 py-2 flex justify-between items-center font-display font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <FileCheck size={13} className="text-amber-400" />
              Section 05: Document Verification
            </span>
          </div>

          <div className="p-4 gap-3 bg-white grid grid-cols-1 md:grid-cols-2">
            <div>
              <FileUploadInput
                label="23. Aadhaar Card Copy"
                fileName={documentAadhaarName}
                fileData={documentAadhaar}
                onFileChange={(name, data) => {
                  setDocumentAadhaarName(name);
                  setDocumentAadhaar(data);
                }}
                onFileClear={() => {
                  setDocumentAadhaarName(undefined);
                  setDocumentAadhaar(undefined);
                }}
                isActive={activeCard === 'doc-aadhaar'}
                onFocus={() => setActiveCard('doc-aadhaar')}
              />
            </div>

            <div>
              <FileUploadInput
                label="24. Educational Certificate"
                fileName={documentCertificateName}
                fileData={documentCertificate}
                onFileChange={(name, data) => {
                  setDocumentCertificateName(name);
                  setDocumentCertificate(data);
                }}
                onFileClear={() => {
                  setDocumentCertificateName(undefined);
                  setDocumentCertificate(undefined);
                }}
                isActive={activeCard === 'doc-cert'}
                onFocus={() => setActiveCard('doc-cert')}
              />
            </div>

            <div className="md:col-span-2">
              <FileUploadInput
                label="25. Signature Scan"
                fileName={documentSignatureName}
                fileData={documentSignature}
                onFileChange={(name, data) => {
                  setDocumentSignatureName(name);
                  setDocumentSignature(data);
                }}
                onFileClear={() => {
                  setDocumentSignatureName(undefined);
                  setDocumentSignature(undefined);
                }}
                allowedTypes="image/*"
                isActive={activeCard === 'doc-sign'}
                onFocus={() => setActiveCard('doc-sign')}
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: Declaration */}
        <div id="sec-declaration" className="scroll-mt-20 overflow-hidden rounded-lg shadow-xs border border-slate-200">
          <div className="bg-brand-blue-800 text-white px-4 py-2 flex justify-between items-center font-display font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <ShieldAlert size={13} className="text-amber-400" />
              Section 06: Declaration Check
            </span>
          </div>

          <div className="p-4 bg-white" ref={fieldRefs.declarationAccepted}>
            <CheckboxInput
              label="I hereby declare that all the information provided by me is correct."
              value={declarationAccepted}
              onChange={setDeclarationAccepted}
              required
              isActive={activeCard === 'declaration'}
              onFocus={() => setActiveCard('declaration')}
              error={errors.declarationAccepted}
            />
          </div>
        </div>

        {/* Form Submission Buttons */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-center sm:text-left">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ready to enroll?</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Please re-confirm your mobile number and date of birth before submitting.</p>
          </div>
          
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetForm}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <RotateCcw size={13} />
              Reset Form
            </button>
             <button
              type="submit"
              disabled={isSubmitting}
              className={`w-1/2 sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2 rounded-md font-black text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer shadow-sm
                ${isSubmitting
                  ? 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-blue-950 border-amber-700'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-500 border-t-transparent animate-spin mr-1" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Submit Form
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
