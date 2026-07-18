"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { KatasTable } from "@/components/katas-table";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { Button } from "@/components/ui/button";
import { Kata } from "@/types/kata";

const MOCK_KATAS: Kata[] = [
  {
    id: 1,
    title: "Fibonacci Sequence",
    content: "Write a function that returns the nth Fibonacci number.",
    note: "Try both recursive and iterative approaches.",
    difficulty: "easy",
    lines: 12,
    tags: ["recursion", "math"],
    created_at: "2026-06-01T00:00:00Z",
    last_solved_at: "2026-07-15T00:00:00Z",
  },
  {
    id: 2,
    title: "FizzBuzz",
    content: "Print numbers 1 to 100, replacing multiples of 3 with Fizz, 5 with Buzz, both with FizzBuzz.",
    note: "",
    difficulty: "easy",
    lines: 8,
    tags: ["loop", "conditionals"],
    created_at: "2026-06-05T00:00:00Z",
    last_solved_at: "2026-07-10T00:00:00Z",
  },
  {
    id: 3,
    title: "LRU Cache",
    content: "Design a data structure that follows the LRU eviction policy.",
    note: "Use a combination of a hash map and a doubly linked list.",
    difficulty: "hard",
    lines: 45,
    tags: ["data-structures", "design"],
    created_at: "2026-06-20T00:00:00Z",
    last_solved_at: "2026-07-01T00:00:00Z",
  },
];

export default function KatasPage() {
  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Katas</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {MOCK_KATAS.length} katas
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/katas/new">
            <Plus className="h-4 w-4" />
            Add kata
          </Link>
        </Button>
      </div>

      <ActivityHeatmap data={[]} />
      <KatasTable katas={MOCK_KATAS} />
    </div>
  );
}
