import React from 'react';
import { Fab, Grid, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatForm: React.FC = () => {
  return (
    <Grid
      container
      component="form"
      px={3}
      py={5}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item sx={{ flexGrow: 1, pr: 2 }}>
        <TextField label="Type Something" fullWidth variant="standard" />
      </Grid>
      <Grid item>
        <Fab color="primary" size="small">
          <SendIcon />
        </Fab>
      </Grid>
    </Grid>
  );
};

export default ChatForm;
