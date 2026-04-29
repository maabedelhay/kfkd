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
    <div className="rounded-lg border border-zinc-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-100 border-b border-zinc-200">
            <th className="text-left px-4 py-3 font-medium text-zinc-500">Title</th>
            <th className="text-left px-4 py-3 font-medium text-zinc-500">Difficulty</th>
            <th className="text-left px-4 py-3 font-medium text-zinc-500">Lines</th>
            <th className="text-left px-4 py-3 font-medium text-zinc-500">Tags</th>
            <th className="text-left px-4 py-3 font-medium text-zinc-500">Added</th>
          </tr>
        </thead>
        <tbody>
          {katas.map((kata, i) => (
            <tr
              key={kata.id}
              className={`group relative transition-colors bg-white hover:bg-zinc-50 ${
                i !== katas.length - 1 ? "border-b border-zinc-100" : ""
              }`}
            >
              <td className="px-4 py-3 font-medium text-zinc-900 relative">
                <Link
                  href={`/katas/${kata.id}`}
                  className="absolute inset-0"
                  aria-label={`Open ${kata.title}`}
                />
                {kata.title}
              </td>
              <td className="px-4 py-3 relative">
                <Link href={`/katas/${kata.id}`} className="absolute inset-0" tabIndex={-1} />
                <DifficultyBadge difficulty={kata.difficulty} />
              </td>
              <td className="px-4 py-3 text-zinc-500 tabular-nums relative">
                <Link href={`/katas/${kata.id}`} className="absolute inset-0" tabIndex={-1} />
                {kata.lines}
              </td>
              <td className="px-4 py-3 relative">
                <Link href={`/katas/${kata.id}`} className="absolute inset-0" tabIndex={-1} />
                <div className="flex flex-wrap gap-1 pointer-events-none">
                  {kata.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-zinc-400 tabular-nums relative">
                <Link href={`/katas/${kata.id}`} className="absolute inset-0" tabIndex={-1} />
                {formatDate(kata.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}