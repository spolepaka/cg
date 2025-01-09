export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          content: string;
          channel_id: string;
          sender_id: string;
          created_at: string;
        };
        Insert: {
          content: string;
          channel_id: string;
          sender_id: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          avatar_url?: string;
        };
      };
    };
  };
} 