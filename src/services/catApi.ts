import api from "./api";

export type CatSearchParams = {
  catschemaId: string; // e.g., "117" for Jammu, "119" for Srinagar
  casetypeId: string; // e.g., "1" for Original Application
  caseNo: string;
  caseYear: string;
};

export type CatCaseDetailsResponse = {
  status: "success" | "error";
  data?: {
    caseno: string;
    caseType: string;
    diaryno: string;
    dateoffiling: string;
    applicant: string;
    respondent: string;
    location: string;
    casestatus: string;
    applicantadvocate1: string | null;
    applicantadvocate: string | null;
    respondentadvocate: string | null;
    nextlistingdate1: string | null;
    lastlistingdate: string | null;
    nextlistingdate2: string | null;
    additionalpartypet: string | null;
    additionalpartyres: string | null;
    dateofdisposal: string | null;
    conndiaryno: string | null;
    nextListingPurpose: string | null;
    courtNo: string | null;
    courtName: string | null;
    disposalNature: string | null;
  };
  message?: string;
};

export type CatDailyOrder = {
  applicantno: string;
  diaryno: string;
  dateoforder: string;
  applicantName: string;
  respondentName: string;
  dailyOrderPdf: string;
  itemNo: string;
};

export type CatDailyOrdersResponse = {
  status: "success" | "error";
  data?: CatDailyOrder[];
  message?: string;
};

export type CatFinalOrder = {
  applicantno: string;
  diaryno: string;
  dateofdisposal: string;
  applicantName: string;
  respondentName: string;
  dailyOrderPdf: string;
};

export type CatFinalOrdersResponse = {
  status: "success" | "error";
  data?: CatFinalOrder[];
  message?: string;
};

export type CatListParams = {
  applicant?: string;
  respondentadvocate?: string;
  respondent?: string;
  applicantadvocate?: string;
  sub_category?: string;
  per_page?: number;
  page?: number;
  id?: string; // for single case lookup
};

export type CatListItem = {
  id: number;
  location: number;
  case_type: number;
  case_no: number;
  year: number;
  caseno: string;
  caseType: string;
  casestatus: string;
  applicant: string;
  respondent: string;
  applicantadvocate: string;
  respondentadvocate: string;
  nextlistingdate: string;
  lastlistingdate: string;
  additionalpartypet: string;
  additionalpartyres: string;
  dateofdisposal: string;
  nextListingPurpose: string;
  courtNo: string;
  courtName: string;
  disposalNature: string;
  dateoffiling: string;
  petitioner_file: string | null;
  reply_file: string | null;
};

export type CatListResponse = {
  status?: string;
  data: CatListItem[];
  page?: number;
  per_page?: number;
  total?: number;
};

export const catApi = {
  async getCaseDetails(
    params: CatSearchParams
  ): Promise<CatCaseDetailsResponse> {
    const res = await api.post("/api/cat/case-details", {
      catschemaId: params.catschemaId,
      casetypeId: params.casetypeId,
      caseNo: params.caseNo,
      caseYear: params.caseYear,
    });
    console.log("casedetails-->", res.data);
    return res.data;
  },
  async getDailyOrders(
    params: CatSearchParams
  ): Promise<CatDailyOrdersResponse> {
    const res = await api.post("/api/cat/daily-orders", {
      catschemaId: params.catschemaId,
      casetypeId: params.casetypeId,
      caseNo: params.caseNo,
      caseYear: params.caseYear,
    });
    return res.data;
  },
  async getFinalOrders(
    params: CatSearchParams
  ): Promise<CatFinalOrdersResponse> {
    const res = await api.post("/api/cat/final-orders", {
      catschemaId: params.catschemaId,
      casetypeId: params.casetypeId,
      caseNo: params.caseNo,
      caseYear: params.caseYear,
    });
    return res.data;
  },
  async search(params: CatListParams): Promise<CatListResponse> {
    const res = await api.get("/api/cat/cases/search", { params });
    return res.data as CatListResponse;
  },
};

export default catApi;
