export type Difficulty = "easy" | "medium" | "hard";

export interface Tag {
  id: number;
  name: string;
}

export interface Kata {
  id: number;
  title: string;
  content: string;
  lines: number;
  note: string;
  difficulty: Difficulty;
  created_at: string;
  tags: Tag[];
}

export interface CreateKataPayload {
  title: string;
  content: string;
  lines: number;
  note: string;
  difficulty: Difficulty;
  tags: string[];
}
