import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import { ApiMessage } from '../../../types';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import { selectDeleteLoading } from '../chatSlice';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteMessage, fetchMessages } from '../chatThunks';

interface Props {
  message: ApiMessage;
}

const ChatItem: React.FC<Props> = ({ message }) => {
  const date = dayjs(message.createdAt).format('hh:mm');
  const user = useAppSelector(selectUser);
  const deleteLoading = useAppSelector(selectDeleteLoading);
  const dispatch = useAppDispatch();

  const handleDelete = async (id: string) => {
    await dispatch(deleteMessage(id));
    await dispatch(fetchMessages());
  };

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={message.user.displayName} />
      </ListItemAvatar>
      <Grid container>
        <Grid item flexGrow={1}>
          <ListItemText
            primary={
              <Typography
                variant="body1"
                fontSize="small"
                color="text.secondary"
              >
                {message.user.displayName}
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
        {user && user.role === 'admin' && (
          <IconButton
            disableRipple
            disabled={deleteLoading}
            onClick={() => handleDelete(message._id)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        )}
      </Grid>
    </ListItem>
  );
};

export default ChatItem;
