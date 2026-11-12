import { createInitialState } from "./engine";
import { getCell, getLightGrid, getMap } from "./map";
import { getModule, getModuleCost } from "./modules";
import { num } from "./science";
import type {
  BuiltModule,
  GameState,
  PlacementResult,
  PreparationState,
  ScenarioId,
} from "./types";

export function createPreparationState(scenarioId: ScenarioId): PreparationState {
  return {
    scenarioId,
    modules: [],
    buildPoints: num("prep.buildPoints"),
  };
}

export function getModuleAt(
  prep: PreparationState,
  x: number,
  y: number,
): BuiltModule | undefined {
  return prep.modules.find((module) => module.x === x && module.y === y);
}

type PlacementCheck = { ok: true } | { ok: false; motivo: string };

export function canPlaceModule(
  prep: PreparationState,
  moduleId: string,
  x: number,
  y: number,
): PlacementCheck {
  const module = getModule(moduleId);
  const map = getMap(prep.scenarioId);
  const cell = getCell(map, x, y);

  if (!cell) {
    return { ok: false, motivo: "Essa célula está fora do mapa." };
  }

  if (getModuleAt(prep, x, y)) {
    return { ok: false, motivo: "Essa célula já tem um módulo." };
  }

  const cost = getModuleCost(module);
  if (prep.buildPoints < cost) {
    return {
      ok: false,
      motivo: `${module.nome} custa ${cost} pontos e só restam ${prep.buildPoints}.`,
    };
  }

  if (!module.requisitos.terreno.includes(cell.terrain)) {
    return {
      ok: false,
      motivo: `${module.nome} não pode ser colocado neste terreno.`,
    };
  }

  if (module.requisitos.luzMinimaKey) {
    const light = getLightGrid(prep.scenarioId, num("rules.firstDay"))[y]?.[x] ?? num("map.light.shadow");
    const minLight = num(module.requisitos.luzMinimaKey);

    if (light < minLight) {
      return {
        ok: false,
        motivo: `${module.nome} precisa de luz solar direta no dia da preparação.`,
      };
    }
  }

  return { ok: true };
}

export function placeModule(
  prep: PreparationState,
  moduleId: string,
  x: number,
  y: number,
): PlacementResult {
  const check = canPlaceModule(prep, moduleId, x, y);
  if (!check.ok) {
    return check;
  }

  const module = getModule(moduleId);
  return {
    ok: true,
    state: {
      ...prep,
      modules: [...prep.modules, { moduleId, x, y }],
      buildPoints: prep.buildPoints - getModuleCost(module),
    },
  };
}

export function removeModule(prep: PreparationState, x: number, y: number): PreparationState {
  const built = getModuleAt(prep, x, y);
  if (!built) {
    return prep;
  }

  const module = getModule(built.moduleId);
  return {
    ...prep,
    modules: prep.modules.filter((item) => item !== built),
    buildPoints: prep.buildPoints + getModuleCost(module),
  };
}

export function getValidPlacements(
  prep: PreparationState,
  moduleId: string,
): Array<{ x: number; y: number }> {
  const map = getMap(prep.scenarioId);
  const placements: Array<{ x: number; y: number }> = [];

  for (const row of map.cells) {
    for (const cell of row) {
      if (canPlaceModule(prep, moduleId, cell.x, cell.y).ok) {
        placements.push({ x: cell.x, y: cell.y });
      }
    }
  }

  return placements;
}

export function startMission(prep: PreparationState): GameState {
  return createInitialState(prep.scenarioId, prep.modules);
}
