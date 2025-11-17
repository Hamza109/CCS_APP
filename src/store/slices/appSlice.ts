import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState, User } from "../../types";

const initialState: AppState = {
  user: null,
  isOnline: true,
  theme: "light",
  language: "en",
  locationPermissionRequestToken: 0,
  deviceInfo: undefined,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    triggerLocationPermissionRequest: (state) => {
      state.locationPermissionRequestToken += 1;
    },
    setDeviceInfo: (
      state,
      action: PayloadAction<AppState["deviceInfo"] | undefined>
    ) => {
      state.deviceInfo = action.payload;
    },
    updateUserPreferences: (
      state,
      action: PayloadAction<Partial<User["preferences"]>>
    ) => {
      if (state.user) {
        state.user.preferences = {
          ...state.user.preferences,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  setUser,
  setOnlineStatus,
  setTheme,
  setLanguage,
  triggerLocationPermissionRequest,
  setDeviceInfo,
  updateUserPreferences,
} = appSlice.actions;
export default appSlice.reducer;
