import React from 'react';
import { ListItemIcon } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';

interface Props {
  contactName: string;
}

const OnlineUserItem: React.FC<Props> = ({ contactName }) => {
  return (
    <ListItem>
      <ListItemIcon>
        <Avatar alt={contactName}>{contactName.charAt(0)}</Avatar>
      </ListItemIcon>
      <ListItemText
        primary={contactName}
        secondary="online"
        secondaryTypographyProps={{ color: 'green' }}
      />
    </ListItem>
  );
};

export default OnlineUserItem;
