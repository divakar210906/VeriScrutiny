// src/mockData.ts
import type { 
  Document, 
  DocumentDetails,
  DocumentStatus,
  Institution, 
  ScrutinyReport, 
  VerificationHistoryItem, 
  ScrutinySettings,
  RequiredDocument,
  InstitutionApplication
} from "./types";

export const institution: Institution = {
  id: "KEC001",
  name: "Kongu Engineering College",
  aictePermanentId: "KEC001",
  aisheCode: "C-37013",
  type: "Autonomous Engineering College (Self-Financing)",
  address: "Perundurai Railway Station Road, Thoppupalayam",
  district: "Erode",
  state: "Tamil Nadu",
  pinCode: "638060",
  affiliation: "Approved by AICTE, Accredited by NBA & NAAC (A++)",
  university: "Anna University, Chennai",
  establishmentYear: 1984,
  principalName: "Dr. V. Balusamy, M.E., Ph.D.",
  contactEmail: "principal@kongu.ac.in",
  contactNumber: "+91 4294 226555",
  website: "https://www.kongu.ac.in",
  accreditation: "NAAC A++ (CGPA 3.65), NBA Accredited Under Tier-I (Washington Accord)",
  landArea: "167.5 Acres (Single Contiguous Parcel)",
  builtUpArea: "1,85,420 sq.m. (Instructional + Administrative + Amenities)",
};

export const defaultSettings: ScrutinySettings = {
  autoVerificationThreshold: "Strict (All Rules Passing)",
  externalRegistrySync: true,
  alertEmailRecipient: "scrutiny.nodal@aicte-india.org",
  ocrConfidenceMin: 85,
  twoFactorAuth: true,
  sessionTimeoutMinutes: 15,
  digitalSignatureId: "DSC-GOV-AICTE-2026-SR-8812",
};

// Generate relative dates
const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();
const daysAhead = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000).toISOString();

/**
 * Base submitted documents for Kongu Engineering College
 */
