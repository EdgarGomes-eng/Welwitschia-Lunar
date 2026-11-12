import { computeScore, getScenario, num } from "../../game";
import type { GameState, ScoreBreakdown } from "../../game";
import ResourceBar from "../components/ResourceBar";
import { SCORE_LABELS, STATUS_LABELS } from "../labels";

interface ResultScreenProps {
  state: GameState;
  onRestart: () => void;
  onHome: () => void;
}

export default function ResultScreen({ state, onRestart, onHome }: ResultScreenProps) {
  const scenario = getScenario(state.scenarioId);
  const score = computeScore(state);
  const keys = Object.keys(SCORE_LABELS) as Array<keyof ScoreBreakdown>;

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">RESULTADO · {scenario.nome}</p>
          <h1>{STATUS_LABELS[state.status]}</h1>
          <p className="muted">
            {state.endReason === "life-zero"
              ? "A vida chegou a zero. A missão terminou."
              : "Chegaste ao fim dos dias de missão."}
          </p>
        </div>
        <span className={`status ${state.status}`}>{STATUS_LABELS[state.status]}</span>
      </header>

      <div className="result-layout">
        <div className="panel score-panel">
          <div className="score-total">
            <span className="muted">Pontuação</span>
            <strong>
              {score.total} <span className="muted">/ {num("scoring.max")}</span>
            </strong>
          </div>

          <div className="score-list">
            {keys.map((key) => (
              <div className={key === "total" ? "score-row total" : "score-row"} key={key}>
                <span>{SCORE_LABELS[key]}</span>
                <strong>{score[key]}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="result-side">
          <div className="panel">
            <h2>Missão</h2>
            <p className="muted">
              Dia {state.day} de {state.missionDays} · {state.modules.length} módulos
              colocados
            </p>
            <ResourceBar resources={state.resources} compact />
          </div>

          <div className="panel">
            <h2>Próximo passo</h2>
            <p className="muted">
              A Fase 2b acrescenta eventos com condições, pesos e cooldowns. Esta
              versão fica pelo loop diário e pelos módulos.
            </p>
            <div className="actions">
              <button type="button" className="primary" onClick={onRestart}>
                Jogar novamente
              </button>
              <button type="button" onClick={onHome}>
                Início
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
