import { createClient } from "@supabase/supabase-js";
import { Idea, Category, Confidence } from "@/types/idea";
import localIdeasRaw from "../../data/ideas.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Initialize Supabase conditionally to prevent crash on empty env keys (e.g. during build)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const localIdeas: Idea[] = (localIdeasRaw as any[]).map((item, index) => ({
  id: item.id || `local-idea-${index}`,
  name: item.name,
  owner: item.owner,
  category: item.category as Category,
  confidence: item.confidence as Confidence,
  problem: item.problem,
  solution: item.solution,
  created_at: new Date(Date.now() - index * 3600000).toISOString(),
  votesCount: 0
}));

// In-memory fallback database for dev without Supabase env variables
let fallbackIdeas = [...localIdeas];

/**
 * Fetch all ideas, including their total vote count.
 * Gracefully falls back to local JSON data if Supabase is not configured.
 */
export async function getIdeas(): Promise<Idea[]> {
  if (!supabase) {
    console.warn("Supabase is not configured. Falling back to local data source.");
    
    // Load vote counts from localStorage fallback if on client side
    if (typeof window !== "undefined") {
      const localVotes = localStorage.getItem("ideas_hub_fallback_votes") || "{}";
      const votesMap = JSON.parse(localVotes);
      return fallbackIdeas.map(idea => ({
        ...idea,
        votesCount: votesMap[idea.id]?.length || 0
      }));
    }
    return fallbackIdeas;
  }

  try {
    const { data, error } = await supabase
      .from("ideas")
      .select(`
        id,
        name,
        owner,
        category,
        confidence,
        problem,
        solution,
        created_at,
        votes(id)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase select error, using fallback:", error.message);
      return fallbackIdeas;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      owner: item.owner,
      category: item.category as Category,
      confidence: item.confidence as Confidence,
      problem: item.problem,
      solution: item.solution,
      created_at: item.created_at,
      votesCount: item.votes ? item.votes.length : 0,
    }));
  } catch (err) {
    console.error("Failed to run getIdeas, using fallback:", err);
    return fallbackIdeas;
  }
}

/**
 * Create a new innovation idea.
 * Gracefully falls back to local data if Supabase is not configured.
 */
export async function createIdea(idea: Omit<Idea, "id">): Promise<Idea | null> {
  if (!supabase) {
    console.warn("Supabase is not configured. Simulating idea creation locally.");
    const newIdea: Idea = {
      ...idea,
      id: `local-idea-${Date.now()}`,
      created_at: new Date().toISOString(),
      votesCount: 0
    };
    fallbackIdeas = [newIdea, ...fallbackIdeas];
    return newIdea;
  }

  const { data, error } = await supabase
    .from("ideas")
    .insert([idea])
    .select()
    .single();

  if (error) {
    console.error("Error creating idea in Supabase:", error.message);
    throw error;
  }

  return data;
}

/**
 * Submit a vote for a specific idea from a unique voter ID.
 * Gracefully falls back to local storage duplicate protection if Supabase is not configured.
 */
export async function voteIdea(ideaId: string, voterId: string): Promise<boolean> {
  if (!supabase) {
    console.warn("Supabase is not configured. Simulating voting via local storage.");
    if (typeof window !== "undefined") {
      const localVotes = localStorage.getItem("ideas_hub_fallback_votes") || "{}";
      const votesMap = JSON.parse(localVotes);
      
      if (!votesMap[ideaId]) {
        votesMap[ideaId] = [];
      }
      
      if (votesMap[ideaId].includes(voterId)) {
        console.warn("Duplicate vote detected locally for voter:", voterId);
        return false;
      }
      
      votesMap[ideaId].push(voterId);
      localStorage.setItem("ideas_hub_fallback_votes", JSON.stringify(votesMap));
      
      // Update in-memory fallback votesCount
      const ideaIndex = fallbackIdeas.findIndex(i => i.id === ideaId);
      if (ideaIndex !== -1) {
        fallbackIdeas[ideaIndex].votesCount = votesMap[ideaId].length;
      }
      return true;
    }
    return false;
  }

  const { error } = await supabase
    .from("votes")
    .insert([
      {
        idea_id: ideaId,
        voter_id: voterId,
      },
    ]);

  if (error) {
    if (error.code === "23505") {
      console.warn("Duplicate vote detected by Supabase unique constraint:", ideaId);
      return false;
    }
    console.error("Error casting vote in Supabase:", error.message);
    throw error;
  }

  return true;
}

/**
 * Get the current vote count for a single idea.
 */
export async function getVoteCount(ideaId: string): Promise<number> {
  if (!supabase) {
    if (typeof window !== "undefined") {
      const localVotes = localStorage.getItem("ideas_hub_fallback_votes") || "{}";
      const votesMap = JSON.parse(localVotes);
      return votesMap[ideaId]?.length || 0;
    }
    return 0;
  }

  const { count, error } = await supabase
    .from("votes")
    .select("*", { count: "exact", head: true })
    .eq("idea_id", ideaId);

  if (error) {
    console.error(`Error getting vote count from Supabase:`, error.message);
    throw error;
  }

  return count || 0;
}

/**
 * Fetch all vote records for a specific voter ID to check voting states on page load.
 */
export async function getVotedIdeaIds(voterId: string): Promise<string[]> {
  if (!supabase) {
    if (typeof window !== "undefined") {
      const localVotes = localStorage.getItem("ideas_hub_fallback_votes") || "{}";
      const votesMap = JSON.parse(localVotes);
      const votedIds: string[] = [];
      
      Object.keys(votesMap).forEach(ideaId => {
        if (votesMap[ideaId].includes(voterId)) {
          votedIds.push(ideaId);
        }
      });
      return votedIds;
    }
    return [];
  }

  const { data, error } = await supabase
    .from("votes")
    .select("idea_id")
    .eq("voter_id", voterId);

  if (error) {
    console.error("Error fetching voter records from Supabase:", error.message);
    return [];
  }

  return data ? data.map((v) => v.idea_id) : [];
}
