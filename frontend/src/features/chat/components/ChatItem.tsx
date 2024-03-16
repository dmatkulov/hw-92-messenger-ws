import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { ApiMessage } from '../../../types';

interface Props {
  message: ApiMessage;
}

const ChatItem: React.FC<Props> = ({ message }) => {
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Dave" />
      </ListItemAvatar>
      <Grid container>
        <Grid item xs={12}>
          <ListItemText
            primary={
              <Typography
                variant="body1"
                fontSize="small"
                color="text.secondary"
              >
                Dave
              </Typography>
            }
            secondary={
              <Typography variant="body2">{message.message}</Typography>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <ListItemText secondary="09:30"></ListItemText>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default ChatItem;
