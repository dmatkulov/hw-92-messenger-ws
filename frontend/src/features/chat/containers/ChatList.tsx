import ChatItem from '../components/ChatItem';
import List from '@mui/material/List';
import { Divider, Grid, Paper } from '@mui/material';
import ChatForm from '../components/ChatForm';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectLatest } from '../chatSlice';
import { fetchMessages } from '../chatThunks';
import { selectUser } from '../../users/usersSlice';
import { ApiMessage, IncomingMessage } from '../../../types';

const ChatList = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const latestMessages = useAppSelector(selectLatest);

  const ws = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<ApiMessage[]>([]);

  useEffect(() => {
    dispatch(fetchMessages());
    setMessages((prevState) => [...prevState, ...latestMessages]);
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
    });

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
          userId: user?._id,
          username: user?.displayName,
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
          <List>Online users</List>
        </Grid>
        <Grid item xs={9}>
          <List
            sx={{
              height: '70vh',
              overflowY: 'auto',
            }}
          >
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
