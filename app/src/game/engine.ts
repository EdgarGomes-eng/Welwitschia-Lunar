import rawEvents from "../../data/events.json";
import { createAstronauts } from "./astronauts";
import { simulateDaily } from "./modules";
import { applyDailyPenalties, applyEffects, checkLifeZero } from "./resources";
import {
  applySiteEffects,
  getDecisionDays,
  getMissionDays,
  getScenario,
} from "./scenarios";
import { num } from "./science";
import type { BuiltModule, EventContent, GameState, ScenarioId } from "./types";

const eventContent = rawEvents as unknown as EventContent[];

export function listEvents(): EventContent[] {
  return eventContent;
}

export function getEvent(id: string): EventContent {
  const event = eventContent.find((item) => item.id === id);
  if (!event) {
    throw new Error(`Evento desconhecido: ${id}`);
  }
  return event;
}

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
  };
}

/**
 * Fecha o dia atual, aplica penalizações uma vez e avança para o dia seguinte.
 * Se o último dia terminar com vida > 0, a missão é ganha.
 */
export function advanceDay(state: GameState): GameState {
  if (state.status !== "running") {
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

  return {
    ...afterPenalties,
    day: afterPenalties.day + num("rules.dayStep"),
  };
}

/**
 * Resolve uma opção de evento.
 * A opção pode desbloquear um marco científico e conta como um ponto de decisão.
 */
export function resolveEventOption(
  state: GameState,
  eventId: string,
  optionId: string,
): GameState {
  if (state.status !== "running") {
    return state;
  }

  const event = getEvent(eventId);
  const option = event.opcoes.find((item) => item.id === optionId);
  if (!option) {
    throw new Error(`Opção desconhecida: ${optionId} (evento ${eventId})`);
  }

  const next = applyEffects(state, option.efeitos);
  if (next.status !== "running") {
    return next;
  }

  const scienceMilestones =
    option.marcoCientifico && !next.scienceMilestones.includes(option.marcoCientifico)
      ? [...next.scienceMilestones, option.marcoCientifico]
      : next.scienceMilestones;

  const decisionPoints = Math.min(
    next.knowledge.maxDecisionPoints,
    next.knowledge.decisionPoints + num("knowledge.pointsPerDecision"),
  );

  return checkLifeZero({
    ...next,
    scienceMilestones,
    knowledge: {
      ...next.knowledge,
      decisionPoints,
    },
  });
}
