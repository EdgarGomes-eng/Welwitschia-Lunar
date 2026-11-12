import { computeOptionEffects, resolveEventDecision } from "./events";
import { num } from "./science";
import type { EventContent, EventOption, GameState } from "./types";

/**
 * Jogador heurístico que avalia opções de eventos com base
 * no estado atual dos recursos e da tripulação.
 */
export function chooseOptionHeuristically(
  state: GameState,
  event: EventContent,
): EventOption {
  if (event.opcoes.length === 1) {
    return event.opcoes[0]!;
  }

  let bestOption = event.opcoes[0]!;
  let bestScore = -Infinity;

  for (const option of event.opcoes) {
    let score = 0;
    const { penalties } = computeOptionEffects(state, option);

    // Efeitos base e penalizados
    for (const effect of option.efeitos) {
      let amount = num(effect.chave);
      const penalty = penalties.find((p) => p.alvo === effect.alvo);
      if (penalty) {
        amount = penalty.penalizado;
      }

      // Avaliação de Recursos
      if (effect.alvo === "life") {
        // Vida é o recurso mais crítico
        score += amount * (state.resources.life < 40 ? 5 : 3);
      } else if (effect.alvo === "energy") {
        // Energia é vital para suporte de vida e evitar penalizações (-20)
        score += amount * (state.resources.energy < 30 ? 3.5 : 1.5);
      } else if (effect.alvo === "protection") {
        score += amount * (state.resources.protection < 25 ? 3 : 1.2);
      } else if (effect.alvo === "food") {
        score += amount * (state.resources.food < 30 ? 3 : 1.2);
      } else if (effect.alvo === "crew.health") {
        // Saúde dos tripulantes
        score += amount * 2.5;
      } else if (effect.alvo === "crew.radiation") {
        // Radiação acumulada é prejudicial
        score -= amount * 1.8;
      } else if (effect.alvo === "crew.fatigue") {
        // Fadiga reduz prontidão
        score -= amount * 1.2;
      }
    }

    // Bónus para marcos científicos se a base estiver estável
    if (
      option.marcoCientifico &&
      state.resources.life > 40 &&
      state.resources.energy > 30
    ) {
      score += 15;
    }

    if (score > bestScore) {
      bestScore = score;
      bestOption = option;
    }
  }

  return bestOption;
}

/**
 * Executa um passo do jogo com o jogador heurístico:
 * Se houver um evento ativo, resolve-o heurísticamente.
 * Em seguida, avança o dia se ainda estiver em running.
 */
export function stepHeuristicGame(state: GameState): GameState {
  if (state.status !== "running") {
    return state;
  }

  let current = state;

  // Se houver evento ativo, o jogador heurístico decide
  if (current.activeEvent) {
    const option = chooseOptionHeuristically(current, current.activeEvent);
    current = resolveEventDecision(current, current.activeEvent.id, option.id);
  }

  return current;
}
