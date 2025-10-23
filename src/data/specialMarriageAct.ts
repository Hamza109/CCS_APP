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

export interface SpecialMarriageActContent {
  title: string;
  sections: SectionItem[];
}

export const specialMarriageActContent: SpecialMarriageActContent = {
  title: "The Special Marriage Act",
  sections: [
    {
      heading: "Download Special Marriage Act",
      description:
        "Access the official document of the Special Marriage Act in your preferred language:",
      downloads: [
        {
          label: "The Special Marriage Act, 1954 (English)",
          file_url: "docs/special_marriage_act_english.pdf",
          language: "English",
        },
        {
          label: "The Special Marriage Act, 1954 (Hindi)",
          file_url: "docs/special_marriage_act_hindi.pdf",
          language: "Hindi",
        },
      ],
    },
    {
      heading: "Download Special Marriage Rules",
      description: "Access the official document of the Special Marriage Rules:",
      downloads: [
        {
          label: "The Special Marriage Rules",
          file_url: "docs/so_312.pdf",
        },
        {
          label: "Marriage Officer Under Special Marriage Act",
          file_url: "docs/so_421.pdf",
        },
      ],
    },
    {
      heading:
        "How to apply for marriage registration under Special Marriage Act?",
      description:
        "Steps to apply for marriage registration under the Special Marriage Act in Jammu and Kashmir via the official Jansugam portal.",
      steps: [
        "Visit the Jansugam Portal (https://jansugam.jk.gov.in).",
        "Register or log in to your account on the ServicePlus platform.",
        "Navigate to 'Apply for Services' and select 'View all available services.'",
        "Search for the marriage registration service under the Special Marriage Act.",
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


