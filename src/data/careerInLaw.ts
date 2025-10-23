export interface CareerItem {
  s_no: number;
  title: string;
  download_url: string;
  date: string;
}

export interface CareerInLawData {
  career_in_law: CareerItem[];
}

export const careerInLawData: CareerInLawData = {
  career_in_law: [
    {
      s_no: 1,
      title:
        "Filling up of two posts of Library Information Assistant on transfer on deputation basis in the Department of Legal Affairs, Ministry of Law & Justice-reg",
      download_url:
        "https://legalaffairs.gov.in/sites/default/files/vacancy/Adv_Library_lnformation_Assistant_DLA.pdf",
      date: "12.10.2025",
    },
    {
      s_no: 2,
      title: "Empanelment of Legal Consultant in 23rd Law Commission of India",
      download_url:
        "https://legalaffairs.gov.in/sites/default/files/vacancy/Adv_Engagement_Legal_Consultants.pdf",
      date: "15.11.2025",
    },
  ],
};
