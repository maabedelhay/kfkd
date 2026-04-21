import { Kata, CreateKataPayload } from "@/types/kata";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export const kataApi = {
  list(): Promise<Kata[]> {
    return request<Kata[]>("/katas");
  },

  get(id: number): Promise<Kata> {
    return request<Kata>(`/katas/${id}`);
  },

  save(payload: CreateKataPayload): Promise<Kata> {
    return request<Kata>("/katas", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
