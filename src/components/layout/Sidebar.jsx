import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaChartPie, FaEnvelope, FaMoon, FaSignOutAlt, FaSun } from 'react-icons/fa';
import { useMessages } from '../../hooks/useMessages.js';
import { useAuthStore } from '../../store/authStore.js';
import { useInboxStore, visibleMessages } from '../../store/inboxStore.js';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: <FaChartPie />, end: true },
  { to: '/mensagens', label: 'Mensagens', icon: <FaEnvelope />, end: false },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { data: messages } = useMessages();
  const hiddenIds = useInboxStore((state) => state.hiddenIds);
  const readIds = useInboxStore((state) => state.readIds);
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  );

  const unread = visibleMessages(messages, hiddenIds).filter(
    (message) => !readIds[message.id]
  ).length;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      <Link className="sidebar__logo" to="/" aria-label="Início">
        <span className="sidebar__logo-bracket">&lt;</span>BC<span className="sidebar__logo-bracket">/&gt;</span>
      </Link>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__link-icon" aria-hidden="true">{item.icon}</span>
            <span className="sidebar__link-label">{item.label}</span>
            {item.to === '/mensagens' && unread > 0 && (
              <span className="sidebar__badge">{unread}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__action"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        >
          <span className="sidebar__action-icon" aria-hidden="true">
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </span>
          <span className="sidebar__action-label">
            {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          </span>
        </button>
        <button
          type="button"
          className="sidebar__action sidebar__action--danger"
          onClick={handleLogout}
        >
          <span className="sidebar__action-icon" aria-hidden="true"><FaSignOutAlt /></span>
          <span className="sidebar__action-label">Sair</span>
        </button>
      </div>
    </aside>
  );
}