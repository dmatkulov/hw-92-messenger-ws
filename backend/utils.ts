import { ActiveConnections, MessageWS, OnlineUser } from './types';

export const sendNewMessage = (
  activeConnections: ActiveConnections,
  message: MessageWS,
) => {
  Object.values(activeConnections).forEach((connection) => {
    const outgoing = {
      type: 'NEW_MESSAGE',
      payload: message,
    };

    connection.send(JSON.stringify(outgoing));
  });
};

export const sendOnlineUsers = (
  activeConnections: ActiveConnections,
  loggedUsers: OnlineUser[],
) => {
  Object.values(activeConnections).forEach((connection) => {
    const outgoing = {
      type: 'ONLINE_USERS',
      payload: loggedUsers,
    };
    connection.send(JSON.stringify(outgoing));
  });
};