const rawDocumentsData = [
  {
    id: "doc-1",
    trackingId: "DEMO-KEC-1001",
    name: "Affiliation Order",
    category: "Academic / Affiliation",
    academicYear: "2026-2027",
    documentNumber: "AU/CAC/AFF/2026-27/0824",
    issuingAuthority: "Centre for Academic Courses, Anna University, Chennai",
    issueDate: daysAgo(42),
    expiryDate: daysAhead(323),
    submissionDate: daysAgo(3),
    uploadedBy: "Registrar / Academic Nodal Officer",
    fileName: "Anna_University_Affiliation_2026_27.pdf",
    fileSize: "2.4 MB",
    checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    type: "Affiliation Order",
    initialStatus: "Submitted" as DocumentStatus,
  },
  {
    id: "doc-2",
    trackingId: "DEMO-KEC-1002",
    name: "Fire Safety Certificate",
    category: "Fire & Safety",
    academicYear: "2026-2027",
    documentNumber: "TN-FRS/ED-ERD/NOC-2025/1192",
    issuingAuthority: "Tamil Nadu Fire and Rescue Services Department",
    issueDate: daysAgo(18),
    expiryDate: daysAhead(164),
    submissionDate: daysAgo(1),
    uploadedBy: "Estate & Safety Officer",
    fileName: "TN_Fire_Safety_NOC_Renewal_2026.pdf",
    fileSize: "1.8 MB",
    checksum: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    type: "Fire Safety Certificate",
    initialStatus: "Under Scrutiny" as DocumentStatus,
  },
  {
    id: "doc-3",
    trackingId: "DEMO-KEC-1003",
    name: "Building Stability Certificate",
    category: "Infrastructure",
    academicYear: "2026-2027",
    documentNumber: "PWD/ED-STRUCT/2024-B89",
    issuingAuthority: "Public Works Department (PWD), Govt. of Tamil Nadu",
    issueDate: daysAgo(90),
    expiryDate: daysAhead(640),
    submissionDate: daysAgo(5),
    uploadedBy: "Campus Maintenance Cell",
    fileName: "PWD_Structural_Soundness_Certificate.pdf",
    fileSize: "4.1 MB",
    checksum: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
    type: "Building Stability Certificate",
    initialStatus: "Submitted" as DocumentStatus,
  },
  {
    id: "doc-4",
    trackingId: "DEMO-KEC-1004",
    name: "Faculty Declaration",
    category: "Academic / Affiliation",
    academicYear: "2026-2027",
    documentNumber: "KEC/REG-FAC/DEC-2026-V1",
    issuingAuthority: "Internal Academic Governance Board",
    issueDate: daysAgo(12),
    expiryDate: daysAhead(353),
    submissionDate: daysAgo(4),
    uploadedBy: "Dean (Academic Administration)",
    fileName: "Faculty_Cadre_Ratio_Affidavit_2026.pdf",
    fileSize: "3.7 MB",
    checksum: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
    type: "Faculty Declaration",
    initialStatus: "Submitted" as DocumentStatus,
  },
  {
    id: "doc-5",
    trackingId: "DEMO-KEC-1005",
    name: "AICTE Approval Letter (EoA)",
    category: "Academic / Affiliation",
    academicYear: "2026-2027",
    documentNumber: "F.No. Southern/1-3512345671/2026/EOA",
    issuingAuthority: "All India Council for Technical Education, New Delhi",
    issueDate: daysAgo(65),
    expiryDate: daysAhead(300),
    submissionDate: daysAgo(6),
    uploadedBy: "Principal's Secretariat",
    fileName: "AICTE_Extension_of_Approval_2026_27.pdf",
    fileSize: "1.9 MB",
    checksum: "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
    type: "AICTE Approval Letter",
    initialStatus: "Submitted" as DocumentStatus,
  },
  {
    id: "doc-6",
    trackingId: "DEMO-KEC-1006",
    name: "Fee Structure Declaration",
    category: "Governance & Finance",
    academicYear: "2026-2027",
    documentNumber: "SFRC/TN/ENGG/FEE-2026-27/104",
    issuingAuthority: "Committee on Fixation of Fee in Self-Financing Colleges",
    issueDate: daysAgo(25),
    expiryDate: daysAhead(340),
    submissionDate: daysAgo(2),
    uploadedBy: "Chief Accounts Officer",
    fileName: "Fee_Regulatory_Committee_Order_2026.pdf",
    fileSize: "2.1 MB",
    checksum: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    type: "Fee Declaration",
    initialStatus: "Submitted" as DocumentStatus,
  },
  {
    id: "doc-7",
    trackingId: "DEMO-KEC-1007",
    name: "Land Ownership & Registered Title Deed",
    category: "Infrastructure",
    academicYear: "2026-2027",
    documentNumber: "REG-TN-ERD/TIT-1984/4412",
    issuingAuthority: "Sub-Registrar Office, Perundurai",
    issueDate: daysAgo(365 * 10),
    expiryDate: daysAhead(365 * 20),
    submissionDate: daysAgo(7),
    uploadedBy: "Estate Legal Officer",
    fileName: "Registered_Land_Title_Deed_Perundurai.pdf",
    fileSize: "5.4 MB",
    checksum: "112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00",
    type: "Land Ownership",
    initialStatus: "Submitted" as DocumentStatus,
  },
  {
    id: "doc-8",
    trackingId: "DEMO-KEC-1008",
    name: "Campus Occupancy Certificate",
    category: "Infrastructure",
    academicYear: "2026-2027",
    documentNumber: "DTCP/ERD/OCC-2021-998",
    issuingAuthority: "Directorate of Town and Country Planning (DTCP)",
    issueDate: daysAgo(120),
    expiryDate: daysAhead(365 * 5),
    submissionDate: daysAgo(8),
    uploadedBy: "Civil Infrastructure Officer",
    fileName: "DTCP_Occupancy_Clearance_2026.pdf",
    fileSize: "3.2 MB",
    checksum: "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
    type: "Occupancy Certificate",
    initialStatus: "Submitted" as DocumentStatus,
  },
];

/**
 * Seed illustrative browser records without source files or generated analysis.
 */
