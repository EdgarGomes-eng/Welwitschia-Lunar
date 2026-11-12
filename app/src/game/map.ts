import rawMaps from "../../data/maps.json";
import { num } from "./science";
import type {
  GameMap,
  MapCell,
  ScenarioId,
  SunPosition,
  TerrainType,
} from "./types";

interface RawMap {
  scenarioId: ScenarioId;
  nome: string;
  legend: Record<string, TerrainType>;
  terrain: string[];
}

const rawMapContent = rawMaps as unknown as RawMap[];
const mapCache = new Map<ScenarioId, GameMap>();

/** Terrenos que o modelo simplificado considera sempre em sombra. */
const ALWAYS_SHADOW_TERRAINS: TerrainType[] = ["psr", "ice"];

/**
 * Constrói a grelha de um cenário a partir de maps.json.
 * A elevação de cada célula vem do tipo de terreno em science-values.json.
 */
export function getMap(scenarioId: ScenarioId): GameMap {
  const cached = mapCache.get(scenarioId);
  if (cached) {
    return cached;
  }

  const raw = rawMapContent.find((item) => item.scenarioId === scenarioId);
  if (!raw) {
    throw new Error(`Mapa desconhecido: ${scenarioId}`);
  }

  const width = num("map.width");
  const height = num("map.height");

  if (raw.terrain.length !== height) {
    throw new Error(`O mapa ${scenarioId} deve ter ${height} linhas.`);
  }

  const cells: MapCell[][] = raw.terrain.map((row, y) => {
    if (row.length !== width) {
      throw new Error(`A linha ${y} do mapa ${scenarioId} deve ter ${width} células.`);
    }

    return [...row].map((code, x) => {
      const terrain = raw.legend[code];
      if (!terrain) {
        throw new Error(`Código de terreno desconhecido no mapa ${scenarioId}: ${code}`);
      }

      return {
        x,
        y,
        terrain,
        elevation: num(`map.terrain.${terrain}.elevation`),
      };
    });
  });

  const map: GameMap = { scenarioId, width, height, cells };
  mapCache.set(scenarioId, map);
  return map;
}

export function getCell(map: GameMap, x: number, y: number): MapCell | undefined {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
    return undefined;
  }
  return map.cells[y]?.[x];
}

/**
 * Posição solar simplificada.
 * No dia 1 a elevação é máxima; ao longo do dia lunar ela oscila
 * entre os limites definidos em science-values.json.
 */
export function getSunPosition(day: number): SunPosition {
  const firstDay = num("rules.firstDay");
  const lunarDayDays = num("science.C02.lunarDayDays");
  const fullTurn = Math.PI * 2;
  const phase = ((day - firstDay) / lunarDayDays) * fullTurn;

  const minElevation = num("map.sun.elevationMinDegrees");
  const maxElevation = num("map.sun.elevationMaxDegrees");
  const midElevation = (minElevation + maxElevation) / 2;
  const amplitude = (maxElevation - minElevation) / 2;

  return {
    azimuthDegrees:
      num("map.sun.azimuthStartDegrees") +
      (phase / fullTurn) * num("map.sun.azimuthSpanDegrees"),
    elevationDegrees: midElevation + amplitude * Math.cos(phase),
  };
}

/**
 * Grelha de luz/sombra para um dia.
 * 0 = sombra; 1 = luz direta. Os valores vêm de science-values.json.
 */
export function getLightGrid(scenarioId: ScenarioId, day: number): number[][] {
  const map = getMap(scenarioId);
  const sun = getSunPosition(day);
  const azimuthRadians = (sun.azimuthDegrees * Math.PI) / 180;
  const elevationRadians = (sun.elevationDegrees * Math.PI) / 180;
  const dx = Math.cos(azimuthRadians);
  const dy = Math.sin(azimuthRadians);
  const tanElevation = Math.tan(elevationRadians);
  const maxSteps = num("map.shadowSteps");
  const tolerance = num("map.shadowHeightTolerance");
  const lit = num("map.light.lit");
  const shadow = num("map.light.shadow");

  return map.cells.map((row) =>
    row.map((cell) => {
      if (ALWAYS_SHADOW_TERRAINS.includes(cell.terrain)) {
        return shadow;
      }

      for (let step = 1; step <= maxSteps; step += 1) {
        const nx = Math.round(cell.x + dx * step);
        const ny = Math.round(cell.y + dy * step);

        if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) {
          break;
        }

        const blocker = map.cells[ny]?.[nx];
        if (!blocker) {
          break;
        }

        if (blocker.elevation > cell.elevation + step * tanElevation + tolerance) {
          return shadow;
        }
      }

      return lit;
    }),
  );
}

export function getLightAt(
  scenarioId: ScenarioId,
  day: number,
  x: number,
  y: number,
): number {
  return getLightGrid(scenarioId, day)[y]?.[x] ?? num("map.light.shadow");
}
