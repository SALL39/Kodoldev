import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';

export default function UserMenu() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (err) {
      showToast('error', 'Erreur lors de la déconnexion');
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="px-4 py-3 border-t border-gray-200">
      <div className="flex items-center mb-3">
        <User className="h-5 w-5 text-gray-400 mr-2" />
        <span className="text-sm text-gray-600">{user?.email}</span>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Se déconnecter
      </button>
    </div>
  );
}