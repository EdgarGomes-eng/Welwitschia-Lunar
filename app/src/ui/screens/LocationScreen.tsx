import {
  getMissionDays,
  listScenarios,
  num,
} from "../../game";
import type { ScenarioId } from "../../game";

interface LocationScreenProps {
  onSelect: (scenarioId: ScenarioId) => void;
  onBack: () => void;
}

export default function LocationScreen({ onSelect, onBack }: LocationScreenProps) {
  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">PASSO 1 DE 3</p>
          <h1>Escolhe o local</h1>
        </div>
        <button type="button" className="ghost" onClick={onBack}>
          Voltar
        </button>
      </header>

      <p className="lede">
        Cada local tem uma duração, um relevo e uma combinação de luz e sombra
        diferentes.
      </p>

      <div className="scenario-list">
        {listScenarios().map((scenario) => {
          const minutes = Math.round(
            (getMissionDays(scenario.id) * num("timing.dayDurationSeconds")) /
              num("timing.secondsPerMinute"),
          );

          return (
            <button
              type="button"
              className="scenario-card"
              key={scenario.id}
              onClick={() => onSelect(scenario.id)}
              style={{ borderColor: scenario.cor }}
            >
              <span className="scenario-topline">
                <strong>{scenario.nome}</strong>
                <span className="badge">{scenario.dificuldade}</span>
              </span>
              <span className="scenario-objective">{scenario.objetivo}</span>
              <span className="muted">{scenario.descricao}</span>
              <span className="scenario-meta">
                {getMissionDays(scenario.id)} dias · cerca de {minutes} min
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
