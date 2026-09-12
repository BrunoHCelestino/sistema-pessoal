import { Suspense, lazy } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';

const Dashboard = lazy(() => import('./components/dashboard/Dashboard.jsx'));
const MessagesPage = lazy(() => import('./components/messages/MessagesPage.jsx'));

function RouteFallback() {
  return <div className="route-fallback">Carregando…</div>;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route element={<AppShell />}>
          <Route
            index
            element={
              <Suspense fallback={<RouteFallback />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="mensagens"
            element={
              <Suspense fallback={<RouteFallback />}>
                <MessagesPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}