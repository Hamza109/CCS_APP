# Services Directory

This directory contains all API service modules for the CCS (Citizen Centric Services) application.

## Structure

```
services/
├── index.ts              # Central export point for all services
├── api.ts                # Main API configuration and URL setup
├── legalAidApi.ts        # Legal Aid specific services
├── districtsApi.ts       # Districts API services
├── proBonoLawyersApi.ts  # Pro-Bono Lawyers API services
└── README.md             # This file
```

## Usage

### Importing Services

**Recommended (using index):**

```typescript
import {
  legalAidApi,
  districtsApi,
  proBonoLawyersApi,
  type LegalAidClinic,
  type District,
  type ProBonoLawyer,
} from "@/services";
```

**Direct import:**

```typescript
import { legalAidApi } from "@/services/legalAidApi";
import { districtsApi } from "@/services/districtsApi";
import { proBonoLawyersApi } from "@/services/proBonoLawyersApi";
```

## Available Services

### Districts API (`districtsApi.ts`)

Handles district-related API calls:

- `getDistricts()` - Get all districts (returns array of strings)

**Types:**

- `District` - Type alias for string (district name)

**Example:**

```typescript
import { districtsApi } from "@/services/districtsApi";

// Get all districts
const response = await districtsApi.getDistricts();
// response.data = ["Srinagar", "Ganderbal", "Anantnag", ...]
```

**Response Format:**

```typescript
{
  success: true,
  data: ["Anantnag", "Bandipora", "Baramulla", ...],
  message: "Districts fetched successfully"
}
```

**Fallback Data:**
The `getDistricts()` method includes dummy data fallback if the API is unavailable, ensuring the app always has district data.

### Pro-Bono Lawyers API (`proBonoLawyersApi.ts`)

Handles pro-bono lawyer related API calls:

- `getLawyers(district?)` - Get all pro-bono lawyers, optionally filtered by district
- `getDistricts()` - Get districts where pro-bono lawyers are available
- `getLawyerById(id)` - Get pro-bono lawyer details by ID

**Types:**

- `ProBonoLawyer` - Interface for pro-bono lawyer data

**Example:**

```typescript
import { proBonoLawyersApi } from "@/services/proBonoLawyersApi";

// Get all pro-bono lawyers
const response = await proBonoLawyersApi.getLawyers();

// Get pro-bono lawyers by district
const srinagarLawyers = await proBonoLawyersApi.getLawyers("Srinagar");

// Get districts with pro-bono lawyers
const districts = await proBonoLawyersApi.getDistricts();
```

**Response Format:**

```typescript
{
  success: true,
  data: [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@law.com",
      phone: "+91-9876543210",
      specialization: ["Criminal Law", "Civil Law"],
      experience: 15,
      district: "Srinagar",
      rating: 4.8,
      isAvailable: true,
      // ... other fields
    }
  ],
  message: "Pro-bono lawyers fetched successfully"
}
```

**Fallback Data:**
The `getLawyers()` method includes dummy data fallback if the API is unavailable, ensuring the app always has lawyer data.

### Legal Aid API (`legalAidApi.ts`)

Handles all legal aid related API calls:

- `getClinics(district?: string)` - Get legal aid clinics, optionally filtered by district
- `getAdvocates(filters?)` - Get list of advocates
- `getAdvocateById(id)` - Get advocate details by ID
- `getCourts(filters?)` - Get list of courts
- `getCourtById(id)` - Get court details by ID

**Types:**

- `LegalAidClinic` - Interface for legal aid clinic data

**Example:**

```typescript
import { legalAidApi } from "@/services/legalAidApi";

// Get all clinics
const response = await legalAidApi.getClinics();

// Get clinics by district
const srinagarClinics = await legalAidApi.getClinics("Srinagar");
```

## Platform-Specific URLs

The Legal Aid API automatically detects the platform and uses the appropriate localhost URL:

- **Android Emulator**: `http://10.0.2.2:8000`
- **iOS Simulator**: `http://localhost:8000`
- **Web**: `http://localhost:8000`

For **physical devices**, update the `getLocalApiUrl()` function in `legalAidApi.ts` to use your computer's IP address.

## Adding New Services

When adding a new service module:

1. Create a new file (e.g., `grievanceApi.ts`)
2. Define your API functions and types
3. Export them in `index.ts`
4. Update this README

**Template:**

```typescript
import axios from "axios";
import { ApiResponse } from "../types";

export const newServiceApi = {
  getData: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await axios.get("/endpoint");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw new Error("Failed to fetch data");
    }
  },
};
```

## Error Handling

All services implement comprehensive error handling:

- Network errors are logged with troubleshooting tips
- Platform-specific debugging information
- Proper error propagation to React Query hooks

## Best Practices

1. ✅ Always use TypeScript interfaces for data structures
2. ✅ Include JSDoc comments for API functions
3. ✅ Implement proper error handling
4. ✅ Use consistent timeout values (15000ms for local development)
5. ✅ Log important debug information during development
6. ✅ Export types alongside functions for type safety
