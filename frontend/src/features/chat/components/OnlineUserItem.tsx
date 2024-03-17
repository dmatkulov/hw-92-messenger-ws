import React from 'react';
import { ListItemIcon } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';

interface Props {
  contactName: string;
}

const OnlineUserItem: React.FC<Props> = ({ contactName }) => {
  const user = useAppSelector(selectUser);

  return (
    <ListItem>
      <ListItemIcon>
        <Avatar alt={contactName}>{contactName.charAt(0)}</Avatar>
      </ListItemIcon>
      <ListItemText
        primary={contactName === user.displayName ? 'You' : contactName}
        secondary="online"
        secondaryTypographyProps={{ color: 'green' }}
      />
    </ListItem>
  );
};

export default OnlineUserItem;
