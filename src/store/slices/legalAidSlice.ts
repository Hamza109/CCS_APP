import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Advocate, Court, LegalAidState } from "../../types";

const initialState: LegalAidState = {
  advocates: [],
  courts: [],
  helplines: [],
  isLoading: false,
  error: null,
};

const legalAidSlice = createSlice({
  name: "legalAid",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAdvocates: (state, action: PayloadAction<Advocate[]>) => {
      state.advocates = action.payload;
    },
    addAdvocate: (state, action: PayloadAction<Advocate>) => {
      state.advocates.push(action.payload);
    },
    updateAdvocate: (state, action: PayloadAction<Advocate>) => {
      const index = state.advocates.findIndex(
        (advocate) => advocate.id === action.payload.id
      );
      if (index !== -1) {
        state.advocates[index] = action.payload;
      }
    },
    setCourts: (state, action: PayloadAction<Court[]>) => {
      state.courts = action.payload;
    },
    // setFilters: (state, action: PayloadAction<SearchFilters>) => {
    //   state.filters = action.payload;
    // },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setAdvocates,
  addAdvocate,
  updateAdvocate,
  setCourts,
  // setFilters,
  clearError,
} = legalAidSlice.actions;
export default legalAidSlice.reducer;
