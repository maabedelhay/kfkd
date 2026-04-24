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

async function requestVoid(path: string, options?: RequestInit): Promise<void> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }
}

function b64(str: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

export const kataApi = {
  list(): Promise<Kata[]> {
    return request<Kata[]>("/kata/list");
  },

  get(id: number): Promise<Kata> {
    return request<Kata>(`/kata/${id}`);
  },

  save(payload: CreateKataPayload): Promise<void> {
    return requestVoid("/kata", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        content: b64(payload.content),
        note: b64(payload.note),
      }),
    });
  },

  delete(id: number): Promise<void> {
    return requestVoid(`/kata/${id}`, { method: "DELETE" });
  },
};
