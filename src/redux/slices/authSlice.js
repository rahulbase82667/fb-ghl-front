import { createSlice } from "@reduxjs/toolkit";
import CONFIG from "../../constants/config";

// Load token & user from localStorage if available
const token = localStorage.getItem(CONFIG.TOKEN_KEY);
const user = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;

const initialState = {
  token: token || null,
  user: user || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      // Persist in localStorage
      localStorage.setItem(CONFIG.TOKEN_KEY, action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
                                                          
      state.token = null;
      state.user = null;
      localStorage.removeItem(CONFIG.TOKEN_KEY);
      localStorage.removeItem("user");
    },
      updateUser: (state, action) => {
      // Update user data in Redux store
      state.user = { ...state.user, ...action.payload };
      // Persist updated user in localStorage
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
