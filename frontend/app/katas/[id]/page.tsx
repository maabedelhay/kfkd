"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Hash, StickyNote, Trash2 } from "lucide-react";
import { kataApi } from "@/lib/api";
import { Kata } from "@/types/kata";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function KataDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [kata, setKata] = useState<Kata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!kata) return;
    setDeleting(true);
    try {
      await kataApi.delete(kata.id);
      router.push("/katas");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete kata");
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    kataApi
      .get(id)
      .then((data) => {
        setKata(data);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load kata");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleTabKey = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const el = e.currentTarget;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newValue =
          code.substring(0, start) + "  " + code.substring(end);
        setCode(newValue);
        // restore cursor after state update
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + 2;
        });
      }
    },
    [code]
  );

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
        Loading…
      </div>
    );
  }

  if (error || !kata) {
    return (
      <div className="max-w-6xl mx-auto w-full px-6 py-8">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
          <Link href="/katas">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ?? "Kata not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Topbar */}
      <div className="px-6 py-3 border-b border-zinc-200 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/katas">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-sm font-semibold text-zinc-900 truncate">
          {kata.title}
        </h1>
        <DifficultyBadge difficulty={kata.difficulty} />
        <Button
          // variant="destructive"
          size="sm"
          className="ml-auto"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? "Deleting…" : "Delete"}
        </Button>
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 105px)" }}>
        {/* Left — kata info */}
        <div className="w-[380px] shrink-0 border-r border-zinc-200 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(kata.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="h-3.5 w-3.5" />
              {kata.lines} lines
            </span>
          </div>

          {/* Tags */}
          {kata.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {kata.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* Content */}
          {kata.content && (
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Description
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {kata.content}
              </p>
            </div>
          )}

          {/* Note */}
          {kata.note && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <StickyNote className="h-3.5 w-3.5" />
                  Note
                </p>
                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
                  {kata.note}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right — code editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-zinc-100 shrink-0">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
              Scratch pad
            </span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleTabKey}
            spellCheck={false}
            placeholder="// Write your solution here…"
            className="flex-1 w-full resize-none border-0 outline-none px-6 py-4 text-sm font-mono text-zinc-800 placeholder:text-zinc-300 bg-white leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
