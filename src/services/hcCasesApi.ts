import api from "./api";

export type HighCourtListParams = {
  est_code?: string;
  case_type?: string;
  reg_year?: string;
  reg_no?: string;
  cino?: string;
  pet_name?: string;
  pet_adv?: string;
  res_name?: string;
  res_advocate?: string;
  sub_category?: string;
  per_page?: number;
  page?: number;
};

export type HighCourtListItem = {
  cino: string;
  pet_name?: string;
  res_name?: string;
  date_of_filing?: string;
  [key: string]: any;
};

export type HighCourtListResponse = {
  status?: string;
  data: HighCourtListItem[];
  page?: number;
  per_page?: number;
  total?: number;
};

export const hcCasesApi = {
  async search(params: HighCourtListParams): Promise<HighCourtListResponse> {
    const res = await api.get("/api/hc-cases/search", { params });
    return res.data as HighCourtListResponse;
  },
};

export default hcCasesApi;
