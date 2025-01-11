// Consolidate types from various files
export interface Message {
  id: string;
  content: string;
  channel_id: string;
  sender_id: string;
  created_at: string;
}

export interface Channel {
  id: string;
  name: string;
  workspace_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string;
}

export interface MessageGroup {
  date: Date;
  messages: Message[];
} 