import ReactDOM from 'react-dom/client';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constants';
import { persistor, store } from './app/store';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { addInterceptors } from './axiosApi';

addInterceptors(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <CssBaseline />
          <App />
        </BrowserRouter>
      </PersistGate>
    </GoogleOAuthProvider>
  </Provider>,
);
