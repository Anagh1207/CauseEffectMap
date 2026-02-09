"use client";

import React from "react"

import { useState, useRef } from "react";
import { Sparkles, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  "Traffic jam near my college",
  "Why my plant keeps dying",
  "High employee turnover",
  "Slow website loading times",
  "Climate change effects on agriculture",
];

export function HeroInput({
  onGenerate,
  isGenerating,
}: {
  onGenerate: (problem: string) => void;
  isGenerating: boolean;
}) {
  const [problem, setProblem] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (problem.trim() && !isGenerating) {
      onGenerate(problem.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="relative px-4 pb-6 pt-12 md:pb-10 md:pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span>AI-Powered Problem Analysis</span>
        </div>

        <h1 className="mb-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Map the roots of any problem
        </h1>

        <p className="mx-auto mb-8 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Describe a real-world problem and watch as we build a visual
          cause-effect map to help you understand it deeply.
        </p>

        <div className="mx-auto max-w-xl">
          <div className="group relative rounded-2xl border border-border bg-card p-1.5 shadow-lg shadow-primary/5 transition-shadow focus-within:shadow-xl focus-within:shadow-primary/10">
            <textarea
              ref={textareaRef}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe a real-world problem you're facing..."
              rows={3}
              className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              disabled={isGenerating}
              aria-label="Problem description"
            />
            <div className="flex items-center justify-between px-2 pb-1.5">
              <span className="text-xs text-muted-foreground/50">
                {problem.length > 0
                  ? `${problem.length} characters`
                  : "Press Enter to generate"}
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!problem.trim() || isGenerating}
                size="sm"
                className="gap-2 rounded-xl bg-primary px-5 text-primary-foreground hover:bg-primary/90"
              >
                {isGenerating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Map
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5" />
              Try:
            </span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setProblem(s);
                  textareaRef.current?.focus();
                }}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                disabled={isGenerating}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
