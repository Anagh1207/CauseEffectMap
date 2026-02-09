"use client";

import React from "react"

import { useState, useRef, useCallback, useEffect } from "react";
import type { MapNode, MapEdge } from "@/lib/cause-map-types";

const NODE_WIDTH = 160;
const NODE_HEIGHT = 56;

function getNodeColor(type: MapNode["type"]) {
  switch (type) {
    case "cause":
      return {
        bg: "hsl(var(--cause-light))",
        border: "hsl(var(--cause))",
        text: "hsl(var(--cause-foreground))",
        dot: "hsl(var(--cause))",
      };
    case "effect":
      return {
        bg: "hsl(var(--effect-light))",
        border: "hsl(var(--effect))",
        text: "hsl(var(--effect-foreground))",
        dot: "hsl(var(--effect))",
      };
    case "problem":
      return {
        bg: "hsl(var(--problem))",
        border: "hsl(var(--problem))",
        text: "hsl(var(--problem-foreground))",
        dot: "hsl(var(--problem))",
      };
  }
}

function CurvedEdge({
  fromX,
  fromY,
  toX,
  toY,
  highlighted,
  animated,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  highlighted: boolean;
  animated: boolean;
}) {
  const midX = (fromX + toX) / 2;
  const d = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={highlighted ? "hsl(var(--primary))" : "hsl(var(--border))"}
        strokeWidth={highlighted ? 2.5 : 1.5}
        strokeDasharray={animated ? "8 4" : "none"}
        className="transition-all duration-300"
        style={
          animated
            ? {
                animation: "dash 1s linear infinite",
              }
            : undefined
        }
      />
      {/* Arrow */}
      <circle cx={toX} cy={toY} r={3} fill={highlighted ? "hsl(var(--primary))" : "hsl(var(--border))"} />
    </g>
  );
}

