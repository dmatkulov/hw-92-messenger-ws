import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { LockOpen } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { login } from '../usersThunks';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectGoogleLoginError,
  selectLoginError,
  selectLoginLoading,
  setLoginError,
} from '../usersSlice';

import { LoginMutation } from '../../../types';

const LoginUser: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const loading = useAppSelector(selectLoginLoading);
  const googleError = useAppSelector(selectGoogleLoginError);

  const [state, setState] = useState<LoginMutation>({
    email: '',
    password: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  useEffect(() => {
    dispatch(setLoginError(null));
  }, [dispatch]);

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await dispatch(login(state)).unwrap();
      navigate('/chat');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOpen />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
            {error.error}
          </Alert>
        )}

        {googleError && (
          <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
            {googleError.error}
          </Alert>
        )}

        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                autoComplete="current-email"
                value={state.email}
                onChange={inputChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                autoComplete="current-password"
                value={state.password}
                onChange={inputChangeHandler}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <LoadingButton
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1 }}
              disableElevation
              disabled={loading}
              loading={loading}
            >
              Sign In
            </LoadingButton>
          </Grid>
          <Grid container justifyContent="center" mb={4}>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                New user? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginUser;
