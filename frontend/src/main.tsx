import ReactDOM from 'react-dom/client';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { persistor, store } from './app/store';
import { Provider } from 'react-redux';
import { addInterceptors } from './axiosApi';

addInterceptors(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
