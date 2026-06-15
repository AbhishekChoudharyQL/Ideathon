export type Category = "AI/LLMs" | "Mobile" | "Frontend/UI";

export type Confidence =
  | "Very Risky"
  | "Tight but Ok"
  | "Might Stretch"
  | "Total Feasible"
  | "Pretty Doable";

export interface Idea {
  id: string;
  name: string;
  owner: string;
  category: Category;
  confidence: Confidence;
  problem: string;
  solution: string;
  votesCount?: number;
  created_at?: string;
}
