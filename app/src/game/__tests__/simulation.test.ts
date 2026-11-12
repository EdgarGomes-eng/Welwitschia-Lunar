import { describe, expect, it } from "vitest";
import { advanceDay } from "../engine";
import { listModules } from "../modules";
import {
  createPreparationState,
  getValidPlacements,
  placeModule,
  startMission,
} from "../preparation";
import { listScenarios } from "../scenarios";
import { num } from "../science";
import { computeScore } from "../scoring";
import type { GameState, PreparationState, ScenarioId } from "../types";

const GAMES = 1000;

function mulberry32(seed: number): () => number {
  let value = seed;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomPreparation(
  scenarioId: ScenarioId,
  random: () => number,
): PreparationState {
  let prep = createPreparationState(scenarioId);

  // Algumas partidas começam sem módulos para testar o caso mínimo.
  if (random() < 0.2) {
    return prep;
  }

  const moduleIds = listModules().map((module) => module.id);

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const moduleId = moduleIds[Math.floor(random() * moduleIds.length)]!;
    const placements = getValidPlacements(prep, moduleId);
    if (placements.length === 0) {
      continue;
    }

    const placement = placements[Math.floor(random() * placements.length)]!;
    const result = placeModule(prep, moduleId, placement.x, placement.y);
    if (result.ok) {
      prep = result.state;
    }
  }

  return prep;
}

function assertValidState(state: GameState, context: string): void {
  const fail = (message: string): never => {
    throw new Error(`${context}: ${message}`);
  };

  const resourceMin = num("rules.resourceMin");
  const resourceMax = num("rules.resourceMax");
  const statMin = num("rules.astronautStatMin");
  const statMax = num("rules.astronautStatMax");

  for (const key of ["life", "energy", "protection", "food"] as const) {
    if (!Number.isFinite(state.resources[key])) {
      fail(`recurso ${key} não finito`);
    }
    if (state.resources[key] < resourceMin || state.resources[key] > resourceMax) {
      fail(`recurso ${key} fora de ${resourceMin}–${resourceMax}`);
    }
  }

  for (const astronaut of state.astronauts) {
    for (const key of ["health", "radiation", "fatigue"] as const) {
      if (!Number.isFinite(astronaut[key])) {
        fail(`estatística ${key} de ${astronaut.id} não finita`);
      }
      if (astronaut[key] < statMin || astronaut[key] > statMax) {
        fail(`estatística ${key} de ${astronaut.id} fora de ${statMin}–${statMax}`);
      }
    }
  }

  if (state.day < num("rules.firstDay") || state.day > state.missionDays) {
    fail(`dia ${state.day} fora da missão`);
  }

  if (!["running", "won", "lost"].includes(state.status)) {
    fail(`estado ${state.status} inválido`);
  }

  const occupied = new Set<string>();
  for (const module of state.modules) {
    if (module.x < 0 || module.x >= num("map.width")) {
      fail(`módulo ${module.moduleId} com x inválido`);
    }
    if (module.y < 0 || module.y >= num("map.height")) {
      fail(`módulo ${module.moduleId} com y inválido`);
    }

    const cell = `${module.x},${module.y}`;
    if (occupied.has(cell)) {
      fail(`dois módulos na célula ${cell}`);
    }
    occupied.add(cell);
  }

  const score = computeScore(state);
  if (score.total < 0 || score.total > num("scoring.max")) {
    fail(`pontuação ${score.total} fora de 0–${num("scoring.max")}`);
  }

  for (const value of Object.values(score)) {
    if (!Number.isFinite(value)) {
      fail("pontuação não finita");
    }
  }
}

describe("1000 partidas aleatórias", () => {
  it("nenhum cenário é impossível de preparar", () => {
    for (const scenario of listScenarios()) {
      const prep = createPreparationState(scenario.id);
      expect(getValidPlacements(prep, "solar-panel").length, scenario.id).toBeGreaterThan(0);
      expect(getValidPlacements(prep, "greenhouse").length, scenario.id).toBeGreaterThan(0);
      expect(getValidPlacements(prep, "shelter").length, scenario.id).toBeGreaterThan(0);
    }
  });

  it("não produzem estados inválidos e têm distribuição de pontuação", () => {
    const random = mulberry32(20261112);
    const scenarios = listScenarios();
    const scores: number[] = [];
    const outcomes = { running: 0, won: 0, lost: 0 };

    for (let game = 0; game < GAMES; game += 1) {
      const scenario = scenarios[Math.floor(random() * scenarios.length)]!;
      const prep = randomPreparation(scenario.id, random);
      let state = startMission(prep);

      assertValidState(state, `jogo ${game} início`);

      let guard = 0;
      while (state.status === "running" && guard <= state.missionDays) {
        state = advanceDay(state);
        assertValidState(state, `jogo ${game} dia ${state.day}`);
        guard += 1;
      }

      expect(state.status, `jogo ${game}`).not.toBe("running");
      outcomes[state.status] += 1;
      scores.push(computeScore(state).total);
    }

    expect(scores).toHaveLength(GAMES);
    expect(new Set(scores).size).toBeGreaterThan(1);
    expect(Math.min(...scores)).toBeLessThan(Math.max(...scores));
    expect(Math.max(...scores)).toBeLessThan(num("scoring.max"));
    expect(outcomes.won).toBeGreaterThan(0);
    expect(outcomes.lost).toBeGreaterThan(0);
  }, 30000);

  it("uma missão C sem módulos não é trivial", () => {
    let state = startMission(createPreparationState("C"));
    let guard = 0;

    while (state.status === "running" && guard <= state.missionDays) {
      state = advanceDay(state);
      guard += 1;
    }

    expect(state.status).toBe("lost");
  });
});
