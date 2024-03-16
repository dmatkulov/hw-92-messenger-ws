import React, { useState } from 'react';
import { Grid, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  onSubmit: (messageText: string) => void;
}

const ChatForm: React.FC<Props> = ({ onSubmit }) => {
  const [messageText, setMessageText] = useState('');

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const onMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(messageText);
    setMessageText('');
  };

  return (
    <Grid
      container
      component="form"
      onSubmit={onMessageSubmit}
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
          fullWidth
        />
      </Grid>
      <Grid item>
        <IconButton type="submit">
          <SendIcon color="primary" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default ChatForm;