export const documents: Document[] = rawDocumentsData.map((raw) => {
  const details: DocumentDetails = {
    type: raw.type,
    category: raw.category,
    institution: institution.name,
    institutionId: institution.aictePermanentId,
    academicYear: raw.academicYear,
    documentNumber: raw.documentNumber,
    issuingAuthority: raw.issuingAuthority,
    issueDate: raw.issueDate,
    expiryDate: raw.expiryDate,
    submissionDate: raw.submissionDate,
    uploadedBy: raw.uploadedBy,
    fileName: raw.fileName,
    fileSize: raw.fileSize,
    checksum: raw.checksum,
    status: raw.initialStatus,
    trackingId: raw.trackingId,
  };

  return {
    id: raw.id,
    name: raw.name,
    category: raw.category,
    academicYear: raw.academicYear,
    documentNumber: raw.documentNumber,
    issuingAuthority: raw.issuingAuthority,
    issueDate: raw.issueDate,
    expiryDate: raw.expiryDate,
    submissionDate: raw.submissionDate,
    status: raw.initialStatus,
    trackingId: raw.trackingId,
    details,
    checklist: [],
  };
});

/**
 * 10 Required Documents for the Institution
 */
export const requiredDocumentsList: RequiredDocument[] = [
  {
    id: "req-1",
    code: "DOC-FS-01",
    name: "Fire Safety Certificate",
    category: "Fire & Safety",
    requirement: "Mandatory",
    validityRequirement: "Validity / applicable validity requirement",
    submitted: true,
    docId: "doc-2",
    status: "Under Scrutiny",
    guidelines: "Issued by Divisional Fire Officer, Fire & Rescue Services. Subject to applicable validity requirement.",
  },
  {
    id: "req-2",
    code: "DOC-AF-02",
    name: "Affiliation Order",
    category: "Academic / Affiliation",
    requirement: "Mandatory",
    validityRequirement: "Annual extension order for AY 2026–27",
    submitted: true,
    docId: "doc-1",
    status: "Verified",
    guidelines: "Provisional or Permanent affiliation grant order issued by affiliating university for AY 2026–27.",
  },
  {
    id: "req-3",
    code: "DOC-FC-03",
    name: "Faculty Declaration",
    category: "Academic / Affiliation",
    requirement: "Mandatory",
    validityRequirement: "Mandatory annual submission for academic session",
    submitted: true,
    docId: "doc-4",
    status: "Needs Correction",
    remarks: "Cadre ratio declaration non-compliant (1:2.4 vs mandated 1:2:6). Re-upload signed affidavit.",
    guidelines: "Signed declaration on cadre ratio (1:2:6), pay scales as per 7th CPC, and faculty roster.",
  },
  {
    id: "req-4",
    code: "DOC-BS-04",
    name: "Building Stability Certificate",
    category: "Infrastructure",
    requirement: "Mandatory",
    validityRequirement: "Valid for 3 to 5 years from issuance date",
    submitted: true,
    docId: "doc-3",
    status: "Verified",
    remarks: "PWD structural fitness certificate required for all instructional and administrative blocks.",
    guidelines: "Form-A, Form-B, and Form-C structural stability issued by certified PWD Executive Engineer.",
  },
  {
    id: "req-5",
    code: "DOC-AP-05",
    name: "AICTE Approval Letter (EoA)",
    category: "Academic / Affiliation",
    requirement: "Mandatory",
    validityRequirement: "Valid for AY 2025–26 preceding approval cycle",
    submitted: true,
    docId: "doc-5",
    status: "Verified",
    guidelines: "Previous year Extension of Approval letter issued by AICTE Member Secretary.",
  },
  {
    id: "req-6",
    code: "DOC-FE-06",
    name: "Fee Structure Declaration",
    category: "Governance & Finance",
    requirement: "Mandatory",
    validityRequirement: "Current 3-year fixation period",
    submitted: true,
    docId: "doc-6",
    status: "Verified",
    guidelines: "Endorsement copy issued by State Fee Regulatory Committee.",
  },
  {
    id: "req-7",
    code: "DOC-LD-07",
    name: "Land Ownership & Registered Title Deed",
    category: "Infrastructure",
    requirement: "Mandatory",
    validityRequirement: "Perpetual non-agricultural educational conversion",
    submitted: true,
    docId: "doc-7",
    status: "Verified",
    guidelines: "Registered sale deed or 30-year unencumbered lease in the name of the sponsoring Trust/Society.",
  },
  {
    id: "req-8",
    code: "DOC-OC-08",
    name: "Campus Occupancy Certificate",
    category: "Infrastructure",
    requirement: "Mandatory",
    validityRequirement: "Permanent / One-time grant by local body",
    submitted: true,
    docId: "doc-8",
    status: "Verified",
    guidelines: "Occupancy or completion certificate issued by Town Planning authority / Municipal Commissioner.",
  },
  {
    id: "req-9",
    code: "DOC-PC-09",
    name: "Pollution Control Board (PCB) NOC",
    category: "Fire & Safety",
    requirement: "Conditional",
    validityRequirement: "Consent to Operate (CTO) valid through 2027",
    submitted: false,
    status: "Not Submitted",
    remarks: "Required for campus sewage treatment plant (STP) and campus laboratories.",
    guidelines: "Consent to Operate (CTO) issued by State Pollution Control Board.",
  },
  {
    id: "req-10",
    code: "DOC-DB-10",
    name: "Barrier-Free Environment (Divyangjan) Clearance",
    category: "Infrastructure",
    requirement: "Mandatory",
    validityRequirement: "Permanent accessible infrastructure undertaking",
    submitted: false,
    status: "Not Submitted",
    remarks: "Architect compliance certificate for ramps, accessible restrooms, and dedicated braille signage.",
    guidelines: "Certificate by registered architect conforming to PwD barrier-free building regulations.",
  },
];

