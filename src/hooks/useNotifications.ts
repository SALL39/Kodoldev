import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';
import type { Notification } from '../types/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotifications();

    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, payload => {
        if (payload.eventType === 'INSERT') {
          setNotifications(current => [payload.new as Notification, ...current]);
          setUnreadCount(count => count + 1);
        } else if (payload.eventType === 'UPDATE') {
          setNotifications(current =>
            current.map(notif =>
              notif.id === payload.new.id ? payload.new : notif
            )
          );
          updateUnreadCount();
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
      updateUnreadCount();
    } catch (err) {
      showToast('error', 'Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const updateUnreadCount = () => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      setNotifications(current =>
        current.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      updateUnreadCount();
    } catch (err) {
      showToast('error', 'Erreur lors de la mise à jour de la notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;
      setNotifications(current =>
        current.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      showToast('error', 'Erreur lors de la mise à jour des notifications');
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}