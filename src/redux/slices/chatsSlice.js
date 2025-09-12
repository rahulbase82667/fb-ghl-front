import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Fetch conversations for a specific FB account
export const fetchConversations = createAsyncThunk(
  "chats/fetchConversations",
  async (accountId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/chats/conversations/${accountId}`);
      return res.data.conversations; // returns array of conversations
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load conversations");
    }
  }
);
// Fetch messages for a conversation
export const fetchMessages = createAsyncThunk(
  "chats/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/messages/all/${conversationId}`);
      return res.data.messages; // array of messages
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load messages");
    }
  }
);

const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    conversations: [],
    activeConversation: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      state.messages = []; // reset messages until we fetch
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveConversation, setMessages, addMessage } = chatsSlice.actions;
export default chatsSlice.reducer;
