import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChartLine,
  FaEllipsisH,
  FaEnvelope,
  FaEyeSlash,
  FaRegEnvelopeOpen,
  FaTh,
  FaThList,
} from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import {
  addDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMessages } from '../../hooks/useMessages.js';
import { useInboxStore, visibleMessages } from '../../store/inboxStore.js';
import { formatListDate } from '../../utils/date.js';
import { buildReplyMailto } from '../../utils/mailto.js';
import { MotionDiv } from '../../utils/motion.jsx';
import { ErrorView, SkeletonLines } from '../ui/Status.jsx';
import './Dashboard.css';

function initials(name) {
  return String(name ?? '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Ring({ value = 0, size = 128, stroke = 12, children }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, value));
  const offset = circumference * (1 - clamped);

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="ring__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring__center">{children}</div>
    </div>
  );
}

function CardPanel({ className = '', title, meta, action, children }) {
  return (
    <MotionDiv
      className={`dash-card glass ${className}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.42, ease: 'easeOut' }}
    >
      <div className="dash-card__head">
        <div className="dash-card__head-text">
          <h2 className="dash-card__title">{title}</h2>
          {meta && <span className="dash-card__meta">{meta}</span>}
        </div>
        {action && <div className="dash-card__action">{action}</div>}
      </div>
      {children}
    </MotionDiv>
  );
}

function OverviewCard({ total, unread, read, hidden }) {
  return (
    <CardPanel
      className="dash__overview"
      title="Visão geral"
      action={
        <Link className="dash-card__link" to="/mensagens">
          Ver todas
        </Link>
      }
    >
      <div className="overview__stat">
        <strong className="overview__value">{total}</strong>
        <span className="overview__hint">
          <em>{unread}</em> não lidas aguardando
        </span>
      </div>
      {hidden > 0 && (
        <p className="overview__muted">
          {hidden} oculta{hidden === 1 ? '' : 's'}
        </p>
      )}
      <div className="overview__divider" aria-hidden="true" />
      <div className="overview__minis">
        <div className="overview__mini glass-inner">
          <span className="overview__mini-label">Mensagens</span>
          <strong className="overview__mini-value">{total}</strong>
        </div>
        <div className="overview__mini glass-inner">
          <span className="overview__mini-label">Não lidas</span>
          <strong className="overview__mini-value">{unread}</strong>
        </div>
        <div className="overview__mini glass-inner">
          <span className="overview__mini-label">Lidas</span>
          <strong className="overview__mini-value">{read}</strong>
        </div>
      </div>
    </CardPanel>
  );
}

function WeekProgress({ messages }) {
  const days = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end: addDays(start, 6) }).map((day) => ({
      full: format(day, 'EEE', { locale: ptBR }),
      label: format(day, 'EEEEE', { locale: ptBR }),
      count: messages.filter((m) => isSameDay(new Date(m.createdAt), day)).length,
      isToday: isSameDay(day, new Date()),
    }));
  }, [messages]);

  const max = Math.max(1, ...days.map((day) => day.count));
  const total = days.reduce((sum, day) => sum + day.count, 0);

  return (
    <CardPanel
      className="dash__week"
      title="Progresso da semana"
      action={
        <span className="dash-card__icon" aria-hidden="true">
          <FaChartLine />
        </span>
      }
    >
      <div className="week__chart">
        {days.map((day) => (
          <div className="week__col" key={day.full} title={`${day.full}: ${day.count}`}>
            <div className="week__bar" style={{ height: `${(day.count / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="week__chips">
        {days.map((day) => (
          <span
            key={day.full}
            className={`week__chip ${day.isToday ? 'week__chip--today' : ''}`}
          >
            {day.label}
          </span>
        ))}
      </div>
      <p className="week__hint">
        {total === 0
          ? 'Sem mensagens nesta semana.'
          : `${total} mensagem${total === 1 ? '' : 's'} nesta semana.`}
      </p>
    </CardPanel>
  );
}

function MonthProgress({ messages }) {
  const stats = useMemo(() => {
    const now = new Date();
    const previous = subMonths(now, 1);
    const currentCount = messages.filter((m) => isSameMonth(new Date(m.createdAt), now)).length;
    const previousCount = messages.filter(
      (m) => isSameMonth(new Date(m.createdAt), previous)
    ).length;
    const ratio = previousCount > 0 ? currentCount / previousCount : 0;
    const center =
      previousCount > 0 ? `${Math.round(ratio * 100)}%` : String(currentCount);

    return {
      currentCount,
      previousCount,
      ratio,
      center,
      month: format(now, 'MMMM', { locale: ptBR }),
      prev: format(previous, 'MMM', { locale: ptBR }),
    };
  }, [messages]);

  return (
    <CardPanel
      className="dash__month"
      title="Progresso do mês"
      meta={`${stats.prev} → ${stats.month}`}
    >
      <div className="month__body">
        <Ring value={stats.ratio} size={150} stroke={13}>
          <strong className="month__center">{stats.center}</strong>
          <span className="month__center-label">no mês</span>
        </Ring>
        <div className="month__legend">
          <span className="month__legend-item">
            <i className="month__dot" aria-hidden="true" />
            {stats.month}: {stats.currentCount}
          </span>
          <span className="month__legend-item">
            <i className="month__dot month__dot--dim" aria-hidden="true" />
            {stats.prev}: {stats.previousCount}
          </span>
        </div>
      </div>
    </CardPanel>
  );
}

function RecentContacts({ messages }) {
  if (messages.length === 0) {
    return (
      <CardPanel className="dash__contacts" title="Últimos contatos">
        <p className="dash-card__empty">Nenhum contato ainda.</p>
      </CardPanel>
    );
  }

  return (
    <CardPanel className="dash__contacts" title="Últimos contatos">
      <ul className="contacts__list">
        {messages.slice(0, 5).map((message) => (
          <li key={message.id}>
            <Link to="/mensagens" className="contacts__item">
              <span className="contacts__avatar" aria-hidden="true">
                {initials(message.name)}
              </span>
              <span className="contacts__body">
                <span className="contacts__top">
                  <strong className="contacts__name">{message.name}</strong>
                  <time className="contacts__time">
                    {formatListDate(message.createdAt)}
                  </time>
                </span>
                <span className="contacts__email">{message.email}</span>
                <span className="contacts__preview">{message.message}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </CardPanel>
  );
}

function InProcess({ unread, onRead, onHide }) {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (openMenu == null) return undefined;
    const close = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openMenu]);

  const tasks = unread.slice(0, 3);

  return (
    <CardPanel
      className="dash__process"
      title={`Em processo (${unread.length})`}
      meta="não lidas"
    >
      {tasks.length === 0 ? (
        <p className="dash-card__empty">Nenhuma mensagem não lida. Tudo em dia.</p>
      ) : (
        <div className="process__list">
          {tasks.map((message) => {
            const mailto = buildReplyMailto(message);
            const isOpen = openMenu === message.id;
            return (
              <div
                className="process__card glass-inner"
                key={message.id}
                ref={isOpen ? menuRef : undefined}
              >
                <div className="process__top">
                  <span className="process__mark" aria-hidden="true">
                    <FaEnvelope />
                  </span>
                  <div className="process__head">
                    <strong className="process__name">{message.name}</strong>
                    <time className="process__time">
                      {formatListDate(message.createdAt)}
                    </time>
                  </div>
                  <div className="process__ctrl">
                    <button
                      type="button"
                      className="process__iconbtn"
                      aria-label="Marcar como lida"
                      onClick={() => onRead(message.id)}
                    >
                      <FaRegEnvelopeOpen aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="process__iconbtn"
                      aria-label="Mais ações"
                      aria-expanded={isOpen}
                      onClick={() => setOpenMenu(isOpen ? null : message.id)}
                    >
                      <FaEllipsisH aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <p className="process__preview">{message.message}</p>

                <div className="process__foot">
                  <a
                    className="btn btn--primary btn--sm process__reply"
                    href={mailto}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiGmail aria-hidden="true" />
                    <span>Responder</span>
                  </a>
                </div>

                {isOpen && (
                  <div className="context-menu glass-float" role="menu">
                    <a
                      href={mailto}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      onClick={() => setOpenMenu(null)}
                    >
                      <SiGmail aria-hidden="true" />
                      <span>Responder no Gmail</span>
                    </a>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onRead(message.id);
                        setOpenMenu(null);
                      }}
                    >
                      <FaRegEnvelopeOpen aria-hidden="true" />
                      <span>Marcar como lida</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onHide(message.id);
                        setOpenMenu(null);
                      }}
                    >
                      <FaEyeSlash aria-hidden="true" />
                      <span>Ocultar</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <Link to="/mensagens" className="process__add glass-inner">
        <span className="process__add-plus" aria-hidden="true">
          +
        </span>
        Abrir caixa de entrada
      </Link>
    </CardPanel>
  );
}

function ProjectsArea({ contacts, view, sortBy, onViewChange, onSortChange }) {
  const top = contacts.slice(0, 3);
  const max = Math.max(1, ...top.map((contact) => contact.count));

  return (
    <section className="dash__projects">
      <div className="projects__head">
        <div className="projects__title-wrap">
          <h2 className="projects__title">Contatos recentes</h2>
          <span className="projects__count">{contacts.length}</span>
        </div>

        <div className="projects__tools">
          <label className="projects__sort">
            <span className="projects__sort-label">Ordenar por</span>
            <select
              className="projects__select"
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value)}
              aria-label="Ordenar contatos"
            >
              <option value="recent">Mais recentes</option>
              <option value="name">Nome</option>
            </select>
          </label>

          <div className="projects__views" role="group" aria-label="Visualização">
            <button
              type="button"
              className={view === 'grid' ? 'is-active' : ''}
              onClick={() => onViewChange('grid')}
              aria-label="Visualizar em grade"
              aria-pressed={view === 'grid'}
            >
              <FaTh aria-hidden="true" />
            </button>
            <button
              type="button"
              className={view === 'list' ? 'is-active' : ''}
              onClick={() => onViewChange('list')}
              aria-label="Visualizar em lista"
              aria-pressed={view === 'list'}
            >
              <FaThList aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {top.length === 0 ? (
        <p className="dash-card__empty">Sem contatos para exibir.</p>
      ) : (
        <div className={`projects__grid ${view === 'list' ? 'projects__grid--list' : ''}`}>
          {top.map((contact) => (
            <Link to="/mensagens" className="project glass" key={contact.email}>
              <div className="project__inner">
                <Ring value={contact.count / max} size={72} stroke={8}>
                  <span className="project__ring-val">{contact.count}</span>
                </Ring>
                <div className="project__body">
                  <span className="project__status">
                    <i aria-hidden="true" />
                    {contact.count} mensagen{contact.count === 1 ? '' : 's'}
                  </span>
                  <strong className="project__name">{contact.name}</strong>
                  <span className="project__email">{contact.email}</span>
                  <span className="project__preview">{contact.latest.message}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch } = useMessages();
  const hiddenIds = useInboxStore((state) => state.hiddenIds);
  const readIds = useInboxStore((state) => state.readIds);
  const setRead = useInboxStore((state) => state.setRead);
  const hide = useInboxStore((state) => state.hide);

  const [sortBy, setSortBy] = useState('recent');
  const [view, setView] = useState('grid');

  const messages = useMemo(() => {
    const list = visibleMessages(data, hiddenIds);
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data, hiddenIds]);

  const total = messages.length;
  const unreadList = messages.filter((message) => !readIds[message.id]);
  const unreadCount = unreadList.length;
  const readCount = total - unreadCount;
  const hiddenCount = data
    ? data.filter((message) => hiddenIds[message.id]).length
    : 0;

  const contacts = useMemo(() => {
    const map = new Map();
    for (const message of messages) {
      const key = message.email.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          email: message.email,
          name: message.name,
          count: 0,
          latest: message,
        });
      }
      const entry = map.get(key);
      entry.count += 1;
      if (new Date(message.createdAt) > new Date(entry.latest.createdAt)) {
        entry.latest = message;
      }
    }
    const list = [...map.values()];
    if (sortBy === 'name') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list.sort(
      (a, b) => new Date(b.latest.createdAt) - new Date(a.latest.createdAt)
    );
  }, [messages, sortBy]);

  if (isLoading) {
    return (
      <section className="dash">
        <div className="dash__status glass">
          <SkeletonLines lines={6} />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="dash">
        <div className="dash__status glass">
          <ErrorView message={error?.message} onRetry={() => refetch()} />
        </div>
      </section>
    );
  }

  return (
    <section className="dash">
      <div className="dash__grid">
        <OverviewCard
          total={total}
          unread={unreadCount}
          read={readCount}
          hidden={hiddenCount}
        />
        <WeekProgress messages={messages} />
        <MonthProgress messages={messages} />
        <RecentContacts messages={messages} />
        <InProcess
          unread={unreadList}
          onRead={(id) => setRead(id, true)}
          onHide={(id) => hide(id)}
        />
        <ProjectsArea
          contacts={contacts}
          view={view}
          sortBy={sortBy}
          onViewChange={setView}
          onSortChange={setSortBy}
        />
      </div>
    </section>
  );
}