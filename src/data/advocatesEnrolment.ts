export interface EnrolmentDownloadFile {
  label: string;
  url: string;
}

export interface EnrolmentDownloads {
  title: string;
  files: EnrolmentDownloadFile[];
}

export interface EnrolmentSection {
  heading: string;
  steps: string[];
}

export interface AdvocatesEnrolmentContent {
  title: string;
  description: string;
  downloads: EnrolmentDownloads;
  sections: EnrolmentSection[];
}

export const advocatesEnrolmentContent: AdvocatesEnrolmentContent = {
  title: "Process for Enrollment as an Advocate in J&K Bar Council",
  description:
    "Step-by-step process for applying for enrollment as an advocate in the Jammu & Kashmir Bar Council, including eligibility criteria, required documents, and verification procedures.",
  downloads: {
    title: "Download Enrollment Process & Application Form",
    files: [
      {
        label: "Download Enrollment Process",
        url: "docs/enrollment_form_04012025.pdf",
      },
      { label: "Download Application Form", url: "docs/Applicationform.pdf" },
    ],
  },
  sections: [
    {
      heading: "Check Eligibility",
      steps: [
        "Ensure you are at least 21 years old (verified by Matriculation/Secondary School Certificate).",
        "Hold a recognized LLB or BA LLB degree from a university approved by the Bar Council of India (BCI).",
        "Be a permanent resident of J&K (verified by Domicile Certificate).",
        "Not be in full-time employment, business, or profession (unless exempted).",
        "No criminal convictions or pending cases affecting character/fitness.",
      ],
    },
    {
      heading: "Download and Prepare the Enrollment Form",
      steps: [
        "Download the form from www.jkhighcourt.nic.in under 'Advocates' Corner' tab.",
        "Fill in personal details (name, addresses, date of birth, etc.) in block letters.",
        "Affix Rs. 10/- court stamp and paste an attested passport-size photo.",
        "Sign and date the form.",
      ],
    },
    {
      heading: "Gather Required Documents",
      steps: [
        "Original and self-attested copies of: Matriculation, 10+2, Graduation (if applicable), LLB/BA LLB certificates.",
        "Character Certificate from University/College, Domicile Certificate, Category Certificate (if applicable).",
        "Address proof (Aadhaar, Voter Card, etc.), affidavit with Rs. 10/- e-stamp, two Senior Advocate character certificates.",
        "Two unattested photos, one attested photo for Verification Roll.",
      ],
    },
    {
      heading: "Prepare Demand Drafts",
      steps: [
        "Rs. 600/- (Rs. 300/- for SC/ST) for J&K Bar Council, payable at R.C.C. Jammu/Srinagar.",
        "Rs. 300/- (Rs. 150/- for SC/ST) for Bar Council of India, payable at R.C.C. New Delhi.",
        "Two Rs. 830/- drafts for JKBOSE verification of Matriculation and 10+2 certificates.",
        "Rs. 300/- each for University of Kashmir verification of LLB and Graduation degrees (if applicable).",
      ],
    },
    {
      heading: "Complete Personal Verification",
      steps: [
        "Submit Personal Verification Roll online at https://evs.jk.gov.in using registered mobile/email.",
        "Include an attested photo and submit one hard copy with the application.",
      ],
    },
    {
      heading: "Submit the Application",
      steps: [
        "Compile all forms, documents, drafts, and Verification Roll copy.",
        "Submit to Registrar General, High Court of J&K, Bar Council of J&K, Srinagar/Jammu.",
      ],
    },
    {
      heading: "Verification and Approval",
      steps: [
        "Bar Council verifies certificates with boards/universities; CID verifies character.",
        "Upon clearance, enrollment is approved, and you can practice in J&K.",
      ],
    },
  ],
};
