-- Add avatar_url to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update existing profiles with default avatar
UPDATE profiles 
SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || id::text
WHERE avatar_url IS NULL;