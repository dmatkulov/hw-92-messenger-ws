import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { LoadingButton } from '@mui/lab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectGoogleLoginError,
  selectRegisterError,
  selectRegisterLoading,
  setRegisterError,
} from '../usersSlice';
import { register } from '../usersThunks';

import { RegisterMutation } from '../../../types';

const RegisterUser: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const googleError = useAppSelector(selectGoogleLoginError);
  const error = useAppSelector(selectRegisterError);

  const loading = useAppSelector(selectRegisterLoading);

  const [state, setState] = useState<RegisterMutation>({
    email: '',
    displayName: '',
    password: '',
  });

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  useEffect(() => {
    dispatch(setRegisterError(null));
  }, [dispatch]);

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await dispatch(register(state)).unwrap();
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

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
                type="text"
                value={state.email}
                autoComplete="new-email"
                fullWidth
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('email'))}
                helperText={getFieldError('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="displayName"
                label="First name"
                type="displayName"
                value={state.displayName}
                autoComplete="new-displayName"
                fullWidth
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('displayName'))}
                helperText={getFieldError('displayName')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                value={state.password}
                autoComplete="new-password"
                fullWidth
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('password'))}
                helperText={getFieldError('password')}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <LoadingButton
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1 }}
              disableElevation
              disabled={loading}
              loading={loading}
              fullWidth
            >
              Sign Up
            </LoadingButton>
          </Grid>
          <Grid container justifyContent="center" mb={4}>
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
export default RegisterUser;
