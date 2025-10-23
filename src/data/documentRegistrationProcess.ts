export interface ProcessFile {
  label: string;
  url: string;
  target?: string;
}

export interface DownloadSection {
  heading: string;
  description: string;
  file: ProcessFile;
}

export interface StepItem {
  step: number;
  title: string;
  description?: string;
  link?: string;
}

export interface GeneralSteps {
  heading: string;
  steps: StepItem[];
}

export interface DocumentRegistrationProcess {
  title: string;
  description: string;
  download_section: DownloadSection;
  general_steps: GeneralSteps;
}

export const documentRegistrationProcess: DocumentRegistrationProcess = {
  title: "Document Registration Guidelines",
  description:
    "Comprehensive step-by-step guide and downloadable document for the Registration System (NGDRS) in the Union Territory of Jammu & Kashmir.",
  download_section: {
    heading:
      "Download Registration System (NGDRS) in the UT of Jammu & Kashmir",
    description:
      "Access the official document of the Registration System (NGDRS) in the UT of Jammu & Kashmir:",
    file: {
      label: "Download PDF File",
      url: "docs/registration_process.pdf",
      target: "_blank",
    },
  },
  general_steps: {
    heading: "General Steps for Registration",
    steps: [
      {
        step: 1,
        title: "Go to the website",
        description: "Visit the official NGDRS website.",
        link: "https://ngdrs.jk.gov.in/NGDRS_JK/",
      },
      { step: 2, title: "Complete new user registration" },
      { step: 3, title: "Log in to the website" },
      { step: 4, title: "Fill all details in the A-General Info tab" },
      { step: 5, title: "Complete C-Property details & Valuation" },
      {
        step: 6,
        title: "Fill D-Party details and designate one party as the presenter",
      },
      { step: 7, title: "Complete E-Witness details" },
      { step: 8, title: "Proceed to F-Payment" },
      { step: 9, title: "Calculate G-Stamp duty" },
      { step: 10, title: "Review H-Pre-Registration Summary" },
      { step: 11, title: "Upload files in I-Upload File" },
      { step: 12, title: "Submit data in J-Data Submission" },
      { step: 13, title: "Schedule K-Appointment" },
      {
        step: 14,
        title:
          "Visit the SRO office on the appointment date for further processing",
      },
    ],
  },
};
