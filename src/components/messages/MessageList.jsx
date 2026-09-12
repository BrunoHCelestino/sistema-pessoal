import { memo } from 'react';
import { formatListDate } from '../../utils/date.js';
import { MotionLi } from '../../utils/motion.jsx';

function getInitials(name) {
  return String(name ?? '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

const MessageListItem = memo(function MessageListItem({ message, active, isRead, onSelect }) {
  return (
    <MotionLi
      className={`message-item ${active ? 'message-item--active' : ''} ${isRead ? '' : 'message-item--unread'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        className="message-item__click"
        onClick={onSelect}
        aria-current={active ? 'true' : undefined}
      >
        <span className="message-item__avatar" aria-hidden="true">
          {getInitials(message.name)}
        </span>
        <span className="message-item__body">
          <span className="message-item__top">
            <span className="message-item__name">
              {!isRead && <span className="message-item__dot" aria-hidden="true" />}
              {message.name}
            </span>
            <span className="message-item__time">{formatListDate(message.createdAt)}</span>
          </span>
          <span className="message-item__email">{message.email}</span>
          <span className="message-item__preview">{message.message}</span>
        </span>
      </button>
    </MotionLi>
  );
});

export default function MessageList({ messages, selectedId, readIds, onSelect }) {
  return (
    <ul className="message-list">
      {messages.map((message) => (
        <MessageListItem
          key={message.id}
          message={message}
          active={message.id === selectedId}
          isRead={Boolean(readIds[message.id])}
          onSelect={() => onSelect(message.id)}
        />
      ))}
    </ul>
  );
}