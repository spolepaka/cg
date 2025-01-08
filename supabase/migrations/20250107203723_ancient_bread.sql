/*
  # Add created_by to channels table
  
  1. Changes
    - Add created_by column to channels table
    - Set NOT NULL constraint
    - Add foreign key reference to auth.users
*/

ALTER TABLE channels 
ADD COLUMN IF NOT EXISTS created_by UUID NOT NULL REFERENCES auth.users(id);

-- Update existing channels if any
UPDATE channels 
SET created_by = (
  SELECT user_id 
  FROM channel_members 
  WHERE channel_id = channels.id 
  LIMIT 1
)
WHERE created_by IS NULL;