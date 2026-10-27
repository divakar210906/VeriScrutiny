// src/types.ts

export type UserRole = "institution" | "aicte";

export type DocumentStatus = 
  | "Verified" 
  | "Needs Review" 
  | "Rejected" 
  | "Under Scrutiny" 
  | "Under Review"
  | "Submitted"
  | "Pending"
  | "Needs Correction"
  | "Deficiency Raised"
  | "Re-submitted"
  | "Not Submitted";

export type RuleResult = "PASS" | "WARNING" | "FAIL";

export type VerificationTag = "FOUND" | "MATCHED" | "MISMATCH" | "NOT FOUND" | "REVIEW REQUIRED";

export interface ExtractedField {
  field: string;
  value: string;
  verification: VerificationTag;
}

export type SystemRecommendation = "VERIFICATION PASSED" | "NEEDS CLARIFICATION" | "DEFICIENCY DETECTED";

export interface ChecklistItem {
  id: string;
  order: number;
  parameter: string;
  requirement: string;
  extractedValue: string;
  result: RuleResult;
  remarks: string;
  confidenceScore?: number;
}

export interface DocumentDetails {
  type: string;
  category: string;
  institution: string;
  institutionId: string;
  academicYear: string;
  documentNumber: string;
  issuingAuthority: string;
  issueDate: string; // ISO
  expiryDate: string; // ISO
  submissionDate: string; // ISO
  uploadedBy: string;
  fileName: string;
  fileSize: string;
  checksum: string;
  status: DocumentStatus;
  trackingId?: string;
  rejectionReason?: string;
  officerRemarks?: string;
  recommendation?: SystemRecommendation;
  recommendationReason?: string;
  extractedFields?: ExtractedField[];
  scrutinySummary?: {
    lastScrutinized: string;
    scrutinizedBy: string;
    status: DocumentStatus;
    reason: string;
    totalChecks: number;
    passed: number;
    warnings: number;
    failed: number;
    recommendation?: SystemRecommendation;
    officerDecision?: DocumentStatus;
    officerRemarks?: string;
  };
  meta?: any;
}

export interface Document {
  id: string;
  name: string;
  category: string;
  academicYear: string;
  documentNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  submissionDate: string; // ISO string
  status: DocumentStatus;
  trackingId?: string;
  lastScrutinized?: string;
  details: DocumentDetails;
  checklist: ChecklistItem[];
}

export interface RequiredDocument {
  id: string;
  code: string;
  name: string;
  category: "Fire & Safety" | "Academic / Affiliation" | "Infrastructure" | "Governance & Finance";
  requirement: "Mandatory" | "Conditional";
  validityRequirement?: string;
  submitted: boolean;
  docId?: string; // Links to uploaded Document if submitted
  status: DocumentStatus;
  remarks?: string;
  guidelines: string;
}

export interface InstitutionApplication {
  id: string; // e.g. KEC001
  name: string;
  applicationId: string; // e.g. APP-2026-00182
  aictePermanentId: string;
  state: string;
  district: string;
  type: string;
  totalRequired: number;
  submittedCount: number;
  status: "Pending Scrutiny" | "Under Review" | "Verified" | "Deficient";
  lastUpdated: string;
  documents: Document[];
}

export interface Institution {
  id: string;
  name: string;
  aictePermanentId: string;
  aisheCode: string;
  type: string;
  address: string;
  district: string;
  state: string;
  pinCode: string;
  affiliation: string;
  university: string;
  establishmentYear: number;
  principalName: string;
  contactEmail: string;
  contactNumber: string;
  website: string;
  accreditation: string;
  landArea: string;
  builtUpArea: string;
}

export interface ScrutinyReport {
  reportId: string;
  documentId: string;
  documentName: string;
  documentType: string;
  documentNumber: string;
  institutionName: string;
  institutionId: string;
  applicationId: string;
  aisheCode: string;
  scrutinyDate: string;
  scrutinizedBy: string;
  designation: string;
  finalStatus: DocumentStatus;
  summary: {
    total: number;
    passed: number;
    warnings: number;
    failed: number;
  };
  checklist: ChecklistItem[];
  findings: string[];
  officialRemarks: string;
  qrCodeDigest: string;
}

export interface VerificationHistoryItem {
  id: string;
  reportId: string;
  institutionId: string;
  institutionName: string;
  applicationId: string;
  documentId: string;
  documentName: string;
  documentNumber: string;
  category: string;
  scrutinyDate: string;
  scrutinizedBy: string;
  action?: string;
  result: DocumentStatus | string;
  passedCount: number;
  warningCount: number;
  failedCount: number;
  remarks: string;
}

export interface ScrutinySettings {
  autoVerificationThreshold: string;
  externalRegistrySync: boolean;
  alertEmailRecipient: string;
  ocrConfidenceMin: number;
  twoFactorAuth: boolean;
  sessionTimeoutMinutes: number;
  digitalSignatureId: string;
}
