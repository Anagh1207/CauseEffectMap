import type { CauseMapData, MapNode, MapEdge } from "./cause-map-types";

const causeEffectDatabase: Record<
  string,
  {
    causes: { label: string; description: string; confidence: number }[];
    effects: { label: string; description: string; confidence: number }[];
  }
> = {
  traffic: {
    causes: [
      {
        label: "Poor road infrastructure",
        description:
          "Narrow roads and lack of alternative routes force all vehicles into the same corridors, creating bottlenecks during peak hours.",
        confidence: 88,
      },
      {
        label: "High vehicle density",
        description:
          "Increasing number of private vehicles without corresponding road capacity creates congestion.",
        confidence: 92,
      },
      {
        label: "Lack of public transit",
        description:
          "Insufficient or unreliable public transportation forces reliance on personal vehicles.",
        confidence: 85,
      },
      {
        label: "Poor traffic management",
        description:
          "Unoptimized signal timing and lack of smart traffic systems cause unnecessary delays.",
        confidence: 78,
      },
    ],
    effects: [
      {
        label: "Increased commute time",
        description:
          "Average travel durations significantly increase, reducing productive hours for commuters.",
        confidence: 95,
      },
      {
        label: "Air pollution",
        description:
          "Idling vehicles emit higher concentrations of CO2 and particulate matter into the atmosphere.",
        confidence: 90,
      },
      {
        label: "Stress & fatigue",
        description:
          "Extended time in traffic contributes to mental health issues and reduced well-being.",
        confidence: 82,
      },
      {
        label: "Economic losses",
        description:
          "Late deliveries, reduced productivity, and increased fuel consumption cause financial impact.",
        confidence: 87,
      },
    ],
  },
  plant: {
    causes: [
      {
        label: "Overwatering",
        description:
          "Excess moisture causes root rot, depriving the plant of oxygen and nutrients.",
        confidence: 90,
      },
      {
        label: "Insufficient light",
        description:
          "Plants need adequate sunlight for photosynthesis; low light stunts growth and weakens the plant.",
        confidence: 86,
      },
      {
        label: "Poor soil quality",
        description:
          "Nutrient-depleted or compacted soil fails to support healthy root development.",
        confidence: 80,
      },
      {
        label: "Pests & disease",
        description:
          "Insects and fungal infections damage plant tissue and deplete its resources.",
        confidence: 75,
      },
    ],
    effects: [
      {
        label: "Yellowing leaves",
        description:
          "Chlorosis indicates nutrient deficiency or excess moisture disrupting chlorophyll production.",
        confidence: 88,
      },
      {
        label: "Wilting stems",
        description:
          "Loss of turgor pressure from water imbalance causes drooping and structural weakness.",
        confidence: 85,
      },
      {
        label: "Stunted growth",
        description:
          "The plant redirects energy to survival rather than growth, resulting in smaller leaves and stems.",
        confidence: 82,
      },
      {
        label: "Root decay",
        description:
          "Compromised root system reduces water and nutrient uptake, accelerating plant decline.",
        confidence: 78,
      },
    ],
  },
  employee: {
    causes: [
      {
        label: "Low compensation",
        description:
          "Below-market salaries drive employees to seek better-paying opportunities elsewhere.",
        confidence: 91,
      },
      {
        label: "Poor management",
        description:
          "Ineffective leadership, micromanagement, and lack of recognition create a toxic environment.",
        confidence: 88,
      },
      {
        label: "Limited growth",
        description:
          "Absence of career development paths and learning opportunities leads to stagnation.",
        confidence: 85,
      },
      {
        label: "Work-life imbalance",
        description:
          "Excessive hours and inflexible schedules cause burnout and dissatisfaction.",
        confidence: 83,
      },
    ],
    effects: [
      {
        label: "Knowledge loss",
        description:
          "Departing employees take institutional knowledge and expertise that's hard to replace.",
        confidence: 90,
      },
      {
        label: "Higher costs",
        description:
          "Recruiting, onboarding, and training replacements significantly increases operational expenses.",
        confidence: 87,
      },
      {
        label: "Team morale drop",
        description:
          "Remaining team members face increased workload and uncertainty, lowering overall morale.",
        confidence: 84,
      },
      {
        label: "Productivity decline",
        description:
          "Gaps in staffing and time to onboard new hires reduce overall team output.",
        confidence: 86,
      },
    ],
  },
  default: {
    causes: [
      {
        label: "Root cause A",
        description:
          "A primary contributing factor that sets the chain of events in motion.",
        confidence: 85,
      },
      {
        label: "Root cause B",
        description:
          "A secondary factor that compounds the primary cause and worsens outcomes.",
        confidence: 78,
      },
      {
        label: "Environmental factor",
        description:
          "External conditions that create a favorable environment for the problem.",
        confidence: 72,
      },
      {
        label: "Systemic issue",
        description:
          "Underlying structural or organizational patterns that perpetuate the problem.",
        confidence: 80,
      },
    ],
    effects: [
      {
        label: "Immediate impact",
        description:
          "The most direct and noticeable consequence of the problem occurring.",
        confidence: 90,
      },
      {
        label: "Secondary effect",
        description:
          "A downstream consequence that emerges after the initial impact takes hold.",
        confidence: 82,
      },
      {
        label: "Long-term consequence",
        description:
          "Cumulative effects that manifest over time if the problem remains unaddressed.",
        confidence: 75,
      },
      {
        label: "Cascading failure",
        description:
          "Chain reactions triggered by the problem that affect adjacent systems.",
        confidence: 70,
      },
    ],
  },
};

