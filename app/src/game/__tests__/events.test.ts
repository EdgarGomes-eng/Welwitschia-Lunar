import { describe, expect, it } from "vitest";
import { createAstronauts } from "../astronauts";
import {
  computeOptionEffects,
  getEligibleEvents,
  getEvent,
  isDecisionDay,
  isEventEligible,
  isSpecialistAlive,
  listEvents,
  resolveEventDecision,
} from "../events";
import { createInitialState } from "../engine";
import { num } from "../science";
import type { GameState } from "../types";

function mockState(overrides: Partial<GameState> = {}): GameState {
  const base = createInitialState("A");
  return {
    ...base,
    ...overrides,
  };
}

describe("Máquina de Eventos (Função Pura e Elegibilidade)", () => {
  it("carrega todos os 12 eventos com os campos obrigatórios da Fase 2b", () => {
    const events = listEvents();
    expect(events.length).toBe(12);

    for (const event of events) {
      expect(event.id).toMatch(/^E\d{2}$/);
      expect(event.titulo).toBeTruthy();
      expect(event.pista).toBeTruthy();
      expect(event.descricao).toBeTruthy();
      expect(event.porque).toBeTruthy();
      // "porquê" deve ter no máximo 2 frases
      const sentences = event.porque
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      expect(sentences.length).toBeLessThanOrEqual(2);
      expect(event.fonte).toMatch(/^S\d+$/);
      expect(event.peso).toBeGreaterThan(0);
      expect(event.cooldownDias).toBeGreaterThan(0);
      expect(event.opcoes.length).toBeGreaterThanOrEqual(2);

      for (const opt of event.opcoes) {
        expect(opt.vantagem).toBeTruthy();
        expect(opt.custo).toBeTruthy();
        expect(opt.efeitos.length).toBeGreaterThan(0);
      }
    }
  });

  describe("Condições de Elegibilidade", () => {
    it("E01 (tempestade solar) só é elegível se astronautas estiverem no exterior", () => {
      const e01 = getEvent("E01");
      const stateInside = mockState({ day: 3, astronautsOutside: false });
      expect(isEventEligible(stateInside, e01)).toBe(false);

      const stateOutside = mockState({ day: 3, astronautsOutside: true });
      expect(isEventEligible(stateOutside, e01)).toBe(true);
    });

    it("E05 (estufa com stress) só é elegível se existir estufa construída", () => {
      const e05 = getEvent("E05");
      const stateNoGreenhouse = mockState({ day: 3, modules: [] });
      expect(isEventEligible(stateNoGreenhouse, e05)).toBe(false);

      const stateWithGreenhouse = mockState({
        day: 3,
        modules: [{ moduleId: "greenhouse", x: 1, y: 1 }],
      });
      expect(isEventEligible(stateWithGreenhouse, e05)).toBe(true);
    });

    it("E02 e E03 só são elegíveis se existir painel solar", () => {
      const e02 = getEvent("E02");
      const e03 = getEvent("E03");
      const stateNoSolar = mockState({ day: 3, modules: [] });
      expect(isEventEligible(stateNoSolar, e02)).toBe(false);
      expect(isEventEligible(stateNoSolar, e03)).toBe(false);

      const stateWithSolar = mockState({
        day: 3,
        modules: [{ moduleId: "solar-panel", x: 0, y: 0 }],
      });
      expect(isEventEligible(stateWithSolar, e02)).toBe(true);
      expect(isEventEligible(stateWithSolar, e03)).toBe(true);
    });

    it("E06 (extrator) só é elegível se existir extrator de água construído", () => {
      const e06 = getEvent("E06");
      const stateNoExtractor = mockState({ day: 3, modules: [] });
      expect(isEventEligible(stateNoExtractor, e06)).toBe(false);

      const stateWithExtractor = mockState({
        day: 3,
        modules: [{ moduleId: "water-extractor", x: 2, y: 2 }],
      });
      expect(isEventEligible(stateWithExtractor, e06)).toBe(true);
    });
  });

  describe("Cooldown e Não Repetição", () => {
    it("evento nunca repete dentro do período de cooldown", () => {
      const e02 = getEvent("E02"); // cooldown = 4 dias
      const state = mockState({
        day: 5,
        modules: [{ moduleId: "solar-panel", x: 0, y: 0 }],
        eventCooldowns: { E02: 3 }, // Ocorreu no dia 3 (decorreram 2 dias < 4)
      });

      expect(isEventEligible(state, e02)).toBe(false);

      // No dia 7 (decorreram 4 dias >= 4), volta a ser elegível
      const stateAfterCooldown = { ...state, day: 7 };
      expect(isEventEligible(stateAfterCooldown, e02)).toBe(true);
    });

    it("seleção com pool determinístico respeita cooldowns e histórico", () => {
      const state = mockState({
        day: 4,
        modules: [{ moduleId: "solar-panel", x: 0, y: 0 }],
        eventCooldowns: {
          E02: 3,
          E03: 3,
          E07: 3,
          E08: 3,
          E09: 3,
          E10: 3,
          E11: 3,
          E12: 3,
        },
      });

      const eligible = getEligibleEvents(state);
      for (const ev of eligible) {
        if (state.eventCooldowns[ev.id] !== undefined) {
          expect(state.day - state.eventCooldowns[ev.id]!).toBeGreaterThanOrEqual(
            ev.cooldownDias,
          );
        }
      }
    });
  });

  describe("Efeitos da Morte de Especialistas nas Tarefas", () => {
    it("se Ngola (A2 / Engenharia) morrer, reparação custa 50% mais energia", () => {
      const e02 = getEvent("E02");
      const optReparar = e02.opcoes.find((o) => o.id === "E02-A")!;

      const aliveCrew = createAstronauts();
      const stateAlive = mockState({ astronauts: aliveCrew });
      const effectsAlive = computeOptionEffects(stateAlive, optReparar);
      expect(effectsAlive.penalties).toHaveLength(0);

      // Mata Ngola (A2)
      const deadNgolaCrew = aliveCrew.map((a) =>
        a.id === "A2" ? { ...a, health: 0 } : a,
      );
      const stateNgolaDead = mockState({ astronauts: deadNgolaCrew });
      expect(isSpecialistAlive(stateNgolaDead, "A2")).toBe(false);

      const effectsDead = computeOptionEffects(stateNgolaDead, optReparar);
      expect(effectsDead.penalties.length).toBeGreaterThan(0);
      expect(effectsDead.specialistWarning).toContain("Ngola");

      const fatiguePenalty = effectsDead.penalties.find((p) => p.alvo === "crew.fatigue");
      expect(fatiguePenalty).toBeDefined();
      expect(fatiguePenalty!.penalizado).toBe(
        Math.round(fatiguePenalty!.original * num("specialists.deathPenaltyMultiplier")),
      );
    });

    it("se Kudi (A3 / Medicina) morrer, radiação ou risco biológico é agravado em 50%", () => {
      const e01 = getEvent("E01");
      const optB = e01.opcoes.find((o) => o.id === "E01-B")!;

      const aliveCrew = createAstronauts();
      const deadKudiCrew = aliveCrew.map((a) =>
        a.id === "A3" ? { ...a, health: 0 } : a,
      );
      const stateKudiDead = mockState({ astronauts: deadKudiCrew });
      expect(isSpecialistAlive(stateKudiDead, "A3")).toBe(false);

      const effects = computeOptionEffects(stateKudiDead, optB);
      expect(effects.specialistWarning).toContain("Kudi");
      const radPenalty = effects.penalties.find((p) => p.alvo === "crew.radiation");
      expect(radPenalty).toBeDefined();
      expect(radPenalty!.penalizado).toBe(
        Math.round(radPenalty!.original * num("specialists.deathPenaltyMultiplier")),
      );
    });

    it("se Nzinga (A1 / Comando) morrer, resolver crises acrescenta pontos de penalização", () => {
      const aliveCrew = createAstronauts();
      const deadNzingaCrew = aliveCrew.map((a) =>
        a.id === "A1" ? { ...a, health: 0 } : a,
      );

      const stateAlive = mockState({ astronauts: aliveCrew });
      const afterAlive = resolveEventDecision(stateAlive, "E07", "E07-A");

      const stateDead = mockState({ astronauts: deadNzingaCrew });
      const afterDead = resolveEventDecision(stateDead, "E07", "E07-A");

      expect(afterDead.penaltyPoints).toBe(
        afterAlive.penaltyPoints + num("specialists.Nzinga.crisisPenalty"),
      );
    });
  });

  describe("Função Pura: estado + evento → novo estado", () => {
    it("resolveEventDecision não muta o estado de entrada e retorna novo estado consistente", () => {
      const base = mockState({ day: 4 });
      const deepCopy = JSON.parse(JSON.stringify(base));

      const next = resolveEventDecision(base, "E07", "E07-A");

      // Estado original inalterado
      expect(base).toEqual(deepCopy);

      // Novo estado atualizado
      expect(next).not.toBe(base);
      expect(next.eventCooldowns["E07"]).toBe(4);
      expect(next.eventHistory).toHaveLength(1);
      expect(next.eventHistory[0]).toEqual({
        day: 4,
        eventId: "E07",
        optionId: "E07-A",
      });
      expect(next.resolvedOutcome).toBeDefined();
      expect(next.resolvedOutcome?.eventId).toBe("E07");
      expect(next.resolvedOutcome?.porque).toBe(getEvent("E07").porque);
      expect(next.resolvedOutcome?.fonte).toBe("S8");
    });
  });

  describe("Dias de Decisão", () => {
    it("cada cenário tem entre 8 e 12 dias de decisão", () => {
      for (const scenarioId of ["A", "B", "C"] as const) {
        let count = 0;
        const maxDay = num(`scenarios.${scenarioId}.missionDays`);
        for (let d = 1; d <= maxDay; d++) {
          if (isDecisionDay(scenarioId, d)) {
            count++;
          }
        }
        expect(count).toBeGreaterThanOrEqual(8);
        expect(count).toBeLessThanOrEqual(12);
      }
    });
  });
});
