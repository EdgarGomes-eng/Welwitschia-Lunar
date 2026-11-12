import rawEvents from "../../data/events.json";
import { isAlive } from "./astronauts";
import { applyEffectAmount, checkLifeZero } from "./resources";
import { num } from "./science";
import type {
  AstronautState,
  Effect,
  EventContent,
  EventOption,
  GameState,
  ScenarioId,
} from "./types";

const eventList = rawEvents as unknown as EventContent[];

export function listEvents(): EventContent[] {
  return eventList;
}

export function getEvent(id: string): EventContent {
  const event = eventList.find((item) => item.id === id);
  if (!event) {
    throw new Error(`Evento desconhecido: ${id}`);
  }
  return event;
}

/**
 * Retorna os dias de decisão fixados para cada cenário,
 * garantindo entre 8 e 12 eventos por partida.
 */
export function getDecisionDaysList(scenarioId: ScenarioId): number[] {
  switch (scenarioId) {
    case "A":
      return [2, 3, 5, 7, 9, 11, 12, 13]; // 8 eventos
    case "B":
      return [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]; // 10 eventos
    case "C":
      return [2, 4, 6, 8, 11, 13, 16, 18, 21, 23, 26, 28]; // 12 eventos
  }
}

export function isDecisionDay(scenarioId: ScenarioId, day: number): boolean {
  return getDecisionDaysList(scenarioId).includes(day);
}

export function isSpecialistAlive(state: GameState, specialistId: string): boolean {
  const astronaut = state.astronauts.find((item) => item.id === specialistId);
  return Boolean(astronaut && isAlive(astronaut));
}

export function getSpecialist(
  state: GameState,
  specialistId: string,
): AstronautState | undefined {
  return state.astronauts.find((item) => item.id === specialistId);
}

/**
 * Avalia se um evento é elegível para o estado atual.
 * Verifica condições de cooldown, dias, módulos construídos,
 * presença de astronautas no exterior e especialistas.
 */
export function isEventEligible(state: GameState, event: EventContent): boolean {
  // 1. Cooldown: nunca repete dentro do período de arrefecimento
  const lastDay = state.eventCooldowns[event.id];
  if (lastDay !== undefined) {
    const elapsed = state.day - lastDay;
    if (elapsed < event.cooldownDias) {
      return false;
    }
  }

  const cond = event.condicoes;
  if (!cond) {
    return true;
  }

  // 2. Dias mínimo e máximo
  if (cond.minDay !== undefined && state.day < cond.minDay) {
    return false;
  }
  if (cond.maxDay !== undefined && state.day > cond.maxDay) {
    return false;
  }

  // 3. Módulos obrigatórios (ex.: falha de estufa só se existir estufa)
  if (cond.requiresModule !== undefined) {
    const hasModule = state.modules.some(
      (mod) => mod.moduleId === cond.requiresModule,
    );
    if (!hasModule) {
      return false;
    }
  }

  // 4. Módulos proibidos
  if (cond.requiresNoModule !== undefined) {
    const hasModule = state.modules.some(
      (mod) => mod.moduleId === cond.requiresNoModule,
    );
    if (hasModule) {
      return false;
    }
  }

  // 5. Astronautas fora (ex.: tempestade solar só com astronautas fora)
  if (cond.astronautsOutside !== undefined) {
    if (cond.astronautsOutside !== state.astronautsOutside) {
      return false;
    }
  }

  // 6. Especialista vivo obrigatório
  if (cond.specialistAlive !== undefined) {
    if (!isSpecialistAlive(state, cond.specialistAlive)) {
      return false;
    }
  }

  // 7. Limiares de recursos
  if (cond.minResource !== undefined) {
    if (state.resources[cond.minResource.key] < cond.minResource.value) {
      return false;
    }
  }
  if (cond.maxResource !== undefined) {
    if (state.resources[cond.maxResource.key] > cond.maxResource.value) {
      return false;
    }
  }

  return true;
}

export function getEligibleEvents(
  state: GameState,
  pool: EventContent[] = listEvents(),
): EventContent[] {
  return pool.filter((event) => isEventEligible(state, event));
}

/**
 * Seleciona um evento aleatório ponderado a partir dos elegíveis.
 * Usa um RNG determinístico para ser reprodutível.
 */
