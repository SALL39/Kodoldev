export interface Notification {
  id: string;
  type: 'alert' | 'health' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}