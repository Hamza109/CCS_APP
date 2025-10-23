import  api  from "./api";

export interface MLA {
  id: number;
  constituency: string;
  name: string;
  mobile_no: string;
  address: string | null;
  email: string;
}

export const mlaApi = {
  // Get all MLAs
  getMLAs: async (): Promise<MLA[]> => {
    const response = await api.get("/api/mlas");
    return response.data;
  },

  // Get MLA by ID
  getMLAById: async (id: number): Promise<MLA> => {
    const response = await api.get(`/mlas/${id}`);
    return response.data;
  },
};
