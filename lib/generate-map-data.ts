import type { CauseMapData, MapNode, MapEdge } from "./cause-map-types";

// ─── Expanded rule-based database (15+ categories) ───────────────────────────

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

  website: {
    causes: [
      {
        label: "Unoptimized assets",
        description:
          "Large, uncompressed images and JS bundles increase download times significantly.",
        confidence: 90,
      },
      {
        label: "No CDN usage",
        description:
          "Serving assets from a single origin server increases latency for distant users.",
        confidence: 85,
      },
      {
        label: "Render-blocking resources",
        description:
          "Synchronous scripts and stylesheets in <head> delay first contentful paint.",
        confidence: 87,
      },
      {
        label: "Poor server response",
        description:
          "Slow database queries or insufficient server capacity increase time-to-first-byte.",
        confidence: 82,
      },
    ],
    effects: [
      {
        label: "High bounce rate",
        description:
          "Visitors leave before the page loads, directly reducing conversions and engagement.",
        confidence: 93,
      },
      {
        label: "Poor SEO ranking",
        description:
          "Search engines penalize slow sites, reducing organic traffic and discoverability.",
        confidence: 88,
      },
      {
        label: "Bad user experience",
        description:
          "Slow load times frustrate users and reduce trust in the product or brand.",
        confidence: 91,
      },
      {
        label: "Revenue loss",
        description:
          "Every second of load delay reduces conversion rates, directly impacting sales.",
        confidence: 85,
      },
    ],
  },

  climate: {
    causes: [
      {
        label: "Greenhouse gas emissions",
        description:
          "CO2, methane, and other gases trap heat in the atmosphere, warming the planet.",
        confidence: 97,
      },
      {
        label: "Deforestation",
        description:
          "Removing forests reduces CO2 absorption and increases surface albedo changes.",
        confidence: 92,
      },
      {
        label: "Industrial pollution",
        description:
          "Manufacturing and energy sectors release vast quantities of warming gases and pollutants.",
        confidence: 90,
      },
      {
        label: "Fossil fuel dependence",
        description:
          "Burning coal, oil, and gas for energy is the primary driver of global emissions.",
        confidence: 95,
      },
    ],
    effects: [
      {
        label: "Rising temperatures",
        description:
          "Global average temperatures increase, disrupting ecosystems and weather patterns.",
        confidence: 98,
      },
      {
        label: "Extreme weather events",
        description:
          "More frequent and intense hurricanes, droughts, and floods affect communities worldwide.",
        confidence: 92,
      },
      {
        label: "Sea level rise",
        description:
          "Melting ice caps and glaciers raise ocean levels, threatening coastal populations.",
        confidence: 90,
      },
      {
        label: "Biodiversity loss",
        description:
          "Habitat disruption and temperature changes drive species extinction at accelerating rates.",
        confidence: 88,
      },
    ],
  },

  mental_health: {
    causes: [
      {
        label: "Chronic stress",
        description:
          "Prolonged exposure to stressors dysregulates the nervous system and impairs cognitive function.",
        confidence: 90,
      },
      {
        label: "Social isolation",
        description:
          "Lack of meaningful social connections increases risk of depression and anxiety.",
        confidence: 87,
      },
      {
        label: "Trauma & adverse events",
        description:
          "Past traumatic experiences can rewire brain chemistry and trigger mental health disorders.",
        confidence: 88,
      },
      {
        label: "Poor sleep habits",
        description:
          "Sleep deprivation disrupts emotional regulation, memory, and stress resilience.",
        confidence: 85,
      },
    ],
    effects: [
      {
        label: "Reduced productivity",
        description:
          "Cognitive impairment and lack of motivation significantly reduce work and life performance.",
        confidence: 88,
      },
      {
        label: "Physical health decline",
        description:
          "Mental health disorders correlate with weakened immunity, cardiovascular risk, and chronic pain.",
        confidence: 85,
      },
      {
        label: "Relationship strain",
        description:
          "Mood disorders and social withdrawal damage personal and professional relationships.",
        confidence: 82,
      },
      {
        label: "Economic burden",
        description:
          "Lost productivity and healthcare costs create substantial economic impact on individuals and societies.",
        confidence: 80,
      },
    ],
  },

  poverty: {
    causes: [
      {
        label: "Lack of education",
        description:
          "Limited access to quality education restricts employment opportunities and income potential.",
        confidence: 90,
      },
      {
        label: "Systemic inequality",
        description:
          "Structural barriers based on race, gender, and class limit economic mobility for marginalized groups.",
        confidence: 88,
      },
      {
        label: "Unemployment",
        description:
          "Lack of stable employment or living wages traps individuals in cycles of economic hardship.",
        confidence: 92,
      },
      {
        label: "Limited healthcare access",
        description:
          "Medical costs create financial ruin for many, perpetuating poverty across generations.",
        confidence: 85,
      },
    ],
    effects: [
      {
        label: "Food insecurity",
        description:
          "Insufficient income leads to inadequate nutrition, stunting development especially in children.",
        confidence: 93,
      },
      {
        label: "Housing instability",
        description:
          "Inability to afford stable housing leads to homelessness or substandard living conditions.",
        confidence: 90,
      },
      {
        label: "Crime increase",
        description:
          "Economic desperation correlates with higher rates of property crime and social unrest.",
        confidence: 82,
      },
      {
        label: "Generational cycle",
        description:
          "Children born into poverty face compounded disadvantages that carry forward across generations.",
        confidence: 87,
      },
    ],
  },

  pollution: {
    causes: [
      {
        label: "Industrial waste",
        description:
          "Factories discharge untreated chemicals and heavy metals into water and air.",
        confidence: 92,
      },
      {
        label: "Vehicle emissions",
        description:
          "Internal combustion engines release NOx, CO, and particulate matter into the atmosphere.",
        confidence: 90,
      },
      {
        label: "Plastic waste",
        description:
          "Single-use plastics accumulate in ecosystems, leaching toxins over centuries of degradation.",
        confidence: 88,
      },
      {
        label: "Agricultural runoff",
        description:
          "Pesticides and fertilizers contaminate waterways, causing algal blooms and dead zones.",
        confidence: 85,
      },
    ],
    effects: [
      {
        label: "Respiratory disease",
        description:
          "Air pollutants cause asthma, lung cancer, and chronic obstructive pulmonary disease.",
        confidence: 93,
      },
      {
        label: "Ecosystem damage",
        description:
          "Toxic contamination destroys habitats and disrupts food chains across land and sea.",
        confidence: 90,
      },
      {
        label: "Water contamination",
        description:
          "Polluted water sources create public health crises and eliminate safe drinking water.",
        confidence: 88,
      },
      {
        label: "Economic cost",
        description:
          "Healthcare, cleanup, and productivity losses from pollution impose trillions in annual costs.",
        confidence: 85,
      },
    ],
  },

  inflation: {
    causes: [
      {
        label: "Excess money supply",
        description:
          "Central banks printing more currency increases money in circulation, reducing purchasing power.",
        confidence: 88,
      },
      {
        label: "Supply chain disruption",
        description:
          "Shortages in goods and services drive prices up when demand exceeds supply.",
        confidence: 90,
      },
      {
        label: "Energy price shocks",
        description:
          "Rising fuel costs cascade into higher prices across nearly every sector of the economy.",
        confidence: 87,
      },
      {
        label: "Wage-price spiral",
        description:
          "Higher wages increase production costs, which businesses pass on as higher prices.",
        confidence: 82,
      },
    ],
    effects: [
      {
        label: "Reduced purchasing power",
        description:
          "Consumers can buy less with the same income, eroding living standards especially for lower earners.",
        confidence: 95,
      },
      {
        label: "Interest rate hikes",
        description:
          "Central banks raise interest rates to control inflation, increasing borrowing costs.",
        confidence: 88,
      },
      {
        label: "Savings erosion",
        description:
          "The real value of savings diminishes over time, discouraging long-term financial planning.",
        confidence: 85,
      },
      {
        label: "Business uncertainty",
        description:
          "Unpredictable costs make it difficult for businesses to plan, invest, and hire.",
        confidence: 82,
      },
    ],
  },

  cybersecurity: {
    causes: [
      {
        label: "Weak passwords",
        description:
          "Simple or reused passwords are easily compromised through brute force or credential stuffing.",
        confidence: 90,
      },
      {
        label: "Phishing attacks",
        description:
          "Social engineering tricks users into revealing credentials or installing malware.",
        confidence: 92,
      },
      {
        label: "Unpatched software",
        description:
          "Known vulnerabilities in outdated software are exploited by attackers within hours of disclosure.",
        confidence: 88,
      },
      {
        label: "Insider threats",
        description:
          "Malicious or negligent employees with system access can cause significant data breaches.",
        confidence: 80,
      },
    ],
    effects: [
      {
        label: "Data breach",
        description:
          "Sensitive customer and business data is exposed, violating privacy and trust.",
        confidence: 93,
      },
      {
        label: "Financial loss",
        description:
          "Ransomware, fraud, and remediation costs can run into millions of dollars.",
        confidence: 90,
      },
      {
        label: "Reputational damage",
        description:
          "Public disclosure of security failures erodes customer trust and brand value.",
        confidence: 88,
      },
      {
        label: "Regulatory penalties",
        description:
          "GDPR, HIPAA, and other regulations impose heavy fines for data protection failures.",
        confidence: 85,
      },
    ],
  },

  education: {
    causes: [
      {
        label: "Underfunded schools",
        description:
          "Lack of government investment means outdated materials, low teacher pay, and poor facilities.",
        confidence: 90,
      },
      {
        label: "Teacher shortage",
        description:
          "Low salaries and high burnout rates drive qualified educators out of the profession.",
        confidence: 88,
      },
      {
        label: "Socioeconomic barriers",
        description:
          "Students from low-income families lack access to tutoring, technology, and nutritious meals.",
        confidence: 92,
      },
      {
        label: "Outdated curriculum",
        description:
          "Education systems slow to adapt fail to prepare students for evolving job markets.",
        confidence: 82,
      },
    ],
    effects: [
      {
        label: "Skills gap",
        description:
          "Graduates lack industry-relevant skills, creating a mismatch between employers' needs and talent supply.",
        confidence: 90,
      },
      {
        label: "Higher dropout rates",
        description:
          "Disengaged or unsupported students abandon education, limiting future opportunities.",
        confidence: 87,
      },
      {
        label: "Increased inequality",
        description:
          "Educational gaps compound socioeconomic inequality across communities and generations.",
        confidence: 88,
      },
      {
        label: "Reduced innovation",
        description:
          "Poorly educated workforces struggle to drive the R&D and entrepreneurship that fuel economic growth.",
        confidence: 82,
      },
    ],
  },

  healthcare: {
    causes: [
      {
        label: "Limited access",
        description:
          "Rural and low-income communities often have inadequate healthcare infrastructure and providers.",
        confidence: 92,
      },
      {
        label: "High treatment costs",
        description:
          "Unaffordable medications and procedures force patients to delay or forgo necessary care.",
        confidence: 90,
      },
      {
        label: "Staff shortages",
        description:
          "Burnout and attrition have left healthcare systems with critical shortages of nurses and doctors.",
        confidence: 88,
      },
      {
        label: "Preventive care gaps",
        description:
          "Lack of focus on prevention leads to more severe and costly illness requiring emergency care.",
        confidence: 85,
      },
    ],
    effects: [
      {
        label: "Delayed diagnoses",
        description:
          "Without timely access to care, conditions worsen and become harder to treat.",
        confidence: 92,
      },
      {
        label: "Increased mortality",
        description:
          "Preventable deaths rise when healthcare access is inequitable or resource-constrained.",
        confidence: 88,
      },
      {
        label: "Financial ruin",
        description:
          "Medical debt is a leading cause of personal bankruptcy in many countries.",
        confidence: 86,
      },
      {
        label: "Overwhelmed emergency services",
        description:
          "Unmanaged chronic conditions lead to emergency hospitalizations, straining hospital capacity.",
        confidence: 83,
      },
    ],
  },

  remote_work: {
    causes: [
      {
        label: "Global pandemic",
        description:
          "COVID-19 forced widespread adoption of remote work practically overnight.",
        confidence: 95,
      },
      {
        label: "Digital infrastructure",
        description:
          "Broadband expansion and cloud tools made remote collaboration feasible at scale.",
        confidence: 88,
      },
      {
        label: "Cost reduction goals",
        description:
          "Companies reduce office overhead by enabling flexible or fully remote workforces.",
        confidence: 85,
      },
      {
        label: "Talent competition",
        description:
          "Offering remote options helps companies attract a global talent pool.",
        confidence: 82,
      },
    ],
    effects: [
      {
        label: "Work-life blur",
        description:
          "Boundaries between professional and personal time erode, increasing stress and burnout.",
        confidence: 88,
      },
      {
        label: "Reduced commute",
        description:
          "Elimination of daily commutes saves time and reduces transportation emissions.",
        confidence: 93,
      },
      {
        label: "Collaboration challenges",
        description:
          "Spontaneous in-person interaction is lost, making team cohesion and creativity harder.",
        confidence: 85,
      },
      {
        label: "Digital fatigue",
        description:
          "Constant video calls and screen time lead to exhaustion and reduced focus.",
        confidence: 87,
      },
    ],
  },

  supply_chain: {
    causes: [
      {
        label: "Just-in-time over-reliance",
        description:
          "Lean inventory strategies leave no buffer when demand spikes or suppliers fail.",
        confidence: 88,
      },
      {
        label: "Geopolitical tensions",
        description:
          "Trade wars and sanctions disrupt established international sourcing relationships.",
        confidence: 85,
      },
      {
        label: "Natural disasters",
        description:
          "Floods, earthquakes, and extreme weather events halt production and logistics infrastructure.",
        confidence: 90,
      },
      {
        label: "Labour shortages",
        description:
          "Insufficient workers at ports, warehouses, and factories create bottlenecks.",
        confidence: 82,
      },
    ],
    effects: [
      {
        label: "Product shortages",
        description:
          "Consumers face empty shelves and long wait times for goods across many categories.",
        confidence: 93,
      },
      {
        label: "Price increases",
        description:
          "Scarcity drives up retail prices, contributing to broader inflationary pressures.",
        confidence: 90,
      },
      {
        label: "Business cash flow issues",
        description:
          "Inconsistent supply forces companies to over-order, tying up capital in inventory.",
        confidence: 85,
      },
      {
        label: "Customer trust erosion",
        description:
          "Repeated delivery failures cause customers to switch to more reliable competitors.",
        confidence: 82,
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

// ─── Keyword matching ─────────────────────────────────────────────────────────

function matchProblem(problem: string): string {
  const lower = problem.toLowerCase();

  if (lower.includes("traffic") || lower.includes("commute") || lower.includes("road") || lower.includes("jam"))
    return "traffic";

  if (lower.includes("plant") || lower.includes("dying") || lower.includes("garden") || lower.includes("grow"))
    return "plant";

  if (lower.includes("employee") || lower.includes("turnover") || lower.includes("quit") || lower.includes("retention") || lower.includes("attrition"))
    return "employee";

  if (lower.includes("website") || lower.includes("web") || lower.includes("loading") || lower.includes("slow site") || lower.includes("performance"))
    return "website";

  if (lower.includes("climate") || lower.includes("global warming") || lower.includes("greenhouse") || lower.includes("carbon"))
    return "climate";

  if (lower.includes("mental health") || lower.includes("depression") || lower.includes("anxiety") || lower.includes("burnout") || lower.includes("stress"))
    return "mental_health";

  if (lower.includes("poverty") || lower.includes("poor") || lower.includes("homeless") || lower.includes("income inequality"))
    return "poverty";

  if (lower.includes("pollution") || lower.includes("waste") || lower.includes("contamination") || lower.includes("toxic"))
    return "pollution";

  if (lower.includes("inflation") || lower.includes("price rise") || lower.includes("cost of living") || lower.includes("deflation"))
    return "inflation";

  if (lower.includes("cyber") || lower.includes("hack") || lower.includes("security breach") || lower.includes("malware") || lower.includes("phishing"))
    return "cybersecurity";

  if (lower.includes("education") || lower.includes("school") || lower.includes("student") || lower.includes("dropout") || lower.includes("literacy"))
    return "education";

  if (lower.includes("health") || lower.includes("hospital") || lower.includes("patient") || lower.includes("medical") || lower.includes("disease"))
    return "healthcare";

  if (lower.includes("remote work") || lower.includes("work from home") || lower.includes("wfh") || lower.includes("hybrid work"))
    return "remote_work";

  if (lower.includes("supply chain") || lower.includes("logistics") || lower.includes("shortage") || lower.includes("inventory"))
    return "supply_chain";

  return "default";
}

// ─── Layout calculator ────────────────────────────────────────────────────────

export function buildMapData(
  problem: string,
  causes: { label: string; description: string; confidence: number }[],
  effects: { label: string; description: string; confidence: number }[]
): CauseMapData {
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

  const causeSpacing = CANVAS_HEIGHT / (causes.length + 1);
  causes.forEach((cause, i) => {
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
    edges.push({ id: `edge-cause-${i}`, from: `cause-${i}`, to: "problem-0" });
  });

  const effectSpacing = CANVAS_HEIGHT / (effects.length + 1);
  effects.forEach((effect, i) => {
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
    edges.push({ id: `edge-effect-${i}`, from: "problem-0", to: `effect-${i}` });
  });

  return { problem, nodes, edges };
}

// ─── Main fallback export ─────────────────────────────────────────────────────

export function generateFallbackMapData(problem: string): CauseMapData {
  const key = matchProblem(problem);
  const data = causeEffectDatabase[key];
  return buildMapData(problem, data.causes, data.effects);
}
