import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import PageHeader from './PageHeader.jsx';
import Login from '../auth/Login.jsx';
import { useIsAuthenticated } from '../../store/authStore.js';
import './AppShell.css';

export default function AppShell() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return <Login />;

  return (
    <div className="shell">
      <div className="shell__backdrop" aria-hidden="true">
        <div className="shell__blob shell__blob--1" />
        <div className="shell__blob shell__blob--2" />
        <div className="shell__blob shell__blob--3" />
        <div className="shell__grain" />
      </div>
      <div className="shell__window">
        <Sidebar />
        <div className="shell__main">
          <PageHeader />
          <div className="shell__content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}