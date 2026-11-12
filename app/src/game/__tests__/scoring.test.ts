import { describe, expect, it } from "vitest";
import { createInitialState } from "../engine";
import {
  computeKnowledgeIndex,
  computeMaxTheoreticalScore,
  computeScore,
} from "../scoring";
import { num } from "../science";
import type { GameState } from "../types";

function perfectState(): GameState {
  const base = createInitialState("A");

  return {
    ...base,
    resources: {
      life: num("rules.resourceMax"),
      energy: num("rules.resourceMax"),
      protection: num("rules.resourceMax"),
      food: num("rules.resourceMax"),
    },
    astronauts: base.astronauts.map((astronaut) => ({
      ...astronaut,
      health: num("rules.astronautStatMax"),
    })),
    knowledge: {
      ...base.knowledge,
      decisionPoints: base.knowledge.maxDecisionPoints,
      miniChallengesCorrect: base.knowledge.miniChallengesTotal,
    },
    scienceMilestones: ["M01", "M02", "M03", "M04", "M05"],
    penaltyPoints: num("scoring.initialPenaltyPoints"),
  };
}

describe("pontuação", () => {
  it("o máximo teórico é exatamente 100", () => {
    expect(computeMaxTheoreticalScore()).toBe(100);
    expect(computeMaxTheoreticalScore()).toBe(num("scoring.max"));
  });

  it("um estado perfeito soma exatamente 100", () => {
    const score = computeScore(perfectState());

    expect(score.astronauts).toBe(num("scoring.weights.astronauts"));
    expect(score.life).toBe(num("scoring.weights.life"));
    expect(score.energy).toBe(num("scoring.weights.energy"));
    expect(score.protection).toBe(num("scoring.weights.protection"));
    expect(score.food).toBe(num("scoring.weights.food"));
    expect(score.science).toBe(num("scoring.weights.science"));
    expect(score.knowledge).toBe(num("scoring.weights.knowledge"));
    expect(score.penaltyPoints).toBe(0);
    expect(score.total).toBe(100);
  });

  it("um estado sem astronautas, recursos, ciência ou conhecimento vale 0", () => {
    const base = createInitialState("A");
    const zero: GameState = {
      ...base,
      resources: {
        life: num("rules.resourceMin"),
        energy: num("rules.resourceMin"),
        protection: num("rules.resourceMin"),
        food: num("rules.resourceMin"),
      },
      astronauts: base.astronauts.map((astronaut) => ({
        ...astronaut,
        health: num("rules.astronautAliveThreshold"),
      })),
      knowledge: {
        ...base.knowledge,
        decisionPoints: num("knowledge.initialDecisionPoints"),
        miniChallengesCorrect: num("knowledge.initialMiniChallengesCorrect"),
      },
      scienceMilestones: [],
      penaltyPoints: num("scoring.initialPenaltyPoints"),
    };

    expect(computeScore(zero).total).toBe(0);
  });

  it("as penalizações descontam do total sem passar abaixo de 0", () => {
    const perfect = perfectState();
    const withPenalty = {
      ...perfect,
      penaltyPoints: num("penalties.energyZero"),
    };

    expect(computeScore(withPenalty).total).toBe(100 + num("penalties.energyZero"));

    const tooMuchPenalty = {
      ...perfect,
      penaltyPoints: num("penalties.energyZero") * 20,
    };

    expect(computeScore(tooMuchPenalty).total).toBe(0);
  });

  it("o Índice de Conhecimento segue a fórmula 20 + 5", () => {
    const base = createInitialState("A");

    expect(
      computeKnowledgeIndex({
        ...base.knowledge,
        decisionPoints: 0,
        miniChallengesCorrect: 0,
      }),
    ).toBe(0);

    expect(
      computeKnowledgeIndex({
        ...base.knowledge,
        decisionPoints: base.knowledge.maxDecisionPoints,
        miniChallengesCorrect: base.knowledge.miniChallengesTotal,
      }),
    ).toBe(num("scoring.weights.knowledge"));

    expect(
      computeKnowledgeIndex({
        ...base.knowledge,
        decisionPoints: base.knowledge.maxDecisionPoints / 2,
        miniChallengesCorrect: 3,
      }),
    ).toBe(13);
  });
});
