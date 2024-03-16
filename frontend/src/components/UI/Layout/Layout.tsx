import React from 'react';
import AppToolbar from '../AppToolbar/AppToolbar';
import { Box, Container } from '@mui/material';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Container maxWidth="md" disableGutters>
      <header>
        <AppToolbar />
      </header>
      <main>
        <Box component="section">{children}</Box>
      </main>
    </Container>
  );
};

export default Layout;
