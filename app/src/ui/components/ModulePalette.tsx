import {
  getModuleCost,
  getValidPlacements,
  listModules,
  num,
} from "../../game";
import type { PreparationState } from "../../game";
import { TERRAIN_LABELS } from "../labels";

interface ModulePaletteProps {
  prep: PreparationState;
  selectedModuleId: string;
  onSelect: (moduleId: string) => void;
}

export default function ModulePalette({
  prep,
  selectedModuleId,
  onSelect,
}: ModulePaletteProps) {
  return (
    <div className="module-palette">
      <div className="panel-heading">
        <h2>Construir</h2>
        <span className="badge">
          {prep.buildPoints} / {num("prep.buildPoints")} pontos
        </span>
      </div>

      <div className="module-list">
        {listModules().map((module) => {
          const cost = getModuleCost(module);
          const validCount = getValidPlacements(prep, module.id).length;
          const selected = module.id === selectedModuleId;
          const requirements = module.requisitos.terreno
            .map((terrain) => TERRAIN_LABELS[terrain])
            .join(" · ");

          return (
            <button
              type="button"
              key={module.id}
              className={selected ? "module-card selected" : "module-card"}
              onClick={() => onSelect(module.id)}
              aria-pressed={selected}
            >
              <span className="module-swatch" style={{ background: module.cor }} />
              <span className="module-copy">
                <strong>{module.nome}</strong>
                <span className="muted">{module.descricao}</span>
                <span className="module-meta">
                  Custo {cost} · {requirements}
                  {module.requisitos.luzMinimaKey ? " · precisa de luz" : ""}
                </span>
                <span className={validCount > 0 ? "module-ok" : "module-warn"}>
                  {validCount > 0 ? `${validCount} locais válidos` : "Sem local válido agora"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
