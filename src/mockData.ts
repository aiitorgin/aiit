import { AdmissionSubmission } from './types';

// Simple inline SVGs for mock files to make the dashboard look highly realistic and beautiful
export const MOCK_AVATAR_MALE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%231e3a8a"/><circle cx="50" cy="35" r="22" fill="%23f59e0b"/><path d="M15 85 C15 65, 30 55, 50 55 C70 55, 85 65, 85 85 Z" fill="%23fff" opacity="0.9"/></svg>`;
export const MOCK_AVATAR_FEMALE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%230f172a"/><circle cx="50" cy="35" r="22" fill="%23f59e0b"/><path d="M15 85 C15 65, 30 55, 50 55 C70 55, 85 65, 85 85 Z" fill="%23fff" opacity="0.9"/><path d="M25 25 Q50 5 75 25" stroke="%23fff" stroke-width="8" fill="none"/></svg>`;

export const MOCK_DOC_AADHAAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180" width="300" height="180"><rect width="300" height="180" rx="10" fill="%23eff6ff" stroke="%231e3a8a" stroke-width="4"/><rect x="15" y="15" width="270" height="30" rx="5" fill="%231e3a8a"/><text x="150" y="35" font-family="sans-serif" font-weight="bold" font-size="14" fill="%23f59e0b" text-anchor="middle">GOVERNMENT OF INDIA</text><rect x="20" y="60" width="50" height="60" rx="4" fill="%2394a3b8"/><text x="80" y="75" font-family="sans-serif" font-weight="bold" font-size="12" fill="%231e3a8a">AADHAAR CARD</text><text x="80" y="95" font-family="sans-serif" font-size="10" fill="%23475569">Name: Student Applicant</text><text x="80" y="110" font-family="sans-serif" font-size="10" fill="%23475569">DOB: 12/04/2004</text><text x="150" y="150" font-family="sans-serif" font-weight="bold" font-size="16" fill="%231e3a8a" letter-spacing="4" text-anchor="middle">1234 5678 9012</text></svg>`;
export const MOCK_DOC_CERTIFICATE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 320" width="240" height="320"><rect width="240" height="320" rx="5" fill="%23fff" stroke="%23b45309" stroke-width="6"/><rect x="15" y="15" width="210" height="290" fill="none" stroke="%23f59e0b" stroke-width="2" stroke-dasharray="4 4"/><text x="120" y="60" font-family="serif" font-weight="bold" font-size="16" fill="%231e3a8a" text-anchor="middle">BOARD OF EDUCATION</text><text x="120" y="90" font-family="sans-serif" font-weight="semibold" font-size="11" fill="%23b45309" text-anchor="middle">PASSING CERTIFICATE</text><line x1="40" y1="110" x2="200" y2="110" stroke="%23e2e8f0" stroke-width="2"/><text x="120" y="150" font-family="serif" font-size="12" fill="%231e293b" text-anchor="middle">This is to certify that the candidate</text><text x="120" y="175" font-family="serif" font-weight="bold" font-size="14" fill="%231e3a8a" text-anchor="middle">SUCCESSFULLY GRADUATED</text><text x="120" y="200" font-family="sans-serif" font-size="10" fill="%2364748b" text-anchor="middle">with Distinction and Excellent Merits</text><circle cx="120" cy="255" r="22" fill="%23f59e0b" opacity="0.2"/><path d="M120 230 L130 250 L150 255 L135 270 L140 290 L120 280 L100 290 L105 270 L90 255 L110 250 Z" fill="%23d97706"/></svg>`;
export const MOCK_DOC_SIGNATURE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80"><rect width="200" height="80" fill="%23fff" stroke="%23e2e8f0" stroke-width="2"/><path d="M20 50 Q 50 10, 80 50 T 140 40 T 180 30" fill="none" stroke="%231d4ed8" stroke-width="3" stroke-linecap="round"/><line x1="15" y1="65" x2="185" y2="65" stroke="%2394a3b8" stroke-width="1" stroke-dasharray="2 2"/></svg>`;

