import { Link, NavLink } from 'react-router-dom';
import { FaChartPie, FaEnvelope } from 'react-icons/fa';
import { useMessages } from '../../hooks/useMessages.js';
import { useInboxStore, visibleMessages } from '../../store/inboxStore.js';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', index: '01', icon: <FaChartPie />, end: true },
  { to: '/mensagens', label: 'Mensagens', index: '02', icon: <FaEnvelope />, end: false },
];

export default function Sidebar() {
  const { data: messages } = useMessages();
  const hiddenIds = useInboxStore((state) => state.hiddenIds);
  const readIds = useInboxStore((state) => state.readIds);

  const unread = visibleMessages(messages, hiddenIds).filter(
    (message) => !readIds[message.id]
  ).length;

  return (
    <aside className="sidebar">
      <Link className="sidebar__brand" to="/" aria-label="Início">
        <span className="sidebar__brand-meta">
          <strong className="sidebar__brand-name">Bruno Celestino</strong>
          <span className="sidebar__brand-role">sistema pessoal</span>
        </span>
      </Link>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        <span className="sidebar__nav-caption">Navegação</span>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__index" aria-hidden="true">{item.index}</span>
            <span className="sidebar__link-icon" aria-hidden="true">{item.icon}</span>
            <span className="sidebar__link-label">{item.label}</span>
            {item.to === '/mensagens' && unread > 0 && (
              <span className="sidebar__badge">{unread}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}