-- LOCKDOWN: Disable all public INSERT access to voting and idea submission.
-- The anon key is public-facing; without a permissive INSERT policy, RLS blocks
-- all writes by default — this stops both the UI and any direct API abuse.

-- Drop idea submission INSERT policy
DROP POLICY IF EXISTS "Allow public insert access to ideas" ON ideas;

-- Drop voting INSERT policy
DROP POLICY IF EXISTS "Allow public insert access to votes" ON votes;

-- Read-only policies remain intact so the hub continues to display ideas and vote counts.