function matchProblem(problem: string): string {
  const lower = problem.toLowerCase();
  if (lower.includes("traffic") || lower.includes("commute") || lower.includes("road"))
    return "traffic";
  if (
    lower.includes("plant") ||
    lower.includes("dying") ||
    lower.includes("garden") ||
    lower.includes("grow")
  )
    return "plant";
  if (
    lower.includes("employee") ||
    lower.includes("turnover") ||
    lower.includes("quit") ||
    lower.includes("retention")
  )
    return "employee";
  return "default";
}

export function generateMapData(problem: string): CauseMapData {
  const key = matchProblem(problem);
  const data = causeEffectDatabase[key];

  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 600;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;

  const nodes: MapNode[] = [];
  const edges: MapEdge[] = [];

  const problemNode: MapNode = {
    id: "problem-0",
    label: problem.length > 40 ? `${problem.slice(0, 40)}...` : problem,
    type: "problem",
    x: CENTER_X,
    y: CENTER_Y,
    description: `The core problem: "${problem}". This is the central issue from which causes and effects branch out.`,
    confidence: 100,
  };
  nodes.push(problemNode);

  const causeSpacing = CANVAS_HEIGHT / (data.causes.length + 1);
  data.causes.forEach((cause, i) => {
    const node: MapNode = {
      id: `cause-${i}`,
      label: cause.label,
      type: "cause",
      x: CENTER_X - 380,
      y: causeSpacing * (i + 1),
      description: cause.description,
      confidence: cause.confidence,
      expanded: false,
    };
    nodes.push(node);
    edges.push({
      id: `edge-cause-${i}`,
      from: `cause-${i}`,
      to: "problem-0",
    });
  });

  const effectSpacing = CANVAS_HEIGHT / (data.effects.length + 1);
  data.effects.forEach((effect, i) => {
    const node: MapNode = {
      id: `effect-${i}`,
      label: effect.label,
      type: "effect",
      x: CENTER_X + 380,
      y: effectSpacing * (i + 1),
      description: effect.description,
      confidence: effect.confidence,
      expanded: false,
    };
    nodes.push(node);
    edges.push({
      id: `edge-effect-${i}`,
      from: "problem-0",
      to: `effect-${i}`,
    });
  });

  return { problem, nodes, edges };
}
