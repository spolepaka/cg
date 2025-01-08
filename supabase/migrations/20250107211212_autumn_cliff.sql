-- Add avatar_url to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update existing profiles with default avatar
UPDATE profiles 
SET avatar_url = 'https://api.d-id.com/avatars/default-avatar.png'
WHERE avatar_url IS NULL;