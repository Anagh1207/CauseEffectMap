"use client";

import React from "react"

import { Undo2, Redo2, RotateCcw, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function MapToolbar({
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
  hasMap,
}: {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasMap: boolean;
}) {
  const actions: ToolbarAction[] = [
    {
      icon: <Undo2 className="h-4 w-4" />,
      label: "Undo",
      onClick: onUndo,
      disabled: !canUndo,
    },
    {
      icon: <Redo2 className="h-4 w-4" />,
      label: "Redo",
      onClick: onRedo,
      disabled: !canRedo,
    },
    {
      icon: <RotateCcw className="h-4 w-4" />,
      label: "Reset Map",
      onClick: onReset,
      disabled: !hasMap,
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 rounded-xl border border-border bg-card/90 px-2 py-1.5 shadow-sm backdrop-blur-sm">
        {actions.map((action, i) => (
          <Tooltip key={action.label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={action.onClick}
                disabled={action.disabled}
                className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label={action.label}
              >
                {action.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {action.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
