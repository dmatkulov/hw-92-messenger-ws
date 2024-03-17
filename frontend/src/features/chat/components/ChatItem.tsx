import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { ApiMessage } from '../../../types';
import dayjs from 'dayjs';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';

interface Props {
  message: ApiMessage;
}

const ChatItem: React.FC<Props> = ({ message }) => {
  const date = dayjs(message.createdAt).format('hh:mm');
  const user = useAppSelector(selectUser);

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={message.user?.displayName} />
      </ListItemAvatar>
      <Grid container>
        <Grid item flexGrow={1}>
          <ListItemText
            primary={
              <Typography
                variant="body1"
                fontSize="small"
                color={
                  message.user?.displayName === user.displayName
                    ? 'blue'
                    : 'text.secondary'
                }
              >
                {message.user?.displayName === user.displayName
                  ? ' You'
                  : message.user?.displayName}
              </Typography>
            }
            secondary={
              <Typography variant="body2" fontSize="medium">
                {message.message}
              </Typography>
            }
          />
          <ListItemText secondary={date} />
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default ChatItem;
