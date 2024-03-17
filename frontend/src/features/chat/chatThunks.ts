import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiMessage } from '../../types';
import axiosApi from '../../axiosApi';
import { routes } from '../../helpers/constants';

export const fetchMessages = createAsyncThunk<ApiMessage[]>(
  'chat/fetchLatest',
  async () => {
    const response = await axiosApi.get<ApiMessage[]>(routes.chat);
    return response.data ?? [];
  },
);
