import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaSearch, FaSyncAlt } from 'react-icons/fa';
import { useMessages } from '../../hooks/useMessages.js';
import { useInboxStore, visibleMessages } from '../../store/inboxStore.js';
import MessageList from './MessageList.jsx';
import MessagePane from './MessagePane.jsx';
import { MotionDiv } from '../../utils/motion.jsx';
import { ErrorView, SkeletonLines } from '../ui/Status.jsx';
import './Messages.css';

export default function MessagesPage() {
  const { data, isLoading, isError, error, refetch } = useMessages();
  const hiddenIds = useInboxStore((state) => state.hiddenIds);
  const readIds = useInboxStore((state) => state.readIds);
  const markRead = useInboxStore((state) => state.markRead);
  const setRead = useInboxStore((state) => state.setRead);
  const hide = useInboxStore((state) => state.hide);

  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const messages = useMemo(
    () =>
      visibleMessages(data, hiddenIds).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    [data, hiddenIds]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return messages;
    return messages.filter((message) =>
      [message.name, message.email, message.message].some((value) =>
        String(value ?? '').toLowerCase().includes(term)
      )
    );
  }, [messages, search]);

  const selected = filtered.find((message) => message.id === selectedId) || null;

  useEffect(() => {
    if (selected) markRead(selected.id);
  }, [selected, markRead]);

  useEffect(() => {
    if (selectedId && !selected) setSelectedId(null);
  }, [selectedId, selected]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const unreadCount = messages.filter((message) => !readIds[message.id]).length;

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <span className="section__tag">inbox</span>
          <h1 className="page__title">
            Caixa de <span className="accent">Mensagens</span>
          </h1>
          <div className="page__divider" aria-hidden="true" />
        </div>
      </div>

      <div className="messages">
        <div className="messages__toolbar glass">
          <div className="messages__search">
            <FaSearch className="messages__search-icon" aria-hidden="true" />
            <input
              type="text"
              className="messages__search-input"
              placeholder="Buscar por nome, e-mail ou conteúdo…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar mensagens"
            />
          </div>
          <div className="messages__toolbar-right">
            <span className="messages__stats">
              {messages.length > 0 && (
                <>
                  <strong>{unreadCount}</strong> não lida{unreadCount === 1 ? '' : 's'}
                  <span className="messages__stats-sep">·</span>
                </>
              )}
              {filtered.length} de {messages.length}
            </span>
            <button
              type="button"
              className="btn btn--glass btn--sm messages__refresh"
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
              aria-label="Atualizar mensagens"
            >
              <FaSyncAlt className={refreshing ? 'is-spinning' : ''} aria-hidden="true" />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="messages__panel glass">
            <SkeletonLines lines={5} />
          </div>
        )}

        {isError && (
          <div className="messages__panel glass">
            <ErrorView message={error?.message} onRetry={() => refetch()} />
          </div>
        )}

        {isLoading === false && !isError && (
          <div
            className={`messages__layout ${selected ? 'messages__layout--reading' : ''}`}
          >
            <div className="messages__list glass">
              {messages.length === 0 && (
                <div className="messages__list-empty">
                  Nenhuma mensagem recebida ainda.
                </div>
              )}
              {messages.length > 0 && filtered.length === 0 && (
                <div className="messages__list-empty">
                  Nenhum resultado para “{search}”.
                </div>
              )}
              {filtered.length > 0 && (
                <MessageList
                  messages={filtered}
                  selectedId={selectedId}
                  readIds={readIds}
                  onSelect={setSelectedId}
                />
              )}
            </div>

            <div className="messages__pane-wrap">
              <AnimatePresence mode="wait">
                {selected ? (
                  <MotionDiv
                    key={selected.id}
                    className="messages__pane glass"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <MessagePane
                      message={selected}
                      isRead={Boolean(readIds[selected.id])}
                      onToggleRead={() => setRead(selected.id, !readIds[selected.id])}
                      onHide={() => {
                        hide(selected.id);
                        setSelectedId(null);
                      }}
                      onBack={() => setSelectedId(null)}
                    />
                  </MotionDiv>
                ) : (
                  <MotionDiv
                    key="placeholder"
                    className="messages__pane messages__pane--placeholder glass"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <span className="messages__pane-empty">
                      Selecione uma mensagem para ler.
                    </span>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}