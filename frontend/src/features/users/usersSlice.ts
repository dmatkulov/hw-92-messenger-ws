import { GlobalError, User, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { googleLogin, login, logOut, register } from './usersThunks';
import { RootState } from '../../app/store';

interface UserState {
  user: User | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
  logOutLoading: boolean;
  googleLogin: boolean;
  googleLoginError: GlobalError | null;
}

const initialState: UserState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  loginError: null,
  logOutLoading: false,
  googleLogin: false,
  googleLoginError: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
    setRegisterError: (state, { payload: action }) => {
      state.registerError = action;
    },
    setLoginError: (state, { payload: action }) => {
      state.loginError = action;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, { payload: data }) => {
        state.registerLoading = false;
        state.user = data.user;
      })
      .addCase(register.rejected, (state, { payload: error }) => {
        state.registerLoading = false;
        state.registerError = error || null;
      });

    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, { payload: data }) => {
        state.loginLoading = false;
        state.user = data.user;
      })
      .addCase(login.rejected, (state, { payload: error }) => {
        state.loginLoading = false;
        state.loginError = error || null;
      });

    builder
      .addCase(logOut.pending, (state) => {
        state.logOutLoading = true;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.logOutLoading = false;
      })
      .addCase(logOut.rejected, (state) => {
        state.logOutLoading = false;
      });

    builder
      .addCase(googleLogin.pending, (state) => {
        state.googleLogin = true;
        state.googleLoginError = null;
      })
      .addCase(googleLogin.fulfilled, (state, { payload: data }) => {
        state.googleLogin = false;
        state.user = data.user;
      })
      .addCase(googleLogin.rejected, (state, { payload: error }) => {
        state.googleLogin = false;
        state.googleLoginError = error || null;
      });
  },
});

export const usersReducer = usersSlice.reducer;
export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterLoading = (state: RootState) =>
  state.users.registerLoading;
export const selectRegisterError = (state: RootState) =>
  state.users.registerError;
export const selectLoginLoading = (state: RootState) =>
  state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectGoogleLoginError = (state: RootState) =>
  state.users.googleLoginError;
export const selectLogOutLoading = (state: RootState) =>
  state.users.logOutLoading;
export const { unsetUser, setRegisterError, setLoginError } =
  usersSlice.actions;
