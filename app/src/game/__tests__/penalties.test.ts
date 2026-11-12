import { describe, expect, it } from "vitest";
import { createInitialState } from "../engine";
import { applyDailyPenalties } from "../resources";
import { num } from "../science";

describe("penalizações diárias", () => {
  it("energia a zero retira pontos uma vez por dia e acumula no dia seguinte", () => {
    const base = createInitialState("A");
    const state = {
      ...base,
      resources: { ...base.resources, energy: num("rules.resourceMin") },
    };

    const once = applyDailyPenalties(state, 1);
    expect(once.penaltyPoints).toBe(num("penalties.energyZero"));

    const twice = applyDailyPenalties(once, 1);
    expect(twice.penaltyPoints).toBe(num("penalties.energyZero"));

    const nextDay = applyDailyPenalties(twice, 2);
    expect(nextDay.penaltyPoints).toBe(num("penalties.energyZero") * 2);
    expect(nextDay.resources.energy).toBe(num("rules.resourceMin"));
  });

  it("proteção a zero retira vida uma vez por dia", () => {
    const base = createInitialState("A");
    const state = {
      ...base,
      resources: { ...base.resources, protection: num("rules.resourceMin") },
    };

    const once = applyDailyPenalties(state, 1);
    expect(once.resources.life).toBe(
      base.resources.life + num("penalties.protectionZeroLife"),
    );

    const twice = applyDailyPenalties(once, 1);
    expect(twice.resources.life).toBe(once.resources.life);
  });

  it("alimentos a zero retiram vida uma vez por dia", () => {
    const base = createInitialState("A");
    const state = {
      ...base,
      resources: { ...base.resources, food: num("rules.resourceMin") },
    };

    const once = applyDailyPenalties(state, 1);
    expect(once.resources.life).toBe(
      base.resources.life + num("penalties.foodZeroLife"),
    );

    const twice = applyDailyPenalties(once, 1);
    expect(twice.resources.life).toBe(once.resources.life);
  });

  it("vida a zero termina a missão imediatamente", () => {
    const base = createInitialState("A");
    const state = {
      ...base,
      resources: { ...base.resources, life: num("rules.resourceMin") },
    };

    const after = applyDailyPenalties(state, 1);
    expect(after.status).toBe("lost");
    expect(after.endReason).toBe("life-zero");
  });
});
