import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,         // desktop sidebar
  mobileSidebarOpen: false,  // mobile sidebar
  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openMobileSidebar: (state) => {
      state.mobileSidebarOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.mobileSidebarOpen = false;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, openMobileSidebar, closeMobileSidebar, setTheme } =
  uiSlice.actions;

export default uiSlice.reducer;
