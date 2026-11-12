import { createAstronauts } from "./astronauts";
import {
  getDecisionDaysList,
  getEvent,
  isDecisionDay,
  listEvents,
  resolveEventDecision,
  selectEvent,
} from "./events";
import { simulateDaily } from "./modules";
import { applyDailyPenalties } from "./resources";
import {
  applySiteEffects,
  getDecisionDays,
  getMissionDays,
  getScenario,
} from "./scenarios";
import { num } from "./science";
import type { BuiltModule, EventContent, GameState, ScenarioId } from "./types";

export {
  getDecisionDaysList,
  getEvent,
  isDecisionDay,
  listEvents,
  resolveEventDecision,
  selectEvent,
};

/**
 * Estado inicial de uma missão.
 * Todos os valores vêm de science-values.json; o cenário só contribui
 * com os seus efeitos provisórios de local.
 */
export function createInitialState(
  scenarioId: ScenarioId,
  modules: BuiltModule[] = [],
): GameState {
  getScenario(scenarioId);

  const resources = applySiteEffects(
    {
      life: num("resources.initial.life"),
      energy: num("resources.initial.energy"),
      protection: num("resources.initial.protection"),
      food: num("resources.initial.food"),
    },
    scenarioId,
  );

  const decisionDays = getDecisionDays(scenarioId);

  return {
    scenarioId,
    day: num("rules.firstDay"),
    missionDays: getMissionDays(scenarioId),
    decisionDays,
    resources,
    astronauts: createAstronauts(),
    modules,
    knowledge: {
      decisionPoints: num("knowledge.initialDecisionPoints"),
      maxDecisionPoints: decisionDays,
      miniChallengesCorrect: num("knowledge.initialMiniChallengesCorrect"),
      miniChallengesTotal: num("knowledge.miniChallengesTotal"),
    },
    scienceMilestones: [],
    penaltyPoints: num("scoring.initialPenaltyPoints"),
    lastPenaltyDay: null,
    status: "running",
    activeEvent: null,
    resolvedOutcome: null,
    eventCooldowns: {},
    eventHistory: [],
    astronautsOutside: false,
  };
}

/**
 * Fecha o dia atual, aplica penalizações uma vez e avança para o dia seguinte.
 * Se o dia seguinte for um dia de decisão, sorteia um evento elegível.
 * Se o último dia terminar com vida > 0, a missão é ganha.
 */
export function advanceDay(
  state: GameState,
  rng: () => number = Math.random,
): GameState {
  if (state.status !== "running") {
    return state;
  }

  // Se houver um evento ativo não resolvido, a simulação não avança
  if (state.activeEvent) {
    return state;
  }

  const afterSimulation = simulateDaily(state);
  if (afterSimulation.status !== "running") {
    return afterSimulation;
  }

  const afterPenalties = applyDailyPenalties(afterSimulation);
  if (afterPenalties.status !== "running") {
    return afterPenalties;
  }

  if (afterPenalties.day >= afterPenalties.missionDays) {
    return {
      ...afterPenalties,
      status: "won",
      endReason: "mission-complete",
    };
  }

  const nextDay = afterPenalties.day + num("rules.dayStep");
  const tempState: GameState = {
    ...afterPenalties,
    day: nextDay,
    resolvedOutcome: null,
  };

  let activeEvent: EventContent | null = null;
  if (isDecisionDay(state.scenarioId, nextDay)) {
    activeEvent = selectEvent(tempState, listEvents(), rng);
  }

  return {
    ...tempState,
    activeEvent,
  };
}

/**
 * Resolve uma opção de evento delegando na máquina de eventos pura.
 */
export function resolveEventOption(
  state: GameState,
  eventId: string,
  optionId: string,
): GameState {
  return resolveEventDecision(state, eventId, optionId);
}
