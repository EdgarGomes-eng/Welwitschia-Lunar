import { computeOptionEffects } from "../../game";
import type { GameState } from "../../game";

interface EventModalProps {
  state: GameState;
  onChooseOption: (eventId: string, optionId: string) => void;
  onDismissOutcome: () => void;
}

export default function EventModal({
  state,
  onChooseOption,
  onDismissOutcome,
}: EventModalProps) {
  const active = state.activeEvent;
  const outcome = state.resolvedOutcome;

  if (!active && !outcome) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        {active ? (
          <>
            <header className="modal-header">
              <span className="eyebrow">
                DIA {state.day} · EVENTO DE MISSÃO
              </span>
              <h2>{active.titulo}</h2>
              <span className="badge">{active.tipo}</span>
            </header>

            <div className="event-pista-box">
              <span className="pista-label">PISTA CIENTÍFICA (DADO REAL)</span>
              <p className="pista-content">{active.pista}</p>
            </div>

            <p className="event-description">{active.descricao}</p>

            <div className="event-options-container">
              <h3>Escolha a ação da tripulação:</h3>
              <div className="options-grid">
                {active.opcoes.map((opt) => {
                  const { specialistWarning } = computeOptionEffects(state, opt);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className="option-button"
                      onClick={() => onChooseOption(active.id, opt.id)}
                    >
                      <strong className="option-headline">{opt.texto}</strong>
                      <div className="option-pro">
                        <span className="pro-tag">Vantagem:</span> {opt.vantagem}
                      </div>
                      <div className="option-con">
                        <span className="con-tag">Custo:</span> {opt.custo}
                      </div>
                      {specialistWarning && (
                        <div className="specialist-warning-box">
                          ⚠️ {specialistWarning}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : outcome ? (
          <>
            <header className="modal-header">
              <span className="eyebrow">RELATÓRIO DE CONSEQUÊNCIA</span>
              <h2>{outcome.titulo}</h2>
              <p className="muted">Decisão tomada: {outcome.opcaoEscolhida}</p>
            </header>

            <div className="outcome-section">
              <h3>Consequência no sistema</h3>
              <p className="outcome-text">{outcome.consequencia}</p>

              {outcome.penalizacaoEspecialista && (
                <div className="specialist-warning-box">
                  ⚠️ {outcome.penalizacaoEspecialista}
                </div>
              )}

              <div className="why-box">
                <span className="why-label">PORQUÊ CIENTÍFICO</span>
                <p className="why-text">{outcome.porque}</p>
              </div>

              <div className="source-row">
                <span className="source-badge">
                  Fonte: <strong>{outcome.fonte}</strong>
                </span>
                <span className="muted text-sm">
                  Documentado no Registo de Fontes (/docs/validacao-ciencia.md)
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="primary continue-button"
                onClick={onDismissOutcome}
              >
                Continuar missão
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
