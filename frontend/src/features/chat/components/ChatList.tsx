import React from 'react';
import { CircularProgress, Divider, Grid, Paper } from '@mui/material';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import OnlineUserItem from './OnlineUserItem';
import ChatItem from './ChatItem';
import ChatForm from './ChatForm';
import { ApiMessage, LoggedUser } from '../../../types';
import { useAppSelector } from '../../../app/hooks';
import { selectFetchLoading } from '../chatSlice';

interface Props {
  latestMessages: ApiMessage[];
  messages: ApiMessage[];
  loggedUsers: LoggedUser[];
  onSendMessage: (messageText: string) => void;
}

const ChatList: React.FC<Props> = ({
  latestMessages,
  messages,
  loggedUsers,
  onSendMessage,
}) => {
  const messagesLoading = useAppSelector(selectFetchLoading);

  return (
    <Grid
      container
      component={Paper}
      sx={{
        width: '100%',
        borderRadius: 4,
      }}
    >
      <Grid
        item
        xs={3}
        sx={{
          borderRight: '1px solid #e0e0e0',
        }}
      >
        <List>
          <Typography variant="h6" ml={2} mt={2} gutterBottom>
            Online users
          </Typography>

          {loggedUsers.length > 0 &&
            loggedUsers.map((loggedUser) => (
              <OnlineUserItem
                contactName={loggedUser.displayName}
                key={loggedUser._id}
              />
            ))}
        </List>
      </Grid>
      <Grid item xs={9}>
        <List
          sx={{
            height: '70vh',
            overflowY: 'auto',
          }}
        >
          {messagesLoading && <CircularProgress />}
          {latestMessages.length > 0 &&
            latestMessages.map((message) => (
              <ChatItem message={message} key={message._id} />
            ))}
          {messages.length > 0 &&
            messages.map((message) => (
              <ChatItem message={message} key={message._id} />
            ))}
        </List>
        <Divider />
        <ChatForm onSubmit={onSendMessage} />
      </Grid>
    </Grid>
  );
};

export default ChatList;
