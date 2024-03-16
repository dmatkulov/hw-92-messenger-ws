import Layout from './components/UI/Layout/Layout';
import { Route, Routes } from 'react-router-dom';
import LoginUser from './features/users/containers/LoginUser';
import RegisterUser from './features/users/containers/RegisterUser';
import ProtectedRoute from './components/UI/ProtectedRoute/ProtectedRoute';
import { selectUser } from './features/users/usersSlice';
import { useAppSelector } from './app/hooks';
import ChatList from './features/chat/containers/ChatList';

function App() {
  const user = useAppSelector(selectUser);

  return (
    <>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                isAllowed={
                  user && (user.role === 'admin' || user.role === 'user')
                }
              >
                {<ChatList />}
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="*" element={<h2>Not found!</h2>} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
