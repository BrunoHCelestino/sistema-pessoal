import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import './AppShell.css';

export default function AppShell() {
  return (
    <div className="shell">
      <div className="shell__bg" aria-hidden="true">
        <div className="shell__bg-orb shell__bg-orb--1" />
        <div className="shell__bg-orb shell__bg-orb--2" />
      </div>
      <div className="shell__layout">
        <Sidebar />
        <main className="shell__main">
          <div className="shell__content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}