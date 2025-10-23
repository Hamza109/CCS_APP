export interface ModelTemplateItem {
  id: number;
  name: string;
  file_url: string;
  icon: string;
}

export interface ModelTemplatesData {
  title: string;
  description: string;
  templates: ModelTemplateItem[];
}

export const modelTemplatesData: ModelTemplatesData = {
  title: "Model Template",
  description:
    "List of downloadable model templates for various legal deeds and agreements related to property registration and documentation.",
  templates: [
    {
      id: 1,
      name: "Draft For Revocation Of Will Deed",
      file_url: "model_template/draft for revocation of will deed-1.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 2,
      name: "Reconveyance Deed",
      file_url: "model_template/draft for reconveyance deed-1.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 3,
      name: "Format For Agreement To Sell",
      file_url: "model_template/draft for agreement to sell-1.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 4,
      name: "Format For Exchange Deed",
      file_url: "model_template/draft for format for exchange deed-1.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 5,
      name: "Relinquishment Deed",
      file_url: "model_template/draft for relinquishment deed-1.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 6,
      name: "Deed For Further Charge",
      file_url: "model_template/draft for deed for further change-1.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 7,
      name: "Cancellation Revocation",
      file_url: "model_template/CANCELLATION_REVOCATION.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 8,
      name: "Deed of Cancellation",
      file_url: "model_template/deed-cancellation-deed.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 9,
      name: "Format For Gift",
      file_url: "model_template/FORMAT_FOR_GIFT.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 10,
      name: "General Power of Attorney",
      file_url: "model_template/GENERAL_POWER_OF_ATTORNEY.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 11,
      name: "Sale Deed",
      file_url: "model_template/SALE_DEED.pdf",
      icon: "assets/images/download.png",
    },
    {
      id: 12,
      name: "WILL DEED",
      file_url: "model_template/WILLDEED.pdf",
      icon: "assets/images/download.png",
    },
  ],
};
