import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import userReducer from "./slices/userSlice";
import fbAccountsReducer from "./slices/fbAccountsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    user: userReducer,
    fbAccounts: fbAccountsReducer,
  },
});

export default store;
