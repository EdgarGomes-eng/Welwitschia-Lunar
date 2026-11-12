import rawScenarios from "../../data/scenarios.json";
import { clampResources } from "./resources";
import { num } from "./science";
import type { Resources, ScenarioContent, ScenarioId } from "./types";

const scenarioContent = rawScenarios as ScenarioContent[];

export function listScenarios(): ScenarioContent[] {
  return scenarioContent;
}

export function getScenario(id: ScenarioId): ScenarioContent {
  const scenario = scenarioContent.find((item) => item.id === id);
  if (!scenario) {
    throw new Error(`Cenário desconhecido: ${id}`);
  }
  return scenario;
}

export function getMissionDays(id: ScenarioId): number {
  return num(`scenarios.${id}.missionDays`);
}

export function getDecisionDays(id: ScenarioId): number {
  return num(`scenarios.${id}.decisionDays`);
}

/**
 * Efeitos provisórios de cada local (D04).
 * São valores de design, não dados da NASA.
 */
export function getSiteEffects(id: ScenarioId): Resources {
  return {
    life: num(`scenarios.${id}.siteEffect.life`),
    energy: num(`scenarios.${id}.siteEffect.energy`),
    protection: num(`scenarios.${id}.siteEffect.protection`),
    food: num(`scenarios.${id}.siteEffect.food`),
  };
}

export function applySiteEffects(base: Resources, id: ScenarioId): Resources {
  const effect = getSiteEffects(id);
  return clampResources({
    life: base.life + effect.life,
    energy: base.energy + effect.energy,
    protection: base.protection + effect.protection,
    food: base.food + effect.food,
  });
}

/**
 * Estimativa do tempo real de uma missão.
 * Missão C: 15 dias de decisão × 45 s + 15 dias de rotina × 2 s ≈ 11,75 min.
 */
export function estimateMissionSeconds(id: ScenarioId): number {
  const missionDays = getMissionDays(id);
  const decisionDays = getDecisionDays(id);
  const routineDays = Math.max(num("rules.resourceMin"), missionDays - decisionDays);
  return (
    decisionDays * num("timing.secondsPerDecisionDay") +
    routineDays * num("timing.secondsPerRoutineDay")
  );
}
