import rawAstronauts from "../../data/astronauts.json";
import { num } from "./science";
import type { AstronautContent, AstronautState } from "./types";

const astronautContent = rawAstronauts as AstronautContent[];

/** Cria o estado individual dos quatro tripulantes a partir do conteúdo. */
export function createAstronauts(): AstronautState[] {
  return astronautContent.map((astronaut) => ({
    id: astronaut.id,
    nome: astronaut.nome,
    especialidade: astronaut.especialidade,
    health: num("astronauts.initialHealth"),
    radiation: num("astronauts.initialRadiation"),
    fatigue: num("astronauts.initialFatigue"),
  }));
}

/** Um astronauta está vivo quando a saúde individual é superior ao limiar. */
export function isAlive(astronaut: AstronautState): boolean {
  return astronaut.health > num("rules.astronautAliveThreshold");
}

export function aliveAstronauts(astronauts: AstronautState[]): AstronautState[] {
  return astronauts.filter(isAlive);
}

export function countAlive(astronauts: AstronautState[]): number {
  return aliveAstronauts(astronauts).length;
}

export function listAstronautContent(): AstronautContent[] {
  return astronautContent;
}