export function selectEvent(
  state: GameState,
  pool: EventContent[] = listEvents(),
  rng: () => number = Math.random,
): EventContent | null {
  const eligible = getEligibleEvents(state, pool);
  if (eligible.length === 0) {
    return null;
  }

  const totalWeight = eligible.reduce((acc, event) => acc + event.peso, 0);
  let threshold = rng() * totalWeight;

  for (const event of eligible) {
    threshold -= event.peso;
    if (threshold <= 0) {
      return event;
    }
  }

  return eligible[eligible.length - 1] ?? null;
}

/**
 * Calcula os efeitos de uma opção, aplicando o multiplicador de penalização
 * se o especialista responsável pela tarefa estiver morto.
 */
export function computeOptionEffects(
  state: GameState,
  option: EventOption,
): {
  effects: Effect[];
  penalties: Array<{ alvo: string; original: number; penalizado: number }>;
  specialistWarning?: string;
} {
  const deathMultiplier = num("specialists.deathPenaltyMultiplier");
  const penalties: Array<{ alvo: string; original: number; penalizado: number }> = [];
  let specialistWarning: string | undefined;

  const isDead =
    option.specialistId && !isSpecialistAlive(state, option.specialistId);

  if (isDead) {
    const specialist = getSpecialist(state, option.specialistId!);
    specialistWarning = `O/A especialista ${specialist?.nome ?? option.specialistId} (${specialist?.especialidade ?? "área"}) está inativo(a)/falecido(a). O custo e os riscos da tarefa aumentam em 50%.`;
  }

  const effects = option.efeitos.map((effect) => {
    const baseValue = num(effect.chave);
    if (!isDead) {
      return effect;
    }

    // Se o efeito for um custo (valor negativo para vida, energia, comida, proteção, saúde)
    // ou um aumento de radiação/fadiga, amplifica a penalização
    const isCostOrRisk =
      (effect.alvo.startsWith("crew.") &&
        (effect.alvo.endsWith("radiation") || effect.alvo.endsWith("fatigue")) &&
        baseValue > 0) ||
      baseValue < 0;

    if (isCostOrRisk) {
      const penalizedValue = Math.round(baseValue * deathMultiplier);
      penalties.push({
        alvo: effect.alvo,
        original: baseValue,
        penalizado: penalizedValue,
      });
    }

    return effect;
  });

  return { effects, penalties, specialistWarning };
}

/**
 * Função pura da máquina de eventos:
 * estado + evento (decisão) → novo estado
 */
export function resolveEventDecision(
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

  const { penalties, specialistWarning } = computeOptionEffects(state, option);

  let next = state;

  // Aplica cada efeito (com penalizações se especialista estiver morto)
  for (const effect of option.efeitos) {
    let amount = num(effect.chave);
    const penaltyEntry = penalties.find((p) => p.alvo === effect.alvo);
    if (penaltyEntry) {
      amount = penaltyEntry.penalizado;
    }
    next = applyEffectAmount(next, effect.alvo, amount);
  }

  if (next.status !== "running") {
    return next;
  }

  // Se Nzinga (Comando, A1) estiver morta, crises geram pontos de penalização adicionais
  let penaltyPoints = next.penaltyPoints;
  if (!isSpecialistAlive(next, "A1")) {
    penaltyPoints += num("specialists.Nzinga.crisisPenalty");
  }

  const scienceMilestones =
    option.marcoCientifico && !next.scienceMilestones.includes(option.marcoCientifico)
      ? [...next.scienceMilestones, option.marcoCientifico]
      : next.scienceMilestones;

  const decisionPoints = Math.min(
    next.knowledge.maxDecisionPoints,
    next.knowledge.decisionPoints + num("knowledge.pointsPerDecision"),
  );

  const updatedCooldowns = {
    ...next.eventCooldowns,
    [eventId]: next.day,
  };

  const updatedHistory = [
    ...next.eventHistory,
    { day: next.day, eventId, optionId },
  ];

  const resolvedOutcome = {
    eventId,
    optionId,
    titulo: event.titulo,
    opcaoEscolhida: option.texto,
    consequencia: `${option.vantagem} ${option.custo}`,
    porque: event.porque,
    fonte: event.fonte,
    efeitos: option.efeitos,
    penalizacaoEspecialista: specialistWarning,
  };

  return checkLifeZero({
    ...next,
    activeEvent: null,
    resolvedOutcome,
    penaltyPoints,
    eventCooldowns: updatedCooldowns,
    eventHistory: updatedHistory,
    scienceMilestones,
    knowledge: {
      ...next.knowledge,
      decisionPoints,
    },
  });
}
