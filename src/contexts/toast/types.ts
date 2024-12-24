import { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

export interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

export interface ToastProviderProps {
  children: ReactNode;
}