import axios from "axios";
import { LOCAL_API_URL } from "./api";

export interface StateItem {
  id: number;
  name: string;
}

export interface DistrictItem {
  id: number;
  state_id: number;
  name: string;
}

export const geoApi = {
  getStates: async (): Promise<StateItem[]> => {
    const url = `${LOCAL_API_URL}/api/states`;
    const res = await axios.get(url, { timeout: 15000 });
    return res.data as StateItem[];
  },

  getDistrictsByState: async (stateId: number): Promise<DistrictItem[]> => {
    const url = `${LOCAL_API_URL}/api/districts-by-state`;
    const res = await axios.get(url, {
      params: { state_id: stateId },
      timeout: 15000,
    });
    return res.data as DistrictItem[];
  },
};

export default geoApi;
