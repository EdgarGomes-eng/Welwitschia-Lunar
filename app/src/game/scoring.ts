import { countAlive, listAstronautContent } from "./astronauts";
import { num } from "./science";
import type { GameState, KnowledgeState, ScoreBreakdown } from "./types";

function clampRatio(value: number): number {
  return Math.min(num("knowledge.ratioMax"), Math.max(num("knowledge.ratioMin"), value));
}

/**
 * Índice de Conhecimento:
 * round(20 × decisões/máx + 5 × mini-desafios certos/total).
 * O pós-teste é opcional e não pontua.
 */
export function computeKnowledgeIndex(knowledge: KnowledgeState): number {
  const decisionRatio =
    knowledge.maxDecisionPoints > num("knowledge.ratioMin")
      ? knowledge.decisionPoints / knowledge.maxDecisionPoints
      : num("knowledge.ratioMin");

  const miniRatio =
    knowledge.miniChallengesTotal > num("knowledge.ratioMin")
      ? knowledge.miniChallengesCorrect / knowledge.miniChallengesTotal
      : num("knowledge.ratioMin");

  const raw =
    num("knowledge.decisionWeight") * clampRatio(decisionRatio) +
    num("knowledge.miniChallengeWeight") * clampRatio(miniRatio);

  return Math.min(
    num("scoring.weights.knowledge"),
    Math.max(num("knowledge.ratioMin"), Math.round(raw)),
  );
}

function resourceScore(value: number, weightKey: string): number {
  const ratio = value / num("rules.resourceMax");
  return Math.round(clampRatio(ratio) * num(weightKey));
}

/** Pontuação total, sempre limitada a 0–100. */
export function computeScore(state: GameState): ScoreBreakdown {
  const astronauts = countAlive(state.astronauts) * num("scoring.astronautAlivePoints");
  const life = resourceScore(state.resources.life, "scoring.weights.life");
  const energy = resourceScore(state.resources.energy, "scoring.weights.energy");
  const protection = resourceScore(state.resources.protection, "scoring.weights.protection");
  const food = resourceScore(state.resources.food, "scoring.weights.food");

  const science = Math.min(
    num("scoring.weights.science"),
    state.scienceMilestones.length * num("scoring.scienceMilestonePoints"),
  );
  const knowledge = computeKnowledgeIndex(state.knowledge);

  const subtotal =
    astronauts + life + energy + protection + food + science + knowledge + state.penaltyPoints;

  const total = Math.min(
    num("scoring.max"),
    Math.max(num("rules.resourceMin"), subtotal),
  );

  return {
    astronauts,
    life,
    energy,
    protection,
    food,
    science,
    knowledge,
    penaltyPoints: state.penaltyPoints,
    total,
  };
}

/**
 * Máximo teórico: 4 astronautas vivos × 5 + 15 + 10 + 10 + 10 + 10 + 25 = 100.
 * É usado pelo teste que prova que a pontuação máxima é exatamente 100.
 */
export function computeMaxTheoreticalScore(): number {
  const astronautMax =
    listAstronautContent().length * num("scoring.astronautAlivePoints");

  return (
    astronautMax +
    num("scoring.weights.life") +
    num("scoring.weights.energy") +
    num("scoring.weights.protection") +
    num("scoring.weights.food") +
    num("scoring.weights.science") +
    num("scoring.weights.knowledge")
  );
}
