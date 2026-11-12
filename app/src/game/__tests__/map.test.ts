import { describe, expect, it } from "vitest";
import { getCell, getLightGrid, getMap, getSunPosition } from "../map";
import { num } from "../science";
import type { ScenarioId } from "../types";

const scenarios: ScenarioId[] = ["A", "B", "C"];

describe("mapa lunar 10×10", () => {
  it("todos os cenários têm as dimensões definidas no JSON", () => {
    for (const scenarioId of scenarios) {
      const map = getMap(scenarioId);
      expect(map.width, scenarioId).toBe(num("map.width"));
      expect(map.height, scenarioId).toBe(num("map.height"));
      expect(map.cells).toHaveLength(map.height);
      expect(map.cells.every((row) => row.length === map.width)).toBe(true);
    }
  });

  it("cada célula tem terreno e elevação vindos do JSON", () => {
    for (const scenarioId of scenarios) {
      const map = getMap(scenarioId);

      for (const row of map.cells) {
        for (const cell of row) {
          expect(cell.elevation, `${scenarioId}:${cell.x},${cell.y}`).toBe(
            num(`map.terrain.${cell.terrain}.elevation`),
          );
        }
      }
    }
  });

  it("getCell rejeita coordenadas fora do mapa", () => {
    const map = getMap("A");
    expect(getCell(map, -1, 0)).toBeUndefined();
    expect(getCell(map, 0, -1)).toBeUndefined();
    expect(getCell(map, map.width, 0)).toBeUndefined();
    expect(getCell(map, 0, map.height)).toBeUndefined();
    expect(getCell(map, 0, 0)?.terrain).toBe("rim");
  });

  it("a luz só assume os valores definidos no JSON", () => {
    const allowed = [num("map.light.shadow"), num("map.light.lit")];

    for (const scenarioId of scenarios) {
      for (const day of [1, 8, 15, 22]) {
        for (const row of getLightGrid(scenarioId, day)) {
          for (const light of row) {
            expect(allowed, `${scenarioId}:${day}`).toContain(light);
          }
        }
      }
    }
  });

  it("PSR e gelo ficam sempre em sombra", () => {
    for (const scenarioId of scenarios) {
      const map = getMap(scenarioId);
      const light = getLightGrid(scenarioId, 1);

      for (const row of map.cells) {
        for (const cell of row) {
          if (cell.terrain === "psr" || cell.terrain === "ice") {
            expect(light[cell.y]?.[cell.x], `${scenarioId}:${cell.x},${cell.y}`).toBe(
              num("map.light.shadow"),
            );
          }
        }
      }
    }
  });

  it("a luz muda ao longo dos dias lunares", () => {
    const dayOne = JSON.stringify(getLightGrid("C", 1));
    const dayFifteen = JSON.stringify(getLightGrid("C", 15));
    expect(dayOne).not.toBe(dayFifteen);
  });

  it("a posição solar usa os limites do JSON", () => {
    const firstDay = num("rules.firstDay");
    const lunarDayDays = num("science.C02.lunarDayDays");
    const maxElevation = num("map.sun.elevationMaxDegrees");
    const minElevation = num("map.sun.elevationMinDegrees");

    expect(getSunPosition(firstDay).elevationDegrees).toBeCloseTo(maxElevation, 5);
    expect(getSunPosition(firstDay + lunarDayDays / 2).elevationDegrees).toBeCloseTo(
      minElevation,
      5,
    );
  });
});
