export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          full_name: string;
          avatar_url: string;
          created_at: string;
          status: string;
          last_seen: string;
        };
      };
      channels: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          created_by: string;
        };
      };
      channel_members: {
        Row: {
          channel_id: string;
          user_id: string;
          joined_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          content: string;
          channel_id: string;
          sender_id: string;
          created_at: string;
        };
      };
    };
  };
}