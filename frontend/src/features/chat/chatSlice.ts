import { ApiMessage } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { deleteMessage, fetchMessages } from './chatThunks';
import { RootState } from '../../app/store';

interface ChatState {
  items: ApiMessage[];
  fetchLoading: boolean;
  deleteLoading: boolean;
}

const initialState: ChatState = {
  items: [],
  fetchLoading: false,
  deleteLoading: false,
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

    builder
      .addCase(deleteMessage.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteMessage.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(deleteMessage.rejected, (state) => {
        state.deleteLoading = false;
      });
  },
});

export const chatReducer = ChatSlice.reducer;

export const selectLatest = (state: RootState) => state.chat.items;
export const selectFetchLoading = (state: RootState) => state.chat.fetchLoading;
export const selectDeleteLoading = (state: RootState) =>
  state.chat.deleteLoading;
