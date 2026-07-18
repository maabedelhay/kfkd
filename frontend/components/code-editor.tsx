"use client";

import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";
import go from "highlight.js/lib/languages/go";
import "highlight.js/styles/github.css";

hljs.registerLanguage("go", go);

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function CodeEditor({
  value,
  onChange,
  placeholder = "// code here…",
  className = "",
  minHeight = "120px",
}: CodeEditorProps) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when switching to edit mode
  useEffect(() => {
    if (focused) {
      textareaRef.current?.focus();
    }
  }, [focused]);

  const highlighted = hljs.highlight(value || "", { language: "go" }).value;

  const sharedStyle: React.CSSProperties = {
    minHeight,
    fontFamily: "var(--font-geist-mono), 'Fira Code', monospace",
    fontSize: "13px",
    lineHeight: "1.6",
    tabSize: 2,
  };

  if (focused || !value) {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        spellCheck={false}
        style={sharedStyle}
        className={`w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-800 placeholder:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${className}`}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const el = e.currentTarget;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const next = value.substring(0, start) + "  " + value.substring(end);
            onChange(next);
            requestAnimationFrame(() => {
              el.selectionStart = el.selectionEnd = start + 2;
            });
          }
        }}
      />
    );
  }

  return (
    <pre
      onClick={() => setFocused(true)}
      title="Click to edit"
      style={sharedStyle}
      className={`w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 overflow-x-auto cursor-text hover:border-zinc-300 transition-colors ${className}`}
    >
      <code
        className="hljs language-go"
        dangerouslySetInnerHTML={{ __html: highlighted || `<span class="text-zinc-300">${placeholder}</span>` }}
      />
    </pre>
  );
}