export const MOCK_SUBMISSIONS: AdmissionSubmission[] = [
  {
    id: 'sub-1',
    registrationNo: 'AIIT-2026-0482',
    dateSubmitted: '2026-06-25T10:14:00Z',
    status: 'approved',
    adminNotes: 'All qualifications and original identity documents verified. Standard fee receipt submitted. Student assigned to Batch M1 (8:00 AM).',
    
    // Student Information
    fullName: 'Amit Kumar Sharma',
    fathersName: 'Ram Sharan Sharma',
    mothersName: 'Sita Devi Sharma',
    dob: '2004-12-14',
    gender: 'Male',
    mobileNumber: '9876543210',
    whatsAppNumber: '9876543210',
    emailAddress: 'amit.sharma04@gmail.com',
    aadhaarNumber: '423456789012',
    photo: MOCK_AVATAR_MALE,
    photoName: 'amit_passport.jpg',

    // Address
    fullAddress: 'Flat 402, Royal Residency, Gomti Nagar',
    villageCity: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pinCode: '226010',

    // Educational
    highestQualification: 'Intermediate',
    schoolCollegeName: 'S.R. Public College',
    passingYear: '2022',
    percentageGrade: '84.5%',

    // Course
    selectCourse: 'ADCA',
    courseDuration: '12 Months',
    preferredBatchTiming: 'Morning',

    // Documents
    documentAadhaar: MOCK_DOC_AADHAAR,
    documentAadhaarName: 'aadhaar_card.pdf',
    documentCertificate: MOCK_DOC_CERTIFICATE,
    documentCertificateName: 'intermediate_marksheet.pdf',
    documentSignature: MOCK_DOC_SIGNATURE,
    documentSignatureName: 'signature_amit.png',
    
    declarationAccepted: true
  },
  {
    id: 'sub-2',
    registrationNo: 'AIIT-2026-0483',
    dateSubmitted: '2026-06-26T14:32:00Z',
    status: 'pending',
    
    // Student Information
    fullName: 'Priya Patel',
    fathersName: 'Dineshbhai Patel',
    mothersName: 'Geetaben Patel',
    dob: '2005-07-22',
    gender: 'Female',
    mobileNumber: '8765432109',
    whatsAppNumber: '8765432109',
    emailAddress: 'priya.patel.ahm@yahoo.com',
    aadhaarNumber: '987654321098',
    photo: MOCK_AVATAR_FEMALE,
    photoName: 'priya_avatar.png',

    // Address
    fullAddress: '12, Shanti Kunj Society, Near Stadium Circle',
    villageCity: 'Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    pinCode: '380009',

    // Educational
    highestQualification: 'Graduation',
    schoolCollegeName: 'Gujarat University',
    passingYear: '2025',
    percentageGrade: '7.8 CGPA',

    // Course
    selectCourse: 'DCA',
    courseDuration: '6 Months',
    preferredBatchTiming: 'Afternoon',

    // Documents
    documentAadhaar: MOCK_DOC_AADHAAR,
    documentAadhaarName: 'aadhaar_priya.pdf',
    documentCertificate: MOCK_DOC_CERTIFICATE,
    documentCertificateName: 'grad_degree.pdf',
    documentSignature: MOCK_DOC_SIGNATURE,
    documentSignatureName: 'sign_priya.png',
    
    declarationAccepted: true
  },
  {
    id: 'sub-3',
    registrationNo: 'AIIT-2026-0484',
    dateSubmitted: '2026-06-27T09:45:00Z',
    status: 'verified',
    adminNotes: 'Documents successfully matched on Digilocker app. Candidate needs to submit hardcopy photo on induction day.',

    // Student Information
    fullName: 'Rahul Verma',
    fathersName: 'Vijay Kumar Verma',
    mothersName: 'Renu Verma',
    dob: '2003-05-18',
    gender: 'Male',
    mobileNumber: '7654321098',
    whatsAppNumber: '7654321098',
    emailAddress: 'rahulverma_tech@gmail.com',
    aadhaarNumber: '823412345678',
    photo: MOCK_AVATAR_MALE,
    photoName: 'rahul_photo.jpg',

    // Address
    fullAddress: 'Mohalla Kadamkuan, Lane No. 4',
    villageCity: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    pinCode: '800003',

    // Educational
    highestQualification: 'Post Graduation',
    schoolCollegeName: 'Patna Science College',
    passingYear: '2024',
    percentageGrade: '78.2%',

    // Course
    selectCourse: 'DIFA',
    courseDuration: '6 Months',
    preferredBatchTiming: 'Evening',

    // Documents
    documentAadhaar: MOCK_DOC_AADHAAR,
    documentAadhaarName: 'aadhaar_rahul.png',
    documentCertificate: MOCK_DOC_CERTIFICATE,
    documentCertificateName: 'msc_certificate.pdf',
    documentSignature: MOCK_DOC_SIGNATURE,
    documentSignatureName: 'sign_rahul.jpg',
    
    declarationAccepted: true
  },
  {
    id: 'sub-4',
    registrationNo: 'AIIT-2026-0485',
    dateSubmitted: '2026-06-28T11:20:00Z',
    status: 'pending',

    // Student Information
    fullName: 'Ananya Rao',
    fathersName: 'K. Srinivasa Rao',
    mothersName: 'K. Lakshmi Rao',
    dob: '2006-03-30',
    gender: 'Female',
    mobileNumber: '9123456780',
    whatsAppNumber: '9123456780',
    emailAddress: 'ananya.rao@gmail.com',
    aadhaarNumber: '321098765432',
    photo: MOCK_AVATAR_FEMALE,
    photoName: 'ananya_photo.jpg',

    // Address
    fullAddress: '34/1, 5th Cross, Malleshwaram',
    villageCity: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    pinCode: '560003',

    // Educational
    highestQualification: 'High School',
    schoolCollegeName: 'Kendriya Vidyalaya',
    passingYear: '2023',
    percentageGrade: '92.4%',

    // Course
    selectCourse: 'CFA',
    courseDuration: '3 Months',
    preferredBatchTiming: 'Morning',

    // Documents
    documentAadhaar: MOCK_DOC_AADHAAR,
    documentAadhaarName: 'aadhaar_card.pdf',
    documentCertificate: MOCK_DOC_CERTIFICATE,
    documentCertificateName: 'tenth_marksheet.pdf',
    documentSignature: MOCK_DOC_SIGNATURE,
    documentSignatureName: 'ananya_sign.png',
    
    declarationAccepted: true
  },
  {
    id: 'sub-5',
    registrationNo: 'AIIT-2026-0486',
    dateSubmitted: '2026-06-28T16:05:00Z',
    status: 'rejected',
    adminNotes: 'Rejected due to blurred Educational Certificate. Student contacted via email and requested to resubmit a clean PDF scan of High School marksheet.',

    // Student Information
    fullName: 'Vikram Singh Rathore',
    fathersName: 'Rajendra Singh Rathore',
    mothersName: 'Padmini Rathore',
    dob: '2002-11-05',
    gender: 'Male',
    mobileNumber: '9812345678',
    whatsAppNumber: '9812345678',
    emailAddress: 'vikram.rathore99@gmail.com',
    aadhaarNumber: '765498763210',
    photo: MOCK_AVATAR_MALE,
    photoName: 'vikram_rathore.jpg',

    // Address
    fullAddress: 'House 56, Sector 4, Hanumangarh Road',
    villageCity: 'Sikar',
    district: 'Sikar',
    state: 'Rajasthan',
    pinCode: '332001',

    // Educational
    highestQualification: 'Graduation',
    schoolCollegeName: 'Shetkhawati College',
    passingYear: '2024',
    percentageGrade: '59.8%',

    // Course
    selectCourse: 'HDCA',
    courseDuration: '18 Months',
    preferredBatchTiming: 'Evening',

    // Documents
    documentAadhaar: MOCK_DOC_AADHAAR,
    documentAadhaarName: 'aadhaar_vikram.png',
    documentCertificate: MOCK_DOC_CERTIFICATE,
    documentCertificateName: 'grad_marksheet.jpg',
    documentSignature: MOCK_DOC_SIGNATURE,
    documentSignatureName: 'sign_vikram.png',
    
    declarationAccepted: true
  }
];
