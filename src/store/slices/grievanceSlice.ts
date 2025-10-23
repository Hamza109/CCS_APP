import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Complaint, GrievanceState } from "../../types";

const initialState: GrievanceState = {
  complaints: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
};

const grievanceSlice = createSlice({
  name: "grievance",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setComplaints: (state, action: PayloadAction<Complaint[]>) => {
      state.complaints = action.payload;
    },
    addComplaint: (state, action: PayloadAction<Complaint>) => {
      state.complaints.push(action.payload);
    },
    updateComplaint: (state, action: PayloadAction<Complaint>) => {
      const index = state.complaints.findIndex(
        (complaint) => complaint.id === action.payload.id
      );
      if (index !== -1) {
        state.complaints[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setSubmitting,
  setError,
  setComplaints,
  addComplaint,
  updateComplaint,
  clearError,
} = grievanceSlice.actions;
export default grievanceSlice.reducer;