/**
 * Institutions List for AICTE In-charge View
 */
export const aicteInstitutionsList: InstitutionApplication[] = [
  {
    id: "KEC001",
    name: "Kongu Engineering College",
    applicationId: "DEMO-KEC-2026-01",
    aictePermanentId: institution.aictePermanentId,
    state: "Tamil Nadu",
    district: "Erode",
    type: "Autonomous Engineering College",
    documentRecordCount: documents.length,
    status: "Under Review",
    lastUpdated: daysAgo(1),
    documents,
  },
];

/**
 * Quick dictionary mapping ID -> Document
 */
export const documentDetails: Record<string, Document> = documents.reduce(
  (acc, d) => ({ ...acc, [d.id]: d }),
  {} as Record<string, Document>
);

/**
 * History starts empty and is populated by actions taken in this browser.
 */
export const verificationHistory: VerificationHistoryItem[] = [];

/**
 * Generate official Scrutiny Report for any document
 */
export function getScrutinyReport(docId: string, instId: string = "KEC001"): ScrutinyReport | null {
  const doc = documentDetails[docId];
  if (!doc) return null;

  const targetInst = aicteInstitutionsList.find((i) => i.id === instId) || aicteInstitutionsList[0];

  const passed = doc.checklist.filter((c) => c.result === "PASS").length;
  const warnings = doc.checklist.filter((c) => c.result === "WARNING").length;
  const failed = doc.checklist.filter((c) => c.result === "FAIL").length;

  return {
    reportId: `SCR-2026-TN-KEC-00${docId.replace("doc-", "")}`,
    documentId: doc.id,
    documentName: doc.name,
    documentType: doc.details.type,
    documentNumber: doc.documentNumber,
    institutionName: targetInst.name,
    institutionId: targetInst.aictePermanentId,
    applicationId: targetInst.applicationId,
    aisheCode: institution.aisheCode,
    scrutinyDate: doc.lastScrutinized || new Date().toISOString(),
    scrutinizedBy: "AICTE Central Standing Scrutiny Committee",
    designation: "Standing Scrutiny & Verification Directorate",
    finalStatus: doc.status,
    summary: {
      total: doc.checklist.length,
      passed,
      warnings,
      failed,
    },
    checklist: doc.checklist,
    findings: doc.checklist
      .filter((c) => c.result !== "PASS")
      .map((c) => `[${c.result}] ${c.parameter}: ${c.remarks}`),
    officialRemarks:
      doc.status === "Verified"
        ? "All statutory criteria verified. Document meets compliance norms mandated under AICTE Approval Process Handbook 2025–26."
        : doc.status === "Needs Review"
        ? "Certificate validity requires confirmation against issuing authority record."
        : "Required declaration details are incomplete; faculty cadre ratio declaration is non-compliant with AICTE 2025-26 approval norms.",
    qrCodeDigest: `VERISCRUTINY:AICTE:${doc.id}:${targetInst.aictePermanentId}:${doc.documentNumber}`,
  };
}
