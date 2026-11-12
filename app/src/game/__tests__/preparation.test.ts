import { describe, expect, it } from "vitest";
import {
  canPlaceModule,
  createPreparationState,
  getModuleAt,
  getValidPlacements,
  placeModule,
  removeModule,
  startMission,
} from "../preparation";
import { getModule, getModuleCost } from "../modules";
import { num } from "../science";

describe("preparação da missão", () => {
  it("começa com o orçamento definido no JSON e sem módulos", () => {
    const prep = createPreparationState("A");
    expect(prep.buildPoints).toBe(num("prep.buildPoints"));
    expect(prep.modules).toHaveLength(0);
  });

  it("há colocações válidas para os módulos de superfície", () => {
    for (const scenarioId of ["A", "B", "C"] as const) {
      const prep = createPreparationState(scenarioId);
      expect(getValidPlacements(prep, "solar-panel").length, scenarioId).toBeGreaterThan(0);
      expect(getValidPlacements(prep, "greenhouse").length, scenarioId).toBeGreaterThan(0);
      expect(getValidPlacements(prep, "shelter").length, scenarioId).toBeGreaterThan(0);
    }
  });

  it("o extrator só é colocável onde há gelo", () => {
    const prepA = createPreparationState("A");
    const prepC = createPreparationState("C");

    expect(getValidPlacements(prepA, "extractor")).toHaveLength(0);
    expect(getValidPlacements(prepC, "extractor").length).toBeGreaterThan(0);
  });

  it("colocar um módulo desconta o custo e ocupa a célula", () => {
    const prep = createPreparationState("A");
    const placement = getValidPlacements(prep, "solar-panel")[0]!;
    const result = placeModule(prep, "solar-panel", placement.x, placement.y);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const module = getModule("solar-panel");
    expect(result.state.buildPoints).toBe(prep.buildPoints - getModuleCost(module));
    expect(getModuleAt(result.state, placement.x, placement.y)?.moduleId).toBe("solar-panel");
  });

  it("não permite ocupar a mesma célula duas vezes", () => {
    const prep = createPreparationState("A");
    const placement = getValidPlacements(prep, "solar-panel")[0]!;
    const first = placeModule(prep, "solar-panel", placement.x, placement.y);
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = placeModule(first.state, "shelter", placement.x, placement.y);
    expect(second.ok).toBe(false);
  });

  it("não permite colocar sem pontos de construção", () => {
    const prep = { ...createPreparationState("A"), buildPoints: 0 };
    const placement = getValidPlacements(createPreparationState("A"), "solar-panel")[0]!;
    const result = placeModule(prep, "solar-panel", placement.x, placement.y);
    expect(result.ok).toBe(false);
  });

  it("não permite colocar o extrator num terreno sem gelo", () => {
    const prep = createPreparationState("A");
    const placement = getValidPlacements(prep, "greenhouse")[0]!;
    const result = canPlaceModule(prep, "extractor", placement.x, placement.y);
    expect(result.ok).toBe(false);
  });

  it("remover um módulo devolve os pontos", () => {
    const prep = createPreparationState("A");
    const placement = getValidPlacements(prep, "solar-panel")[0]!;
    const placed = placeModule(prep, "solar-panel", placement.x, placement.y);
    expect(placed.ok).toBe(true);
    if (!placed.ok) return;

    const removed = removeModule(placed.state, placement.x, placement.y);
    expect(removed.buildPoints).toBe(prep.buildPoints);
    expect(removed.modules).toHaveLength(0);
  });

  it("iniciar a missão transporta os módulos para o estado do jogo", () => {
    const prep = createPreparationState("A");
    const placement = getValidPlacements(prep, "solar-panel")[0]!;
    const placed = placeModule(prep, "solar-panel", placement.x, placement.y);
    expect(placed.ok).toBe(true);
    if (!placed.ok) return;

    const state = startMission(placed.state);
    expect(state.scenarioId).toBe("A");
    expect(state.modules).toEqual(placed.state.modules);
  });
});
