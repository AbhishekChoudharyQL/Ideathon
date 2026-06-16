-- RESTRICTIVE policies act as hard blocks — they must pass even if a
-- permissive policy exists. This prevents any future accidental re-opening
-- of inserts via the anon key, from the browser or direct API calls.

CREATE POLICY "Block all inserts on votes" ON votes
  AS RESTRICTIVE
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Block all inserts on ideas" ON ideas
  AS RESTRICTIVE
  FOR INSERT
  WITH CHECK (false);
