import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useIsAuthenticated } from './store/authStore.js';
import Login from './components/auth/Login.jsx';
import AppShell from './components/layout/AppShell.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import MessagesPage from './components/messages/MessagesPage.jsx';

function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function PublicOnlyRoute() {
  const isAuthenticated = useIsAuthenticated();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="mensagens" element={<MessagesPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}