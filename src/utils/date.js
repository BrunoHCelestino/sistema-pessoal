import { format, formatDistanceToNowStrict, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatListDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (isToday(date)) return format(date, 'HH:mm', { locale: ptBR });
  if (date.getFullYear() === new Date().getFullYear()) {
    return format(date, "dd 'de' MMM", { locale: ptBR });
  }
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatFullDate(value) {
  if (!value) return '';
  return format(new Date(value), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
    locale: ptBR,
  });
}

export function relativeDate(value) {
  if (!value) return '';
  return formatDistanceToNowStrict(new Date(value), {
    locale: ptBR,
    addSuffix: true,
  });
}