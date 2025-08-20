import { EstimationConfig } from '../types';

export const defaultConfig: EstimationConfig = {
  criteria: [
    {
      id: "dep",
      name: "Dependencies & Coordination",
      weight: 0.15,
      value: 3,
      levels: {
        "1": "None",
        "2": "1 minor dependency",
        "3": "1–2 in-progress dependencies",
        "4": "3+ dependencies or 1 cross-team",
        "5": "Multiple blockers, multi-team"
      }
    },
    {
      id: "know",
      name: "Knowledge & Repetition",
      weight: 0.05,
      value: 3,
      levels: {
        "1": "Expert, done often",
        "2": "Familiar, minor gaps",
        "3": "Moderate familiarity",
        "4": "Limited familiarity",
        "5": "First time, steep learning"
      }
    },
    {
      id: "scope",
      name: "Scope of Change",
      weight: 0.20,
      value: 3,
      levels: {
        "1": "Isolated code-only change in a single module of one service.",
        "2": "Single-service change with multiple modules.",
        "3": "Coordinated changes across multiple internal services with backward compatibility.",
        "4": "Breaking changes requiring multiple services/projects in sync.",
        "5": "Large-scale spanning multiple systems and external integrations."
      }
    },
    {
      id: "cx",
      name: "Technical Complexity",
      weight: 0.20,
      value: 3,
      levels: {
        "1": "Pure code logic change (no config/DB).",
        "2": "Minor config change or additive, backward-compatible DB update.",
        "3": "Moderate DB changes or multi-layer refactoring with migrations.",
        "4": "Breaking DB/API changes requiring migration/backfill or coordinated release.",
        "5": "High-risk systemic changes with data transformation, infra impact, or external contract break."
      }
    },
    {
      id: "biz",
      name: "Business & Operational Impact",
      weight: 0.05,
      value: 3,
      levels: {
        "1": "Internal, low impact",
        "2": "Low-value improvement",
        "3": "Useful but not critical",
        "4": "High-value or visible",
        "5": "Mission-critical/regulatory"
      }
    },
    {
      id: "risk",
      name: "Risk & Uncertainty",
      weight: 0.10,
      value: 3,
      levels: {
        "1": "No risk",
        "2": "Minor known risks",
        "3": "Moderate known risks",
        "4": "High unknowns",
        "5": "Critical business/regulatory risk"
      }
    },
    {
      id: "dur",
      name: "Duration & Effort",
      weight: 0.10,
      value: 3,
      levels: {
        "1": "< 0.5 day, no tests",
        "2": "0.5–1 day, unit tests",
        "3": "1–3 days, unit + integration",
        "4": "3–5 days, multi-layer tests",
        "5": "> 5 days, extensive QA"
      }
    },
    {
      id: "rnd",
      name: "Innovation / R&D",
      weight: 0.15,
      value: 3,
      levels: {
        "1": "No innovation",
        "2": "Small improvement",
        "3": "Some experimentation",
        "4": "New approach",
        "5": "First-of-its-kind, heavy R&D"
      }
    }
  ],
  thresholds: [
    { max: 1.5, sp: 1 },
    { max: 2.0, sp: 2 },
    { max: 2.5, sp: 3 },
    { max: 3.5, sp: 5 },
    { max: 4.0, sp: 8 },
    { max: 4.5, sp: 13 },
    { max: 5.0, sp: 21 }
  ]
}
