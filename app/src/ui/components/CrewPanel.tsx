import { isAlive, num } from "../../game";
import type { AstronautState } from "../../game";

interface CrewPanelProps {
  astronauts: AstronautState[];
}

export default function CrewPanel({ astronauts }: CrewPanelProps) {
  return (
    <div className="crew-grid">
      {astronauts.map((astronaut) => (
        <article className={isAlive(astronaut) ? "crew" : "crew dead"} key={astronaut.id}>
          <h3>{astronaut.nome}</h3>
          <p className="muted">{astronaut.especialidade}</p>
          <dl>
            <div>
              <dt>Saúde</dt>
              <dd>{astronaut.health}</dd>
            </div>
            <div>
              <dt>Radiação</dt>
              <dd>{astronaut.radiation}</dd>
            </div>
            <div>
              <dt>Fadiga</dt>
              <dd>{astronaut.fatigue}</dd>
            </div>
          </dl>
          {!isAlive(astronaut) ? (
            <p className="danger-text">Saúde a {num("rules.astronautAliveThreshold")}.</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
