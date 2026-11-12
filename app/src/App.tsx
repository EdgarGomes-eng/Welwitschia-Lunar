import { useCallback, useState } from "react";
import { advanceDay, resolveEventOption, startMission } from "./game";
import type { GameState, PreparationState, ScenarioId } from "./game";
import GameScreen from "./ui/screens/GameScreen";
import LocationScreen from "./ui/screens/LocationScreen";
import PreparationScreen from "./ui/screens/PreparationScreen";
import ResultScreen from "./ui/screens/ResultScreen";
import StartScreen from "./ui/screens/StartScreen";
import "./styles.css";

type Screen = "start" | "location" | "prep" | "game" | "result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [scenarioId, setScenarioId] = useState<ScenarioId>("A");
  const [game, setGame] = useState<GameState | null>(null);

  const handleAdvance = useCallback(() => {
    setGame((current) => (current ? advanceDay(current) : current));
  }, []);

  const handleResolveEvent = useCallback((eventId: string, optionId: string) => {
    setGame((current) => (current ? resolveEventOption(current, eventId, optionId) : current));
  }, []);

  const handleDismissOutcome = useCallback(() => {
    setGame((current) => (current ? { ...current, resolvedOutcome: null } : current));
  }, []);

  const handleFinish = useCallback(() => {
    setScreen("result");
  }, []);

  function selectScenario(id: ScenarioId) {
    setScenarioId(id);
    setScreen("prep");
  }

  function beginMission(prep: PreparationState) {
    setGame(startMission(prep));
    setScreen("game");
  }

  function goHome() {
    setGame(null);
    setScreen("start");
  }

  return (
    <main className="app-shell">
      {screen === "start" ? (
        <StartScreen onStart={() => setScreen("location")} />
      ) : null}

      {screen === "location" ? (
        <LocationScreen onSelect={selectScenario} onBack={() => setScreen("start")} />
      ) : null}

      {screen === "prep" ? (
        <PreparationScreen
          scenarioId={scenarioId}
          onStart={beginMission}
          onBack={() => setScreen("location")}
        />
      ) : null}

      {screen === "game" && game ? (
        <GameScreen
          state={game}
          onAdvance={handleAdvance}
          onFinish={handleFinish}
          onResolveEvent={handleResolveEvent}
          onDismissOutcome={handleDismissOutcome}
        />
      ) : null}

      {screen === "result" && game ? (
        <ResultScreen
          state={game}
          onRestart={() => setScreen("location")}
          onHome={goHome}
        />
      ) : null}

      <footer className="app-footer">
        <p>
          Fase 2b · eventos dinâmicos por condições, pista, custo/vantagem, porquê e fontes S#.
          Dados em <code>app/data/science-values.json</code>.
        </p>
      </footer>
    </main>
  );
}
