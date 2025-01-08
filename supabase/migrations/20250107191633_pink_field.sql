/*
  # Add sender_id to messages table

  1. Changes
    - Add sender_id column to messages table
    - Make sender_id required
    - Add foreign key constraint to auth.users
*/

ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS sender_id UUID NOT NULL REFERENCES auth.users(id);