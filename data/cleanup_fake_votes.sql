-- =============================================================
-- FAKE VOTE INVESTIGATION & CLEANUP
-- Run each section in the Supabase SQL Editor (dashboard.supabase.com)
-- Analysis results as of 2026-06-16:
--   total_votes=19073, unique_voters=19034, ideas_voted_on=18
--   cron ran: 2026-06-15 09:03 → 2026-06-16 05:38 UTC
--   every idea received ~1000 votes — clearly scripted
-- =============================================================

-- STEP 0: Backup (run this FIRST, before anything else)
CREATE TABLE IF NOT EXISTS votes_backup AS SELECT * FROM votes;
-- Verify: SELECT COUNT(*) FROM votes_backup;


-- STEP 1: Overall scale
SELECT
  COUNT(*)                  AS total_votes,
  COUNT(DISTINCT voter_id)  AS unique_voters,
  COUNT(DISTINCT idea_id)   AS ideas_voted_on,
  MIN(created_at)           AS earliest_vote,
  MAX(created_at)           AS latest_vote
FROM votes;


-- STEP 2: Votes-per-minute histogram
SELECT
  date_trunc('minute', created_at) AS minute_bucket,
  COUNT(*)                          AS votes_in_minute
FROM votes
GROUP BY minute_bucket
ORDER BY votes_in_minute DESC
LIMIT 50;


-- STEP 3: Per-idea vote breakdown
SELECT
  i.name,
  i.id,
  COUNT(v.id)              AS total_votes,
  COUNT(DISTINCT v.voter_id) AS unique_voters,
  MIN(v.created_at)        AS first_vote,
  MAX(v.created_at)        AS last_vote
FROM ideas i
LEFT JOIN votes v ON v.idea_id = i.id
GROUP BY i.id, i.name
ORDER BY total_votes DESC;


-- =============================================================
-- CLEANUP OPTIONS — choose ONE approach below
-- =============================================================

-- -------------------------------------------------------
-- OPTION A: Rate-based delete (catches burst minutes only)
-- Deletes all votes from minutes where >= 55 votes arrived.
-- WARNING: The cron ran at low rates too (avg ~16/min over
-- 20 hours), so this leaves ~15,000 fake votes untouched.
-- Use OPTION B unless you have strong reason to preserve any.
-- -------------------------------------------------------

-- Preview count first:
-- SELECT COUNT(*) AS would_delete
-- FROM votes
-- WHERE date_trunc('minute', created_at) IN (
--   SELECT date_trunc('minute', created_at)
--   FROM votes GROUP BY 1 HAVING COUNT(*) >= 55
-- );

-- BEGIN;
-- WITH fake_minutes AS (
--   SELECT date_trunc('minute', created_at) AS m
--   FROM votes GROUP BY m HAVING COUNT(*) >= 55
-- )
-- DELETE FROM votes
-- WHERE date_trunc('minute', created_at) IN (SELECT m FROM fake_minutes);
-- -- Check: SELECT COUNT(*) FROM votes;
-- COMMIT;


-- -------------------------------------------------------
-- OPTION B: Full wipe (recommended)
-- The cron generated a fresh UUID per request the entire
-- time — ~99% of all 19,073 votes are fake. Real votes
-- (< ~200 estimated) are indistinguishable individually.
-- Wiping everything gives you a clean slate once the
-- lockdown migration is deployed.
-- -------------------------------------------------------

-- BEGIN;
-- DELETE FROM votes;
-- -- Verify:
-- SELECT COUNT(*) FROM votes;        -- should be 0
-- SELECT COUNT(*) FROM votes_backup; -- should be 19073
-- COMMIT;


-- -------------------------------------------------------
-- OPTION C: Keep only pre-event votes as legit signal
-- If you know real voting started at a specific time and
-- the fake cron clearly hadn't started yet, you can keep
-- those early real votes and delete the rest.
-- Replace timestamps with the legitimate window.
-- -------------------------------------------------------

-- BEGIN;
-- DELETE FROM votes
-- WHERE created_at NOT BETWEEN '<real_start>' AND '<real_end>';
-- COMMIT;

-- =============================================================
