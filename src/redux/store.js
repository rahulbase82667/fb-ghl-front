import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import userReducer from "./slices/userSlice";
import fbAccountsReducer from "./slices/fbAccountsSlice";
import chatsReducer from "./slices/chatsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    user: userReducer,
    fbAccounts: fbAccountsReducer,
    chats: chatsReducer, 

  },
});

export default store;
