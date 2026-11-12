import { num } from "../../game";

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="screen start-screen">
      <header className="hero">
        <p className="eyebrow">BASE KWANZA V2 · FASE 2a</p>
        <h1>Treinador de Missão Lunar</h1>
        <p className="lede">
          Escolhe um local, prepara a base e sobrevive com dados reais da NASA.
          Cada decisão tem uma consequência.
        </p>
      </header>

      <div className="start-grid">
        <article className="panel feature">
          <h2>
            Mapa {num("map.width")}×{num("map.height")}
          </h2>
          <p className="muted">
            {num("map.width")} × {num("map.height")} células com terreno, luz e sombra
            ao longo do dia lunar.
          </p>
        </article>
        <article className="panel feature">
          <h2>Base em tempo real</h2>
          <p className="muted">
            Cada dia dura {num("timing.dayDurationSeconds")} segundos. Podes pausar e
            acelerar para {num("timing.speedMultiplier2")}×.
          </p>
        </article>
        <article className="panel feature">
          <h2>Sem quiz obrigatório</h2>
          <p className="muted">
            Aprendes pela consequência. O Diário e o pós-teste opcional ficam para as
            próximas fases.
          </p>
        </article>
      </div>

      <button type="button" className="primary large" onClick={onStart}>
        Começar missão
      </button>

      <p className="muted footnote">
        Todos os valores científicos e de balanceamento vêm de{" "}
        <code>app/data/science-values.json</code>.
      </p>
    </section>
  );
}
