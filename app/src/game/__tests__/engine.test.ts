import { describe, expect, it } from "vitest";
import { advanceDay, createInitialState, resolveEventOption } from "../engine";
import { num } from "../science";

describe("motor", () => {
  it("cria o estado inicial no primeiro dia", () => {
    const state = createInitialState("A");

    expect(state.day).toBe(num("rules.firstDay"));
    expect(state.status).toBe("running");
    expect(state.astronauts).toHaveLength(4);
    expect(state.knowledge.maxDecisionPoints).toBe(state.decisionDays);
  });

  it("avançar um dia normal incrementa o dia", () => {
    const after = advanceDay(createInitialState("A"));
    expect(after.day).toBe(2);
    expect(after.status).toBe("running");
  });

  it("aplicar penalização ao avançar o dia não duplica no mesmo dia", () => {
    const base = createInitialState("A");
    const state = {
      ...base,
      resources: { ...base.resources, energy: num("rules.resourceMin") },
    };

    const after = advanceDay(state);
    expect(after.penaltyPoints).toBe(num("penalties.energyZero"));
    expect(after.day).toBe(2);
  });

  it("o último dia termina com vitória se a vida for maior que zero", () => {
    const base = createInitialState("A");
    const state = { ...base, day: base.missionDays };

    const after = advanceDay(state);
    expect(after.status).toBe("won");
    expect(after.endReason).toBe("mission-complete");
  });

  it("resolver uma opção aplica efeitos, marco científico e ponto de decisão", () => {
    const base = createInitialState("A");
    const after = resolveEventOption(base, "E06", "E06-B");

    expect(after.resources.energy).toBe(base.resources.energy + num("events.E06.B.energy"));
    expect(after.scienceMilestones).toContain("M06");
    expect(after.knowledge.decisionPoints).toBe(
      num("knowledge.initialDecisionPoints") + num("knowledge.pointsPerDecision"),
    );
  });

  it("uma opção que leva a vida a zero termina a missão imediatamente", () => {
    const base = createInitialState("A");
    const state = {
      ...base,
      resources: { ...base.resources, life: 5 },
    };

    const after = resolveEventOption(state, "E04", "E04-B");
    expect(after.resources.life).toBe(num("rules.resourceMin"));
    expect(after.status).toBe("lost");
    expect(after.endReason).toBe("life-zero");
  });

  it("os pontos de decisão não passam do máximo do cenário", () => {
    const base = createInitialState("A");
    const state = {
      ...base,
      knowledge: {
        ...base.knowledge,
        decisionPoints: base.knowledge.maxDecisionPoints,
      },
    };

    const after = resolveEventOption(state, "E06", "E06-B");
    expect(after.knowledge.decisionPoints).toBe(base.knowledge.maxDecisionPoints);
  });
});
