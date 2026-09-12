import { FaArrowLeft, FaEnvelopeOpenText, FaEyeSlash, FaRegEnvelopeOpen } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { formatFullDate } from '../../utils/date.js';
import { buildReplyMailto } from '../../utils/mailto.js';

export default function MessagePane({ message, isRead, onToggleRead, onHide, onBack }) {
  const mailto = buildReplyMailto(message);

  return (
    <div className="message-pane">
      <div className="message-pane__back-row">
        <button
          type="button"
          className="message-pane__back btn btn--ghost btn--sm"
          onClick={onBack}
          aria-label="Voltar para a lista"
        >
          <FaArrowLeft aria-hidden="true" />
          <span>Voltar</span>
        </button>
      </div>

      <header className="message-pane__header">
        <div className="message-pane__row">
          <h2 className="message-pane__name">{message.name}</h2>
          {!isRead && <span className="message-pane__new">nova</span>}
        </div>
        <a
          className="message-pane__email"
          href={`mailto:${message.email}`}
        >
          {message.email}
        </a>
        <time className="message-pane__time">{formatFullDate(message.createdAt)}</time>
      </header>

      <div className="message-pane__body">
        <p>{message.message}</p>
      </div>

      <footer className="message-pane__actions">
        <a
          className="btn btn--primary message-pane__gmail"
          href={mailto}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGmail aria-hidden="true" />
          <span>Responder no Gmail</span>
        </a>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onToggleRead}
          aria-pressed={isRead}
        >
          {isRead ? <FaRegEnvelopeOpen aria-hidden="true" /> : <FaEnvelopeOpenText aria-hidden="true" />}
          <span>{isRead ? 'Marcar como não lida' : 'Marcar como lida'}</span>
        </button>
        <button type="button" className="btn btn--ghost" onClick={onHide}>
          <FaEyeSlash aria-hidden="true" />
          <span>Ocultar</span>
        </button>
      </footer>
    </div>
  );
}