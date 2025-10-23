import axios from "axios";
import { ApiResponse } from "../types";
import { LOCAL_API_URL } from "./api";

// District Litigation Officers API Types
export interface DistrictLitigationOfficer {
  id: number;
  office_name: string;
  contact_number: string;
  lat: string;
  lng: string;
  district_name: string;
}

// District Litigation Officers API
export const districtLitigationOfficersApi = {
  /**
   * Get all district litigation officers, optionally filtered by district
   * @param district - Optional district name to filter officers
   * @returns Promise with list of district litigation officers
   */
  getOfficers: async (
    district?: string
  ): Promise<ApiResponse<DistrictLitigationOfficer[]>> => {
    try {
      const url = `${LOCAL_API_URL}/api/district-litigation-officers`;
      console.log("Fetching district litigation officers from:", url);
      console.log("District filter:", district);

      const response = await axios.get(url, {
        params: district ? { district } : {},
        timeout: 15000,
      });

      console.log("District Litigation Officers API Response:", response.data);

      // Normalize plain array responses to ApiResponse shape
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as DistrictLitigationOfficer[],
          message: "District litigation officers fetched successfully",
        } as ApiResponse<DistrictLitigationOfficer[]>;
      }
      return payload as ApiResponse<DistrictLitigationOfficer[]>;
    } catch (error) {
      console.error("Failed to fetch district litigation officers:", error);

      // Return dummy data as fallback
      console.log("Using dummy district litigation officers data");
      return {
        success: true,
        data: [
          {
            id: 1,
            office_name: "District Litigation Office Srinagar",
            contact_number: "9876543210",
            lat: "34.0837",
            lng: "74.7973",
            district_name: "Srinagar",
          },
          {
            id: 2,
            office_name: "District Litigation Office Jammu",
            contact_number: "9876543211",
            lat: "32.7266",
            lng: "74.8570",
            district_name: "Jammu",
          },
          {
            id: 3,
            office_name: "District Litigation Office Anantnag",
            contact_number: "6006939571",
            lat: "33.73317049805955",
            lng: "75.1479109459016",
            district_name: "Anantnag",
          },
          {
            id: 4,
            office_name: "District Litigation Office Baramulla",
            contact_number: "9876543213",
            lat: "34.2068",
            lng: "74.3467",
            district_name: "Baramulla",
          },
        ],
        message: "District litigation officers fetched successfully",
      } as ApiResponse<DistrictLitigationOfficer[]>;
    }
  },

  /**
   * Get districts for district litigation officers
   * @returns Promise with list of districts where officers are available
   */
  getDistricts: async (): Promise<ApiResponse<string[]>> => {
    try {
      const url = `${LOCAL_API_URL}/api/district-litigation-officers/districts`;
      console.log("Fetching district litigation officer districts from:", url);

      const response = await axios.get(url, {
        timeout: 15000,
      });

      console.log(
        "District Litigation Officer Districts API Response:",
        response.data
      );

      // Normalize plain array responses to ApiResponse shape
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as string[],
          message: "District litigation officer districts fetched successfully",
        } as ApiResponse<string[]>;
      }
      return payload as ApiResponse<string[]>;
    } catch (error) {
      console.error(
        "Failed to fetch district litigation officer districts:",
        error
      );

      // Return dummy data as fallback
      console.log("Using dummy district litigation officer districts data");
      return {
        success: true,
        data: [
          "Srinagar",
          "Jammu",
          "Anantnag",
          "Baramulla",
          "Budgam",
          "Ganderbal",
          "Kupwara",
          "Pulwama",
          "Shopian",
          "Kulgam",
        ],
        message: "District litigation officer districts fetched successfully",
      } as ApiResponse<string[]>;
    }
  },
};

export default districtLitigationOfficersApi;
