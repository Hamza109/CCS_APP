import api from "./api";

export type CatSearchParams = {
  caseNo: string;
  caseYear: string;
  caseType: string;
  location: string;
};

export const catApi = {
  async getCaseDetails(params: CatSearchParams) {
    const res = await api.get("/api/cat/casedetails", {
      params: {
        caseNo: params.caseNo,
        caseType: params.caseType,
        caseYear: params.caseYear,
        location: params.location,
      },
    });
    return res.data;
  },
};

export default catApi;
