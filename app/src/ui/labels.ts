import type {
  GameState,
  ResourceKey,
  ScoreBreakdown,
  TerrainType,
} from "../game";

export const RESOURCE_LABELS: Record<ResourceKey, string> = {
  life: "Vida",
  energy: "Energia",
  protection: "Proteção",
  food: "Alimentos",
};

export const TERRAIN_LABELS: Record<TerrainType, string> = {
  flat: "Terreno plano",
  slope: "Encosta",
  rim: "Borda elevada",
  psr: "Sombra permanente",
  ice: "Gelo",
};

export const SCORE_LABELS: Record<keyof ScoreBreakdown, string> = {
  astronauts: "Astronautas vivos",
  life: "Vida",
  energy: "Energia",
  protection: "Proteção",
  food: "Alimentos",
  science: "Bónus científico",
  knowledge: "Índice de Conhecimento",
  penaltyPoints: "Penalizações",
  total: "Total",
};

export const STATUS_LABELS: Record<GameState["status"], string> = {
  running: "Em curso",
  won: "Missão cumprida",
  lost: "Missão perdida",
};
