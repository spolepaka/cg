/* eslint-disable */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      channel_members: {
        Row: {
          channel_id: string;
          joined_at: string | null;
          user_id: string;
        };
        Insert: {
          channel_id: string;
          joined_at?: string | null;
          user_id: string;
        };
        Update: {
          channel_id?: string;
          joined_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "channel_members_channel_id_fkey";
            columns: ["channel_id"];
            referencedRelation: "channels";
            referencedColumns: ["id"];
          }
        ];
      };
      channels: {
        Row: {
          created_at: string | null;
          created_by: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          channel_id: string;
          content: string;
          created_at: string | null;
          id: string;
          sender_id: string;
        };
        Insert: {
          channel_id: string;
          content: string;
          created_at?: string | null;
          id?: string;
          sender_id: string;
        };
        Update: {
          channel_id?: string;
          content?: string;
          created_at?: string | null;
          id?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey";
            columns: ["channel_id"];
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          full_name: string;
          avatar_url: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          full_name: string;
          avatar_url?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          full_name?: string;
          avatar_url?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
