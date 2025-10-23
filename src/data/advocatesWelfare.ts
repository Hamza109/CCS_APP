export interface WelfareDownload {
  label: string;
  url: string;
}

export interface AdvocatesWelfareContent {
  title: string;
  description: string;
  downloads: WelfareDownload[];
}

export const advocatesWelfareContent: AdvocatesWelfareContent = {
  title: "Advocates Welfare Fund",
  description:
    "Official documents and rules related to the Advocates' Welfare Fund in Jammu & Kashmir.",
  downloads: [
    {
      label: "The Advocates' Welfare Fund Act, 2001",
      url: "docs/welfare act.pdf",
    },
    {
      label:
        "Offices of the Jammu and Kashmir Advocates' Welfare Fund Trustee Committee",
      url: "docs/Jammu and Kasmir Welfare Fund Rules_2022.pdf",
    },
    {
      label: "The Jammu and Kashmir Advocates' Welfare Fund Trustee Committee",
      url: "docs/SO-466-1.pdf",
    },
    {
      label: "The Jammu and Kashmir Advocates' Welfare Fund Rules, 2023",
      url: "docs/so-1.pdf",
    },
    {
      label: "The Jammu and Kashmir Advocates' Welfare Fund",
      url: "docs/SO-467.pdf",
    },
  ],
};
