"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Check, Hash, Save, StickyNote, Timer, Trash2 } from "lucide-react";
import { kataApi } from "@/lib/api";
import { Kata } from "@/types/kata";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CodeEditor } from "@/components/code-editor";

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

  // solve panel
  const [quality, setQuality] = useState<number>(3);
  const [durationSec, setDurationSec] = useState<number>(0);
  const [solveStatus, setSolveStatus] = useState<"idle" | "solving" | "solved" | "error">("idle");

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

  async function handleSolve() {
    if (!kata) return;
    setSolveStatus("solving");
    try {
      await kataApi.solve({
        kata_id: kata.id,
        duration_sec: durationSec,
        quality,
      });
      setSolveStatus("solved");
      setTimeout(() => setSolveStatus("idle"), 2000);
    } catch (e) {
      setSolveStatus("error");
      setTimeout(() => setSolveStatus("idle"), 2000);
    }
  }

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
      <div className="px-6 py-3 border-b border-zinc-500 flex items-center gap-3 shrink-0">
        {/* Left — back + title */}
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/katas">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-sm font-semibold text-zinc-900 truncate max-w-[160px]">
          {kata.title}
        </h1>
        <DifficultyBadge difficulty={kata.difficulty} />

        {/* Center — solve panel */}
        <div className="flex items-center gap-2 mx-auto border border-zinc-500 rounded-lg px-3 py-1.5 bg-lime-50">
          <Timer className="h-3.5 w-3.5 text-zinc-400 shrink-0" />

          <div className="flex items-center gap-1 text-sm font-mono">
            <input
              type="number"
              min={0}
              max={59}
              value={String(Math.floor(durationSec / 60)).padStart(2, "0")}
              onChange={(e) => {
                const mins = Math.min(59, Math.max(0, Number(e.target.value)));
                setDurationSec(mins * 60 + (durationSec % 60));
              }}
              className="w-10 text-center bg-transparent border border-zinc-200 rounded px-1 py-0.5 text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-zinc-400">:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={String(durationSec % 60).padStart(2, "0")}
              onChange={(e) => {
                const secs = Math.min(59, Math.max(0, Number(e.target.value)));
                setDurationSec(Math.floor(durationSec / 60) * 60 + secs);
              }}
              className="w-10 text-center bg-transparent border border-zinc-200 rounded px-1 py-0.5 text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <Separator orientation="vertical" className="h-4" />

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                  q <= quality
                    ? "bg-zinc-800 text-white"
                    : "bg-white border border-zinc-200 text-zinc-400 hover:border-zinc-400"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-4" />

          <Button
            size="sm"
            onClick={handleSolve}
            disabled={solveStatus === "solving" || deleting}
            className={`transition-colors ${
              solveStatus === "solved"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : solveStatus === "error"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : ""
            }`}
          >
            {solveStatus === "solved" && <Check className="h-4 w-4" />}
            {solveStatus === "solving" && <Timer className="h-4 w-4 animate-pulse" />}
            {(solveStatus === "idle" || solveStatus === "error") && <Check className="h-4 w-4" />}
            {solveStatus === "solving" ? "Solving…" : solveStatus === "solved" ? "Solved!" : "Solve"}
          </Button>
        </div>

        {/* Right — save + delete */}
        <div className="flex items-center gap-2">
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
            size="sm"
            onClick={handleDelete}
            disabled={deleting || saveStatus === "saving"}
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 105px)" }}>
        {/* Left — kata info */}
        <div className="w-[800px] shrink-0 border-r border-zinc-500 overflow-y-auto px-6 py-6 flex flex-col gap-5">
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

          {/* Content — editable with syntax highlight */}
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Kata
            </p>
            <CodeEditor
              value={content}
              onChange={setContent}
              placeholder="// kata code here…"
              minHeight="700px"
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
              className="w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 leading-relaxed placeholder:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 min-h-[250px]"
            />
          </div>
        </div>

        {/* Right — scratch pad with syntax highlight */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-zinc-100 shrink-0">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
              Scratch pad
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <CodeEditor
              value={code}
              onChange={setCode}
              placeholder="// Write your solution here…"
              minHeight="100%"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
