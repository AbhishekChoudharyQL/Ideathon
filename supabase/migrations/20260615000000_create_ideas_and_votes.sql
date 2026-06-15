-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  category TEXT NOT NULL,
  confidence TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_idea_voter UNIQUE (idea_id, voter_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create public policies for ideas (anyone can read or insert)
CREATE POLICY "Allow public read access to ideas" ON ideas
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to ideas" ON ideas
  FOR INSERT WITH CHECK (true);

-- Create public policies for votes (anyone can read or insert)
CREATE POLICY "Allow public read access to votes" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to votes" ON votes
  FOR INSERT WITH CHECK (true);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_ideas_category ON ideas(category);
CREATE INDEX IF NOT EXISTS idx_votes_idea_id ON votes(idea_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_id ON votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_votes_idea_voter ON votes(idea_id, voter_id);
