"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { kataApi } from "@/lib/api";
import { Difficulty } from "@/types/kata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function NewKataPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [note, setNote] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addTag(value: string) {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setSubmitting(true);
    try {
      await kataApi.save({
        title: title.trim(),
        content: content.trim(),
        lines: content.trim() ? content.trim().split("\n").length : 0,
        note: note.trim(),
        difficulty,
        tags,
      });
      router.push("/katas");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save kata");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
          <Link href="/katas">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-zinc-900">New kata</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. Fibonacci sequence"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Describe the kata problem..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={difficulty}
            onValueChange={(v) => setDifficulty(v as Difficulty)}
          >
            <SelectTrigger id="difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Note */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            placeholder="Any personal notes or hints..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex flex-wrap items-center gap-1.5 min-h-[36px] w-full rounded-md border border-zinc-200 bg-white px-2 py-1.5 focus-within:ring-1 focus-within:ring-zinc-400">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-zinc-900 text-zinc-400 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => tagInput.trim() && addTag(tagInput)}
              placeholder={tags.length === 0 ? "Add tags (Enter or comma)" : ""}
              className="flex-1 min-w-[120px] text-sm bg-transparent outline-none placeholder:text-zinc-400"
            />
          </div>
          <p className="text-xs text-zinc-400">Press Enter or comma to add a tag</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 rounded-md border border-red-200 bg-red-50 px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" type="button" asChild>
            <Link href="/katas">Cancel</Link>
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save kata"}
          </Button>
        </div>
      </form>
    </div>
  );
}
