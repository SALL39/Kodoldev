import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(date: string | Date) {
  return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
}

export function formatRelativeTime(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}