import { router } from "expo-router";
import { Linking } from "react-native";

// Deep linking configuration
export const linkingConfig = {
  prefixes: ["ccs://", "https://ccs.gov.in", "https://app.ccs.gov.in"],
  config: {
    screens: {
      // Tab screens
      "(tabs)": {
        screens: {
          index: "home",
          services: "services",
          chatbot: "chatbot",
          profile: "profile",
        },
      },
      // Stack screens
      "legal-aid": "legal-aid",
      "acts-rules": "acts-rules",
      "legislative-assembly": "legislative-assembly",
      litigation: "litigation",
      "law-education": "law-education",
      advocates: "advocates",
      "document-registration": "document-registration",
      "marriage-registration": "marriage-registration",
      grievance: "grievance",
      // Detail screens
      "advocate-detail": "advocate/:id",
      "case-detail": "case/:id",
      "act-detail": "act/:id",
      "court-detail": "court/:id",
      "complaint-detail": "complaint/:id",
      "mla-detail": "mla/:id",
    },
  },
};

// URL schemes for different features
export const urlSchemes = {
  // Main features
  home: "ccs://home",
  services: "ccs://services",
  chatbot: "ccs://chatbot",
  profile: "ccs://profile",

  // Legal services
  legalAid: "ccs://legal-aid",
  actsRules: "ccs://acts-rules",
  legislativeAssembly: "ccs://legislative-assembly",
  litigation: "ccs://litigation",
  lawEducation: "ccs://law-education",
  advocates: "ccs://advocates",
  documentRegistration: "ccs://document-registration",
  marriageRegistration: "ccs://marriage-registration",
  grievance: "ccs://grievance",

  // Detail screens
  advocateDetail: (id: string) => `ccs://advocate/${id}`,
  caseDetail: (id: string) => `ccs://case/${id}`,
  actDetail: (id: string) => `ccs://act/${id}`,
  courtDetail: (id: string) => `ccs://court/${id}`,
  complaintDetail: (id: string) => `ccs://complaint/${id}`,
  mlaDetail: (id: string) => `ccs://mla/${id}`,
};

// Deep link handlers
export const handleDeepLink = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    const params = new URLSearchParams(parsedUrl.search);

    // Handle different URL patterns
    if (path === "/home" || path === "/") {
      router.push("/(tabs)");
    } else if (path === "/services") {
      router.push("/(tabs)/services");
    } else if (path === "/chatbot") {
      router.push("/(tabs)/chatbot");
    } else if (path === "/profile") {
      router.push("/(tabs)/profile");
    } else if (path === "/legal-aid") {
      router.push("/legal-aid");
    } else if (path === "/acts-rules") {
      router.push("/acts-rules");
    } else if (path === "/legislative-assembly") {
      router.push("/legislative-assembly" as any);
    } else if (path === "/litigation") {
      router.push("/litigation" as any);
    } else if (path === "/law-education") {
      router.push("/law-education" as any);
    } else if (path === "/advocates") {
      router.push("/advocates" as any);
    } else if (path === "/document-registration") {
      router.push("/document-registration" as any);
    } else if (path === "/marriage-registration") {
      router.push("/marriage-registration" as any);
    } else if (path === "/grievance") {
      router.push("/grievance");
    } else if (path.startsWith("/advocate/")) {
      const id = path.split("/")[2];
      router.push(`/advocate-detail?id=${id}` as any);
    } else if (path.startsWith("/case/")) {
      const id = path.split("/")[2];
      router.push(`/case-detail?id=${id}` as any);
    } else if (path.startsWith("/act/")) {
      const id = path.split("/")[2];
      router.push(`/act-detail?id=${id}` as any);
    } else if (path.startsWith("/court/")) {
      const id = path.split("/")[2];
      router.push(`/court-detail?id=${id}` as any);
    } else if (path.startsWith("/complaint/")) {
      const id = path.split("/")[2];
      router.push(`/complaint-detail?id=${id}` as any);
    } else if (path.startsWith("/mla/")) {
      const id = path.split("/")[2];
      router.push(`/mla-detail?id=${id}` as any);
    } else {
      // Default to home for unknown paths
      router.push("/(tabs)");
    }
  } catch (error) {
    console.error("Error handling deep link:", error);
    // Default to home on error
    router.push("/(tabs)");
  }
};

// Share functionality
export const shareDeepLink = async (
  screen: string,
  params?: Record<string, string>
) => {
  try {
    let url = urlSchemes[screen as keyof typeof urlSchemes];

    if (typeof url === "function" && params) {
      url = url(params.id);
    }

    await Linking.openURL(url as string);
  } catch (error) {
    console.error("Error sharing deep link:", error);
  }
};

// Generate shareable links
export const generateShareableLink = (
  screen: string,
  params?: Record<string, string>
) => {
  const baseUrl = "https://app.ccs.gov.in";

  switch (screen) {
    case "advocate-detail":
      return `${baseUrl}/advocate/${params?.id}`;
    case "case-detail":
      return `${baseUrl}/case/${params?.id}`;
    case "act-detail":
      return `${baseUrl}/act/${params?.id}`;
    case "court-detail":
      return `${baseUrl}/court/${params?.id}`;
    case "complaint-detail":
      return `${baseUrl}/complaint/${params?.id}`;
    case "mla-detail":
      return `${baseUrl}/mla/${params?.id}`;
    default:
      return `${baseUrl}/${screen}`;
  }
};

export default {
  linkingConfig,
  urlSchemes,
  handleDeepLink,
  shareDeepLink,
  generateShareableLink,
};
