import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectLatest } from '../chatSlice';
import { fetchMessages } from '../chatThunks';
import { ApiMessage, IncomingMessage, LoggedUser } from '../../../types';
import { selectUser } from '../../users/usersSlice';
import ChatList from '../components/ChatList';

const Chat = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const latestMessages = useAppSelector(selectLatest);

  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loggedUsers, setLoggedUsers] = useState<LoggedUser[]>([]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  const connectWs = () => {
    ws.current = new WebSocket('ws://localhost:8000/messages');

    if (!ws.current) return;

    ws.current.addEventListener('open', () => {
      if (user) {
        const loginMessage = { type: 'LOGIN', payload: user?.token };
        ws.current?.send(JSON.stringify(loginMessage));
      }
    });

    ws.current.addEventListener('message', (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if (decodedMessage.type === 'NEW_MESSAGE') {
        setMessages((prevState) => [...prevState, decodedMessage.payload]);
      }

      if (decodedMessage.type === 'ONLINE_USERS') {
        setLoggedUsers(decodedMessage.payload);
      }
    });

    ws.current.addEventListener('close', () => {
      setTimeout(connectWs, 5000);
    });
  };

  useEffect(() => {
    if (user) {
      connectWs();
    } else {
      if (ws.current) {
        ws.current.close();
      }
    }
  }, [user]);

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
      <ChatList
        latestMessages={latestMessages}
        messages={messages}
        loggedUsers={loggedUsers}
        onSendMessage={sendMessage}
      />
    </>
  );
};

export default Chat;
