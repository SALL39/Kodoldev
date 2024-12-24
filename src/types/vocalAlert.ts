export interface VocalAlert {
  id: string;
  title: string;
  description?: string;
  audio_url: string;
  type: 'vaccination' | 'health' | 'movement' | 'system';
  created_by: string;
  created_at: string;
}

export interface VocalAlertRecipient {
  id: string;
  alert_id: string;
  user_id: string;
  status: 'sent' | 'delivered' | 'played';
  sent_at: string;
  played_at?: string;
}

export interface VocalAlertWithRecipients extends VocalAlert {
  recipients: VocalAlertRecipient[];
}