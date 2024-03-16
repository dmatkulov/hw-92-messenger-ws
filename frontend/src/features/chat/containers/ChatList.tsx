import ChatItem from '../components/ChatItem';
import List from '@mui/material/List';
import { Divider, Grid, Paper } from '@mui/material';
import ChatForm from '../components/ChatForm';
import { useEffect, useRef, useState } from 'react';
import { ChatMessage, IncomingMessage, LoggedUser } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import { selectLatest } from '../chatSlice';
import OnlineUserItem from '../components/OnlineUserItem';
import { fetchMessages } from '../chatThunks';

const ChatList = () => {
  const [loggedUsers, setLoggedUsers] = useState<LoggedUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sentLogin, setSentLogin] = useState(false);

  const user = useAppSelector(selectUser);
  const latestMessages = useAppSelector(selectLatest);
  const dispatch = useAppDispatch();

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/messages');

    if (!ws.current) return;

    ws.current.addEventListener('close', () => console.log('ws closed'));

    ws.current.addEventListener('message', (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if (decodedMessage.type === 'ONLINE_USERS') {
        setLoggedUsers(decodedMessage.payload);
      }

      if (decodedMessage.type === 'NEW_MESSAGE') {
        setMessages((prevState) => [...prevState, decodedMessage.payload]);
      }

      if (decodedMessage.type === 'WELCOME') {
        console.log(decodedMessage.payload);
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
      if (!sentLogin) {
        const loginMessage = { type: 'LOGIN', payload: user?.token };
        ws.current?.send(JSON.stringify(loginMessage));
        setSentLogin(true);
      }
    });
  };

  useEffect(() => {
    void sendLoginMessage();
  }, []);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  console.log({ messages });
  console.log({ loggedUsers });

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
            {loggedUsers && (
              <OnlineUserItem
                contact={loggedUsers.displayName}
                key={loggedUsers._id}
              />
            )}
          </List>
        </Grid>
        <Grid item xs={9}>
          <List
            sx={{
              height: '70vh',
              overflowY: 'auto',
            }}
          >
            {latestMessages.map((message) => (
              <ChatItem message={message} key={message._id} />
            ))}
          </List>
          <Divider />
          <ChatForm />
        </Grid>
      </Grid>
    </>
  );
};

export default ChatList;
