import { MotionDiv } from '../../utils/motion.jsx';
import './Status.css';

export function EmptyState({ icon, title, description, action }) {
  return (
    <MotionDiv
      className="empty"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {icon && <div className="empty__icon" aria-hidden="true">{icon}</div>}
      <h3 className="empty__title">{title}</h3>
      {description && <p className="empty__desc">{description}</p>}
      {action}
    </MotionDiv>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <MotionDiv
      className="error-view"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      role="alert"
    >
      <div className="error-view__icon" aria-hidden="true">!</div>
      <h3 className="error-view__title">Não foi possível carregar</h3>
      <p className="error-view__desc">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--ghost error-view__retry" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </MotionDiv>
  );
}

export function SkeletonLines({ lines = 3 }) {
  return (
    <div className="skeleton" aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="skeleton__line"
          style={{ width: `${92 - index * 14}%` }}
        />
      ))}
    </div>
  );
}