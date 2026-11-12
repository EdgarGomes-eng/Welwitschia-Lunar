/**
 * Tipos do domínio do motor.
 *
 * O motor é deliberadamente independente de React, DOM e estado de UI.
 * Todos os números de balanceamento são lidos de `app/data/science-values.json`.
 */

export type ScienceType = "real" | "simplificação";
export type ScienceStatus = "proposto" | "a validar" | "verificado (humano)";

export interface ScienceValue<T = number> {
  valor: T;
  tipo: ScienceType;
  fonte: string;
  estado: ScienceStatus;
  nota?: string;
}

export type ScenarioId = "A" | "B" | "C";

export type ResourceKey = "life" | "energy" | "protection" | "food";
export type CrewStatKey = "health" | "radiation" | "fatigue";
export type EffectTarget = ResourceKey | `crew.${CrewStatKey}`;

export interface Effect {
  alvo: EffectTarget;
  chave: string;
}

export interface Resources {
  life: number;
  energy: number;
  protection: number;
  food: number;
}

export type TerrainType = "flat" | "slope" | "rim" | "psr" | "ice";

export interface MapCell {
  x: number;
  y: number;
  terrain: TerrainType;
  elevation: number;
}

export interface GameMap {
  scenarioId: ScenarioId;
  width: number;
  height: number;
  cells: MapCell[][];
}

export interface SunPosition {
  azimuthDegrees: number;
  elevationDegrees: number;
}

export interface BuiltModule {
  moduleId: string;
  x: number;
  y: number;
}

export interface PreparationState {
  scenarioId: ScenarioId;
  modules: BuiltModule[];
  buildPoints: number;
}

export type PlacementResult =
  | { ok: true; state: PreparationState }
  | { ok: false; motivo: string };

export interface AstronautState {
  id: string;
  nome: string;
  especialidade: string;
  health: number;
  radiation: number;
  fatigue: number;
}

export interface KnowledgeState {
  decisionPoints: number;
  maxDecisionPoints: number;
  miniChallengesCorrect: number;
  miniChallengesTotal: number;
}

export type MissionStatus = "running" | "won" | "lost";
export type EndReason = "life-zero" | "mission-complete";

export interface GameState {
  scenarioId: ScenarioId;
  day: number;
  missionDays: number;
  decisionDays: number;
  resources: Resources;
  astronauts: AstronautState[];
  modules: BuiltModule[];
  knowledge: KnowledgeState;
  scienceMilestones: string[];
  penaltyPoints: number;
  lastPenaltyDay: number | null;
  status: MissionStatus;
  endReason?: EndReason;
}

export interface ScoreBreakdown {
  astronauts: number;
  life: number;
  energy: number;
  protection: number;
  food: number;
  science: number;
  knowledge: number;
  penaltyPoints: number;
  total: number;
}

export interface ScenarioContent {
  id: ScenarioId;
  nome: string;
  dificuldade: string;
  objetivo: string;
  descricao: string;
  cienciaIds: string[];
  cor: string;
}

export interface EventOption {
  id: string;
  texto: string;
  vantagem: string;
  custo: string;
  efeitos: Effect[];
  marcoCientifico?: string;
}

export interface EventContent {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  cienciaIds: string[];
  opcoes: EventOption[];
}

export interface ModuleProperty {
  alvo: string;
  chave: string;
}

export interface ModuleRequirement {
  terreno: TerrainType[];
  luzMinimaKey?: string;
}

export interface ModuleContent {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  custoKey: string;
  requisitos: ModuleRequirement;
  escalaComLuz: boolean;
  efeitosPorDia: Effect[];
  propriedades: ModuleProperty[];
  cienciaIds: string[];
}

export interface AstronautContent {
  id: string;
  nome: string;
  especialidade: string;
  bonus: string;
}

export interface ConceptContent {
  id: string;
  titulo: string;
  resumo: string;
  fonteIds: string[];
  cienciaIds: string[];
  tipo: string;
}
