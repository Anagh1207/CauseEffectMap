"use client";

import type { CauseMapData } from "@/lib/cause-map-types";
import { formatRelative } from "date-fns";

export interface SessionMap {
  id: number;
  problem: string;
  mapData: CauseMapData;
  timestamp: Date;
}

interface MyMapsViewProps {
  sessionMaps: SessionMap[];
  onLoadMap: (map: SessionMap) => void;
}

export function MyMapsView({ sessionMaps, onLoadMap }: MyMapsViewProps) {
  if (sessionMaps.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-foreground">No Maps Yet</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          You haven't generated any cause-effect maps in this active session. Head over to the Explore tab to start analyzing problems!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Session Maps
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Automatically tracking maps generated during your current session.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sessionMaps.map((sm) => (
          <div
            key={sm.id}
            className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="mb-4">
              <span className="mb-2 inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {sm.mapData.nodes.length} Nodes
              </span>
              <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-foreground">
                {sm.problem}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Generated {formatRelative(sm.timestamp, new Date())}
              </p>
            </div>

            <div className="mt-auto pt-4">
              <button
                onClick={() => onLoadMap(sm)}
                className="w-full rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                Open Map
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
