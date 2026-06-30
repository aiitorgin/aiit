export type SubmissionStatus = 'pending' | 'verified' | 'approved' | 'rejected';

export interface AdmissionSubmission {
  id: string;
  registrationNo: string;
  dateSubmitted: string;
  status: SubmissionStatus;
  adminNotes?: string;
  
  // SECTION 1: Student Information
  fullName: string;
  fathersName: string;
  mothersName?: string;
  dob: string;
  gender: string;
  mobileNumber: string;
  whatsAppNumber?: string;
  emailAddress?: string;
  aadhaarNumber?: string;
  photo?: string; // base64 representation or mockup path
  photoName?: string;

  // SECTION 2: Address
  fullAddress?: string;
  villageCity?: string;
  district?: string;
  state?: string;
  pinCode?: string;

  // SECTION 3: Educational Qualification
  highestQualification?: string;
  schoolCollegeName?: string;
  passingYear?: string;
  percentageGrade?: string;

  // SECTION 4: Course Details
  selectCourse: string;
  courseDuration: string;
  preferredBatchTiming: string;

  // SECTION 5: Documents Upload
  documentAadhaar?: string; // base64 representation or mockup path
  documentAadhaarName?: string;
  documentCertificate?: string; // base64 representation or mockup path
  documentCertificateName?: string;
  documentSignature?: string; // base64 representation or mockup path
  documentSignatureName?: string;

  // SECTION 6: Declaration
  declarationAccepted: boolean;
}

export type CourseCode = 'CFA' | 'COA' | 'CCA' | 'DCA' | 'ADCA' | 'HDCA' | 'DIFA' | 'ADFA';

export const COURSES_MAP: Record<CourseCode, { name: string; full: string }> = {
  CFA: { name: 'CFA', full: 'Certificate in Financial Accounting' },
  COA: { name: 'COA', full: 'Certificate in Office Automation' },
  CCA: { name: 'CCA', full: 'Certificate in Computer Application' },
  DCA: { name: 'DCA', full: 'Diploma in Computer Application' },
  ADCA: { name: 'ADCA', full: 'Advanced Diploma in Computer Application' },
  HDCA: { name: 'HDCA', full: 'Honour Diploma in Computer Application' },
  DIFA: { name: 'DIFA', full: 'Diploma in Financial Accounting' },
  ADFA: { name: 'ADFA', full: 'Advanced Diploma in Financial Accounting' },
};

export const STATES_LIST = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Other'
];

export const QUALIFICATIONS_LIST = [
  'High School',
  'Intermediate',
  'Graduation',
  'Post Graduation',
  'Other'
];

export const DURATIONS_LIST = [
  '3 Months',
  '6 Months',
  '12 Months',
  '18 Months'
];

export const BATCH_TIMINGS_LIST = [
  'Morning',
  'Afternoon',
  'Evening'
];
