import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Act, ActsRulesState, Notification, Rule } from "../../types";

const initialState: ActsRulesState = {
  acts: [],
  rules: [],
  notifications: [],
  isLoading: false,
  error: null,
};

const actsRulesSlice = createSlice({
  name: "actsRules",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setActs: (state, action: PayloadAction<Act[]>) => {
      state.acts = action.payload;
    },
    addAct: (state, action: PayloadAction<Act>) => {
      state.acts.push(action.payload);
    },
    updateAct: (state, action: PayloadAction<Act>) => {
      const index = state.acts.findIndex((act) => act.id === action.payload.id);
      if (index !== -1) {
        state.acts[index] = action.payload;
      }
    },
    setRules: (state, action: PayloadAction<Rule[]>) => {
      state.rules = action.payload;
    },
    addRule: (state, action: PayloadAction<Rule>) => {
      state.rules.push(action.payload);
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.isRead = true;
      }
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
  setActs,
  addAct,
  updateAct,
  setRules,
  addRule,
  setNotifications,
  markNotificationAsRead,
  clearError,
} = actsRulesSlice.actions;
export default actsRulesSlice.reducer;
