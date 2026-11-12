import { num } from "./science";
import type {
  CrewStatKey,
  Effect,
  EffectTarget,
  GameState,
  ResourceKey,
  Resources,
} from "./types";

const RESOURCE_KEYS: ResourceKey[] = ["life", "energy", "protection", "food"];
const CREW_STATS: CrewStatKey[] = ["health", "radiation", "fatigue"];

export function isResourceKey(value: string): value is ResourceKey {
  return (RESOURCE_KEYS as string[]).includes(value);
}

export function isCrewTarget(value: string): value is `crew.${CrewStatKey}` {
  return value.startsWith("crew.") && (CREW_STATS as string[]).includes(value.slice("crew.".length));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Limita um recurso à escala abstrata definida em science-values.json. */
export function clampResource(value: number): number {
  return clamp(value, num("rules.resourceMin"), num("rules.resourceMax"));
}

/** Limita saúde, radiação ou fadiga à escala individual. */
export function clampCrewStat(value: number): number {
  return clamp(value, num("rules.astronautStatMin"), num("rules.astronautStatMax"));
}

export function clampResources(resources: Resources): Resources {
  return {
    life: clampResource(resources.life),
    energy: clampResource(resources.energy),
    protection: clampResource(resources.protection),
    food: clampResource(resources.food),
  };
}

/** Vida a zero termina a missão imediatamente. */
export function checkLifeZero(state: GameState): GameState {
  if (state.status !== "running") {
    return state;
  }
  if (state.resources.life <= num("rules.resourceMin")) {
    return { ...state, status: "lost", endReason: "life-zero" };
  }
  return state;
}

/**
 * Aplica uma quantidade a um alvo.
 * Recursos e estatísticas individuais são sempre limitados antes de sair.
 * É a base reutilizada por eventos e pela simulação diária dos módulos.
 */
export function applyEffectAmount(
  state: GameState,
  target: EffectTarget,
  amount: number,
): GameState {
  if (state.status !== "running") {
    return state;
  }

  if (isResourceKey(target)) {
    return checkLifeZero({
      ...state,
      resources: {
        ...state.resources,
        [target]: clampResource(state.resources[target] + amount),
      },
    });
  }

  if (isCrewTarget(target)) {
    const stat = target.slice("crew.".length) as CrewStatKey;
    return checkLifeZero({
      ...state,
      astronauts: state.astronauts.map((astronaut) => ({
        ...astronaut,
        [stat]: clampCrewStat(astronaut[stat] + amount),
      })),
    });
  }

  throw new Error(`Alvo de efeito desconhecido: ${target}`);
}

/**
 * Aplica os efeitos de uma opção/evento.
 * Cada efeito é aplicado na ordem do conteúdo.
 */
export function applyEffects(state: GameState, effects: Effect[]): GameState {
  let next = state;

  for (const effect of effects) {
    next = applyEffectAmount(next, effect.alvo, num(effect.chave));
  }

  return next;
}

/**
 * Penalizações de fim de dia.
 *
 * Regra fechada: cada penalização aplica-se UMA VEZ por dia de jogo.
 * `lastPenaltyDay` garante idempotência mesmo que a função seja chamada
 * duas vezes no mesmo dia.
 */
export function applyDailyPenalties(state: GameState, day = state.day): GameState {
  if (state.status !== "running") {
    return state;
  }
  if (state.lastPenaltyDay === day) {
    return state;
  }

  const min = num("rules.resourceMin");
  let resources: Resources = { ...state.resources };
  let penaltyPoints = state.penaltyPoints;

  if (resources.energy <= min) {
    penaltyPoints += num("penalties.energyZero");
  }

  if (resources.protection <= min) {
    resources = {
      ...resources,
      life: clampResource(resources.life + num("penalties.protectionZeroLife")),
    };
  }

  if (resources.food <= min) {
    resources = {
      ...resources,
      life: clampResource(resources.life + num("penalties.foodZeroLife")),
    };
  }

  return checkLifeZero({
    ...state,
    resources,
    penaltyPoints,
    lastPenaltyDay: day,
  });
}