function MapNodeComponent({
  node,
  isSelected,
  isHighlighted,
  onSelect,
  onDragStart,
  animDelay,
}: {
  node: MapNode;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (node: MapNode) => void;
  onDragStart: (e: React.PointerEvent, node: MapNode) => void;
  animDelay: number;
}) {
  const colors = getNodeColor(node.type);
  const x = node.x - NODE_WIDTH / 2;
  const y = node.y - NODE_HEIGHT / 2;

  return (
    <g
      style={{
        animation: `nodeAppear 0.5s ease-out ${animDelay}ms both`,
        cursor: "grab",
      }}
      onPointerDown={(e) => onDragStart(e, node)}
      onClick={() => onSelect(node)}
      role="button"
      tabIndex={0}
      aria-label={`${node.type}: ${node.label}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(node);
        }
      }}
    >
      {/* Shadow */}
      <rect
        x={x + 2}
        y={y + 3}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={14}
        fill="rgba(0,0,0,0.06)"
      />
      {/* Node body */}
      <rect
        x={x}
        y={y}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={14}
        fill={colors.bg}
        stroke={isSelected || isHighlighted ? "hsl(var(--primary))" : colors.border}
        strokeWidth={isSelected ? 2.5 : isHighlighted ? 2 : 1.5}
        className="transition-all duration-200"
      />
      {/* Type indicator dot */}
      <circle cx={x + 16} cy={node.y} r={4} fill={colors.dot} />
      {/* Label */}
      <text
        x={x + 28}
        y={node.y}
        dy="0.35em"
        fill={colors.text}
        fontSize={12.5}
        fontWeight={node.type === "problem" ? 600 : 500}
        fontFamily="var(--font-inter), system-ui, sans-serif"
        style={{ pointerEvents: "none" }}
      >
        {node.label.length > 20
          ? `${node.label.slice(0, 20)}...`
          : node.label}
      </text>
      {/* Confidence badge for non-problem nodes */}
      {node.type !== "problem" && (
        <>
          <rect
            x={x + NODE_WIDTH - 40}
            y={node.y - 10}
            width={30}
            height={20}
            rx={6}
            fill={colors.dot}
            opacity={0.15}
          />
          <text
            x={x + NODE_WIDTH - 25}
            y={node.y}
            dy="0.35em"
            fill={colors.dot}
            fontSize={10}
            fontWeight={600}
            textAnchor="middle"
            fontFamily="var(--font-inter), system-ui, sans-serif"
            style={{ pointerEvents: "none" }}
          >
            {node.confidence}%
          </text>
        </>
      )}
    </g>
  );
}

export function CauseMapCanvas({
  nodes,
  edges,
  selectedNode,
  onSelectNode,
  onNodesChange,
  animating,
}: {
  nodes: MapNode[];
  edges: MapEdge[];
  selectedNode: MapNode | null;
  onSelectNode: (node: MapNode | null) => void;
  onNodesChange: (nodes: MapNode[]) => void;
  animating: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [hoveredEdgeNodes, setHoveredEdgeNodes] = useState<Set<string>>(
    new Set()
  );

  const handleDragStart = useCallback(
    (e: React.PointerEvent, node: MapNode) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(node.id);
      const svg = svgRef.current;
      if (!svg) return;
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const svgPoint = point.matrixTransform(ctm.inverse());
      dragOffset.current = {
        x: svgPoint.x - node.x,
        y: svgPoint.y - node.y,
      };
      (e.target as Element).setPointerCapture(e.pointerId);
    },
    []
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const svg = svgRef.current;
      if (!svg) return;
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const svgPoint = point.matrixTransform(ctm.inverse());
      const newX = svgPoint.x - dragOffset.current.x;
      const newY = svgPoint.y - dragOffset.current.y;
      const updated = nodes.map((n) =>
        n.id === dragging ? { ...n, x: newX, y: newY } : n
      );
      onNodesChange(updated);
    },
    [dragging, nodes, onNodesChange]
  );

  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

  // Compute highlighted edges based on selected node
  const highlightedEdges = new Set<string>();
  const highlightedNodes = new Set<string>();
  if (selectedNode) {
    highlightedNodes.add(selectedNode.id);
    edges.forEach((edge) => {
      if (edge.from === selectedNode.id || edge.to === selectedNode.id) {
        highlightedEdges.add(edge.id);
        highlightedNodes.add(edge.from);
        highlightedNodes.add(edge.to);
      }
    });
  }

  // Merge with hovered
  hoveredEdgeNodes.forEach((id) => highlightedNodes.add(id));

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-canvas">
      {/* Grid background */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern
            id="grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="hsl(var(--canvas-grid))"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* CSS for animations */}
      <style>{`
        @keyframes nodeAppear {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -12;
          }
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 1200 600"
        className="relative h-full w-full"
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as Element).tagName === "rect") {
            // Only deselect if clicking on the background
            if ((e.target as Element).getAttribute("fill") === "url(#grid)" || e.target === svgRef.current) {
              onSelectNode(null);
            }
          }
        }}
        role="img"
        aria-label="Cause and effect map visualization"
      >
        {/* Edges */}
        {edges.map((edge) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;

          const fromX =
            from.type === "cause"
              ? from.x + NODE_WIDTH / 2
              : from.x + NODE_WIDTH / 2;
          const toX =
            to.type === "effect"
              ? to.x - NODE_WIDTH / 2
              : to.x - NODE_WIDTH / 2;

          return (
            <CurvedEdge
              key={edge.id}
              fromX={fromX}
              fromY={from.y}
              toX={toX}
              toY={to.y}
              highlighted={highlightedEdges.has(edge.id)}
              animated={animating}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <MapNodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            isHighlighted={highlightedNodes.has(node.id)}
            onSelect={onSelectNode}
            onDragStart={handleDragStart}
            animDelay={animating ? i * 120 : 0}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-xl border border-border bg-card/90 px-4 py-2.5 text-xs backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "hsl(var(--cause))" }}
          />
          <span className="text-muted-foreground">Causes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: "hsl(var(--problem))" }}
          />
          <span className="text-muted-foreground">Problem</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "hsl(var(--effect))" }}
          />
          <span className="text-muted-foreground">Effects</span>
        </div>
      </div>
    </div>
  );
}
