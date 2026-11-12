import { describe, expect, it } from "vitest";
import { countAlive, isAlive } from "../astronauts";
import { createInitialState } from "../engine";
import { applyEffects } from "../resources";
import { num } from "../science";

describe("astronautas vivos", () => {
  it("conta a saúde individual, não uma média", () => {
    const base = createInitialState("A");
    expect(countAlive(base.astronauts)).toBe(base.astronauts.length);

    const withOneDead = base.astronauts.map((astronaut, index) =>
      index === 0 ? { ...astronaut, health: num("rules.astronautAliveThreshold") } : astronaut,
    );

    expect(countAlive(withOneDead)).toBe(base.astronauts.length - 1);
    expect(isAlive(withOneDead[0]!)).toBe(false);
    expect(isAlive(withOneDead[1]!)).toBe(true);
  });

  it("um efeito de saúde pode levar a saúde individual a zero", () => {
    const base = createInitialState("A");
    const lowHealth = {
      ...base,
      astronauts: base.astronauts.map((astronaut) => ({
        ...astronaut,
        health: 6,
      })),
    };

    const after = applyEffects(lowHealth, [
      { alvo: "crew.health", chave: "events.E10.B.health" },
    ]);

    expect(after.astronauts.every((astronaut) => astronaut.health === 0)).toBe(true);
    expect(countAlive(after.astronauts)).toBe(0);
  });
});
