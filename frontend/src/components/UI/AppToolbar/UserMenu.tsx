import React from 'react';
import { User } from '../../../types';
import { useAppSelector } from '../../../app/hooks';
import { selectLogOutLoading } from '../../../features/users/usersSlice';
import { Button, CircularProgress } from '@mui/material';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const loading = useAppSelector(selectLogOutLoading);

  return (
    <>
      {loading && <CircularProgress />}
      {user.displayName}
      <Button
        variant="contained"
        color="secondary"
        disableElevation
        size="small"
        sx={{ borderRadius: 5, px: 2 }}
      >
        Leave
      </Button>
    </>
  );
};

export default UserMenu;
