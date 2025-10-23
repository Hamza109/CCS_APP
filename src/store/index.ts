import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import actsRulesReducer from "./slices/actsRulesSlice";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import chatbotReducer from "./slices/chatbotSlice";
import grievanceReducer from "./slices/grievanceSlice";
import legalAidReducer from "./slices/legalAidSlice";
import litigationReducer from "./slices/litigationSlice";

// Persist only the auth slice (token)
const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ["token"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: persistedAuthReducer,
    legalAid: legalAidReducer,
    actsRules: actsRulesReducer,
    litigation: litigationReducer,
    grievance: grievanceReducer,
    chatbot: chatbotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Persistor
export const persistor = persistStore(store);
