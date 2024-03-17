import ChatItem from '../components/ChatItem';
import { CircularProgress, Divider, Grid, Paper } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectFetchLoading, selectLatest } from '../chatSlice';
import { fetchMessages } from '../chatThunks';
import { ApiMessage, IncomingMessage, LoggedUser } from '../../../types';
import OnlineUserItem from '../components/OnlineUserItem';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { selectUser } from '../../users/usersSlice';
import ChatForm from '../components/ChatForm';

const ChatList = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const latestMessages = useAppSelector(selectLatest);
  const messagesLoading = useAppSelector(selectFetchLoading);

  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loggedUsers, setLoggedUsers] = useState<LoggedUser[]>([]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);
  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/messages');

    if (!ws.current) return;

    ws.current.addEventListener('close', () => console.log('ws closed'));

    ws.current.addEventListener('message', (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if (decodedMessage.type === 'NEW_MESSAGE') {
        setMessages((prevState) => [...prevState, decodedMessage.payload]);
      }

      if (decodedMessage.type === 'ONLINE_USERS') {
        setLoggedUsers(decodedMessage.payload);
      }
    });

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);
  const sendLoginMessage = () => {
    if (!ws.current) return;

    ws.current.addEventListener('open', () => {
      const loginMessage = { type: 'LOGIN', payload: user?.token };
      ws.current?.send(JSON.stringify(loginMessage));
    });
  };
  useEffect(() => {
    if (ws.current && user) {
      void sendLoginMessage();
    }
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = (messageText: string) => {
    if (!ws.current) return;

    ws.current.send(
      JSON.stringify({
        type: 'SEND_MESSAGE',
        payload: {
          token: user?.token,
          message: messageText,
        },
      }),
    );
  };

  return (
    <>
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

            {loggedUsers.map((loggedUser) => (
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
            {latestMessages.map((message) => (
              <ChatItem message={message} key={message._id} />
            ))}
            {messages.map((message) => (
              <ChatItem message={message} key={message._id} />
            ))}
          </List>
          <Divider />
          <ChatForm onSubmit={sendMessage} />
        </Grid>
      </Grid>
    </>
  );
};

export default ChatList;
