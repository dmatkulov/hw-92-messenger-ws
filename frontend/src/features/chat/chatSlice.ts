import { ApiMessage } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { fetchMessages } from './chatThunks';
import { RootState } from '../../app/store';

interface ChatState {
  items: ApiMessage[];
  fetchLoading: boolean;
}

const initialState: ChatState = {
  items: [],
  fetchLoading: false,
};

export const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, { payload: messages }) => {
        state.fetchLoading = false;
        state.items = messages;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.fetchLoading = false;
      });
  },
});

export const chatReducer = ChatSlice.reducer;

export const selectLatest = (state: RootState) => state.chat.items;
