import { useState } from "react";
import {
  createPreparationState,
  getCell,
  getLightAt,
  getMap,
  getModule,
  getModuleAt,
  getScenario,
  listModules,
  num,
  placeModule,
  removeModule,
} from "../../game";
import type { PreparationState, ScenarioId } from "../../game";
import LunarMap from "../components/LunarMap";
import ModulePalette from "../components/ModulePalette";
import { TERRAIN_LABELS } from "../labels";

interface PreparationScreenProps {
  scenarioId: ScenarioId;
  onStart: (prep: PreparationState) => void;
  onBack: () => void;
}

export default function PreparationScreen({
  scenarioId,
  onStart,
  onBack,
}: PreparationScreenProps) {
  const [prep, setPrep] = useState<PreparationState>(() =>
    createPreparationState(scenarioId),
  );
  const [selectedModuleId, setSelectedModuleId] = useState(
    () => listModules()[0]!.id,
  );
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [message, setMessage] = useState(
    "Toca num módulo e depois numa célula do mapa.",
  );

  const scenario = getScenario(scenarioId);
  const map = getMap(scenarioId);
  const cell = selectedCell ? getCell(map, selectedCell.x, selectedCell.y) : undefined;
  const light = selectedCell
    ? getLightAt(scenarioId, num("rules.firstDay"), selectedCell.x, selectedCell.y)
    : undefined;
  const built = selectedCell ? getModuleAt(prep, selectedCell.x, selectedCell.y) : undefined;
  const builtModule = built ? getModule(built.moduleId) : undefined;

  function handleCellClick(x: number, y: number) {
    setSelectedCell({ x, y });

    const existing = getModuleAt(prep, x, y);
    if (existing) {
      setPrep(removeModule(prep, x, y));
      setMessage(`${getModule(existing.moduleId).nome} removido.`);
      return;
    }

    const module = getModule(selectedModuleId);
    const result = placeModule(prep, selectedModuleId, x, y);

    if (result.ok) {
      setPrep(result.state);
      setMessage(`${module.nome} colocado.`);
    } else {
      setMessage(result.motivo);
    }
  }

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">PASSO 2 DE 3</p>
          <h1>Preparar a base</h1>
          <p className="muted">
            {scenario.nome} · {scenario.objetivo}
          </p>
        </div>
        <button type="button" className="ghost" onClick={onBack}>
          Voltar
        </button>
      </header>

      <div className="prep-layout">
        <div className="panel map-panel">
          <LunarMap
            scenarioId={scenarioId}
            day={num("rules.firstDay")}
            modules={prep.modules}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
            interactive
          />

          <p className="message" role="status">
            {message}
          </p>

          {cell ? (
            <div className="cell-info">
              <span>
                Célula ({cell.x}, {cell.y}) · {TERRAIN_LABELS[cell.terrain]}
              </span>
              <span className={light === num("map.light.lit") ? "lit" : "shadowed"}>
                {light === num("map.light.lit") ? "Luz direta" : "Sombra"}
              </span>
              {builtModule ? <span>Módulo: {builtModule.nome}</span> : null}
            </div>
          ) : null}

          <p className="muted">
            Toca num módulo colocado para o remover. A preparação usa a luz do dia{" "}
            {num("rules.firstDay")}.
          </p>
        </div>

        <div className="panel">
          <ModulePalette
            prep={prep}
            selectedModuleId={selectedModuleId}
            onSelect={setSelectedModuleId}
          />

          <div className="placed-modules">
            <h3>Módulos colocados</h3>
            {prep.modules.length === 0 ? (
              <p className="muted">Ainda não colocaste nenhum módulo.</p>
            ) : (
              <div className="chip-row">
                {prep.modules.map((module) => {
                  const content = getModule(module.moduleId);
                  return (
                    <span
                      className="chip"
                      key={`${module.moduleId}-${module.x}-${module.y}`}
                      style={{ borderColor: content.cor }}
                    >
                      {content.nome} ({module.x}, {module.y})
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <button type="button" className="primary large" onClick={() => onStart(prep)}>
            Iniciar missão
          </button>
        </div>
      </div>
    </section>
  );
}
