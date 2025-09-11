import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Fetch all accounts
export const fetchFBAccounts = createAsyncThunk(
  "fbAccounts/fetchFBAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/facebook/accounts");
      // console.log(res.data.accounts);
      return res.data.accounts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to load accounts");
    }
  }
);

// Add account
export const addFBAccount = createAsyncThunk(
  "fbAccounts/addFBAccount",
  async (accountData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/facebook/add", accountData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add account");
    }
  }
);
// Upload multiple accounts via CSV/Excel
export const uploadFBAccounts = createAsyncThunk(
  "fbAccounts/uploadFBAccounts",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/facebook/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; // contains insertedCount + insertedIds
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to upload accounts");
    }
  }
);

// Remove account
export const removeFBAccount = createAsyncThunk(
  "fbAccounts/removeFBAccount",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/facebook/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove account");
    }
  }
);

const fbAccountsSlice = createSlice({
  name: "fbAccounts",
  initialState: {
    accounts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFBAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFBAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchFBAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addFBAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(addFBAccount.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove
      .addCase(removeFBAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((acc) => acc.id !== action.payload);
      })
      .addCase(removeFBAccount.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(uploadFBAccounts.fulfilled, (state, action) => {
        // Option A: trigger refetch after upload → simplest & always in sync
        // do nothing here, frontend should dispatch(fetchFBAccounts()) after success

        // Option B: optimistic update (if backend returns inserted accounts directly)
        // state.accounts = [...state.accounts, ...action.payload.accounts];
      })
      .addCase(uploadFBAccounts.rejected, (state, action) => {
        state.error = action.payload;
      });

  },
});

export default fbAccountsSlice.reducer;
