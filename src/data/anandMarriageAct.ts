export interface DownloadItem {
  label: string;
  file_url: string;
  language?: string;
}

export interface SectionItem {
  heading: string;
  description: string;
  downloads?: DownloadItem[];
  steps?: string[];
  reference?: { label: string; url: string };
}

export interface AnandMarriageActContent {
  title: string;
  sections: SectionItem[];
}

export const anandMarriageActContent: AnandMarriageActContent = {
  title: "The Anand Marriage Act",
  sections: [
    {
      heading: "Download Anand Marriage Act",
      description:
        "Access the official document of the Anand Marriage Act in your preferred language:",
      downloads: [
        {
          label: "The Anand Marriage Act, 1909 (English)",
          file_url: "docs/anand_marriage_act_english.pdf",
          language: "English",
        },
        {
          label: "The Anand Marriage Act, 1909 (Hindi)",
          file_url: "docs/anand_marriage_act_hindi.pdf",
          language: "Hindi",
        },
      ],
    },
    {
      heading: "Download Anand Marriage Rules",
      description: "Access the official document of the Anand Marriage Rules:",
      downloads: [
        {
          label: "The Anand Marriage Rules",
          file_url: "docs/anand_marriage_rule.pdf",
        },
      ],
    },
    {
      heading:
        "How to apply for marriage registration under Anand Marriage Act?",
      description:
        "Steps to apply for marriage registration under the Anand Marriage Act in Jammu and Kashmir via the official Jansugam portal.",
      steps: [
        "Visit the Jansugam Portal (https://jansugam.jk.gov.in).",
        "Register or log in to your account on the ServicePlus platform.",
        "Navigate to 'Apply for Services' and select 'View all available services.'",
        "Search for the marriage registration service under the Anand Marriage Act.",
        "Fill out the application form with required details and upload necessary documents (e.g., identity proof, marriage proof, photographs).",
        "Submit the application and note the appointment date for verification.",
      ],
      reference: {
        label: "Jansugam Portal",
        url: "https://jansugam.jk.gov.in",
      },
    },
  ],
};
