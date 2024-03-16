import { NavLink } from 'react-router-dom';
import {
  AppBar,
  Grid,
  Stack,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import UserMenu from './UserMenu';
import GuestMenu from './GuestMenu';

const Link = styled(NavLink)({
  color: 'black',
  textDecoration: 'none',
  '&:hover': {
    color: 'black',
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 0,
        mb: 4,
        p: 0,
      }}
    >
      <Toolbar disableGutters>
        <Grid container justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/">Chat</Link>
            </Typography>
          </Stack>
          {user ? <UserMenu user={user} /> : <GuestMenu />}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
