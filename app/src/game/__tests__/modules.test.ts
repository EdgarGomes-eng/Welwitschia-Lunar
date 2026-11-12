import { describe, expect, it } from "vitest";
import { advanceDay, createInitialState } from "../engine";
import { getLightGrid } from "../map";
import { getModule } from "../modules";
import { createPreparationState, getValidPlacements, placeModule, startMission } from "../preparation";
import { num } from "../science";
import type { BuiltModule } from "../types";

function buildAndStart(
  scenarioId: "A" | "B" | "C",
  moduleId: string,
): { state: ReturnType<typeof createInitialState>; built: BuiltModule } {
  const prep = createPreparationState(scenarioId);
  const placement = getValidPlacements(prep, moduleId)[0];
  if (!placement) {
    throw new Error(`Sem colocação válida para ${moduleId} em ${scenarioId}`);
  }

  const result = placeModule(prep, moduleId, placement.x, placement.y);
  if (!result.ok) {
    throw new Error(result.motivo);
  }

  return {
    state: startMission(result.state),
    built: { moduleId, x: placement.x, y: placement.y },
  };
}

describe("simulação diária dos módulos", () => {
  it("sem módulos, aplica o consumo de suporte de vida", () => {
    const base = createInitialState("A");
    const after = advanceDay(base);

    expect(after.resources.energy).toBe(
      base.resources.energy + num("simulation.dailyLifeSupport.energy"),
    );
    expect(after.resources.food).toBe(
      base.resources.food + num("simulation.dailyLifeSupport.food"),
    );
    expect(after.resources.life).toBe(
      base.resources.life + num("simulation.dailyLifeSupport.life"),
    );
    expect(after.resources.protection).toBe(
      base.resources.protection + num("simulation.dailyLifeSupport.protection"),
    );
  });

  it("o painel solar produz energia conforme a luz do dia", () => {
    const { state, built } = buildAndStart("A", "solar-panel");
    const light = getLightGrid("A", state.day)[built.y]?.[built.x] ?? num("map.light.shadow");
    const after = advanceDay(state);

    expect(after.resources.energy).toBe(
      state.resources.energy +
        num("simulation.dailyLifeSupport.energy") +
        num(getModule("solar-panel").efeitosPorDia[0]!.chave) * light,
    );
  });

  it("um painel solar numa célula sempre em sombra não produz energia", () => {
    const state = createInitialState("C", [{ moduleId: "solar-panel", x: 6, y: 4 }]);
    const after = advanceDay(state);

    expect(after.resources.energy).toBe(
      state.resources.energy + num("simulation.dailyLifeSupport.energy"),
    );
  });

  it("a estufa produz alimentos e consome energia e vida", () => {
    const { state } = buildAndStart("A", "greenhouse");
    const after = advanceDay(state);

    expect(after.resources.food).toBe(
      state.resources.food +
        num("simulation.dailyLifeSupport.food") +
        num("modules.greenhouse.foodPerDay"),
    );
    expect(after.resources.energy).toBe(
      state.resources.energy +
        num("simulation.dailyLifeSupport.energy") +
        num("modules.greenhouse.energyPerDay"),
    );
    expect(after.resources.life).toBe(
      state.resources.life +
        num("simulation.dailyLifeSupport.life") +
        num("modules.greenhouse.lifePerDay"),
    );
  });

  it("o extrator produz vida e consome energia", () => {
    const { state } = buildAndStart("C", "extractor");
    const lowLife = {
      ...state,
      resources: { ...state.resources, life: 50 },
    };
    const after = advanceDay(lowLife);

    expect(after.resources.life).toBe(
      lowLife.resources.life +
        num("simulation.dailyLifeSupport.life") +
        num("modules.extractor.lifePerDay"),
    );
    expect(after.resources.energy).toBe(
      lowLife.resources.energy +
        num("simulation.dailyLifeSupport.energy") +
        num("modules.extractor.energyPerDay"),
    );
  });

  it("vida a zero durante a simulação termina a missão imediatamente", () => {
    const base = createInitialState("A");
    const state = {
      ...base,
      resources: { ...base.resources, life: 1 },
    };

    const after = advanceDay(state);
    expect(after.resources.life).toBe(num("rules.resourceMin"));
    expect(after.status).toBe("lost");
    expect(after.endReason).toBe("life-zero");
  });
});
