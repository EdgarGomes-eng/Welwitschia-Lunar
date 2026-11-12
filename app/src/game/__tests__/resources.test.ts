import { describe, expect, it } from "vitest";
import { createInitialState } from "../engine";
import { applyEffects, clampCrewStat, clampResource } from "../resources";
import { num } from "../science";

describe("limites 0–100", () => {
  it("limita recursos ao mínimo e ao máximo configurados", () => {
    expect(clampResource(-50)).toBe(num("rules.resourceMin"));
    expect(clampResource(500)).toBe(num("rules.resourceMax"));
    expect(clampResource(42)).toBe(42);
  });

  it("limita saúde, radiação e fadiga", () => {
    expect(clampCrewStat(-10)).toBe(num("rules.astronautStatMin"));
    expect(clampCrewStat(150)).toBe(num("rules.astronautStatMax"));
    expect(clampCrewStat(37)).toBe(37);
  });

  it("aplica efeitos e limita o resultado", () => {
    const base = createInitialState("A");
    const lowLife = {
      ...base,
      resources: { ...base.resources, life: 5 },
    };

    const after = applyEffects(lowLife, [
      { alvo: "life", chave: "events.E04.B.life" },
    ]);

    expect(after.resources.life).toBe(num("rules.resourceMin"));
    expect(after.status).toBe("lost");
    expect(after.endReason).toBe("life-zero");
  });
});
