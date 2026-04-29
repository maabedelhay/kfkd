"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Check, Hash, Save, StickyNote, Trash2 } from "lucide-react";
import { kataApi } from "@/lib/api";
import { Kata } from "@/types/kata";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// function formatDate(iso: string) {
//   return new Date(iso).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }
function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")} ${
    ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()]
  } ${d.getUTCFullYear()}`;
}
export default function KataDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [kata, setKata] = useState<Kata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [content, setContent] = useState("");
  const [note, setNote] = useState("");
  const [deleting, setDeleting] = useState(false);
const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

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

async function handleSave() {
  if (!kata) return;
  setError(null); 
  setSaveStatus("saving");
  try {
    await kataApi.save({
      title: kata.title,
      content,
      note,
      lines: content ? content.split("\n").length : 0,
      difficulty: kata.difficulty,
      tags: kata.tags,
    });
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  } catch (e) {
    setError(e instanceof Error ? e.message : "Failed to save kata");
    setSaveStatus("error");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }
}

  useEffect(() => {
    if (!id) return;
    kataApi
      .get(id)
      .then((data) => {
        setKata(data);
        setContent(data.content ?? "");
        setNote(data.note ?? "");
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
        <div className="ml-auto flex items-center gap-2">
          <Button
  variant={saveStatus === "saved" ? "secondary" : "outline"}
  size="sm"
  onClick={handleSave}
  disabled={saveStatus === "saving" || deleting}
  className={
    saveStatus === "saved"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
      : saveStatus === "error"
      ? "text-red-600 border-red-200"
      : ""
  }
>
  {saveStatus === "saving" && <Save className="h-4 w-4 animate-pulse" />}
  {saveStatus === "saved" && <Check className="h-4 w-4" />}
  {(saveStatus === "idle" || saveStatus === "error") && <Save className="h-4 w-4" />}
  {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Save"}
</Button>

          <Button
            // variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={saveStatus === "saving" || deleting}
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 105px)" }}>
        {/* Left — kata info */}
        <div className="w-[560px] shrink-0 border-r border-zinc-200 overflow-y-auto px-6 py-6 flex flex-col gap-5">
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
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Description
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the kata problem…"
              spellCheck={false}
              className="w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 leading-relaxed placeholder:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 min-h-[700]"
            />
          </div>

          {/* Note */}
          <Separator />
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <StickyNote className="h-3.5 w-3.5" />
              Note
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Personal notes or hints…"
              spellCheck={false}
              className="w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 leading-relaxed placeholder:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 min-h-[200]"
            />
          </div>
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
