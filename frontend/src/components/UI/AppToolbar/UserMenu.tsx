import React from 'react';
import { User } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectLogOutLoading } from '../../../features/users/usersSlice';
import { Button, CircularProgress, Stack } from '@mui/material';
import { logOut } from '../../../features/users/usersThunks';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector(selectLogOutLoading);

  const handleLogOut = async () => {
    await dispatch(logOut());
    navigate('/login');
  };

  return (
    <>
      {loading && <CircularProgress />}
      <Stack direction="row" spacing={2}>
        <Typography color="black"> {user.displayName}</Typography>
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          size="small"
          sx={{ borderRadius: 5, px: 2 }}
          onClick={handleLogOut}
        >
          Leave
        </Button>
      </Stack>
    </>
  );
};

export default UserMenu;
