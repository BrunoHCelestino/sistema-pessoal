import { Link } from 'react-router-dom';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { useMessages } from '../../hooks/useMessages.js';
import { useInboxStore, visibleMessages } from '../../store/inboxStore.js';
import { relativeDate, formatListDate } from '../../utils/date.js';
import { MotionDiv } from '../../utils/motion.jsx';
import { ErrorView, SkeletonLines } from '../ui/Status.jsx';
import './Dashboard.css';

const CARD_ICONS = {
  total: '∑',
  unread: '•',
  contact: '@',
  last: '↗',
};

function Card({ icon, label, value, sub }) {
  return (
    <MotionDiv
      className="dash-card glass glass--interactive"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <span className="dash-card__icon" aria-hidden="true">{CARD_ICONS[icon]}</span>
      <div className="dash-card__body">
        <span className="dash-card__label">{label}</span>
        <strong className="dash-card__value">{value}</strong>
        {sub && <span className="dash-card__sub">{sub}</span>}
      </div>
    </MotionDiv>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch } = useMessages();
  const hiddenIds = useInboxStore((state) => state.hiddenIds);
  const readIds = useInboxStore((state) => state.readIds);

  const messages = visibleMessages(data, hiddenIds);
  const unread = messages.filter((m) => !readIds[m.id]).length;
  const [latest] = [...messages].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const recent = [...messages]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <span className="section__tag">dashboard</span>
          <h1 className="page__title">Visão <span className="accent">Geral</span></h1>
          <div className="page__divider" aria-hidden="true" />
        </div>
      </div>

      {isLoading && (
        <div className="dash__loading">
          <SkeletonLines lines={4} />
        </div>
      )}

      {isError && <ErrorView message={error?.message} onRetry={() => refetch()} />}

      {isLoading === false && !isError && messages.length === 0 && (
        <div className="dash__empty dash-card glass">
          Nenhuma mensagem recebida ainda. Quando alguém enviar o formulário de
          contato no seu portfólio, ela aparece aqui.
        </div>
      )}

      {messages.length > 0 && (
        <div className="dash__cards">
          <Card icon="total" label="Mensagens" value={messages.length} sub="no total" />
          <Card icon="unread" label="Não lidas" value={unread} sub={unread ? 'aguardando leitura' : 'tudo em dia'} />
          <Card
            icon="contact"
            label="Último contato"
            value={latest.name}
            sub={latest.email}
          />
          <Card
            icon="last"
            label="Última mensagem"
            value={relativeDate(latest.createdAt)}
            sub={latest.message}
          />
        </div>
      )}

      {recent.length > 0 && (
        <MotionDiv
          className="dash-recent glass"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
        >
          <div className="dash-recent__head">
            <h2 className="dash-recent__title">Mensagens recentes</h2>
            <Link to="/mensagens" className="dash-recent__all">
              Ver todas <FaLongArrowAltRight aria-hidden="true" />
            </Link>
          </div>
          <ul className="dash-recent__list">
            {recent.map((m) => (
              <li key={m.id}>
                <Link to="/mensagens" className="dash-recent__item">
                  <div className="dash-recent__meta">
                    <span className="dash-recent__name">
                      {!readIds[m.id] && <span className="dash-recent__dot" aria-hidden="true" />}
                      {m.name}
                    </span>
                    <span className="dash-recent__time">{formatListDate(m.createdAt)}</span>
                  </div>
                  <p className="dash-recent__preview">{m.message}</p>
                </Link>
              </li>
            ))}
          </ul>
        </MotionDiv>
      )}
    </section>
  );
}