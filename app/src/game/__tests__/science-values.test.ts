import { describe, expect, it } from "vitest";
import rawModules from "../../../data/modules.json";
import { listEvents } from "../engine";
import { allScienceValues, getScience, num } from "../science";
import type { ModuleContent } from "../types";

const modules = rawModules as unknown as ModuleContent[];

describe("science-values.json", () => {
  it("todos os valores têm valor, tipo, fonte e estado", () => {
    for (const [key, entry] of Object.entries(allScienceValues())) {
      expect(entry, key).toHaveProperty("valor");
      expect(["real", "simplificação"], key).toContain(entry.tipo);
      expect(entry.fonte.length, key).toBeGreaterThan(0);
      expect(["proposto", "a validar", "verificado (humano)"], key).toContain(entry.estado);
    }
  });

  it("nenhum valor fica verificado sem revisão humana", () => {
    for (const [key, entry] of Object.entries(allScienceValues())) {
      expect(entry.estado, key).not.toBe("verificado");
      if (entry.estado === "verificado (humano)") {
        expect(entry.fonte.length, key).toBeGreaterThan(0);
      }
    }

    expect(getScience("science.C12.gameMin").estado).toBe("a validar");
    expect(getScience("science.C12.literatureMax").estado).toBe("a validar");
  });

  it("C12 está marcado como simplificação e a literatura como real", () => {
    expect(getScience("science.C12.gameMin").tipo).toBe("simplificação");
    expect(getScience("science.C12.gameMax").tipo).toBe("simplificação");
    expect(getScience("science.C12.literatureMin").tipo).toBe("real");
    expect(getScience("science.C12.literatureMax").tipo).toBe("real");
  });

  it("há pelo menos 12 crises e cada uma tem 2 opções com vantagem e custo", () => {
    const events = listEvents();
    expect(events.length).toBeGreaterThanOrEqual(12);

    for (const event of events) {
      expect(event.opcoes.length, event.id).toBeGreaterThanOrEqual(2);
      for (const option of event.opcoes) {
        expect(option.vantagem.length, option.id).toBeGreaterThan(0);
        expect(option.custo.length, option.id).toBeGreaterThan(0);
      }
    }
  });

  it("todas as chaves usadas pelos eventos existem e são numéricas", () => {
    for (const event of listEvents()) {
      for (const option of event.opcoes) {
        expect(option.efeitos.length, option.id).toBeGreaterThan(0);
        for (const effect of option.efeitos) {
          expect(() => num(effect.chave), `${option.id} → ${effect.chave}`).not.toThrow();
        }
      }
    }
  });

  it("todas as chaves usadas pelos módulos existem e são numéricas", () => {
    for (const module of modules) {
      expect(() => num(module.custoKey), `${module.id} → ${module.custoKey}`).not.toThrow();
      if (module.requisitos.luzMinimaKey) {
        expect(
          () => num(module.requisitos.luzMinimaKey as string),
          `${module.id} → ${module.requisitos.luzMinimaKey}`,
        ).not.toThrow();
      }
      for (const effect of [...module.efeitosPorDia, ...module.propriedades]) {
        expect(() => num(effect.chave), `${module.id} → ${effect.chave}`).not.toThrow();
      }
    }
  });
});
