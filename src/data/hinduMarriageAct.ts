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

export interface HinduMarriageActContent {
  title: string;
  sections: SectionItem[];
}

export const hinduMarriageActContent: HinduMarriageActContent = {
  title: "The Hindu Marriage Act",
  sections: [
    {
      heading: "Download Hindu Marriage Act",
      description:
        "Access the official document of the Hindu Marriage Act in your preferred language:",
      downloads: [
        {
          label: "The Hindu Marriage Act, 1955 (English)",
          file_url: "docs/hindu_marriage_act_english.pdf",
          language: "English",
        },
        {
          label: "The Hindu Marriage Act, 1955 (Hindi)",
          file_url: "docs/hindu_marriage_act_hindi.pdf",
          language: "Hindi",
        },
      ],
    },
    {
      heading: "Download Hindu Marriage Rules",
      description: "Access the official document of the Hindu Marriage Rules:",
      downloads: [
        {
          label: "The Hindu Marriage Rules",
          file_url: "docs/marriage_rule.pdf",
        },
      ],
    },
    {
      heading:
        "How to apply for marriage registration under Hindu Marriage Act?",
      description:
        "Steps to apply for marriage registration under the Hindu Marriage Act in Jammu and Kashmir via the official Jansugam portal.",
      steps: [
        "Visit the Jansugam Portal (https://jansugam.jk.gov.in).",
        "Register or log in to your account on the ServicePlus platform.",
        "Navigate to 'Apply for Services' and select 'View all available services.'",
        "Search for the marriage registration service under the Hindu Marriage Act.",
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
