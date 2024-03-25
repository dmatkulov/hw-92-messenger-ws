import Layout from './components/UI/Layout/Layout';
import { Route, Routes } from 'react-router-dom';
import LoginUser from './features/users/containers/LoginUser';
import RegisterUser from './features/users/containers/RegisterUser';
import Chat from './features/chat/containers/Chat';

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/" element={<Chat />} />
          <Route path="*" element={<h2>Not found!</h2>} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
