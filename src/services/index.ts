/**
 * Services Index
 * Centralized exports for all API services
 */

// Main API instance and configuration
export { default as api, getLocalApiUrl, LOCAL_API_URL } from "./api";

// Legal Aid API
export { legalAidApi, type LegalAidClinic } from "./legalAidApi";

// Districts API
export { districtsApi, type District } from "./districtsApi";

// Pro-Bono Lawyers API
export { proBonoLawyersApi, type ProBonoLawyer } from "./proBonoLawyersApi";

// District Litigation Officers API
export {
  districtLitigationOfficersApi,
  type DistrictLitigationOfficer,
} from "./districtLitigationOfficersApi";

// Para Legal Volunteers API
export {
  paraLegalVolunteersApi,
  type ParaLegalVolunteer,
} from "./paraLegalVolunteersApi";

// DLSA API
export { dlsaApi, type DlsaContact } from "./dlsaApi";

// Schemes API
export { schemesApi, type Scheme } from "./schemesApi";

// Literacy Clubs API
export { literacyClubsApi, type LiteracyClub } from "./literacyClubsApi";

// Complaints API
export {
  complaintsApi,
  type ComplaintPayload,
  type ComplaintResponse,
} from "./complaintsApi";

// High Court API
export { highCourtApi, type HighCourtSearchParams } from "./highCourtApi";

// CAT API
export { catApi, type CatSearchParams } from "./catApi";

// Courts API
export { courtsApi, type CourtCoordinate } from "./courtsApi";

// Consumers API
export { consumersApi, type ConsumerCenter } from "./consumersApi";

// Re-export other APIs as they are created
// Example:
// export { actsRulesApi } from "./actsRulesApi";
// export { grievanceApi } from "./grievanceApi";
// export { chatbotApi } from "./chatbotApi";
