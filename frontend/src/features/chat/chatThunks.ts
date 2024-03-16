import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiMessage } from '../../types';
import axiosApi from '../../axiosApi';
import { routes } from '../../constants';

export const fetchMessages = createAsyncThunk<ApiMessage[]>(
  'messages/fetchLatest',
  async () => {
    const response = await axiosApi.get<ApiMessage[]>(routes.chat);
    return response.data ?? [];
  },
);
