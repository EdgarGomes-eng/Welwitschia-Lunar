import rawScience from "../../data/science-values.json";
import type { ScienceValue } from "./types";

interface ScienceFile {
  meta: {
    versao: string;
    atualizado: string;
    regra: string;
  };
  values: Record<string, ScienceValue<unknown>>;
}

const scienceFile = rawScience as unknown as ScienceFile;

/**
 * Devolve o registo completo de um valor: { valor, tipo, fonte, estado }.
 * Falha de forma explícita se a chave não existir, para impedir números órfãos.
 */
export function getScience<T = number>(key: string): ScienceValue<T> {
  const entry = scienceFile.values[key];
  if (!entry) {
    throw new Error(`Valor em falta em science-values.json: ${key}`);
  }
  return entry as ScienceValue<T>;
}

/** Atalho para valores numéricos. */
export function num(key: string): number {
  const entry = getScience<unknown>(key);
  if (typeof entry.valor !== "number") {
    throw new Error(`O valor ${key} não é numérico.`);
  }
  return entry.valor;
}

/** Usado pela página de debug e, mais tarde, pelo painel Real vs. Simplificação. */
export function allScienceValues(): Record<string, ScienceValue<unknown>> {
  return scienceFile.values;
}

export function scienceMeta(): ScienceFile["meta"] {
  return scienceFile.meta;
}
