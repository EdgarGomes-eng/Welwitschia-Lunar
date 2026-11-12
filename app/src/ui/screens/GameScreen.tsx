import { useEffect, useState } from "react";
import {
  computeScore,
  getModule,
  getScenario,
  getSunPosition,
  num,
} from "../../game";
import type { GameState } from "../../game";
import CrewPanel from "../components/CrewPanel";
import EventModal from "../components/EventModal";
import LunarMap from "../components/LunarMap";
import ResourceBar from "../components/ResourceBar";
import { STATUS_LABELS } from "../labels";

interface GameScreenProps {
  state: GameState;
  onAdvance: () => void;
  onFinish: () => void;
  onResolveEvent: (eventId: string, optionId: string) => void;
  onDismissOutcome: () => void;
}

export default function GameScreen({
  state,
  onAdvance,
  onFinish,
  onResolveEvent,
  onDismissOutcome,
}: GameScreenProps) {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(() => num("timing.speedMultiplier1"));

  const scenario = getScenario(state.scenarioId);
  const sun = getSunPosition(state.day);
  const score = computeScore(state);

  const hasPendingEvent = Boolean(state.activeEvent || state.resolvedOutcome);

  useEffect(() => {
    // Se estiver em pausa, com evento ativo/resultado, ou com a missão terminada, o temporizador não corre
    if (paused || hasPendingEvent || state.status !== "running") {
      return;
    }

    const intervalMs =
      (num("timing.dayDurationSeconds") * num("timing.millisecondsPerSecond")) / speed;
    const timer = window.setInterval(onAdvance, intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, hasPendingEvent, speed, state.status, onAdvance]);

  useEffect(() => {
    if (state.status !== "running") {
      onFinish();
    }
  }, [state.status, onFinish]);

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">PASSO 3 DE 3 · {scenario.nome}</p>
          <h1>
            Dia {state.day} <span className="muted">de {state.missionDays}</span>
          </h1>
          <p className="muted">{scenario.objetivo}</p>
        </div>
        <span className={`status ${state.status}`}>{STATUS_LABELS[state.status]}</span>
      </header>

      <div className="game-layout">
        <div className="panel map-panel">
          <LunarMap
            scenarioId={state.scenarioId}
            day={state.day}
            modules={state.modules}
          />

          <div className="day-meta">
            <span>
              Sol: azimute {Math.round(sun.azimuthDegrees)}° · elevação{" "}
              {Math.round(sun.elevationDegrees)}°
            </span>
            <span>Pontuação atual: {score.total}</span>
          </div>

          <div className="controls">
            <button
              type="button"
              disabled={hasPendingEvent}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? "Retomar" : "Pausar"}
            </button>
            <button
              type="button"
              disabled={hasPendingEvent}
              className={speed === num("timing.speedMultiplier1") ? "speed active" : "speed"}
              onClick={() => setSpeed(num("timing.speedMultiplier1"))}
            >
              {num("timing.speedMultiplier1")}×
            </button>
            <button
              type="button"
              disabled={hasPendingEvent}
              className={speed === num("timing.speedMultiplier2") ? "speed active" : "speed"}
              onClick={() => setSpeed(num("timing.speedMultiplier2"))}
            >
              {num("timing.speedMultiplier2")}×
            </button>
            <button
              type="button"
              className="primary"
              disabled={hasPendingEvent}
              onClick={onAdvance}
            >
              Avançar dia
            </button>
          </div>

          <p className="muted">
            {hasPendingEvent
              ? "Decisão de evento necessária para prosseguir."
              : paused
                ? "Em pausa."
                : `A simulação está a correr (${num("timing.dayDurationSeconds")}s por dia).`}
          </p>
        </div>

        <div className="game-side">
          <div className="panel">
            <h2>Recursos</h2>
            <ResourceBar resources={state.resources} />
            <p className="muted">
              Penalizações acumuladas: {state.penaltyPoints}
            </p>
          </div>

          <div className="panel">
            <h2>Base</h2>
            {state.modules.length === 0 ? (
              <p className="muted">Sem módulos. O suporte de vida vai consumir recursos.</p>
            ) : (
              <div className="module-summary">
                {state.modules.map((module) => {
                  const content = getModule(module.moduleId);
                  return (
                    <div className="module-row" key={`${module.moduleId}-${module.x}-${module.y}`}>
                      <span
                        className="module-swatch"
                        style={{ background: content.cor }}
                      />
                      <span>
                        <strong>{content.nome}</strong>
                        <span className="muted"> ({module.x}, {module.y})</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="panel">
            <h2>Tripulação</h2>
            <CrewPanel astronauts={state.astronauts} />
          </div>
        </div>
      </div>

      <EventModal
        state={state}
        onChooseOption={onResolveEvent}
        onDismissOutcome={onDismissOutcome}
      />
    </section>
  );
}
