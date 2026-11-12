import { describe, expect, it } from "vitest";
import { createInitialState } from "../engine";
import { estimateMissionSeconds, getDecisionDays, getMissionDays } from "../scenarios";
import { num } from "../science";

describe("cenários e efeitos provisórios dos locais", () => {
  it("A — Borda de Cratera", () => {
    const state = createInitialState("A");

    expect(getMissionDays("A")).toBe(14);
    expect(getDecisionDays("A")).toBe(8);
    expect(state.resources.life).toBe(100);
    expect(state.resources.energy).toBe(85);
    expect(state.resources.protection).toBe(60);
    expect(state.resources.food).toBe(75);
  });

  it("B — Mons Mouton Plateau", () => {
    const state = createInitialState("B");

    expect(getMissionDays("B")).toBe(21);
    expect(getDecisionDays("B")).toBe(12);
    expect(state.resources.life).toBe(100);
    expect(state.resources.energy).toBe(75);
    expect(state.resources.protection).toBe(60);
    expect(state.resources.food).toBe(65);
  });

  it("C — Cratera Amundsen", () => {
    const state = createInitialState("C");

    expect(getMissionDays("C")).toBe(30);
    expect(getDecisionDays("C")).toBe(15);
    expect(state.resources.life).toBe(100);
    expect(state.resources.energy).toBe(60);
    expect(state.resources.protection).toBe(70);
    expect(state.resources.food).toBe(70);
  });

  it("a missão C dura entre 10 e 15 minutos reais", () => {
    const seconds = estimateMissionSeconds("C");
    const minSeconds = num("timing.targetMinutesMin") * num("timing.secondsPerMinute");
    const maxSeconds = num("timing.targetMinutesMax") * num("timing.secondsPerMinute");

    expect(seconds).toBeGreaterThanOrEqual(minSeconds);
    expect(seconds).toBeLessThanOrEqual(maxSeconds);
  });
});
