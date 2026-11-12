import rawModules from "../../data/modules.json";
import { getLightGrid } from "./map";
import { applyEffectAmount } from "./resources";
import { num } from "./science";
import type { EffectTarget, GameState, ModuleContent } from "./types";

const moduleContent = rawModules as unknown as ModuleContent[];

const DAILY_LIFE_SUPPORT: Array<{ alvo: EffectTarget; chave: string }> = [
  { alvo: "energy", chave: "simulation.dailyLifeSupport.energy" },
  { alvo: "food", chave: "simulation.dailyLifeSupport.food" },
  { alvo: "life", chave: "simulation.dailyLifeSupport.life" },
  { alvo: "protection", chave: "simulation.dailyLifeSupport.protection" },
];

export function listModules(): ModuleContent[] {
  return moduleContent;
}

export function getModule(id: string): ModuleContent {
  const module = moduleContent.find((item) => item.id === id);
  if (!module) {
    throw new Error(`Módulo desconhecido: ${id}`);
  }
  return module;
}

export function getModuleCost(module: ModuleContent): number {
  return num(module.custoKey);
}

/**
 * Simulação diária: consumo de suporte de vida + efeitos dos módulos.
 * Os painéis solares escalam com a luz do dia; os restantes módulos
 * usam o multiplicador neutro de science-values.json.
 */
export function simulateDaily(state: GameState): GameState {
  if (state.status !== "running") {
    return state;
  }

  let next = state;

  for (const effect of DAILY_LIFE_SUPPORT) {
    next = applyEffectAmount(next, effect.alvo, num(effect.chave));
  }

  if (next.status !== "running") {
    return next;
  }

  const lightGrid = getLightGrid(next.scenarioId, next.day);

  for (const built of next.modules) {
    const module = getModule(built.moduleId);
    const light = lightGrid[built.y]?.[built.x] ?? num("map.light.shadow");
    const multiplier = module.escalaComLuz ? light : num("rules.unitMultiplier");

    for (const effect of module.efeitosPorDia) {
      next = applyEffectAmount(
        next,
        effect.alvo,
        num(effect.chave) * multiplier,
      );
    }
  }

  return next;
}
