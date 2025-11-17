export const ROUTES = {
  // Core
  ROOT: "/" as const,

  // Case Search (module)
  SEARCH_CASE: {
    ROOT: "/search-case" as const,
    HIGH_COURT_SEARCH: "/search-case/high-court-search" as const,
    HIGH_COURT_LIST: "/search-case/high-court-list" as const,
    HIGH_COURT_RESULT: "/search-case/high-court-result" as const,
    DISTRICT_COURT_SEARCH: "/search-case/district-court-search" as const,
    CAT_SEARCH: "/search-case/cat-search" as const,
    CAT_LIST: "/search-case/cat-list" as const,
    CAT_RESULT: "/search-case/cat-result" as const,
    FCR_COURT_SEARCH: "/search-case/fcr-court-search" as const,
  } as const,

  // Contact/Forms
  LANDMARK_JUDGEMENTS: "/landmark-judgements" as const,
  // Find My Court (module)
  FIND_COURT: {
    ROOT: "/find-court" as const,
    LIST: "/find-court/list" as const,
  } as const,
  // Legacy alias (kept for backwards-compat if referenced elsewhere)
  FIND_MY_COURT: "/find-my-court" as const,

  // Legal Aid (module)
  LEGAL_AID: {
    ROOT: "/legal-aid" as const,
    CLINICS: "/legal-aid/clinics" as const,
    PRO_BONO_LAWYERS: "/legal-aid/pro-bono-lawyers" as const,
    DISTRICT_LITIGATION_OFFICERS:
      "/legal-aid/district-litigation-officers" as const,
    PARA_LEGAL_VOLUNTEERS: "/legal-aid/para-legal-volunteers" as const,
    DLSA_CONTACTS: "/legal-aid/dlsa-contacts" as const,
    JK_LSA_SCHEMES: "/legal-aid/jk-lsa-schemes" as const,
    LITERACY_CLUBS: "/legal-aid/literacy-clubs" as const,
    CONTACT_FORM: "/legal-aid/contact-form" as const,
  } as const,

  // Acts, Rules & Notifications (module)
  ACTS_RULES: {
    ROOT: "/acts-rules" as const,
    UT: "/acts-rules/ut" as const,
    CENTRE: "/acts-rules/centre" as const,
  } as const,

  // Consumer Commission (module)
  CONSUMER_COMMISSION: {
    ROOT: "/consumer-commission" as const,
    LIST: "/consumer-commission/list" as const,
  } as const,

  // Legislative Assembly (module)
  LEGISLATIVE_ASSEMBLY: {
    ROOT: "/legislative-assembly" as const,
    MLA_LIST: "/legislative-assembly/mla-list" as const,
    QA_SESSION: "/legislative-assembly/qa-session" as const,
    COMMITTEE_REPORTS: "/legislative-assembly/committee-reports" as const,
    LEGISLATIVE_BUSINESS: "/legislative-assembly/legislative-business" as const,
    LIVE_PROCEEDINGS: "/legislative-assembly/live-proceedings" as const,
    PUBLIC_OPINION: "/legislative-assembly/public-opinion" as const,
  } as const,

  // Law Education (module)
  LAW_EDUCATION: {
    ROOT: "/law-education" as const,
    EXPERT_GUIDANCE: "/law-education/expert-guidance" as const,
    NATIONAL_LAW_UNIVERSITIES:
      "/law-education/national-law-universities" as const,
    LOCAL_UNIVERSITIES: "/law-education/local-universities" as const,
    SPECIALISED_COURSES: "/law-education/specialised-courses" as const,
    HOW_TO_APPLY: "/law-education/how-to-apply" as const,
    SCHOLARSHIPS: "/law-education/scholarships" as const,
  } as const,

  // Advocates (module)
  ADVOCATES: {
    ROOT: "/advocates" as const,
    ADVOCATES: "/advocates/advocates" as const,
    ENROLMENT_PROCESS: "/advocates/enrolment-process" as const,
    WELFARE_SCHEMES: "/advocates/welfare-schemes" as const,
    NOTARY_SERVICES: "/advocates/notary-services" as const,
    LIST_NOTARIES: "/advocates/list-notaries" as const,
    NOTARIES: "/advocates/notaries" as const,
    STANDING_COUNSELS: "/advocates/standing-counsels" as const,
    LAW_OFFICERS: "/advocates/law-officers" as const,
    CAREER_IN_LAW: "/advocates/career-in-law" as const,
    COUNSEL_FEE: "/advocates/counsel-fee" as const,
    ECOURT_FEE_BRANCHES: "/advocates/ecourt-fee-branches" as const,
  } as const,

  // Document Registration (module)
  DOCUMENT_REGISTRATION: {
    ROOT: "/document-registration" as const,
    PROCESS: "/document-registration/process" as const,
    REGISTRARS_JAMMU: "/document-registration/registrars-jammu" as const,
    REGISTRARS_KASHMIR: "/document-registration/registrars-kashmir" as const,
    MODEL_TEMPLATES: "/document-registration/model-templates" as const,
    STAMP_VENDORS: "/document-registration/stamp-vendors" as const,
    CHECKLIST_DOCUMENTS: "/document-registration/checklist-documents" as const,
    FAQ: "/document-registration/faq" as const,
  } as const,

  // Marriage Registration (module)
  MARRIAGE_REGISTRATION: {
    ROOT: "/marriage-registration" as const,
    HINDU_MARRIAGE_ACT: "/marriage-registration/hindu-marriage-act" as const,
    SPECIAL_MARRIAGE_ACT:
      "/marriage-registration/special-marriage-act" as const,
    ANAND_MARRIAGE_ACT: "/marriage-registration/anand-marriage-act" as const,
    AUTHORITY_LOCATIONS: "/marriage-registration/authority-locations" as const,
  } as const,

  // Women & Children Development (module)
  WOMEN_CHILDREN: {
    ROOT: "/women-children" as const,
    DCPU_CWC_JJB: "/women-children/dcpu-cwc-jjb" as const,
    ONE_STOP_CENTRE: "/women-children/one-stop-centre" as const,
  } as const,
} as const;

export type RoutePath =
  | (typeof ROUTES)[keyof typeof ROUTES]
  | (typeof ROUTES.LEGAL_AID)[keyof typeof ROUTES.LEGAL_AID]
  | (typeof ROUTES.SEARCH_CASE)[keyof typeof ROUTES.SEARCH_CASE]
  | (typeof ROUTES.FIND_COURT)[keyof typeof ROUTES.FIND_COURT]
  | (typeof ROUTES.ACTS_RULES)[keyof typeof ROUTES.ACTS_RULES]
  | (typeof ROUTES.CONSUMER_COMMISSION)[keyof typeof ROUTES.CONSUMER_COMMISSION]
  | (typeof ROUTES.LEGISLATIVE_ASSEMBLY)[keyof typeof ROUTES.LEGISLATIVE_ASSEMBLY]
  | (typeof ROUTES.LAW_EDUCATION)[keyof typeof ROUTES.LAW_EDUCATION]
  | (typeof ROUTES.WOMEN_CHILDREN)[keyof typeof ROUTES.WOMEN_CHILDREN]
  | (typeof ROUTES.MARRIAGE_REGISTRATION)[keyof typeof ROUTES.MARRIAGE_REGISTRATION]
  | (typeof ROUTES.DOCUMENT_REGISTRATION)[keyof typeof ROUTES.DOCUMENT_REGISTRATION]
  | (typeof ROUTES.ADVOCATES)[keyof typeof ROUTES.ADVOCATES];
