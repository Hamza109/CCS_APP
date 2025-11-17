// User and App State Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
  savedAdvocates?: string[];
  savedCases?: string[];
  complaints?: string[];
}

export interface AppState {
  user: User | null;
  isOnline: boolean;
  theme: "light" | "dark";
  language: string;
  locationPermissionRequestToken: number;
  deviceInfo?: {
    latitude?: number;
    longitude?: number;
    district?: string;
    state?: string;
    country?: string;
    ip_address?: string;
    browser?: string;
  };
}

// Legal Aid Types
export interface Advocate {
  id: string;
  name: string;
  contact: string;
  email: string;
  specialization: string[];
  experience: number;
  rating: number;
  location: string;
  isProBono: boolean;
  availability: "available" | "busy" | "unavailable";
  languages: string[];
  courtType: string[];
}

export interface Court {
  id: string;
  name: string;
  location: string;
  type: "supreme" | "high" | "district" | "family" | "consumer" | "labour";
  address: string;
  phone: string;
  email: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  workingHours: string;
  website: string;
}

export interface LegalAidState {
  advocates: Advocate[];
  courts: Court[];
  helplines: any[];
  isLoading: boolean;
  error: string | null;
}

// Acts and Rules Types
export interface Act {
  id: string;
  title: string;
  description: string;
  link: string;
  updatedAt: string;
  category: "central" | "state" | "ut";
  year: number;
  status: "active" | "amended" | "repealed";
  tags: string[];
}

export interface Rule {
  id: string;
  title: string;
  description: string;
  link: string;
  updatedAt: string;
  category: string;
  year: number;
  status: string;
  tags: string[];
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  link: string;
  publishedAt: string;
  category: string;
  priority: "high" | "medium" | "low";
  isRead: boolean;
}

export interface ActsRulesState {
  acts: Act[];
  rules: Rule[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

// Litigation Types
export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  status: "pending" | "in_progress" | "disposed" | "adjourned";
  court: string;
  judge: string;
  nextHearing: string;
  description: string;
  parties: string[];
  tags: string[];
}

export interface LitigationState {
  cases: Case[];
  judgments: any[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

// Grievance Types
export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: "submitted" | "under_review" | "resolved" | "rejected";
  category: string;
  priority: "high" | "medium" | "low";
  submittedAt: string;
  acknowledgmentId: string;
  attachments?: string[];
}

export interface ComplaintForm {
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
}

export interface GrievanceState {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

// Chatbot Types
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  type: "text" | "quick_reply" | "suggestion";
  suggestions?: string[];
}

export interface ChatbotState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

// Education Types
export interface LegalEducation {
  id: string;
  title: string;
  type: "university" | "course" | "guidance" | "procedure";
  description: string;
  institution?: string;
  duration?: string;
  requirements?: string[];
  applicationDeadline?: string;
  link?: string;
}

// Document Registration Types
export interface DocumentRegistration {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  fees: string;
  processingTime: string;
  documents: string[];
  link?: string;
}

// Marriage Registration Types
export interface MarriageRegistration {
  id: string;
  type: "hindu" | "special";
  title: string;
  description: string;
  requirements: string[];
  documents: string[];
  fees: string;
  processingTime: string;
  link?: string;
}

// MLA Types
export interface MLA {
  id: string;
  name: string;
  constituency: string;
  party: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  committees: string[];
  achievements: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  specialization?: string;
  availability?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Service Module Types
export interface ServiceModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export interface QuickAccessButton {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export interface PopularService {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

// Network State
export interface NetworkState {
  isConnected: boolean;
  type: string;
  isInternetReachable: boolean;
}
