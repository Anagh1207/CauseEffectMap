"use client";

import type { MapNode } from "@/lib/cause-map-types";
import { X, TrendingUp, AlertTriangle, Target, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function TypeIcon({ type }: { type: MapNode["type"] }) {
  switch (type) {
    case "cause":
      return <AlertTriangle className="h-4 w-4" />;
    case "effect":
      return <TrendingUp className="h-4 w-4" />;
    case "problem":
      return <Target className="h-4 w-4" />;
  }
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const getColor = (val: number) => {
    if (val >= 85) return "bg-emerald-500";
    if (val >= 70) return "bg-amber-500";
    return "bg-red-400";
  };

  const getLabel = (val: number) => {
    if (val >= 85) return "High confidence";
    if (val >= 70) return "Moderate confidence";
    return "Low confidence";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Confidence Level</span>
        <span className="font-semibold text-foreground">{confidence}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(confidence)}`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{getLabel(confidence)}</span>
    </div>
  );
}

export function InsightPanel({
  node,
  onClose,
}: {
  node: MapNode | null;
  onClose: () => void;
}) {
  if (!node) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
        <div className="mb-4 rounded-2xl bg-secondary p-4">
          <Info className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">
          Select a node
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Click any node on the map to view detailed insights about its role in
          the cause-effect chain.
        </p>
      </div>
    );
  }

  const typeLabel =
    node.type === "cause"
      ? "Cause"
      : node.type === "effect"
        ? "Effect"
        : "Problem Statement";

  const typeBg =
    node.type === "cause"
      ? "bg-cause-light text-cause-foreground"
      : node.type === "effect"
        ? "bg-effect-light text-effect-foreground"
        : "bg-problem text-problem-foreground";

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border px-5 py-4">
        <div className="flex flex-col gap-2">
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${typeBg}`}
          >
            <TypeIcon type={node.type} />
            {typeLabel}
          </span>
          <h3 className="text-sm font-semibold leading-snug text-foreground">
            {node.label}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5 px-5 py-5">
        {/* Description */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Why this happens
          </h4>
          <p className="text-sm leading-relaxed text-foreground">
            {node.description}
          </p>
        </div>

        {/* Confidence */}
        {node.type !== "problem" && (
          <ConfidenceBar confidence={node.confidence} />
        )}

        {/* Metadata */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Node Type</span>
            <span className="font-medium capitalize text-foreground">
              {node.type}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Position</span>
            <span className="font-mono text-foreground">
              ({Math.round(node.x)}, {Math.round(node.y)})
            </span>
          </div>
          {node.type !== "problem" && (
            <>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Relevance</span>
                <span className="font-medium text-foreground">
                  {node.confidence >= 85
                    ? "High"
                    : node.confidence >= 70
                      ? "Medium"
                      : "Low"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
