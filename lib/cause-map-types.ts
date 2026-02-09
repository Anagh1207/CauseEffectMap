export interface MapNode {
  id: string;
  label: string;
  type: "cause" | "effect" | "problem";
  x: number;
  y: number;
  description: string;
  confidence: number;
  subNodes?: MapNode[];
  expanded?: boolean;
}

export interface MapEdge {
  id: string;
  from: string;
  to: string;
}

export interface CauseMapData {
  problem: string;
  nodes: MapNode[];
  edges: MapEdge[];
}
