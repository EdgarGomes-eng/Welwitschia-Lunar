import { useCallback, useState } from "react";
import { advanceDay, num, startMission } from "./game";
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
        <GameScreen state={game} onAdvance={handleAdvance} onFinish={handleFinish} />
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
          Fase 2a · loop diário, mapa {num("map.width")}×{num("map.height")} e módulos.
          Dados em <code>app/data/science-values.json</code>.
        </p>
      </footer>
    </main>
  );
}
