"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { HeroInput } from "@/components/hero-input";
import { CauseMapCanvas } from "@/components/cause-map-canvas";
import { InsightPanel } from "@/components/insight-panel";
import { MapToolbar } from "@/components/map-toolbar";
import type { MapNode, CauseMapData } from "@/lib/cause-map-types";
import { generateMapData } from "@/lib/generate-map-data";

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [mapData, setMapData] = useState<CauseMapData | null>(null);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  // Undo / redo history
  const [history, setHistory] = useState<MapNode[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const pushHistory = useCallback(
    (nodes: MapNode[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(nodes);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  const handleGenerate = useCallback(
    async (problem: string) => {
      setIsGenerating(true);
      setAnimating(true);
      setSelectedNode(null);

      // Simulate AI generation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const data = generateMapData(problem);
      setMapData(data);
      setShowCanvas(true);
      pushHistory(data.nodes);
      setIsGenerating(false);

      // Scroll to canvas
      setTimeout(() => {
        canvasRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      // End animating after all nodes appear
      setTimeout(() => {
        setAnimating(false);
      }, data.nodes.length * 120 + 600);
    },
    [pushHistory]
  );

  const handleNodesChange = useCallback(
    (nodes: MapNode[]) => {
      if (!mapData) return;
      setMapData({ ...mapData, nodes });
    },
    [mapData]
  );

  const handleNodesCommit = useCallback(
    (nodes: MapNode[]) => {
      pushHistory(nodes);
    },
    [pushHistory]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0 || !mapData) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setMapData({ ...mapData, nodes: history[newIndex] });
  }, [historyIndex, history, mapData]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !mapData) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setMapData({ ...mapData, nodes: history[newIndex] });
  }, [historyIndex, history, mapData]);

  const handleReset = useCallback(() => {
    setMapData(null);
    setShowCanvas(false);
    setSelectedNode(null);
    setHistory([]);
    setHistoryIndex(-1);
    setAnimating(false);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

      <main className="flex flex-1 flex-col">
        <HeroInput onGenerate={handleGenerate} isGenerating={isGenerating} />

        {showCanvas && mapData && (
          <section
            ref={canvasRef}
            className="flex flex-1 flex-col px-4 pb-6 lg:px-6"
            aria-label="Cause-effect map workspace"
          >
            {/* Toolbar */}
            <div className="mx-auto mb-3 flex w-full max-w-7xl items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Cause-Effect Map
                </h2>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                  {mapData.nodes.length} nodes
                </span>
              </div>
              <MapToolbar
                onUndo={handleUndo}
                onRedo={handleRedo}
                onReset={handleReset}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                hasMap={!!mapData}
              />
            </div>

            {/* Canvas + Insight Panel */}
            <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4" style={{ minHeight: 480 }}>
              {/* Canvas area */}
              <div className="flex-1">
                <CauseMapCanvas
                  nodes={mapData.nodes}
                  edges={mapData.edges}
                  selectedNode={selectedNode}
                  onSelectNode={setSelectedNode}
                  onNodesChange={handleNodesChange}
                  animating={animating}
                />
              </div>

              {/* Insight panel (desktop) */}
              <aside className="hidden w-72 shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:block">
                <InsightPanel
                  node={selectedNode}
                  onClose={() => setSelectedNode(null)}
                />
              </aside>
            </div>

            {/* Insight panel (mobile - slide up) */}
            {selectedNode && (
              <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border bg-card shadow-2xl lg:hidden">
                <div className="mx-auto max-h-[50vh] overflow-y-auto">
                  <InsightPanel
                    node={selectedNode}
                    onClose={() => setSelectedNode(null)}
                  />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Empty state when no map */}
        {!showCanvas && (
          <section className="flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-8">
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  title: "Describe",
                  description: "Enter any real-world problem in natural language",
                  icon: "1",
                },
                {
                  title: "Analyze",
                  description: "AI identifies causes and effects automatically",
                  icon: "2",
                },
                {
                  title: "Explore",
                  description: "Interact with the visual map to gain insights",
                  icon: "3",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-8 text-center shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
