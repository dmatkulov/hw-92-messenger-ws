import React from 'react';
import { ListItemButton, ListItemIcon } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

interface Props {
  contact: string;
}

const OnlineUserItem: React.FC<Props> = ({ contact }) => {
  return (
    <ListItemButton key="RemySharp">
      <ListItemIcon>
        <Avatar
          alt="Remy Sharp"
          src="https://material-ui.com/static/images/avatar/1.jpg"
        />
      </ListItemIcon>
      <ListItemText primary={contact} secondary="online" />
    </ListItemButton>
  );
};

export default OnlineUserItem;
