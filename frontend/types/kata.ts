export type Difficulty = "easy" | "medium" | "hard";

// Shape returned by the backend
export interface Kata {
  id: number;
  title: string;
  content: string;   // plain text (backend decodes base64 on read)
  lines: number;
  note: string;      // plain text
  difficulty: Difficulty;
  created_at: string;
  last_solved_at: string;
  tags: string[];    // backend returns []string
}

// Shape sent to POST /kata — content and note must be base64-encoded
export interface CreateKataPayload {
  title: string;
  content: string;   // base64-encoded before sending
  lines: number;
  note: string;      // base64-encoded before sending
  difficulty: Difficulty;
  tags: string[];
}
