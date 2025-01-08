/*
  # Add channel update policy

  1. Changes
    - Add RLS policy to allow users to update channels they are members of
*/

CREATE POLICY "Users can update channels they are members of"
  ON channels FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM channel_members
      WHERE channel_id = channels.id
      AND user_id = auth.uid()
    )
  );