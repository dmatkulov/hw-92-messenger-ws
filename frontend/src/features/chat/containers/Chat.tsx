import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import { useNavigate } from 'react-router-dom';
import { DecodedMessage, Message, OnlineUser } from '../../../types';
import {
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  Paper,
  TextField,
} from '@mui/material';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import dayjs from 'dayjs';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const ws = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (!user) {
      ws.current?.send(
        JSON.stringify({
          type: 'LOGOUT',
        }),
      );
      navigate('/');
    }

    ws.current = new WebSocket('ws://localhost:8000/chat');

    if (!ws.current) return;

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          type: 'LOGIN',
          payload: user?.token,
        }),
      );
    };

    ws.current.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data) as DecodedMessage;

      if (parsedMessage.type === 'LOGIN-SUCCESS') {
        setMessages(parsedMessage.payload.messages);
        setOnlineUsers(parsedMessage.payload.onlineUsers);
      }

      if (parsedMessage.type === 'NEW-USER') {
        setOnlineUsers((prevState) => [
          ...prevState,
          parsedMessage.payload.user,
        ]);
      }

      if (parsedMessage.type === 'USER-LOGOUT') {
        setOnlineUsers(parsedMessage.payload.onlineUsers);
      }

      if (parsedMessage.type === 'NEW-MESSAGE') {
        setMessages((prevState) => [
          ...prevState,
          parsedMessage.payload.message,
        ]);
      }
    };
  }, []);

  const onSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ws.current) return;

    ws.current.send(
      JSON.stringify({
        type: 'SEND-MESSAGE',
        payload: messageText,
      }),
    );
    setMessageText('');
  };

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
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

            {onlineUsers.length > 0 &&
              onlineUsers.map((user) => (
                <ListItem key={user._id}>
                  <ListItemIcon>
                    <Avatar alt={user.displayName} />
                  </ListItemIcon>
                  <ListItemText
                    primary={user.displayName}
                    secondary="online"
                    secondaryTypographyProps={{ color: 'green' }}
                  />
                </ListItem>
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
            {messages.map((message) => (
              <ListItem alignItems="flex-start" key={message._id}>
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
                          color="text.secondary"
                        >
                          {message.user?.displayName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" fontSize="medium">
                          {message.message}
                        </Typography>
                      }
                    />
                    <ListItemText
                      secondary={dayjs(message.createdAt).format('hh:mm')}
                    />
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Grid
            container
            component="form"
            onSubmit={onSendMessage}
            px={3}
            py={5}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item sx={{ flexGrow: 1, pr: 2 }}>
              <TextField
                name="messageText"
                value={messageText}
                label="Type Something"
                variant="standard"
                onChange={changeMessage}
                required
                fullWidth
              />
            </Grid>
            <Grid item>
              <IconButton type="submit">
                <SendIcon color="primary" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Chat;
