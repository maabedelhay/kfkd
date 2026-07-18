"use client";

import Link from "next/link";
import { Kata } from "@/types/kata";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Badge } from "@/components/ui/badge";

interface KatasTableProps {
  katas: Kata[];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")} ${
    ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()]
  } ${d.getUTCFullYear()}`;
}

export function KatasTable({ katas }: KatasTableProps) {
  if (katas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
        <p className="text-sm">No katas yet. Add your first one.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-600 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-everforest-bg-soft border-b border-zinc-600">
            <th className="text-left px-4 py-3 font-medium text-everforest-foreground/70">Title</th>
            <th className="text-left px-4 py-3 font-medium text-everforest-foreground/70">Difficulty</th>
            <th className="text-left px-4 py-3 font-medium text-everforest-foreground/70">Lines</th>
            <th className="text-left px-4 py-3 font-medium text-everforest-foreground/70">Tags</th>
            <th className="text-left px-4 py-3 font-medium text-everforest-foreground/70">Added</th>
            <th className="text-left px-4 py-3 font-medium text-everforest-foreground/70">Last Solved</th>
          </tr>
        </thead>
        <tbody>
          {katas.map((kata, i) => (
            <tr
              key={kata.id}
              className={`group relative transition-colors bg-background hover:bg-everforest-bg-soft ${
                i !== katas.length - 1 ? "border-b border-zinc-600" : ""
              }`}
            >
              <td className="px-4 py-3 font-medium text-foreground relative">
                <Link href={`/katas/${kata.id}`} className="absolute inset-0" />
                {kata.title}
              </td>
              <td className="px-4 py-3 relative">
                <Link href={`/katas/${kata.id}`} className="absolute inset-0" tabIndex={-1} />
                <DifficultyBadge difficulty={kata.difficulty} />
              </td>
              <td className="px-4 py-3 text-everforest-foreground/70 tabular-nums relative">
                <Link href={`/katas/${kata.id}`} className="absolute inset-0" tabIndex={-1} />
                {kata.lines}
              </td>
              <td className="px-4 py-3 relative">
                <Link href={`/katas/${kata.id}`} className="absolute inset-0" tabIndex={-1} />
                <div className="flex flex-wrap gap-1 pointer-events-none">
                  {kata.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-zinc-600 text-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-everforest-foreground/50 tabular-nums relative">
                <Link href={`/katas/${kata.id}`} className="absolute inset-0" tabIndex={-1} />
                {formatDate(kata.created_at)}
              </td>
              <td className="px-4 py-3 text-everforest-foreground/50 tabular-nums relative">
                <Link href={`/katas/${kata.id}`} className="absolute inset-0" tabIndex={-1} />
                {formatDate(kata.last_solved_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}