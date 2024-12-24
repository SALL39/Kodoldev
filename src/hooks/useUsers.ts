import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';

interface User {
  id: string;
  email: string;
  full_name?: string;
  user_role: 'admin' | 'user';
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      showToast('error', 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (email: string, role: 'admin' | 'user' = 'user') => {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { role }
      });

      if (error) throw error;

      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          email: data.user.email,
          user_role: role
        }]);

      if (profileError) throw profileError;

      showToast('success', 'Utilisateur créé avec succès');
      await fetchUsers();
    } catch (err) {
      showToast('error', 'Erreur lors de la création de l\'utilisateur');
      throw err;
    }
  };

  return {
    users,
    loading,
    createUser,
    refresh: fetchUsers
  };
}