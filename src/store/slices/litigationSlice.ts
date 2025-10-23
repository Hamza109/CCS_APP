import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Case, LitigationState } from "../../types";

const initialState: LitigationState = {
  cases: [],
  judgments: [],
  isLoading: false,
  error: null,
  searchQuery: "",
};

const litigationSlice = createSlice({
  name: "litigation",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCases: (state, action: PayloadAction<Case[]>) => {
      state.cases = action.payload;
    },
    addCase: (state, action: PayloadAction<Case>) => {
      state.cases.push(action.payload);
    },
    updateCase: (state, action: PayloadAction<Case>) => {
      const index = state.cases.findIndex(
        (caseItem) => caseItem.id === action.payload.id
      );
      if (index !== -1) {
        state.cases[index] = action.payload;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCases,
  addCase,
  updateCase,
  setSearchQuery,
  clearError,
} = litigationSlice.actions;
export default litigationSlice.reducer;
